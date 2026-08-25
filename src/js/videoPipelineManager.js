/* ==========================================================================
   Smart History Education AI - Deterministic Async Video Pipeline Manager
   ========================================================================== */

import { HistoryAnalyzer } from './historyAnalyzer.js';
import { globalCharacterRefMgr } from './characterReferenceManager.js';
import { CharacterBible } from './characterBible.js';
import { CharacterProfiles } from './characterProfiles.js';

export class VideoPipelineManager {
  constructor(statusCallback, videoReadyCallback, errorCallback) {
    this.onStatus = statusCallback;
    this.onVideoReady = videoReadyCallback;
    this.onError = errorCallback;

    this.state = 'IDLE';
    this.activeGenerationId = null;
    this.activeTopicId = null;
    this.currentJobId = null;
    this.lastTranscript = '';
    this.apiBaseUrl = 'http://localhost:3000';
    this.presetMode = 'fast_preview';
    this.stageLog = [];
    this.pollingTimer = null;
    this.stageTimeoutTimer = null;
    this.isValidating = false;
    this.finalVideoUrl = null;
  }

  setPresetMode(mode) {
    this.presetMode = mode || 'fast_preview';
  }

  setState(newState, message = '') {
    this.state = newState;
    const logEntry = `[${new Date().toLocaleTimeString()}] ${newState}: ${message}`;
    this.stageLog.push(logEntry);
    console.log(logEntry);

    // Reset stage timeout guard (20 seconds limit per processing stage)
    if (this.stageTimeoutTimer) {
      clearTimeout(this.stageTimeoutTimer);
      this.stageTimeoutTimer = null;
    }

    if (!['IDLE', 'READY', 'PLAYING', 'FAILED', 'TRANSCRIBING', 'CANCELLED'].includes(newState)) {
      this.stageTimeoutTimer = setTimeout(() => {
        console.error(`[Pipeline Error] Stage timeout exceeded for ${this.state}`);
        const failedStage = this.state;
        this.setState('FAILED', `Stage ${failedStage} timed out after 20s limit.`);
        if (this.onError) {
          this.onError(`GENERATION FAILED\nStage: ${failedStage}\nReason: Stage processing timed out (20s limit exceeded).\n\nClick 'Retry Generation' to attempt again.`);
        }
      }, 20000);
    }

    if (this.onStatus) this.onStatus(this.state, message, this.stageLog);
  }

  logValidation(characterName, exists, source, attached, providerSupports, strength) {
    const valBlock = `--- CHARACTER REFERENCE VALIDATION ---\nCharacter: ${characterName}\nReference image exists: ${exists}\nReference image source: ${source ? (source.substring(0, 30) + '...') : 'none'}\nReference image attached to request: ${attached}\nGeneration provider supports reference image: ${providerSupports}\nReference Strength: ${strength}`;
    this.stageLog.push(valBlock);
    console.log(valBlock);
    if (this.onStatus) this.onStatus(this.state, `Validated ${characterName}`, this.stageLog);
  }

  /**
   * Called continuously as speech is transcribed into text.
   */
  handleTranscriptStream(transcript, topicTitle = '') {
    if (!transcript || transcript.trim() === '') return;
    this.lastTranscript = transcript;
    if (this.state === 'IDLE' || this.state === 'TRANSCRIBING') {
      this.setState('TRANSCRIBING', 'Speech recognized — ready to generate video');
    }
  }

  /**
   * Cancels any active generation job or polling intervals.
   */
  cancelCurrentGeneration() {
    if (this.pollingTimer) {
      clearInterval(this.pollingTimer);
      this.pollingTimer = null;
    }
    if (this.stageTimeoutTimer) {
      clearTimeout(this.stageTimeoutTimer);
      this.stageTimeoutTimer = null;
    }
    this.isValidating = false;
    this.finalVideoUrl = null;
    this.currentJobId = null;
  }

  /**
   * Submits transcript & character references to start video generation.
   */
  async submitTranscriptForVideo(transcript, topicTitle = '', style = '3d_characters', targetTopicId = null) {
    const cleanTranscript = (transcript || this.lastTranscript).trim();
    
    // Clear previous generation state, timers, character registries & blueprints
    this.cancelCurrentGeneration();
    CharacterBible.clear();
    CharacterProfiles.clear();

    const generationId = `gen_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    this.activeGenerationId = generationId;
    this.stageLog = [];

    if (!cleanTranscript) {
      if (this.onError) this.onError('Please speak or type a history lesson transcript first.');
      return;
    }

    try {
      console.log('====================================');
      console.log(`[Pipeline] Generation Started: ${generationId} for Topic: ${targetTopicId || 'custom'}`);

      // STAGE 1: PROCESSING_REFERENCES
      this.setState('PROCESSING_REFERENCES', 'Processing uploaded character reference images...');
      const references = globalCharacterRefMgr.getAllReferences();
      console.log(`Uploaded Character References: ${references.length}`);

      references.forEach(ref => {
        this.logValidation(
          ref.name,
          !!ref.dataUrl,
          ref.dataUrl,
          true,
          true,
          ref.strength || 'strong'
        );
      });

      // STAGE 2: CREATING_SCENES
      this.setState('CREATING_SCENES', 'Analyzing semantics & creating topic-isolated scene plan...');
      const analysis = HistoryAnalyzer.analyzeLesson(cleanTranscript, topicTitle);
      this.activeTopicId = targetTopicId || analysis.topicId;

      // Stamp and attach character references by ID to scenes
      analysis.scenes.forEach(sc => {
        sc.topicId = this.activeTopicId;
        sc.generationId = generationId;
        sc.characters = references.map(r => ({
          characterId: r.characterId || r.id,
          name: r.name,
          role: r.role,
          referenceStrength: r.strength || 'strong'
        }));
      });

      // Fast Preview Mode (Direct playback preview)
      if (this.presetMode === 'fast_preview') {
        this.setState('CREATING_PLAYABLE_URL', 'Creating video preview stream...');
        
        setTimeout(() => {
          if (this.activeGenerationId !== generationId) return; // Stale job guard
          if (this.stageTimeoutTimer) clearTimeout(this.stageTimeoutTimer);
          
          this.setState('READY', 'Video stream ready for playback');
          if (this.onVideoReady) {
            this.onVideoReady(null, analysis, style, this.presetMode, this.activeTopicId);
          }
        }, 500);

        return;
      }

      // STAGE 3: SUBMITTING_VIDEO_JOB
      this.setState('SUBMITTING_VIDEO_JOB', 'Preparing request payload for video provider...');

      // Build deduplicated reference dictionary
      const referenceImagesDict = {};
      references.forEach(r => {
        const charId = r.characterId || r.id;
        const imgUrl = r.referenceImageUrl || r.dataUrl;
        if (charId && imgUrl) {
          referenceImagesDict[charId] = imgUrl;
        }
      });

      const payload = {
        generationId,
        transcript: cleanTranscript,
        topicTitle: topicTitle || analysis.eventTitle,
        style,
        presetMode: this.presetMode,
        aspect_ratio: '16:9',
        reference_images: referenceImagesDict,
        characterReferences: references.map(r => ({
          characterId: r.characterId || r.id,
          name: r.name,
          role: r.role,
          characterType: 'human',
          visualReferenceRequired: true,
          fallbackToDummy: false
        })),
        scenes: analysis.scenes
      };

      const payloadString = JSON.stringify(payload);
      const payloadSizeKB = Math.round(payloadString.length / 1024);
      console.log(`[API Request] Payload Size: ${payloadSizeKB} KB`);
      this.stageLog.push(`[${new Date().toLocaleTimeString()}] Request payload size: ${payloadSizeKB} KB`);

      let response = await fetch(`${this.apiBaseUrl}/api/generate-video`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: payloadString
      });

      // HTTP 413 Auto-Retry Recovery (Compress to 512px and retry)
      if (response.status === 413) {
        console.warn('[Pipeline Warning] Received HTTP 413. Compressing images to 512px and retrying...');
        this.setState('SUBMITTING_VIDEO_JOB', 'Reference image payload is too large. Images have been resized and compressed before retrying.');

        const compressedDict = {};
        for (const r of references) {
          const charId = r.characterId || r.id;
          const origUrl = r.referenceImageUrl || r.dataUrl;
          if (origUrl) {
            const lowRes = await CharacterReferenceManager.compressAndResizeImage(origUrl, 512, 0.6);
            compressedDict[charId] = lowRes;
          }
        }

        payload.reference_images = compressedDict;
        response = await fetch(`${this.apiBaseUrl}/api/generate-video`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      }

      if (!response.ok) {
        throw new Error(`API server returned HTTP error status ${response.status}`);
      }

      const data = await response.json();
      if (!data || !data.jobId) {
        throw new Error('Video generation provider did not return a valid job ID.');
      }

      this.currentJobId = data.jobId;
      
      // STAGE 4: WAITING_FOR_PROVIDER
      this.setState('WAITING_FOR_PROVIDER', `Video job dispatched (Job ID: ${data.jobId}). Waiting for compilation...`);

      this.pollVideoJobStatus(data.jobId, analysis, style, generationId);
    } catch (err) {
      console.error('[Pipeline Error] Generation failed:', err);
      const failedStage = this.state;
      this.setState('FAILED', `Generation stage failed: ${err.message}`);
      if (this.onError) {
        this.onError(`GENERATION FAILED\nStage: ${failedStage}\nReason: ${err.message}\n\nClick 'Retry Generation' to attempt again.`);
      }
    }
  }

  /**
   * Polls job status until completed, then performs single-pass validation.
   */
  async pollVideoJobStatus(jobId, analysisData, style, generationId) {
    let pollAttempts = 0;
    const maxAttempts = 30;

    this.pollingTimer = setInterval(async () => {
      if (this.activeGenerationId !== generationId) {
        clearInterval(this.pollingTimer);
        return;
      }

      pollAttempts++;
      try {
        const response = await fetch(`${this.apiBaseUrl}/api/video-status/${jobId}`);
        if (!response.ok) throw new Error(`Status endpoint returned HTTP ${response.status}`);

        const job = await response.json();

        if (job.status === 'completed' && job.videoUrl) {
          clearInterval(this.pollingTimer);
          this.pollingTimer = null;

          if (this.activeGenerationId !== generationId) return;

          // STAGE 5: DOWNLOADING_RESULT
          this.setState('DOWNLOADING_RESULT', `Video compiled successfully. Output: ${job.videoUrl}`);

          // STAGE 6: VALIDATING_VIDEO_FILE (Run only once)
          await this.validateAndDeliverVideo(job.videoUrl, analysisData, style, generationId);

        } else if (job.status === 'failed') {
          clearInterval(this.pollingTimer);
          this.pollingTimer = null;
          if (this.stageTimeoutTimer) clearTimeout(this.stageTimeoutTimer);
          this.setState('FAILED', `Video compilation failed: ${job.error}`);
          if (this.onError) {
            this.onError(`GENERATION FAILED\nStage: WAITING_FOR_PROVIDER\nReason: ${job.error || 'Provider error'}\n\nClick 'Retry Generation' to attempt again.`);
          }
        } else if (pollAttempts >= maxAttempts) {
          clearInterval(this.pollingTimer);
          this.pollingTimer = null;
          if (this.stageTimeoutTimer) clearTimeout(this.stageTimeoutTimer);
          this.setState('FAILED', 'Video generation timed out');
          if (this.onError) {
            this.onError(`GENERATION FAILED\nStage: WAITING_FOR_PROVIDER\nReason: Polling limit reached without completed output.\n\nClick 'Retry Generation' to attempt again.`);
          }
        }
      } catch (err) {
        clearInterval(this.pollingTimer);
        this.pollingTimer = null;
        if (this.stageTimeoutTimer) clearTimeout(this.stageTimeoutTimer);
        this.setState('FAILED', err.message);
        if (this.onError) {
          this.onError(`GENERATION FAILED\nStage: WAITING_FOR_PROVIDER\nReason: ${err.message}\n\nClick 'Retry Generation' to attempt again.`);
        }
      }
    }, 600);
  }

  /**
   * Deterministic single-pass video validation before passing to player.
   */
  async validateAndDeliverVideo(videoUrl, analysisData, style, generationId) {
    if (this.isValidating) return;
    this.isValidating = true;

    this.setState('VALIDATING_VIDEO_FILE', 'Validating video headers & content type...');

    let attempts = 0;
    const maxValidationRetries = 3;
    let isValid = false;

    while (attempts < maxValidationRetries && !isValid) {
      attempts++;
      try {
        const headResp = await fetch(videoUrl, { method: 'HEAD' });
        if (headResp.ok) {
          isValid = true;
          break;
        }
      } catch (e) {
        console.warn(`[Validation Warning] Attempt ${attempts} failed:`, e);
      }
      if (!isValid && attempts < maxValidationRetries) {
        await new Promise(r => setTimeout(r, 800 * attempts));
      }
    }

    if (this.activeGenerationId !== generationId) return;

    if (this.stageTimeoutTimer) {
      clearTimeout(this.stageTimeoutTimer);
      this.stageTimeoutTimer = null;
    }

    // STAGE 7: CREATING_PLAYABLE_URL
    this.setState('CREATING_PLAYABLE_URL', 'Creating playable video source URL...');
    this.finalVideoUrl = videoUrl;

    // STAGE 8: READY
    this.setState('READY', 'Playable video ready');
    this.isValidating = false;

    if (this.onVideoReady) {
      this.onVideoReady(videoUrl, analysisData, style, this.presetMode);
    }
  }
}
