/* ==========================================================================
   Smart History Education AI - Automatic Real-Time Video Generator Engine
   ========================================================================== */

import { TemporalVideoEngine } from './temporalVideoEngine.js';
import { MotionValidator } from './motionValidator.js';
import { SpeechEngine } from './speechEngine.js';
import { SoundFXEngine } from './soundFXEngine.js';

export class VideoGenerator {
  constructor(canvasElement, onProgressCallback, onSceneChangeCallback) {
    this.renderer = new TemporalVideoEngine(canvasElement);
    this.soundFX = new SoundFXEngine();
    this.onProgress = onProgressCallback;
    this.onSceneChange = onSceneChangeCallback;

    this.scenes = [];
    this.currentSceneIndex = 0;
    this.currentTime = 0;
    this.totalDuration = 0;
    this.isPlaying = false;
    this.playbackSpeed = 1.0;
    this.animFrameId = null;
    this.lastTimestamp = 0;

    this.subtitlesEnabled = true;
    this.recordedChunks = [];
    this.isRecordingExport = false;
  }

  setVariation(variationName) {
    this.renderer.setVariation(variationName);
    this.renderCurrentFrame();
  }

  setQuality(is4K) {
    this.renderer.setQuality(is4K);
    this.renderCurrentFrame();
  }

  loadScript(analyzedData) {
    this.scenes = analyzedData.scenes || [];
    this.currentSceneIndex = 0;
    this.currentTime = 0;
    this.totalDuration = this.scenes.reduce((acc, sc) => acc + sc.duration, 0);

    // Validate motion quality
    if (this.scenes.length > 0) {
      MotionValidator.validateMotion(this.renderer.canvas, (t) => {
        this.renderer.renderFrame(this.scenes[0], t / this.scenes[0].duration, 0, '');
      }, this.scenes[0].duration);

      this.renderer.renderFrame(this.scenes[0], 0, 0, this.subtitlesEnabled ? this.scenes[0].text : '');
      if (this.onSceneChange) this.onSceneChange(this.scenes[0], 0);
    }
  }

  updateScenes(newScenes) {
    const wasPlaying = this.isPlaying;
    this.scenes = newScenes;
    this.totalDuration = this.scenes.reduce((acc, sc) => acc + sc.duration, 0);
    if (this.currentSceneIndex >= this.scenes.length) this.currentSceneIndex = 0;
    this.renderCurrentFrame();
    if (wasPlaying && !this.isPlaying) this.startPlayback();
  }

  startPlayback() {
    if (this.scenes.length === 0) return;
    this.isPlaying = true;
    this.lastTimestamp = performance.now();

    this.speakCurrentScene();
    this.triggerSceneSFX();

    this.loop();
  }

  pausePlayback() {
    this.isPlaying = false;
    if (this.animFrameId) cancelAnimationFrame(this.animFrameId);
    SpeechEngine.stopNarration();
    this.soundFX.stopCinematicScore();
  }

  stopPlayback() {
    this.pausePlayback();
    this.currentTime = 0;
    this.currentSceneIndex = 0;
    if (this.scenes.length > 0) {
      this.renderer.renderFrame(this.scenes[0], 0, 0, this.subtitlesEnabled ? this.scenes[0].text : '');
    }
  }

  seekTo(timeInSeconds) {
    this.currentTime = Math.max(0, Math.min(timeInSeconds, this.totalDuration));
    let accumulated = 0;
    let newSceneIdx = 0;

    for (let i = 0; i < this.scenes.length; i++) {
      if (this.currentTime >= accumulated && this.currentTime <= accumulated + this.scenes[i].duration) {
        newSceneIdx = i;
        break;
      }
      accumulated += this.scenes[i].duration;
    }

    if (newSceneIdx !== this.currentSceneIndex) {
      this.currentSceneIndex = newSceneIdx;
      if (this.isPlaying) {
        this.speakCurrentScene();
        this.triggerSceneSFX();
      }
      if (this.onSceneChange) this.onSceneChange(this.scenes[this.currentSceneIndex], this.currentSceneIndex);
    }

    this.renderCurrentFrame();
  }

  loop(timestamp = performance.now()) {
    if (!this.isPlaying) return;

    const delta = (timestamp - this.lastTimestamp) / 1000;
    this.lastTimestamp = timestamp;

    this.currentTime += delta * this.playbackSpeed;

    if (this.currentTime >= this.totalDuration) {
      this.currentTime = this.totalDuration;
      this.pausePlayback();
      this.renderCurrentFrame();
      if (this.onProgress) this.onProgress(1.0, this.currentTime, this.totalDuration);
      return;
    }

    let accumulated = 0;
    for (let i = 0; i < this.scenes.length; i++) {
      const sc = this.scenes[i];
      if (this.currentTime >= accumulated && this.currentTime < accumulated + sc.duration) {
        if (i !== this.currentSceneIndex) {
          this.currentSceneIndex = i;
          this.speakCurrentScene();
          this.triggerSceneSFX();
          if (this.onSceneChange) this.onSceneChange(sc, i);
        }
        break;
      }
      accumulated += sc.duration;
    }

    this.renderCurrentFrame();

    const progressRatio = this.totalDuration > 0 ? this.currentTime / this.totalDuration : 0;
    if (this.onProgress) this.onProgress(progressRatio, this.currentTime, this.totalDuration);

    this.animFrameId = requestAnimationFrame((ts) => this.loop(ts));
  }

  renderCurrentFrame() {
    if (this.scenes.length === 0) return;
    const sc = this.scenes[this.currentSceneIndex];
    let accumulatedBefore = 0;
    for (let i = 0; i < this.currentSceneIndex; i++) {
      accumulatedBefore += this.scenes[i].duration;
    }

    const sceneTime = this.currentTime - accumulatedBefore;
    const sceneProgress = Math.max(0, Math.min(1, sceneTime / sc.duration));
    const totalProgress = this.totalDuration > 0 ? this.currentTime / this.totalDuration : 0;

    this.renderer.renderFrame(
      sc,
      sceneProgress,
      totalProgress,
      this.subtitlesEnabled ? sc.text : ''
    );
  }

  speakCurrentScene() {
    if (!this.isPlaying) return;
    const sc = this.scenes[this.currentSceneIndex];
    if (sc && sc.text) {
      SpeechEngine.speakNarration(sc.text, this.playbackSpeed);
    }
  }

  triggerSceneSFX() {
    if (!this.isPlaying) return;
    const sc = this.scenes[this.currentSceneIndex];
    if (!sc) return;

    if (sc.sfx === 'battle') {
      this.soundFX.playCannonFire();
      this.soundFX.startCinematicScore('battle');
    } else if (sc.sfx === 'marching') {
      this.soundFX.playMarchingDrum();
      this.soundFX.startCinematicScore('battle');
    } else if (sc.sfx === 'palace' || sc.sfx === 'fanfare') {
      this.soundFX.playTrumpetFanfare();
      this.soundFX.startCinematicScore('palace');
    } else if (sc.sfx === 'rain') {
      this.soundFX.playThunder();
      this.soundFX.startCinematicScore('rain');
    }
  }

  setSpeed(speed) {
    this.playbackSpeed = speed;
  }

  toggleSubtitles(enabled) {
    this.subtitlesEnabled = enabled;
    this.renderCurrentFrame();
  }

  async exportVideo(onComplete) {
    if (this.isRecordingExport) return;
    this.isRecordingExport = true;
    this.recordedChunks = [];

    this.stopPlayback();
    const stream = this.renderer.canvas.captureStream(60);
    const options = { mimeType: 'video/webm;codecs=vp9' };

    try {
      this.mediaRecorder = new MediaRecorder(stream, options);
    } catch (e) {
      this.mediaRecorder = new MediaRecorder(stream);
    }

    this.mediaRecorder.ondataavailable = (event) => {
      if (event.data && event.data.size > 0) {
        this.recordedChunks.push(event.data);
      }
    };

    this.mediaRecorder.onstop = () => {
      const blob = new Blob(this.recordedChunks, { type: 'video/webm' });
      const url = URL.createObjectURL(blob);
      this.isRecordingExport = false;
      if (onComplete) onComplete(url);
    };

    this.mediaRecorder.start();
    this.startPlayback();

    const checkEnd = setInterval(() => {
      if (!this.isPlaying || this.currentTime >= this.totalDuration) {
        clearInterval(checkEnd);
        if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
          this.mediaRecorder.stop();
        }
      }
    }, 200);
  }

  async compileSceneVideosToPlayableBlob(analysisData, style, onComplete) {
    this.loadScript(analysisData);
    this.setVariation(style);

    const stream = this.renderer.canvas.captureStream(60);
    const chunks = [];
    let recorder;
    try {
      recorder = new MediaRecorder(stream, { mimeType: 'video/webm;codecs=vp9' });
    } catch (e) {
      recorder = new MediaRecorder(stream);
    }

    recorder.ondataavailable = (e) => {
      if (e.data && e.data.size > 0) chunks.push(e.data);
    };

    recorder.onstop = () => {
      const blob = new Blob(chunks, { type: 'video/webm' });
      const videoUrl = URL.createObjectURL(blob);
      if (onComplete) onComplete(videoUrl, blob);
    };

    recorder.start(100);

    // Fast multi-frame recording through all scenes
    let currentT = 0;
    const duration = Math.min(this.totalDuration, 30);
    const frameRate = 30;
    const dt = 1 / frameRate;

    const renderLoop = setInterval(() => {
      currentT += dt;
      this.seekTo(currentT);
      if (currentT >= duration) {
        clearInterval(renderLoop);
        if (recorder.state !== 'inactive') {
          recorder.stop();
        }
      }
    }, 1000 / frameRate);
  }
}
