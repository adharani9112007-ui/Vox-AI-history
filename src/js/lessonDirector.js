/* ==========================================================================
   Smart History Education AI - AI Lesson Director & Rolling Buffer Engine
   ========================================================================== */

import { HistoryAnalyzer } from './historyAnalyzer.js';
import { QualityControl } from './qualityControl.js';

export class LessonDirector {
  constructor(onSceneReadyCallback, onStatusCallback) {
    this.onSceneReady = onSceneReadyCallback;
    this.onStatus = onStatusCallback;

    this.sceneQueue = [];
    this.transcriptHistory = '';
    this.activeTopic = 'Spoken History Lesson';
    this.isProcessingStream = false;
    this.lastProcessedLength = 0;
  }

  /**
   * Continuously ingests streaming speech transcript chunks from teacher's voice.
   * @param {string} fullTranscript 
   * @param {string} topicTitle 
   */
  processSpeechStream(fullTranscript, topicTitle = '') {
    if (!fullTranscript || fullTranscript.length === this.lastProcessedLength) return;
    this.transcriptHistory = fullTranscript;
    this.lastProcessedLength = fullTranscript.length;
    if (topicTitle) this.activeTopic = topicTitle;

    // Trigger Concept Analysis when sufficient text is accumulated (every ~15-20 words)
    const words = fullTranscript.trim().split(/\s+/);
    if (words.length >= 8 && !this.isProcessingStream) {
      this.planUpcomingScenes(fullTranscript, topicTitle);
    }
  }

  /**
   * Plans upcoming cinematic scenes in the background rolling buffer.
   */
  planUpcomingScenes(transcript, topicTitle) {
    this.isProcessingStream = true;
    if (this.onStatus) this.onStatus('AI Director: Planning Upcoming Scenes...', this.sceneQueue.length);

    // Perform NLP Analysis
    const analysis = HistoryAnalyzer.analyzeLesson(transcript, topicTitle);
    const rawScenes = analysis.scenes || [];

    // Quality Control Pass
    const qcScenes = rawScenes.map(sc => QualityControl.validateAndRefineScene(sc));

    // Update internal rolling queue
    this.sceneQueue = qcScenes;
    this.isProcessingStream = false;

    if (this.onSceneReady) {
      this.onSceneReady(this.sceneQueue, analysis);
    }

    if (this.onStatus) {
      this.onStatus(`AI Director: ${this.sceneQueue.length} Scenes Buffered & Ready`, this.sceneQueue.length);
    }
  }

  /**
   * Clears the active director rolling queue.
   */
  clearQueue() {
    this.sceneQueue = [];
    this.lastProcessedLength = 0;
    this.transcriptHistory = '';
  }
}
