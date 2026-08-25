/* ==========================================================================
   Smart History Education AI - Speech Recognition & Audio Wave Engine
   ========================================================================== */

export class SpeechEngine {
  constructor(onTranscriptCallback, onStatusCallback) {
    this.onTranscript = onTranscriptCallback;
    this.onStatus = onStatusCallback;
    this.recognition = null;
    this.isRecording = false;
    this.isPaused = false;

    // Web Audio Waveform Visualizer Properties
    this.audioCtx = null;
    this.analyser = null;
    this.mediaStream = null;
    this.animFrameId = null;

    this.initSpeechRecognition();
  }

  initSpeechRecognition() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = true;
      this.recognition.interimResults = true;
      this.recognition.lang = 'en-US';

      this.recognition.onresult = (event) => {
        if (this.isPaused) return;
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        if (this.onTranscript) {
          this.onTranscript(transcript, event.results[event.results.length - 1].isFinal);
        }
      };

      this.recognition.onerror = (event) => {
        console.warn('Speech Recognition Error:', event.error);
        if (this.onStatus) this.onStatus(`Error: ${event.error}`, false);
      };

      this.recognition.onend = () => {
        if (this.isRecording && !this.isPaused) {
          try { this.recognition.start(); } catch (e) { /* ignore */ }
        } else if (!this.isPaused) {
          if (this.onStatus) this.onStatus('Microphone Idle', false);
        }
      };
    } else {
      console.warn('Web Speech API is not supported in this browser.');
    }
  }

  async startListening(waveformCanvas = null) {
    if (this.isRecording) return;
    this.isRecording = true;
    this.isPaused = false;

    if (this.recognition) {
      try {
        this.recognition.start();
        if (this.onStatus) this.onStatus('Listening... Speak your lesson now!', true);
      } catch (err) {
        console.warn('Speech recognition start failed:', err);
      }
    } else {
      if (this.onStatus) this.onStatus('Listening (Browser Speech API unavailable, using audio record)', true);
    }

    if (waveformCanvas) {
      try {
        this.mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
        this.startWaveformVisualizer(this.mediaStream, waveformCanvas);
      } catch (err) {
        console.warn('Microphone access failed:', err);
      }
    }
  }

  pauseListening() {
    if (!this.isRecording || this.isPaused) return;
    this.isPaused = true;
    if (this.recognition) {
      try { this.recognition.stop(); } catch (e) { /* ignore */ }
    }
    if (this.onStatus) this.onStatus('Recording Paused', true);
  }

  resumeListening() {
    if (!this.isRecording || !this.isPaused) return;
    this.isPaused = false;
    if (this.recognition) {
      try { this.recognition.start(); } catch (e) { /* ignore */ }
    }
    if (this.onStatus) this.onStatus('Listening Resumed... Speak your lesson', true);
  }

  stopListening() {
    if (!this.isRecording) return;
    this.isRecording = false;
    this.isPaused = false;

    if (this.recognition) {
      try {
        this.recognition.stop();
      } catch (e) { /* ignore */ }
    }

    this.stopWaveformVisualizer();
    if (this.onStatus) this.onStatus('Voice Input Captured!', false);
  }

  startWaveformVisualizer(stream, canvas) {
    const ctx = canvas.getContext('2d');
    this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const source = this.audioCtx.createMediaStreamSource(stream);
    this.analyser = this.audioCtx.createAnalyser();
    this.analyser.fftSize = 64;
    source.connect(this.analyser);

    const bufferLength = this.analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      if (!this.isRecording) return;
      this.animFrameId = requestAnimationFrame(draw);

      if (this.isPaused) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#f59e0b';
        ctx.font = '14px "Inter", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('PAUSED', canvas.width / 2, canvas.height / 2 + 5);
        return;
      }

      this.analyser.getByteFrequencyData(dataArray);

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const barWidth = (canvas.width / bufferLength) * 1.5;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const barHeight = (dataArray[i] / 255) * canvas.height;
        ctx.fillStyle = `rgba(245, 158, 11, ${0.4 + (dataArray[i] / 255) * 0.6})`;
        ctx.fillRect(x, canvas.height - barHeight, barWidth - 2, barHeight);
        x += barWidth;
      }
    };

    draw();
  }

  stopWaveformVisualizer() {
    if (this.animFrameId) cancelAnimationFrame(this.animFrameId);
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach(track => track.stop());
    }
    if (this.audioCtx && this.audioCtx.state !== 'closed') {
      this.audioCtx.close();
    }
  }

  static speakNarration(text, rate = 1.0, onEnd = null) {
    if (!('speechSynthesis' in window)) {
      if (onEnd) onEnd();
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = rate;
    utterance.pitch = 1.0;
    
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(v => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha')));
    if (preferredVoice) utterance.voice = preferredVoice;

    if (onEnd) utterance.onend = onEnd;
    window.speechSynthesis.speak(utterance);
  }

  static stopNarration() {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }
}
