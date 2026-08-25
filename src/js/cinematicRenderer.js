/* ==========================================================================
   Smart History Education AI - 1080p / 4K Photorealistic Action-Driven Renderer
   ========================================================================== */

import { CharacterBible } from './characterBible.js';

export class CinematicRenderer {
  constructor(canvasElement) {
    this.canvas = canvasElement;
    this.ctx = canvasElement.getContext('2d');

    this.is4K = false;
    this.width = 1920;
    this.height = 1080;
    this.canvas.width = this.width;
    this.canvas.height = this.height;

    // Atmospheric Particles & Rain Physics
    this.rainDrops = Array.from({ length: 90 }, () => ({
      x: Math.random() * this.width,
      y: Math.random() * this.height,
      speed: Math.random() * 18 + 14,
      length: Math.random() * 28 + 18
    }));

    this.particles = Array.from({ length: 60 }, () => ({
      x: Math.random() * this.width,
      y: Math.random() * this.height,
      radius: Math.random() * 3 + 1,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      alpha: Math.random() * 0.6 + 0.2
    }));
  }

  setQuality(is4K) {
    this.is4K = is4K;
    this.width = is4K ? 3840 : 1920;
    this.height = is4K ? 2160 : 1080;
    this.canvas.width = this.width;
    this.canvas.height = this.height;
  }

  /**
   * Main 60 FPS Photorealistic Render Loop.
   */
  renderFrame(currentScene, sceneProgress, totalProgress, subtitleText = '') {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.width, this.height);

    // 1. Draw Environment Background based on Scene Action/Env Type
    try {
      this.drawEnvironmentBackground(ctx, currentScene);
    } catch (error) {
      console.error('Environment background generation failed:', error);
      throw error;
    }

    // 2. Render Rain/Atmosphere if requested
    if (currentScene && (currentScene.sfx === 'rain' || currentScene.envType === 'river' || currentScene.actionType === 'battle')) {
      this.drawAtmosphericRain(ctx);
    }

    // 3. Render Dynamic Action-Driven Content
    if (currentScene) {
      const env = currentScene.envType || 'palace';
      switch (env) {
        case 'palace':
          this.renderPalaceScene(ctx, currentScene, sceneProgress);
          break;
        case 'march_road':
          this.renderMarchingScene(ctx, currentScene, sceneProgress);
          break;
        case 'battlefield':
          this.renderBattlefieldScene(ctx, currentScene, sceneProgress);
          break;
        case 'river':
          this.renderRiverCrossingScene(ctx, currentScene, sceneProgress);
          break;
        case 'factory':
          this.renderIndustrialScene(ctx, currentScene, sceneProgress);
          break;
        default:
          this.renderPalaceScene(ctx, currentScene, sceneProgress);
      }
    }

    // 4. Draw Ambient Particles
    this.drawParticles(ctx);

    // 5. Draw Frame, Resolution HUD & AI Video Prompt Box
    this.drawHUDAndPromptBox(ctx, currentScene);

    // 6. Render Subtitle Bar
    if (subtitleText) {
      this.drawSubtitles(ctx, subtitleText);
    }
  }

  drawEnvironmentBackground(ctx, scene) {
    this.drawActionEnvironment(ctx, scene);
  }

  drawActionEnvironment(ctx, scene) {
    const env = scene ? scene.envType : 'palace';
    const bgGrad = ctx.createRadialGradient(
      this.width / 2, this.height / 2, 120,
      this.width / 2, this.height / 2, Math.max(this.width, this.height)
    );

    if (env === 'battlefield') {
      bgGrad.addColorStop(0, '#3f1d1d'); bgGrad.addColorStop(0.6, '#180909'); bgGrad.addColorStop(1, '#050202');
    } else if (env === 'river') {
      bgGrad.addColorStop(0, '#0c4a6e'); bgGrad.addColorStop(0.6, '#072738'); bgGrad.addColorStop(1, '#020d14');
    } else if (env === 'march_road') {
      bgGrad.addColorStop(0, '#1c1917'); bgGrad.addColorStop(0.6, '#0c0a09'); bgGrad.addColorStop(1, '#030202');
    } else {
      bgGrad.addColorStop(0, '#1e293b'); bgGrad.addColorStop(0.6, '#0f172a'); bgGrad.addColorStop(1, '#020617');
    }

    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, this.width, this.height);
  }

  drawAtmosphericRain(ctx) {
    ctx.save();
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.45)';
    ctx.lineWidth = this.is4K ? 3 : 1.5;

    this.rainDrops.forEach(drop => {
      drop.y += drop.speed;
      drop.x -= 4;
      if (drop.y > this.height) { drop.y = -20; drop.x = Math.random() * this.width; }
      ctx.beginPath(); ctx.moveTo(drop.x, drop.y); ctx.lineTo(drop.x - 5, drop.y + drop.length); ctx.stroke();
    });
    ctx.restore();
  }

  drawParticles(ctx) {
    ctx.save();
    this.particles.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0) p.x = this.width; if (p.x > this.width) p.x = 0;
      if (p.y < 0) p.y = this.height; if (p.y > this.height) p.y = 0;
      ctx.fillStyle = `rgba(245, 158, 11, ${p.alpha})`;
      ctx.beginPath(); ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2); ctx.fill();
    });
    ctx.restore();
  }

  /* -------------------------------------------------------------------------- */
  /* Action-Driven Scene Renderers                                              */
  /* -------------------------------------------------------------------------- */

  // 1. Palace & Courtroom Action Scene
  renderPalaceScene(ctx, scene, progress) {
    ctx.save();
    ctx.fillStyle = '#f59e0b'; ctx.font = 'bold 34px "Outfit", sans-serif';
    ctx.fillText(`🏛️ PALACE & ROYAL COURT: ${scene.locationName.toUpperCase()}`, 80, 110);

    const animPhase = Date.now() / 250;
    const figures = scene.figures || [];
    const leaderBp = CharacterBible.getOrRegisterCharacter(figures[0] ? figures[0].name : 'The King', 'Monarch', 'Crown');
    const officerBp = CharacterBible.getOrRegisterCharacter(figures[1] ? figures[1].name : 'The Officer', 'Commander', 'Guard');

    // Royal Throne Backdrop
    ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
    ctx.strokeStyle = '#f59e0b'; ctx.lineWidth = 3;
    this.drawRoundedRect(ctx, this.width / 2 - 400, 180, 800, 520, 20, true, true);

    // Leader Puppet in Throne Room
    const enterX = (this.width / 2 - 180) + Math.min(1, progress * 1.5) * 80;
    CharacterBible.drawPhotorealisticPuppet(ctx, enterX, 580, leaderBp, 1.45, animPhase, this.is4K);
    CharacterBible.drawPhotorealisticPuppet(ctx, this.width / 2 + 180, 580, officerBp, 1.35, animPhase + 1.2, this.is4K);

    ctx.restore();
  }

  // 2. Troop Marching Scene
  renderMarchingScene(ctx, scene, progress) {
    ctx.save();
    ctx.fillStyle = '#f59e0b'; ctx.font = 'bold 34px "Outfit", sans-serif';
    ctx.fillText(`🪖 TROOP MOBILIZATION & MARCH: ${scene.locationName.toUpperCase()}`, 80, 110);

    const animPhase = Date.now() / 180;
    const figures = scene.figures || [];
    const leaderBp = CharacterBible.getOrRegisterCharacter(figures[0] ? figures[0].name : 'General', 'Commander', 'Forces');

    // Marching Road Vector
    ctx.fillStyle = '#1c1917'; ctx.strokeStyle = 'rgba(245, 158, 11, 0.3)'; ctx.lineWidth = 3;
    this.drawRoundedRect(ctx, 80, 150, this.width - 160, this.height - 320, 16, true, true);

    // Marching Column
    const marchX = 250 + (this.width - 600) * Math.min(1, progress * 1.2);
    CharacterBible.drawPhotorealisticPuppet(ctx, marchX, 620, leaderBp, 1.3, animPhase, this.is4K);

    const soldierBp = CharacterBible.getOrRegisterCharacter('Imperial Guard', 'Soldier', 'Battalion');
    CharacterBible.drawPhotorealisticPuppet(ctx, marchX - 220, 620, soldierBp, 1.2, animPhase + 0.8, this.is4K);

    ctx.restore();
  }

  // 3. Battlefield Action Scene
  renderBattlefieldScene(ctx, scene, progress) {
    ctx.save();
    ctx.fillStyle = '#ef4444'; ctx.font = 'bold 34px "Outfit", sans-serif';
    ctx.fillText(`⚔️ BATTLE ENGAGEMENT & CLIMAX: ${scene.locationName.toUpperCase()}`, 80, 110);

    const animPhase = Date.now() / 220;
    const figures = scene.figures || [];
    const charA = CharacterBible.getOrRegisterCharacter(figures[0] ? figures[0].name : 'Defending General', 'Nawab', 'Defenders');
    const charB = CharacterBible.getOrRegisterCharacter(figures[1] ? figures[1].name : 'Attacking Commander', 'Commander', 'Attackers');

    ctx.fillStyle = 'rgba(239, 68, 68, 0.15)'; ctx.fillRect(80, 150, this.width - 160, this.height - 320);

    const leadX = 450 + Math.sin(animPhase) * 50;
    const oppX = 1450 - Math.sin(animPhase) * 50;

    CharacterBible.drawPhotorealisticPuppet(ctx, leadX, 640, charA, 1.5, animPhase, this.is4K);
    CharacterBible.drawPhotorealisticPuppet(ctx, oppX, 640, charB, 1.5, animPhase + 1.5, this.is4K);

    ctx.restore();
  }

  // 4. River / Sea Crossing Scene
  renderRiverCrossingScene(ctx, scene, progress) {
    ctx.save();
    ctx.fillStyle = '#38bdf8'; ctx.font = 'bold 34px "Outfit", sans-serif';
    ctx.fillText(`🌊 RIVER CROSSING & EXPEDITION: ${scene.locationName.toUpperCase()}`, 80, 110);

    const animPhase = Date.now() / 250;
    const figures = scene.figures || [];
    const leaderBp = CharacterBible.getOrRegisterCharacter(figures[0] ? figures[0].name : 'Leader', 'Commander', 'Expedition');

    // Water River Canvas
    ctx.fillStyle = 'rgba(12, 74, 110, 0.85)'; ctx.strokeStyle = '#38bdf8'; ctx.lineWidth = 2;
    this.drawRoundedRect(ctx, 80, 150, this.width - 160, this.height - 320, 16, true, true);

    const crossX = 300 + (this.width - 600) * Math.min(1, progress * 1.1);
    CharacterBible.drawPhotorealisticPuppet(ctx, crossX, 600, leaderBp, 1.35, animPhase, this.is4K);

    ctx.restore();
  }

  // 5. Industrial / City Scene
  renderIndustrialScene(ctx, scene, progress) {
    ctx.save();
    ctx.fillStyle = '#f59e0b'; ctx.font = 'bold 34px "Outfit", sans-serif';
    ctx.fillText(`🏭 INDUSTRIAL & CITIZEN REVOLUTION: ${scene.locationName.toUpperCase()}`, 80, 110);

    const animPhase = Date.now() / 250;
    const figures = scene.figures || [];
    const leaderBp = CharacterBible.getOrRegisterCharacter(figures[0] ? figures[0].name : 'Leader', 'Pioneer', 'Reformers');

    ctx.fillStyle = 'rgba(30, 41, 59, 0.9)'; ctx.strokeStyle = '#f59e0b'; ctx.lineWidth = 2;
    this.drawRoundedRect(ctx, 80, 150, this.width - 160, this.height - 320, 16, true, true);

    CharacterBible.drawPhotorealisticPuppet(ctx, this.width / 2, 620, leaderBp, 1.4, animPhase, this.is4K);

    ctx.restore();
  }

  /* HUD & AI Prompt Overlay Box */
  drawHUDAndPromptBox(ctx, scene) {
    ctx.save();
    ctx.strokeStyle = 'rgba(245, 158, 11, 0.35)'; ctx.lineWidth = 4;
    ctx.strokeRect(30, 30, this.width - 60, this.height - 60);

    // Fact-Checked Record Watermark
    ctx.fillStyle = 'rgba(15, 23, 42, 0.9)'; ctx.strokeStyle = '#f59e0b'; ctx.lineWidth = 2;
    this.drawRoundedRect(ctx, this.width - 500, 45, 440, 48, 24, true, true);
    ctx.fillStyle = '#fbbf24'; ctx.font = `bold ${this.is4K ? 24 : 18}px "Outfit", sans-serif`; ctx.textAlign = 'center';
    ctx.fillText('📜 Fact-Checked Record | 🎬 AI Visual Movie', this.width - 280, 75);

    // On-Screen AI Scene Prompt Box derived from spoken text
    if (scene && scene.aiPrompt) {
      const promptW = this.width - 240;
      const promptX = 120;
      const promptY = 110;

      ctx.fillStyle = 'rgba(15, 23, 42, 0.88)';
      ctx.strokeStyle = 'rgba(245, 158, 11, 0.5)';
      ctx.lineWidth = 1.5;
      this.drawRoundedRect(ctx, promptX, promptY, promptW, 55, 10, true, true);

      ctx.fillStyle = '#f59e0b';
      ctx.font = 'bold 16px "Outfit", sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText('🤖 AI SCENE PROMPT:', promptX + 20, promptY + 33);

      ctx.fillStyle = '#e2e8f0';
      ctx.font = '15px "Inter", sans-serif';
      const truncatedPrompt = scene.aiPrompt.length > 120 ? scene.aiPrompt.substring(0, 117) + '...' : scene.aiPrompt;
      ctx.fillText(truncatedPrompt, promptX + 205, promptY + 33);
    }

    ctx.restore();
  }

  drawSubtitles(ctx, subtitleText) {
    ctx.save();
    const barW = this.width - 240;
    const barH = 85;
    const barX = 120;
    const barY = this.height - 145;

    ctx.fillStyle = 'rgba(10, 14, 23, 0.9)'; ctx.strokeStyle = 'rgba(245, 158, 11, 0.5)'; ctx.lineWidth = 2;
    this.drawRoundedRect(ctx, barX, barY, barW, barH, 14, true, true);

    ctx.fillStyle = '#f59e0b'; ctx.font = 'bold 20px "Outfit", sans-serif'; ctx.textAlign = 'left';
    ctx.fillText('🗣️ SPOKEN NARRATION:', barX + 25, barY + 48);

    ctx.fillStyle = '#ffffff'; ctx.font = '500 24px "Inter", sans-serif';
    ctx.fillText(subtitleText, barX + 280, barY + 48);

    ctx.restore();
  }

  drawRoundedRect(ctx, x, y, width, height, radius, fill, stroke) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y); ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
    if (fill) ctx.fill(); if (stroke) ctx.stroke();
  }
}
