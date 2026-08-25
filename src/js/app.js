/* ==========================================================================
   Smart History Education AI - Main Application Controller & Topic Registry
   ========================================================================== */

import { PRESET_LESSONS } from './presetLessons.js';
import { SpeechEngine } from './speechEngine.js';
import { VideoGenerator } from './videoGenerator.js';
import { StoryboardEditor } from './storyboardEditor.js';
import { VideoPipelineManager } from './videoPipelineManager.js';
import { globalCharacterRefMgr } from './characterReferenceManager.js';
import { CharacterBible } from './characterBible.js';
import { CharacterProfiles } from './characterProfiles.js';

document.addEventListener('DOMContentLoaded', () => {
  // DOM Selectors
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  const pipelineStatusBadge = document.getElementById('pipelineStatusBadge');
  const presetContainer = document.getElementById('presetContainer');
  const topicTitleInput = document.getElementById('topicTitleInput');
  
  const micBox = document.getElementById('micBox');
  const micBtn = document.getElementById('micBtn');
  const micPauseBtn = document.getElementById('micPauseBtn');
  const micStatusText = document.getElementById('micStatusText');
  const waveformCanvas = document.getElementById('waveformCanvas');
  
  const transcriptTextarea = document.getElementById('transcriptTextarea');
  const generateVideoBtn = document.getElementById('generateVideoBtn');
  
  const addCharacterBtn = document.getElementById('addCharacterBtn');
  const charFileInput = document.getElementById('charFileInput');
  const characterRefGrid = document.getElementById('characterRefGrid');

  const mainCanvas = document.getElementById('mainCanvas');
  const html5VideoPlayer = document.getElementById('html5VideoPlayer');
  const aiProcessingOverlay = document.getElementById('aiProcessingOverlay');
  const aiStepTitle = document.getElementById('aiStepTitle');
  const aiStepDetails = document.getElementById('aiStepDetails');
  const pipelineLogConsole = document.getElementById('pipelineLogConsole');
  const errorAlertBox = document.getElementById('errorAlertBox');
  const errorMessageContent = document.getElementById('errorMessageContent');
  const retryBtn = document.getElementById('retryBtn');
  
  const playPauseBtn = document.getElementById('playPauseBtn');
  const restartBtn = document.getElementById('restartBtn');
  const subtitleToggleBtn = document.getElementById('subtitleToggleBtn');
  const fullscreenBtn = document.getElementById('fullscreenBtn');
  
  const currentTimeDisplay = document.getElementById('currentTimeDisplay');
  const totalTimeDisplay = document.getElementById('totalTimeDisplay');
  const progressBarWrapper = document.getElementById('progressBarWrapper');
  const progressBarFill = document.getElementById('progressBarFill');
  
  const exportVideoBtn = document.getElementById('exportVideoBtn');
  const downloadScriptBtn = document.getElementById('downloadScriptBtn');

  const storyboardGrid = document.getElementById('storyboardGrid');
  const characterRosterGrid = document.getElementById('characterRosterGrid');

  // Topic-Specific Video Registry (Isolated State for Each Topic)
  let selectedTopicId = 'plassey-1757';
  let selectedStyle = '3d_characters';
  let selectedPreset = 'fast_preview';

  function createPortraitDataUrl(primaryColor, accentColor, title) {
    const c = document.createElement('canvas');
    c.width = 160;
    c.height = 160;
    const ctx = c.getContext('2d');
    ctx.fillStyle = primaryColor;
    ctx.fillRect(0, 0, 160, 160);
    ctx.fillStyle = accentColor;
    ctx.beginPath();
    ctx.arc(80, 70, 40, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 12px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(title, 80, 140);
    return c.toDataURL('image/jpeg', 0.85);
  }

  const topicRegistry = {
    'plassey-1757': {
      id: 'plassey-1757',
      title: 'Battle of Plassey 1757',
      transcript: PRESET_LESSONS[2] ? PRESET_LESSONS[2].transcript : '',
      characters: [
        { id: 'ref_siraj', name: 'Siraj-ud-Daulah', role: 'Nawab of Bengal', p: '#ea580c', a: '#ffdbac' },
        { id: 'ref_clive', name: 'Robert Clive', role: 'British Commander', p: '#b91c1c', a: '#ffe4c4' },
        { id: 'ref_mir_jafar', name: 'Mir Jafar', role: 'Commander-in-Chief', p: '#1e293b', a: '#d1a36a' },
        { id: 'ref_british_soldier', name: 'British EIC Soldier', role: 'Infantry Soldier', p: '#15803d', a: '#f1c27d' }
      ],
      analysisData: null,
      videoUrl: null,
      status: 'IDLE',
      duration: 0,
      currentTime: 0
    },
    'ww1-1914-1918': {
      id: 'ww1-1914-1918',
      title: 'World War I (1914–1918)',
      transcript: PRESET_LESSONS[0] ? PRESET_LESSONS[0].transcript : '',
      characters: [
        { id: 'ref_archduke', name: 'Archduke Franz Ferdinand', role: 'Austrian Archduke', p: '#1e3a8a', a: '#ffdbac' },
        { id: 'ref_allied_soldier', name: 'WWI Allied Soldier', role: 'Infantry Soldier', p: '#365314', a: '#f1c27d' },
        { id: 'ref_central_soldier', name: 'WWI Central Powers Soldier', role: 'Infantry Soldier', p: '#475569', a: '#e0ac69' },
        { id: 'ref_ww1_commander', name: 'WWI Supreme Commander', role: 'Supreme Commander', p: '#1e1b4b', a: '#fed7aa' }
      ],
      analysisData: null,
      videoUrl: null,
      status: 'IDLE',
      duration: 0,
      currentTime: 0
    },
    'independence-1947': {
      id: 'independence-1947',
      title: 'August 14, 1947 Independence',
      transcript: PRESET_LESSONS[1] ? PRESET_LESSONS[1].transcript : '',
      characters: [
        { id: 'ref_nehru', name: 'Jawaharlal Nehru', role: 'Prime Minister of India', p: '#f8fafc', a: '#c68642' },
        { id: 'ref_freedom_fighter', name: 'Freedom Fighter', role: 'National Leader', p: '#ea580c', a: '#d1a36a' },
        { id: 'ref_statesman', name: 'Assembly Statesman', role: 'Constituent Assembly Member', p: '#78350f', a: '#f1c27d' },
        { id: 'ref_citizen', name: 'Delhi Citizen', role: 'Public Celebrant', p: '#0284c7', a: '#e0ac69' }
      ],
      analysisData: null,
      videoUrl: null,
      status: 'IDLE',
      duration: 0,
      currentTime: 0
    }
  };

  /* 1. Initialize Engines */
  let speechEngine = null;
  let videoGenerator = null;
  let storyboardEditor = null;
  let pipelineManager = null;

  videoGenerator = new VideoGenerator(
    mainCanvas,
    (progressRatio, currentSec, totalSec) => {
      progressBarFill.style.width = `${progressRatio * 100}%`;
      currentTimeDisplay.textContent = formatTime(currentSec);
      totalTimeDisplay.textContent = formatTime(totalSec);
      const activeTopic = topicRegistry[selectedTopicId];
      if (activeTopic) {
        activeTopic.currentTime = currentSec;
        activeTopic.duration = totalSec;
      }
    },
    () => {}
  );

  storyboardEditor = new StoryboardEditor(
    storyboardGrid,
    characterRosterGrid,
    (updatedScenes) => {
      const activeTopic = topicRegistry[selectedTopicId];
      if (videoGenerator && activeTopic && activeTopic.analysisData) {
        activeTopic.analysisData.scenes = updatedScenes;
        videoGenerator.updateScenes(updatedScenes);
      }
    }
  );

  // Initialize End-to-End Pipeline Manager
  pipelineManager = new VideoPipelineManager(
    (state, message, logs) => {
      updatePipelineHUD(state, message, logs);
    },
    (serverVideoUrl, analysisData, style, presetMode, topicId) => {
      const generationTopicId = topicId || pipelineManager.activeTopicId || selectedTopicId;
      console.log(`[Pipeline] Video Generation Completed for Topic: ${generationTopicId}`);

      // Save output strictly to the generating topic
      let targetTopic = topicRegistry[generationTopicId];
      if (!targetTopic) {
        targetTopic = {
          id: generationTopicId,
          title: topicTitleInput.value.trim() || 'History Lesson',
          transcript: transcriptTextarea.value.trim(),
          characters: [],
          analysisData: null,
          videoUrl: null,
          status: 'READY',
          duration: analysisData.totalDuration || 15,
          currentTime: 0
        };
        topicRegistry[generationTopicId] = targetTopic;
      }

      targetTopic.analysisData = analysisData;
      targetTopic.duration = analysisData.totalDuration || 15;
      targetTopic.videoUrl = serverVideoUrl;
      targetTopic.status = 'READY';

      aiProcessingOverlay.classList.remove('active');
      errorAlertBox.style.display = 'none';

      // Only update the active player if user is still on this topic
      if (selectedTopicId === generationTopicId) {
        storyboardEditor.loadData(analysisData.scenes, analysisData.figures);
        videoGenerator.loadScript(analysisData);
        videoGenerator.setVariation(style);
        videoGenerator.startPlayback();

        const totalDur = analysisData.totalDuration || videoGenerator.totalDuration;
        totalTimeDisplay.textContent = formatTime(totalDur);
        currentTimeDisplay.textContent = '00:00';
        updatePlayPauseIcon(true);

        pipelineManager.setState('READY', `Playable video ready (${analysisData.scenes.length} scenes, ${formatTime(totalDur)})`);
        showToast(`Cinematic Video Ready! ${analysisData.scenes.length} Scenes (${formatTime(totalDur)})`, 'success');
      } else {
        console.log(`[Pipeline] Saved result in background for ${generationTopicId} (Currently viewing: ${selectedTopicId})`);
      }
    },
    (errorMessage) => {
      aiProcessingOverlay.classList.remove('active');
      errorMessageContent.textContent = errorMessage;
      errorAlertBox.style.display = 'block';
    }
  );

  // Initialize Speech Engine
  speechEngine = new SpeechEngine(
    (transcript) => {
      transcriptTextarea.value = transcript;
      const title = topicTitleInput.value.trim() || 'History Lesson';
      pipelineManager.handleTranscriptStream(transcript, title);
    },
    (statusText, isRecording) => {
      micStatusText.textContent = statusText;
      if (isRecording) {
        micBox.classList.add('recording');
        micBtn.innerHTML = '<i class="fa-solid fa-stop"></i>';
        pipelineManager.setState('LISTENING', 'Listening...');
      } else {
        micBox.classList.remove('recording');
        micBtn.innerHTML = '<i class="fa-solid fa-microphone"></i>';
        if (transcriptTextarea.value.trim()) {
          pipelineManager.setState('TRANSCRIBING', 'Speech recognized — ready to generate video');
        }
      }
    }
  );

  function updatePipelineHUD(state, message, logs = []) {
    if (pipelineStatusBadge) {
      let icon = '<i class="fa-solid fa-circle-notch fa-spin"></i>';
      if (state === 'IDLE' || state === 'LISTENING') icon = '<i class="fa-solid fa-microphone"></i>';
      if (state === 'READY') icon = '<i class="fa-solid fa-circle-check" style="color:var(--accent-emerald);"></i>';
      if (state === 'FAILED') icon = '<i class="fa-solid fa-triangle-exclamation" style="color:var(--accent-crimson);"></i>';

      pipelineStatusBadge.innerHTML = `${icon} ${state}: ${message}`;
    }

    if (pipelineLogConsole) {
      pipelineLogConsole.innerHTML = logs.map(l => `<div>${l}</div>`).join('');
      pipelineLogConsole.scrollTop = pipelineLogConsole.scrollHeight;
    }

    const activeStates = [
      'PROCESSING_REFERENCES',
      'CREATING_SCENES',
      'SUBMITTING_VIDEO_JOB',
      'WAITING_FOR_PROVIDER',
      'DOWNLOADING_RESULT',
      'VALIDATING_VIDEO_FILE',
      'CREATING_PLAYABLE_URL'
    ];

    if (activeStates.includes(state)) {
      aiProcessingOverlay.classList.add('active');
      aiStepTitle.textContent = `Pipeline: ${state.replace(/_/g, ' ')}`;
      aiStepDetails.innerHTML = `<i class="fa-solid fa-brain"></i> ${message}`;
    } else if (['READY', 'PLAYING', 'IDLE', 'TRANSCRIBING', 'FAILED', 'CANCELLED'].includes(state)) {
      aiProcessingOverlay.classList.remove('active');
    }
  }

  /* 2. Topic Switching & State Architecture */
  function switchTopic(topicId) {
    console.log(`[TopicManager] TOPIC_CHANGED: Switching from ${selectedTopicId} -> ${topicId}`);
    
    // 1. Immediately stop current playback & audio
    videoGenerator.stopPlayback();
    SpeechEngine.stopNarration();
    updatePlayPauseIcon(false);

    // 2. Clear character registries to prevent cross-contamination
    CharacterBible.clear();
    CharacterProfiles.clear();
    globalCharacterRefMgr.clear();

    // 3. Switch active topic
    selectedTopicId = topicId;
    const currentTopic = topicRegistry[topicId] || {
      id: topicId,
      title: 'Custom History Topic',
      transcript: '',
      characters: [],
      analysisData: null,
      videoUrl: null,
      status: 'IDLE',
      duration: 0,
      currentTime: 0
    };

    // 4. Update UI input fields
    topicTitleInput.value = currentTopic.title;
    transcriptTextarea.value = currentTopic.transcript;

    // 5. Update Preset Buttons
    document.querySelectorAll('.preset-btn').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-topic') === topicId);
    });

    // 6. Load topic-specific character references
    if (currentTopic.characters && currentTopic.characters.length > 0) {
      currentTopic.characters.forEach(r => {
        const url = r.dataUrl || createPortraitDataUrl(r.p || '#1e293b', r.a || '#f59e0b', r.name);
        const img = new Image();
        img.src = url;
        img.onload = () => {
          globalCharacterRefMgr.addReference(r.id, r.name, r.role, url, img, r.strength || 'strong');
          renderCharacterRefCards();
        };
      });
    } else {
      renderCharacterRefCards();
    }

    // 7. Load previously generated video if exists for this topic
    if (currentTopic.analysisData) {
      storyboardEditor.loadData(currentTopic.analysisData.scenes, currentTopic.analysisData.figures);
      videoGenerator.loadScript(currentTopic.analysisData);
      videoGenerator.setVariation(selectedStyle);
      
      const totalDur = currentTopic.duration || currentTopic.analysisData.totalDuration || 15;
      totalTimeDisplay.textContent = formatTime(totalDur);
      currentTimeDisplay.textContent = formatTime(currentTopic.currentTime || 0);
      const ratio = totalDur > 0 ? (currentTopic.currentTime / totalDur) * 100 : 0;
      progressBarFill.style.width = `${ratio}%`;

      pipelineStatusBadge.innerHTML = `<i class="fa-solid fa-circle-check" style="color:var(--accent-emerald);"></i> READY: Playable video loaded (${formatTime(totalDur)})`;
      showToast(`Loaded ${currentTopic.title} (Saved Video Ready)`, 'info');
    } else {
      // Empty / Ungenerated Player State
      storyboardGrid.innerHTML = '<div class="empty-state-notice" style="grid-column: 1/-1; text-align: center; padding: 2.5rem; color: var(--text-muted);"><i class="fa-solid fa-clapperboard" style="font-size: 2rem; margin-bottom: 0.5rem;"></i><p>Click 🎬 <strong>Generate Video</strong> to analyze this lesson and generate cinematic scenes.</p></div>';
      characterRosterGrid.innerHTML = '';
      totalTimeDisplay.textContent = '00:00';
      currentTimeDisplay.textContent = '00:00';
      progressBarFill.style.width = '0%';
      pipelineStatusBadge.innerHTML = '<i class="fa-solid fa-microphone"></i> IDLE: Ready to generate video';
      showToast(`Loaded ${currentTopic.title}. Click 🎬 Generate Video when ready.`, 'info');
    }
  }

  /* 3. Character Reference Cards Rendering */
  function renderCharacterRefCards() {
    characterRefGrid.innerHTML = '';
    const refs = globalCharacterRefMgr.getAllReferences();

    refs.forEach(ref => {
      const card = document.createElement('div');
      card.className = 'char-ref-card';
      card.innerHTML = `
        <button class="btn-remove-char" title="Remove Character"><i class="fa-solid fa-xmark"></i></button>
        <img src="${ref.dataUrl}" class="char-img-preview" alt="${ref.name}">
        <div class="char-details-inputs">
          <input type="text" class="char-input-text char-name-input" value="${ref.name}" placeholder="Character Name">
          <input type="text" class="char-input-text char-role-input" value="${ref.role}" placeholder="Role (e.g. Leader)">
          <select class="char-input-text char-strength-select" style="font-size: 0.75rem; margin-top: 0.2rem; cursor: pointer;">
            <option value="exact" ${ref.strength === 'exact' ? 'selected' : ''}>Exact Similarity</option>
            <option value="strong" ${ref.strength === 'strong' ? 'selected' : ''}>Strong Similarity (Default)</option>
            <option value="flexible" ${ref.strength === 'flexible' ? 'selected' : ''}>Flexible Interpretation</option>
          </select>
        </div>
      `;

      card.querySelector('.char-name-input').addEventListener('input', (ev) => {
        ref.name = ev.target.value.trim() || 'Character';
      });

      card.querySelector('.char-role-input').addEventListener('input', (ev) => {
        ref.role = ev.target.value.trim() || 'Leader';
      });

      card.querySelector('.char-strength-select').addEventListener('change', (ev) => {
        globalCharacterRefMgr.updateStrength(ref.id, ev.target.value);
        showToast(`Strength for ${ref.name}: ${ev.target.value}`, 'info');
      });

      card.querySelector('.btn-remove-char').addEventListener('click', () => {
        globalCharacterRefMgr.removeReference(ref.id);
        renderCharacterRefCards();
        showToast(`Removed Character ${ref.name}`, 'info');
      });

      characterRefGrid.appendChild(card);
    });
  }

  addCharacterBtn.addEventListener('click', () => {
    charFileInput.click();
  });

  charFileInput.addEventListener('change', (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    const reader = new FileReader();

    reader.onload = (evt) => {
      const dataUrl = evt.target.result;
      const img = new Image();
      img.src = dataUrl;
      img.onload = () => {
        const defaultName = file.name.split('.')[0].replace(/[-_]/g, ' ');
        const record = globalCharacterRefMgr.addReference(null, defaultName, 'Historical Actor', dataUrl, img, 'strong');
        
        // Save into current topic
        const currentTopic = topicRegistry[selectedTopicId];
        if (currentTopic) {
          currentTopic.characters.push({
            id: record.id,
            name: record.name,
            role: record.role,
            dataUrl: dataUrl,
            strength: 'strong'
          });
        }

        renderCharacterRefCards();
        showToast(`Character Reference Uploaded: ${record.name}`, 'success');
      };
    };

    reader.readAsDataURL(file);
    charFileInput.value = '';
  });

  /* 4. Style Cards & Mode Presets */
  document.querySelectorAll('.style-card').forEach(card => {
    card.addEventListener('click', (e) => {
      document.querySelectorAll('.style-card').forEach(c => c.classList.remove('active'));
      const target = e.currentTarget;
      target.classList.add('active');
      selectedStyle = target.getAttribute('data-style') || '3d_characters';
      videoGenerator.setVariation(selectedStyle);
      showToast(`Selected Style: ${target.querySelector('.style-title').textContent}`, 'info');
    });
  });

  document.querySelectorAll('.mode-preset-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      document.querySelectorAll('.mode-preset-btn').forEach(b => b.classList.remove('active'));
      const target = e.currentTarget;
      target.classList.add('active');
      selectedPreset = target.getAttribute('data-preset') || 'fast_preview';
      pipelineManager.setPresetMode(selectedPreset);
      showToast(`Generation Mode: ${target.textContent.trim()}`, 'info');
    });
  });

  /* 5. PROMINENT 🎬 GENERATE VIDEO BUTTON & RETRY HANDLER */
  generateVideoBtn.addEventListener('click', () => {
    startGenerationPipeline();
  });

  retryBtn.addEventListener('click', () => {
    errorAlertBox.style.display = 'none';
    startGenerationPipeline();
  });

  function startGenerationPipeline() {
    const generationTopicId = selectedTopicId;
    console.log("GENERATE_BUTTON_CLICKED", generationTopicId);

    const transcript = transcriptTextarea.value.trim();
    if (!transcript) {
      console.error("GENERATION_BLOCKED: transcript missing for topic", generationTopicId);
      showToast('Please speak or enter a history lesson transcript first.', 'warning');
      return;
    }
    const title = topicTitleInput.value.trim() || 'History Lesson';
    console.log("GENERATION_TOPIC_CAPTURED", generationTopicId, { title, transcriptLength: transcript.length });

    showToast(`Generating ${selectedStyle.replace('_', ' ')} video for ${title}...`, 'info');
    pipelineManager.submitTranscriptForVideo(transcript, title, selectedStyle, generationTopicId);
  }

  /* 6. Microphone Controls */
  micBtn.addEventListener('click', () => {
    if (speechEngine.isRecording) {
      speechEngine.stopListening();
    } else {
      speechEngine.startListening(waveformCanvas);
    }
  });

  micPauseBtn.addEventListener('click', () => {
    if (!speechEngine.isRecording) return;
    if (speechEngine.isPaused) {
      speechEngine.resumeListening();
      micPauseBtn.innerHTML = '<i class="fa-solid fa-pause"></i>';
    } else {
      speechEngine.pauseListening();
      micPauseBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
    }
  });

  transcriptTextarea.addEventListener('input', () => {
    const title = topicTitleInput.value.trim() || 'History Lesson';
    const currentTopic = topicRegistry[selectedTopicId];
    if (currentTopic) {
      currentTopic.transcript = transcriptTextarea.value;
      currentTopic.title = title;
    }
    pipelineManager.handleTranscriptStream(transcriptTextarea.value, title);
  });

  /* 7. Preset Lesson Buttons */
  presetContainer.innerHTML = '';
  PRESET_LESSONS.forEach((preset) => {
    const btn = document.createElement('button');
    btn.className = `preset-btn ${preset.id === selectedTopicId ? 'active' : ''}`;
    btn.setAttribute('data-topic', preset.id);
    btn.innerHTML = `<i class="fa-solid fa-landmark"></i> ${preset.title}`;
    btn.addEventListener('click', () => switchTopic(preset.id));
    presetContainer.appendChild(btn);
  });

  // Initialize with Default Topic
  switchTopic('plassey-1757');

  /* 8. Player Controls (Play, Pause, Restart, Subtitles, Fullscreen, Seeking) */
  playPauseBtn.addEventListener('click', () => {
    const activeTopic = topicRegistry[selectedTopicId];
    if (!activeTopic || !activeTopic.analysisData) {
      showToast('Generate a video first by clicking 🎬 Generate Video', 'warning');
      return;
    }

    if (videoGenerator.isPlaying) {
      videoGenerator.pausePlayback();
      updatePlayPauseIcon(false);
    } else {
      videoGenerator.startPlayback();
      updatePlayPauseIcon(true);
    }
  });

  restartBtn.addEventListener('click', () => {
    const activeTopic = topicRegistry[selectedTopicId];
    if (!activeTopic || !activeTopic.analysisData) return;

    videoGenerator.stopPlayback();
    videoGenerator.startPlayback();
    updatePlayPauseIcon(true);
  });

  subtitleToggleBtn.addEventListener('click', () => {
    const isEnabled = !videoGenerator.subtitlesEnabled;
    videoGenerator.toggleSubtitles(isEnabled);
    subtitleToggleBtn.style.color = isEnabled ? 'var(--accent-gold)' : 'var(--text-muted)';
    showToast(isEnabled ? 'Subtitles Enabled' : 'Subtitles Disabled', 'info');
  });

  fullscreenBtn.addEventListener('click', () => {
    const playerCard = document.querySelector('.video-player-hero-card');
    if (!document.fullscreenElement) {
      playerCard.requestFullscreen().catch(err => console.warn(err));
    } else {
      document.exitFullscreen();
    }
  });

  /* 9. Interactive Timeline Scrubbing & Dragging */
  let isDraggingProgress = false;

  function seekByClientX(clientX) {
    const rect = progressBarWrapper.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    const activeTopic = topicRegistry[selectedTopicId];
    const totalDur = (activeTopic && activeTopic.duration) || videoGenerator.totalDuration || 15;
    const targetTime = ratio * totalDur;

    videoGenerator.seekTo(targetTime);
    currentTimeDisplay.textContent = formatTime(targetTime);
    progressBarFill.style.width = `${ratio * 100}%`;
  }

  progressBarWrapper.addEventListener('pointerdown', (e) => {
    const activeTopic = topicRegistry[selectedTopicId];
    if (!activeTopic || !activeTopic.analysisData) return;

    isDraggingProgress = true;
    progressBarWrapper.setPointerCapture(e.pointerId);
    seekByClientX(e.clientX);
  });

  progressBarWrapper.addEventListener('pointermove', (e) => {
    if (isDraggingProgress) {
      seekByClientX(e.clientX);
    }
  });

  progressBarWrapper.addEventListener('pointerup', (e) => {
    if (isDraggingProgress) {
      isDraggingProgress = false;
      progressBarWrapper.releasePointerCapture(e.pointerId);
    }
  });

  function updatePlayPauseIcon(isPlaying) {
    playPauseBtn.innerHTML = isPlaying ? '<i class="fa-solid fa-pause"></i>' : '<i class="fa-solid fa-play"></i>';
  }

  /* 10. Export Options */
  exportVideoBtn.addEventListener('click', async () => {
    const activeTopic = topicRegistry[selectedTopicId];
    if (!activeTopic || !activeTopic.analysisData) {
      showToast('Please generate a video first.', 'warning');
      return;
    }

    exportVideoBtn.disabled = true;
    exportVideoBtn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Exporting...';
    videoGenerator.exportVideo((blobUrl) => {
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = `${topicTitleInput.value.replace(/\s+/g, '_')}_Video.webm`;
      a.click();
      exportVideoBtn.disabled = false;
      exportVideoBtn.innerHTML = '<i class="fa-solid fa-download"></i> Download Video (.webm)';
      showToast('Video File Downloaded!', 'success');
    });
  });

  downloadScriptBtn.addEventListener('click', () => {
    const activeTopic = topicRegistry[selectedTopicId];
    if (!activeTopic || !activeTopic.analysisData) {
      showToast('No script generated yet.', 'warning');
      return;
    }
    const currentAnalysis = activeTopic.analysisData;
    const scriptContent = `CHARACTER REFERENCE VIDEO PLATFORM - SCRIPT\nTitle: ${topicTitleInput.value}\nStyle: ${selectedStyle}\nPreset: ${selectedPreset}\nYear: ${currentAnalysis.year}\nLocation: ${currentAnalysis.location}\n\nFULL TRANSCRIPT:\n${transcriptTextarea.value}\n\nSCENES:\n${currentAnalysis.scenes.map((s, i) => `Scene ${i + 1}: ${s.title} (${s.cameraAngle})\nText: ${s.text}\nPrompt: ${s.aiPrompt}\n`).join('\n')}`;

    const blob = new Blob([scriptContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${topicTitleInput.value.replace(/\s+/g, '_')}_Script.txt`;
    a.click();
    showToast('Script Exported!', 'success');
  });

  themeToggleBtn.addEventListener('click', () => {
    document.body.classList.toggle('light-theme');
    const isLight = document.body.classList.contains('light-theme');
    themeToggleBtn.innerHTML = isLight ? '<i class="fa-solid fa-sun"></i>' : '<i class="fa-solid fa-moon"></i>';
  });

  function showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    if (!container) return;
    const toast = document.createElement('div');
    toast.className = 'toast';
    
    let icon = '<i class="fa-solid fa-circle-info" style="color: var(--accent-gold);">';
    if (type === 'success') icon = '<i class="fa-solid fa-circle-check" style="color: var(--accent-emerald);">';
    if (type === 'warning') icon = '<i class="fa-solid fa-triangle-exclamation" style="color: var(--accent-crimson);">';

    toast.innerHTML = `${icon} <span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(100%)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  }

  function formatTime(seconds) {
    if (!seconds || !Number.isFinite(seconds) || isNaN(seconds) || seconds <= 0) return '00:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
});
