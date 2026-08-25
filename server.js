/* ==========================================================================
   Smart History Education AI - Node.js Express Backend Video API Server
   ========================================================================== */

import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { VideoCompiler } from './videoCompiler.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Serve generated video files statically
app.use('/videos', express.static(path.join(__dirname, 'public', 'videos')));

// In-Memory Jobs Database
const videoJobs = new Map();

/**
 * POST /api/generate-video
 * Ingests teacher transcript and creates an asynchronous video generation job.
 */
app.post('/api/generate-video', async (req, res) => {
  try {
    const { transcript, topicTitle, style, reference_images, characterReferences, scenes, aspect_ratio } = req.body;

    if (!transcript || transcript.trim() === '') {
      return res.status(400).json({ error: 'Transcript is required for video generation.' });
    }

    const jobId = `job_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    
    // Register initial job state
    videoJobs.set(jobId, {
      jobId,
      transcript,
      topicTitle: topicTitle || 'Spoken History Lesson',
      style: style || 'cinematic',
      aspect_ratio: aspect_ratio || '16:9',
      referenceImagesCount: (reference_images || []).length,
      characterReferencesCount: (characterReferences || []).length,
      scenesCount: (scenes || []).length,
      status: 'analyzing',
      progress: 15,
      createdAt: new Date().toISOString()
    });

    console.log(`[API Server] Created Video Job: ${jobId}`);
    console.log(`[API Server] Spoken Transcript: "${transcript}"`);
    console.log(`[API Server] Attached Character Reference Images: ${(reference_images || []).length}`);

    // Async video compilation pipeline
    setTimeout(async () => {
      try {
        const job = videoJobs.get(jobId);
        if (job) { job.status = 'compiling_scenes'; job.progress = 50; }

        const result = await VideoCompiler.compileVideo(jobId, transcript, scenes || [], style, reference_images || [], characterReferences || []);

        job.status = 'completed';
        job.progress = 100;
        job.videoUrl = `http://localhost:${PORT}${result.videoUrl}`;
        job.completedAt = new Date().toISOString();

        console.log(`[API Server] Video Job Completed: ${jobId} -> ${job.videoUrl}`);
      } catch (err) {
        console.error(`[API Server] Video Compilation Failed for ${jobId}:`, err);
        const job = videoJobs.get(jobId);
        if (job) { job.status = 'failed'; job.error = err.message; }
      }
    }, 1200);

    return res.status(202).json({
      success: true,
      jobId,
      status: 'analyzing',
      message: 'Video generation job submitted successfully.'
    });
  } catch (err) {
    console.error('[API Server] POST /api/generate-video error:', err);
    return res.status(500).json({ error: err.message });
  }
});

/**
 * GET /api/video-status/:jobId
 * Polls current status of a video generation job.
 */
app.get('/api/video-status/:jobId', (req, res) => {
  const { jobId } = req.params;
  const job = videoJobs.get(jobId);

  if (!job) {
    return res.status(404).json({ error: 'Video job not found.' });
  }

  return res.json(job);
});

app.listen(PORT, () => {
  console.log(`[API Server] Smart History Video Backend listening on http://localhost:${PORT}`);
});
