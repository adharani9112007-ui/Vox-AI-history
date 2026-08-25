/* ==========================================================================
   Smart History Education AI - 60 FPS HTML5 Canvas Visual Renderer Engine
   ========================================================================== */

import { CharacterProfiles } from './characterProfiles.js';

export class CanvasRenderer {
  constructor(canvasElement) {
    this.canvas = canvasElement;
    this.ctx = canvasElement.getContext('2d');
    
    // Internal render dimensions (Standard 1080p 16:9 ratio)
    this.width = 1920;
    this.height = 1080;
    this.canvas.width = this.width;
    this.canvas.height = this.height;

    // Render style mode: 'cinematic', '3d_anim', '2d_art', 'documentary'
    this.currentStyle = 'cinematic';

    // Animated particles & rain physics
    this.particles = Array.from({ length: 50 }, () => ({
      x: Math.random() * this.width,
      y: Math.random() * this.height,
      radius: Math.random() * 2.5 + 1,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      alpha: Math.random() * 0.5 + 0.2
    }));

    this.rainDrops = Array.from({ length: 80 }, () => ({
      x: Math.random() * this.width,
      y: Math.random() * this.height,
      speed: Math.random() * 15 + 12,
      length: Math.random() * 25 + 15
    }));
  }

  setStyle(styleName) {
    this.currentStyle = styleName || 'cinematic';
  }

  /**
   * Main render method called per frame.
   */
  renderFrame(currentScene, sceneProgress, totalProgress, subtitleText = '') {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.width, this.height);

    // 1. Draw Universal Background & Historic Texture
    this.drawBackground(ctx, currentScene ? currentScene.bgTheme : 'gold_imperial');

    // 2. Draw Weather / Environment Effects
    if (currentScene && (currentScene.id === 'scene-aftermath' || currentScene.id === 'scene-climax-battle')) {
      this.drawRain(ctx);
    }

    // 3. Draw Scene Content
    if (currentScene) {
      switch (currentScene.type) {
        case 'title_card':
          this.renderTitleCard(ctx, currentScene, sceneProgress);
          break;
        case 'animated_map':
          this.renderAnimatedMap(ctx, currentScene, sceneProgress);
          break;
        case 'character_cards':
          this.renderCharacterCards(ctx, currentScene, sceneProgress);
          break;
        case 'animated_timeline':
          this.renderAnimatedTimeline(ctx, currentScene, sceneProgress);
          break;
        case 'cause_effect':
          this.renderCauseEffect(ctx, currentScene, sceneProgress);
          break;
        case 'lesson_summary':
          this.renderLessonSummary(ctx, currentScene, sceneProgress);
          break;
        default:
          this.renderTitleCard(ctx, currentScene, sceneProgress);
      }
    }

    // 4. Style Overlays (Film Grain / Sepia / Cel Shader)
    this.applyStyleFilters(ctx);

    // 5. Draw Ambient Floating Particles
    this.drawParticles(ctx);

    // 6. Draw Outer Frame & Camera HUD
    this.drawHistoricFrame(ctx, currentScene);

    // 7. Draw Subtitle Bar
    if (subtitleText) {
      this.drawSubtitles(ctx, subtitleText);
    }
  }

  applyStyleFilters(ctx) {
    ctx.save();
    if (this.currentStyle === 'documentary') {
      // Vintage Sepia Vignette
      ctx.fillStyle = 'rgba(180, 83, 9, 0.08)';
      ctx.fillRect(0, 0, this.width, this.height);
    } else if (this.currentStyle === '3d_anim') {
      // Clean Cel-shaded Lighting boost
      ctx.fillStyle = 'rgba(255, 255, 255, 0.03)';
      ctx.fillRect(0, 0, this.width, this.height);
    } else if (this.currentStyle === '2d_art') {
      // Parchment paper tone
      ctx.fillStyle = 'rgba(254, 243, 199, 0.06)';
      ctx.fillRect(0, 0, this.width, this.height);
    }
    ctx.restore();
  }

  drawRain(ctx) {
    ctx.save();
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.4)';
    ctx.lineWidth = 1.5;

    this.rainDrops.forEach(drop => {
      drop.y += drop.speed;
      drop.x -= 3;
      if (drop.y > this.height) {
        drop.y = -20;
        drop.x = Math.random() * this.width;
      }
      ctx.beginPath();
      ctx.moveTo(drop.x, drop.y);
      ctx.lineTo(drop.x - 4, drop.y + drop.length);
      ctx.stroke();
    });
    ctx.restore();
  }

  drawBackground(ctx, theme) {
    const bgGradient = ctx.createRadialGradient(
      this.width / 2, this.height / 2, 100,
      this.width / 2, this.height / 2, Math.max(this.width, this.height)
    );
    bgGradient.addColorStop(0, '#0f172a');
    bgGradient.addColorStop(0.6, '#090d16');
    bgGradient.addColorStop(1, '#030509');

    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, this.width, this.height);

    ctx.save();
    ctx.strokeStyle = 'rgba(245, 158, 11, 0.05)';
    ctx.lineWidth = 1;
    const gridSize = 90;
    for (let x = 0; x < this.width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0); ctx.lineTo(x, this.height); ctx.stroke();
    }
    for (let y = 0; y < this.height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y); ctx.lineTo(this.width, y); ctx.stroke();
    }
    ctx.restore();
  }

  drawParticles(ctx) {
    ctx.save();
    this.particles.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0) p.x = this.width;
      if (p.x > this.width) p.x = 0;
      if (p.y < 0) p.y = this.height;
      if (p.y > this.height) p.y = 0;

      ctx.fillStyle = `rgba(245, 158, 11, ${p.alpha})`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.restore();
  }

  drawHistoricFrame(ctx, currentScene) {
    ctx.save();
    ctx.strokeStyle = 'rgba(245, 158, 11, 0.35)';
    ctx.lineWidth = 4;
    ctx.strokeRect(30, 30, this.width - 60, this.height - 60);

    // Top Right Educational Fact-Check Badge
    ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 2;
    this.drawRoundedRect(ctx, this.width - 480, 50, 420, 46, 23, true, true);

    ctx.fillStyle = '#fbbf24';
    ctx.font = 'bold 18px "Outfit", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('📜 Fact-Checked Record | 🎬 AI Visual Movie', this.width - 270, 78);

    // Camera Angle HUD Indicator
    if (currentScene && currentScene.cameraAngle) {
      ctx.fillStyle = 'rgba(15, 23, 42, 0.75)';
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
      this.drawRoundedRect(ctx, 50, 50, 240, 42, 10, true, true);

      ctx.fillStyle = '#94a3b8';
      ctx.font = '600 16px "Inter", sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(`🎥 ${currentScene.cameraAngle}`, 65, 76);
    }

    ctx.restore();
  }

  /* Scene Renderers */
  renderTitleCard(ctx, scene, progress) {
    ctx.save();
    const alpha = Math.min(1, progress * 3);
    ctx.globalAlpha = alpha;

    ctx.font = '96px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('🏛️', this.width / 2, this.height / 2 - 180);

    const yearY = this.height / 2 - 80;
    ctx.fillStyle = 'rgba(245, 158, 11, 0.15)';
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 2;
    this.drawRoundedRect(ctx, this.width / 2 - 140, yearY - 24, 280, 48, 24, true, true);

    ctx.fillStyle = '#fbbf24';
    ctx.font = 'bold 28px "Outfit", sans-serif';
    ctx.fillText(scene.subtitle || 'CINEMATIC HISTORICAL MOVIE', this.width / 2, yearY);

    ctx.fillStyle = '#ffffff';
    ctx.font = '900 72px "Outfit", sans-serif';
    ctx.fillText(scene.title, this.width / 2, this.height / 2 + 20);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '500 32px "Inter", sans-serif';
    ctx.fillText('AI-Generated Cinematic Historical Storytelling', this.width / 2, this.height / 2 + 100);

    ctx.restore();
  }

  renderAnimatedMap(ctx, scene, progress) {
    ctx.save();
    ctx.fillStyle = '#f59e0b';
    ctx.font = 'bold 36px "Outfit", sans-serif';
    ctx.fillText(`🗺️ THEATER OF EVENTS: ${scene.locationName.toUpperCase()}`, 80, 110);

    const mapX = 80; const mapY = 140;
    const mapW = this.width - 160; const mapH = this.height - 300;

    ctx.fillStyle = '#0a101d';
    ctx.strokeStyle = 'rgba(245, 158, 11, 0.4)';
    ctx.lineWidth = 3;
    this.drawRoundedRect(ctx, mapX, mapY, mapW, mapH, 16, true, true);

    // Animated Marching Troops Puppet on Map
    const animPhase = Date.now() / 200;
    const marchingX = mapX + 300 + (mapW - 600) * Math.min(1, progress * 1.2);
    const marchingY = mapY + mapH - 180;

    // Draw Commander Puppet on Map
    const leaderProfile = CharacterProfiles.createProfile('Robert Clive', 'Commander', 'EIC');
    CharacterProfiles.drawCharacterPuppet(ctx, marchingX, marchingY, leaderProfile, 0.8, animPhase, this.currentStyle);

    ctx.restore();
  }

  renderCharacterCards(ctx, scene, progress) {
    ctx.save();
    ctx.fillStyle = '#f59e0b';
    ctx.font = 'bold 36px "Outfit", sans-serif';
    ctx.fillText('👑 ROYAL COUNCIL & HISTORICAL ACTORS', 80, 110);

    const figures = scene.figures || [];
    const animPhase = Date.now() / 250;
    const startX = 450;
    const figureY = this.height / 2 + 150;

    figures.forEach((fig, idx) => {
      const x = startX + idx * 550;
      const profile = CharacterProfiles.createProfile(fig.name, fig.role, fig.faction);
      CharacterProfiles.drawCharacterPuppet(ctx, x, figureY, profile, 1.4, animPhase + idx, this.currentStyle);

      // Speech / Dialogue Bubble
      ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 2;
      this.drawRoundedRect(ctx, x - 180, figureY - 340, 360, 100, 14, true, true);

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 22px "Outfit", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(profile.name, x, figureY - 305);

      ctx.fillStyle = '#fbbf24';
      ctx.font = '18px "Inter", sans-serif';
      ctx.fillText(`"${fig.role}"`, x, figureY - 265);
    });

    ctx.restore();
  }

  renderAnimatedTimeline(ctx, scene, progress) {
    ctx.save();
    ctx.fillStyle = '#f59e0b';
    ctx.font = 'bold 36px "Outfit", sans-serif';
    ctx.fillText('⚔️ BATTLEFIELD CLIMAX & MILESTONES', 80, 110);

    // Battle Smoke & Fire FX
    const animPhase = Date.now() / 300;
    ctx.fillStyle = 'rgba(239, 68, 68, 0.15)';
    ctx.fillRect(80, 140, this.width - 160, this.height - 300);

    // Animated Charging Cavalry / Troops Puppets
    const charA = CharacterProfiles.createProfile('Siraj-ud-Daulah', 'Nawab', 'Defenders');
    const charB = CharacterProfiles.createProfile('Robert Clive', 'Commander', 'Attackers');

    const leadX = 400 + Math.sin(animPhase) * 40;
    const oppX = 1400 - Math.sin(animPhase) * 40;

    CharacterProfiles.drawCharacterPuppet(ctx, leadX, this.height / 2 + 180, charA, 1.5, animPhase, this.currentStyle);
    CharacterProfiles.drawCharacterPuppet(ctx, oppX, this.height / 2 + 180, charB, 1.5, animPhase + 1.5, this.currentStyle);

    ctx.restore();
  }

  renderCauseEffect(ctx, scene, progress) {
    ctx.save();
    ctx.fillStyle = '#f59e0b';
    ctx.font = 'bold 36px "Outfit", sans-serif';
    ctx.fillText('⚡ HISTORICAL CONSEQUENCES & IMPACT', 80, 110);

    const ce = scene.causesAndEffects || {};
    const turningPoint = ce.turningPoint || 'Key strategic turning point event.';

    const colX = (this.width - 1000) / 2;
    const colY = 220;

    ctx.fillStyle = 'rgba(17, 24, 39, 0.9)';
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 3;
    this.drawRoundedRect(ctx, colX, colY, 1000, 480, 20, true, true);

    ctx.fillStyle = '#fbbf24';
    ctx.font = 'bold 36px "Outfit", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('⭐ THE DECISIVE TURNING POINT', this.width / 2, colY + 80);

    ctx.fillStyle = '#ffffff';
    ctx.font = '500 28px "Inter", sans-serif';
    this.wrapText(ctx, `"${turningPoint}"`, this.width / 2, colY + 180, 880, 40, true);

    ctx.restore();
  }

  renderLessonSummary(ctx, scene, progress) {
    ctx.save();
    ctx.fillStyle = '#f59e0b';
    ctx.font = 'bold 36px "Outfit", sans-serif';
    ctx.fillText('🎓 EDUCATIONAL LESSON SUMMARY', 80, 110);

    const cardX = (this.width - 1200) / 2;
    const cardY = 200;

    ctx.fillStyle = 'rgba(17, 24, 39, 0.9)';
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 3;
    this.drawRoundedRect(ctx, cardX, cardY, 1200, 520, 20, true, true);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 44px "Outfit", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`${scene.eventTitle || 'Historical Summary'}`, this.width / 2, cardY + 80);

    const points = scene.summaryPoints || ['Essential milestone in historical progression.'];
    let itemY = cardY + 180;

    points.forEach((pt) => {
      ctx.fillStyle = 'rgba(245, 158, 11, 0.12)';
      this.drawRoundedRect(ctx, cardX + 60, itemY, 1080, 80, 12, true, false);

      ctx.fillStyle = '#fbbf24';
      ctx.font = 'bold 26px "Outfit", sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(`✓ ${pt}`, cardX + 90, itemY + 48);

      itemY += 105;
    });

    ctx.restore();
  }

  drawSubtitles(ctx, subtitleText) {
    ctx.save();
    const barW = this.width - 240;
    const barH = 90;
    const barX = 120;
    const barY = this.height - 150;

    ctx.fillStyle = 'rgba(10, 14, 23, 0.88)';
    ctx.strokeStyle = 'rgba(245, 158, 11, 0.5)';
    ctx.lineWidth = 2;
    this.drawRoundedRect(ctx, barX, barY, barW, barH, 14, true, true);

    ctx.fillStyle = '#f59e0b';
    ctx.font = 'bold 20px "Outfit", sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('🗣️ NARRATION:', barX + 25, barY + 52);

    ctx.fillStyle = '#ffffff';
    ctx.font = '500 24px "Inter", sans-serif';
    ctx.fillText(subtitleText, barX + 210, barY + 52);

    ctx.restore();
  }

  drawRoundedRect(ctx, x, y, width, height, radius, fill, stroke) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
    if (fill) ctx.fill();
    if (stroke) ctx.stroke();
  }

  wrapText(ctx, text, x, y, maxWidth, lineHeight, center = false) {
    const words = text.split(' ');
    let line = '';
    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' ';
      const metrics = ctx.measureText(testLine);
      if (metrics.width > maxWidth && n > 0) {
        ctx.textAlign = center ? 'center' : 'left';
        ctx.fillText(line, x, y);
        line = words[n] + ' ';
        y += lineHeight;
      } else {
        line = testLine;
      }
    }
    ctx.textAlign = center ? 'center' : 'left';
    ctx.fillText(line, x, y);
  }
}
