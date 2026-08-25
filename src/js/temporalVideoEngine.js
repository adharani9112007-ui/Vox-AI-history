/* ==========================================================================
   Smart History Education AI - Photorealistic & Cinematic Video Engine
   ========================================================================== */

import { AnimeCharacterEngine } from './animeCharacterEngine.js';
import { CharacterProfiles } from './characterProfiles.js';

export class TemporalVideoEngine {
  constructor(canvasElement) {
    this.canvas = canvasElement;
    this.ctx = canvasElement.getContext('2d');
    this.is4K = false;
    this.width = 1920;
    this.height = 1080;
    this.canvas.width = this.width;
    this.canvas.height = this.height;
    this.variation = '3d_characters';

    // Cinematic particle system (Floating dust, fire embers, atmospheric mist)
    this.particles = Array.from({ length: 60 }, () => ({
      x: Math.random() * this.width,
      y: Math.random() * this.height,
      radius: Math.random() * 3 + 1,
      vx: (Math.random() - 0.5) * 0.6,
      vy: (Math.random() - 0.5) * 0.6,
      alpha: Math.random() * 0.5 + 0.2
    }));

    // Realistic rain streaks with speed variance
    this.rainDrops = Array.from({ length: 140 }, () => ({
      x: Math.random() * this.width,
      y: Math.random() * this.height,
      speed: Math.random() * 25 + 18,
      length: Math.random() * 35 + 25,
      alpha: Math.random() * 0.4 + 0.3
    }));
  }

  setVariation(variationName) {
    this.variation = variationName || '3d_characters';
  }

  setQuality(is4K) {
    this.is4K = is4K;
    this.width = is4K ? 3840 : 1920;
    this.height = is4K ? 2160 : 1080;
    this.canvas.width = this.width;
    this.canvas.height = this.height;
  }

  renderFrame(scene, progress, totalProgress, narrationText = '') {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.width, this.height);

    const envType = scene && scene.envType ? scene.envType : 'plassey_bengal_1757';

    // Scene Environment Renderers
    if (envType.startsWith('plassey_')) {
      this.renderPlasseySceneRouter(ctx, envType, scene, progress);
    } else if (envType === 'ww1_europe_map') {
      this.renderWWIEuropeMapScene(ctx, scene, progress);
    } else if (envType === 'sarajevo_1914') {
      this.renderSarajevo1914Scene(ctx, scene, progress);
    } else if (envType === 'ww1_trench') {
      this.renderWWITrenchScene(ctx, scene, progress);
    } else if (envType === 'ww1_technology') {
      this.renderWWITechnologyScene(ctx, scene, progress);
    } else if (envType === 'ww1_armistice') {
      this.renderWWIArmisticeScene(ctx, scene, progress);
    } else if (envType === 'ww1_aftermath') {
      this.renderWWIAftermathScene(ctx, scene, progress);
    } else if (envType === 'assembly_hall') {
      this.renderAssemblyChamberScene(ctx, scene, progress);
    } else if (envType === 'clock_ticking') {
      this.renderTickingClockScene(ctx, scene, progress);
    } else if (envType === 'colonial_map') {
      this.renderColonialMapScene(ctx, scene, progress);
    } else {
      this.renderPlasseyBengalScene(ctx, scene, progress);
    }

    // Atmospheric Weather & Physics
    if (scene && (scene.sfx === 'rain' || envType.includes('rain') || envType.includes('monsoon') || envType.includes('ammo'))) {
      this.drawRainPhysics(ctx);
    }

    this.drawParticles(ctx);
    this.applyVariationFilters(ctx);

    if (narrationText) {
      this.drawSubtitles(ctx, narrationText);
    }
  }

  renderPlasseySceneRouter(ctx, envType, scene, progress) {
    if (envType === 'plassey_bengal_1757') {
      this.renderPlasseyBengalScene(ctx, scene, progress);
    } else if (envType === 'plassey_british_prep') {
      this.renderPlasseyBritishPrepScene(ctx, scene, progress);
    } else if (envType === 'plassey_nawab_army') {
      this.renderPlasseyNawabArmyScene(ctx, scene, progress);
    } else if (envType === 'plassey_mir_jafar') {
      this.renderPlasseyMirJafarScene(ctx, scene, progress);
    } else if (envType === 'plassey_monsoon_clouds') {
      this.renderPlasseyMonsoonCloudsScene(ctx, scene, progress);
    } else if (envType === 'plassey_heavy_rain') {
      this.renderPlasseyHeavyRainScene(ctx, scene, progress);
    } else if (envType === 'plassey_nawab_ammo') {
      this.renderPlasseyNawabAmmoScene(ctx, scene, progress);
    } else if (envType === 'plassey_betrayal') {
      this.renderPlasseyBetrayalScene(ctx, scene, progress);
    } else if (envType === 'plassey_british_advance') {
      this.renderPlasseyBritishAdvanceScene(ctx, scene, progress);
    } else if (envType === 'plassey_nawab_retreat') {
      this.renderPlasseyNawabRetreatScene(ctx, scene, progress);
    } else if (envType === 'plassey_consequences') {
      this.renderPlasseyConsequencesScene(ctx, scene, progress);
    } else {
      this.renderPlasseyBengalScene(ctx, scene, progress);
    }
  }

  // SCENE 1: Cinematic Establishing Shot of Plassey, Bengal (1757) - Bhagirathi River & Terrain
  renderPlasseyBengalScene(ctx, scene, progress) {
    ctx.save();

    // 1. Multi-layered Atmospheric Sky (Morning Sunlight + Distant Clouds)
    const skyGrad = ctx.createLinearGradient(0, 0, 0, this.height * 0.6);
    skyGrad.addColorStop(0, '#1e3a8a');
    skyGrad.addColorStop(0.4, '#38bdf8');
    skyGrad.addColorStop(0.75, '#bae6fd');
    skyGrad.addColorStop(1, '#fef08a');
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, this.width, this.height * 0.6);

    // Sun Glow
    const sunGlow = ctx.createRadialGradient(this.width * 0.75, 180, 20, this.width * 0.75, 180, 280);
    sunGlow.addColorStop(0, 'rgba(254, 240, 138, 0.9)');
    sunGlow.addColorStop(0.3, 'rgba(251, 191, 36, 0.4)');
    sunGlow.addColorStop(1, 'rgba(251, 191, 36, 0)');
    ctx.fillStyle = sunGlow;
    ctx.fillRect(0, 0, this.width, this.height * 0.6);

    // Volumetric Moving Clouds
    ctx.fillStyle = 'rgba(255, 255, 255, 0.65)';
    for (let i = 0; i < 5; i++) {
      const cx = (i * 420 + progress * 60) % (this.width + 400) - 200;
      const cy = 110 + (i % 3) * 35;
      ctx.beginPath();
      ctx.arc(cx, cy, 70, 0, Math.PI * 2);
      ctx.arc(cx + 50, cy - 20, 85, 0, Math.PI * 2);
      ctx.arc(cx + 110, cy, 65, 0, Math.PI * 2);
      ctx.fill();
    }

    // 2. Distant Horizon Hills & Atmospheric Haze
    ctx.fillStyle = '#64748b';
    ctx.beginPath();
    ctx.moveTo(0, 420);
    ctx.quadraticCurveTo(this.width * 0.25, 380, this.width * 0.5, 410);
    ctx.quadraticCurveTo(this.width * 0.75, 370, this.width, 420);
    ctx.lineTo(this.width, 500);
    ctx.lineTo(0, 500);
    ctx.closePath();
    ctx.fill();

    // 3. Middleground - Dense Bengal Mango Groves & Village Thatched Huts
    ctx.fillStyle = '#1e3a5f';
    for (let x = 40; x < this.width; x += 110) {
      const treeHeight = 70 + Math.sin(x) * 20;
      ctx.beginPath();
      ctx.arc(x, 460 - treeHeight * 0.4, treeHeight * 0.5, 0, Math.PI * 2);
      ctx.fill();
    }

    // 4. Bhagirathi River (Realistic Reflective Water with Flow Ripples)
    const riverGrad = ctx.createLinearGradient(0, 460, 0, 720);
    riverGrad.addColorStop(0, '#0284c7');
    riverGrad.addColorStop(0.5, '#0369a1');
    riverGrad.addColorStop(1, '#075985');
    ctx.fillStyle = riverGrad;
    ctx.beginPath();
    ctx.moveTo(0, 470);
    ctx.quadraticCurveTo(this.width * 0.4, 430, this.width, 490);
    ctx.lineTo(this.width, 740);
    ctx.quadraticCurveTo(this.width * 0.5, 680, 0, 760);
    ctx.closePath();
    ctx.fill();

    // Specular Water Highlights
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.lineWidth = 2;
    for (let r = 0; r < 8; r++) {
      const rx = (r * 240 + progress * 140) % this.width;
      const ry = 520 + r * 22;
      ctx.beginPath();
      ctx.moveTo(rx, ry);
      ctx.lineTo(rx + 90, ry);
      ctx.stroke();
    }

    // 5. Foreground Riverbank Terrain (Textured Grassland & Palm Trunks)
    const bankGrad = ctx.createLinearGradient(0, 680, 0, this.height);
    bankGrad.addColorStop(0, '#15803d');
    bankGrad.addColorStop(0.5, '#166534');
    bankGrad.addColorStop(1, '#14532d');
    ctx.fillStyle = bankGrad;
    ctx.beginPath();
    ctx.moveTo(0, 720);
    ctx.quadraticCurveTo(this.width * 0.5, 660, this.width, 710);
    ctx.lineTo(this.width, this.height);
    ctx.lineTo(0, this.height);
    ctx.closePath();
    ctx.fill();

    // Palm Tree Silhouettes on Left
    this.drawPalmTree(ctx, 120, 750, 240, progress);
    this.drawPalmTree(ctx, 240, 790, 200, progress + 0.3);

    // 6. Characters Rendered with Contact Ground Drop Shadows
    this.drawDropShadow(ctx, 520, 780, 65, 16);
    const sirajBp = CharacterProfiles.createProfile('Siraj-ud-Daulah', 'Nawab of Bengal', 'Bengal Sultanate');
    AnimeCharacterEngine.drawAnimeActor(ctx, 520, 770, sirajBp, 1.35, progress * 14, 0, false, this.is4K, this.variation, 'talk');

    this.drawDropShadow(ctx, 1420, 780, 65, 16);
    const cliveBp = CharacterProfiles.createProfile('Robert Clive', 'British Commander', 'British EIC');
    AnimeCharacterEngine.drawAnimeActor(ctx, 1420, 770, cliveBp, 1.35, progress * 14 + 1, 0, true, this.is4K, this.variation, 'point');

    ctx.restore();
  }

  // SCENE 2: British Encampment & Battle Strategy
  renderPlasseyBritishPrepScene(ctx, scene, progress) {
    ctx.save();
    // Sky
    const skyGrad = ctx.createLinearGradient(0, 0, 0, this.height * 0.5);
    skyGrad.addColorStop(0, '#0f172a');
    skyGrad.addColorStop(1, '#334155');
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, this.width, this.height * 0.5);

    // British Military Encampment (Canvas Tents & Redcoat Standards)
    this.drawMilitaryTent(ctx, 280, 680, 320, 240);
    this.drawMilitaryTent(ctx, 720, 640, 260, 200);

    // Ground Grassland
    ctx.fillStyle = '#1b4332';
    ctx.fillRect(0, 620, this.width, this.height - 620);

    // Brass Artillery Cannon
    this.drawFieldCannon(ctx, 1480, 680, 1.2);

    // Characters
    this.drawDropShadow(ctx, 960, 720, 70, 18);
    const cliveBp = CharacterProfiles.createProfile('Robert Clive', 'British Commander', 'British EIC');
    AnimeCharacterEngine.drawAnimeActor(ctx, 960, 710, cliveBp, 1.4, progress * 12, 0, true, this.is4K, this.variation, 'point');

    this.drawDropShadow(ctx, 1260, 730, 65, 16);
    const soldierBp = CharacterProfiles.createProfile('British EIC Soldier', 'Infantry Soldier', 'British EIC');
    AnimeCharacterEngine.drawAnimeActor(ctx, 1260, 720, soldierBp, 1.3, progress * 12 + 2, 0, false, this.is4K, this.variation, 'walk');

    ctx.restore();
  }

  // SCENE 3: Nawabi Grand Army & Silk Pavillions
  renderPlasseyNawabArmyScene(ctx, scene, progress) {
    ctx.save();
    // Dawn Sky
    const sky = ctx.createLinearGradient(0, 0, 0, this.height * 0.55);
    sky.addColorStop(0, '#78350f');
    sky.addColorStop(0.5, '#b45309');
    sky.addColorStop(1, '#fde68a');
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, this.width, this.height * 0.55);

    // Nawabi Royal Silk Pavillion
    this.drawRoyalPavillion(ctx, 420, 620, 480, 280);

    // Ground
    ctx.fillStyle = '#2d6a4f';
    ctx.fillRect(0, 620, this.width, this.height - 620);

    // Distant Elephant & Infantry Silhouettes
    ctx.fillStyle = 'rgba(15, 23, 42, 0.7)';
    for (let e = 0; e < 6; e++) {
      ctx.beginPath();
      ctx.arc(1100 + e * 110, 580, 28, 0, Math.PI * 2);
      ctx.fill();
    }

    this.drawDropShadow(ctx, 960, 720, 75, 18);
    const sirajBp = CharacterProfiles.createProfile('Siraj-ud-Daulah', 'Nawab of Bengal', 'Bengal Sultanate');
    AnimeCharacterEngine.drawAnimeActor(ctx, 960, 710, sirajBp, 1.45, progress * 15, 0, true, this.is4K, this.variation, 'command');

    ctx.restore();
  }

  // SCENE 4: Mir Jafar's Standstill (Conspiratorial Stance)
  renderPlasseyMirJafarScene(ctx, scene, progress) {
    ctx.save();
    // Ominous Dark Atmosphere
    const darkSky = ctx.createRadialGradient(this.width * 0.5, 300, 50, this.width * 0.5, 300, 800);
    darkSky.addColorStop(0, '#1e293b');
    darkSky.addColorStop(1, '#020617');
    ctx.fillStyle = darkSky;
    ctx.fillRect(0, 0, this.width, this.height);

    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 640, this.width, this.height - 640);

    // Distant Battlefield Fire Flashes
    ctx.fillStyle = `rgba(239, 68, 68, ${0.15 + Math.sin(progress * 20) * 0.08})`;
    ctx.fillRect(100, 320, 600, 320);

    this.drawDropShadow(ctx, 960, 720, 75, 18);
    const mirJafarBp = CharacterProfiles.createProfile('Mir Jafar', 'Commander-in-Chief (Conspirator)', 'Bengal Conspirators');
    AnimeCharacterEngine.drawAnimeActor(ctx, 960, 710, mirJafarBp, 1.45, progress * 6, 0, false, this.is4K, this.variation, 'stand');

    ctx.restore();
  }

  // SCENE 5: Dark Monsoon Clouds Gathering
  renderPlasseyMonsoonCloudsScene(ctx, scene, progress) {
    ctx.save();
    // Stormy Monsoon Sky
    const stormSky = ctx.createLinearGradient(0, 0, 0, this.height);
    stormSky.addColorStop(0, '#030712');
    stormSky.addColorStop(0.4, '#1e1b4b');
    stormSky.addColorStop(1, '#0f172a');
    ctx.fillStyle = stormSky;
    ctx.fillRect(0, 0, this.width, this.height);

    // Layered Heavy Storm Clouds
    ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
    for (let c = 0; c < 8; c++) {
      const cx = (c * 300 + progress * 120) % (this.width + 400) - 200;
      ctx.beginPath();
      ctx.arc(cx, 160, 160, 0, Math.PI * 2);
      ctx.arc(cx + 80, 130, 190, 0, Math.PI * 2);
      ctx.fill();
    }

    // Lightning Flash Effect
    if (Math.sin(progress * 30) > 0.85) {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
      ctx.fillRect(0, 0, this.width, this.height);
    }

    ctx.fillStyle = '#14532d';
    ctx.fillRect(0, 660, this.width, this.height - 660);

    this.drawDropShadow(ctx, 520, 740, 65, 16);
    const sirajBp = CharacterProfiles.createProfile('Siraj-ud-Daulah', 'Nawab of Bengal', 'Bengal Sultanate');
    AnimeCharacterEngine.drawAnimeActor(ctx, 520, 730, sirajBp, 1.3, progress * 15, 0, false, this.is4K, this.variation, 'talk');

    this.drawDropShadow(ctx, 1380, 740, 65, 16);
    const cliveBp = CharacterProfiles.createProfile('Robert Clive', 'British Commander', 'British EIC');
    AnimeCharacterEngine.drawAnimeActor(ctx, 1380, 730, cliveBp, 1.3, progress * 15, 0, true, this.is4K, this.variation, 'command');

    ctx.restore();
  }

  // SCENE 6: Torrential Monsoon Rain - British Tarpaulin Munitions Protection
  renderPlasseyHeavyRainScene(ctx, scene, progress) {
    ctx.save();
    ctx.fillStyle = '#020617';
    ctx.fillRect(0, 0, this.width, this.height);

    ctx.fillStyle = '#1c1917';
    ctx.fillRect(0, 640, this.width, this.height - 640);

    // Protected Gunpowder Casks under Heavy Waterproof Tarpaulin
    this.drawProtectedGunpowder(ctx, 820, 620, 280, 160);

    this.drawDropShadow(ctx, 620, 730, 70, 18);
    const soldierBp = CharacterProfiles.createProfile('British EIC Soldier', 'Infantry Soldier', 'British EIC');
    AnimeCharacterEngine.drawAnimeActor(ctx, 620, 720, soldierBp, 1.35, progress * 20, 0, false, this.is4K, this.variation, 'walk');

    ctx.restore();
  }

  // SCENE 7: Nawab's Ammunition Water-Soaked & Ruined
  renderPlasseyNawabAmmoScene(ctx, scene, progress) {
    ctx.save();
    ctx.fillStyle = '#0b0f19';
    ctx.fillRect(0, 0, this.width, this.height);

    ctx.fillStyle = '#292524';
    ctx.fillRect(0, 640, this.width, this.height - 640);

    // Unprotected cannons in mud puddles with water spray
    this.drawFieldCannon(ctx, 720, 670, 1.3);

    this.drawDropShadow(ctx, 960, 730, 70, 18);
    const sirajBp = CharacterProfiles.createProfile('Siraj-ud-Daulah', 'Nawab of Bengal', 'Bengal Sultanate');
    AnimeCharacterEngine.drawAnimeActor(ctx, 960, 720, sirajBp, 1.35, progress * 12, 0, false, this.is4K, this.variation, 'talk');

    ctx.restore();
  }

  // SCENE 8: The Decisive Betrayal - Mir Jafar's Army Frozen in Inaction
  renderPlasseyBetrayalScene(ctx, scene, progress) {
    ctx.save();
    ctx.fillStyle = '#030712';
    ctx.fillRect(0, 0, this.width, this.height);

    ctx.fillStyle = '#1c1917';
    ctx.fillRect(0, 640, this.width, this.height - 640);

    // Distant battle chaos on left
    ctx.fillStyle = 'rgba(220, 38, 38, 0.2)';
    ctx.fillRect(80, 240, 680, 400);

    this.drawDropShadow(ctx, 1200, 730, 75, 18);
    const mirJafarBp = CharacterProfiles.createProfile('Mir Jafar', 'Commander-in-Chief (Conspirator)', 'Bengal Conspirators');
    AnimeCharacterEngine.drawAnimeActor(ctx, 1200, 720, mirJafarBp, 1.45, 0, 0, false, this.is4K, this.variation, 'stand');

    ctx.restore();
  }

  // SCENE 9: British Forces Advancing in Regimental Formation
  renderPlasseyBritishAdvanceScene(ctx, scene, progress) {
    ctx.save();
    const sky = ctx.createLinearGradient(0, 0, 0, this.height * 0.55);
    sky.addColorStop(0, '#1e293b');
    sky.addColorStop(1, '#475569');
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, this.width, this.height * 0.55);

    ctx.fillStyle = '#1e3a1e';
    ctx.fillRect(0, 620, this.width, this.height - 620);

    const advanceOffset = progress * 400;

    this.drawDropShadow(ctx, 420 + advanceOffset + 240, 730, 70, 18);
    const cliveBp = CharacterProfiles.createProfile('Robert Clive', 'British Commander', 'British EIC');
    AnimeCharacterEngine.drawAnimeActor(ctx, 420 + advanceOffset + 240, 720, cliveBp, 1.45, progress * 24, 0, true, this.is4K, this.variation, 'command');

    this.drawDropShadow(ctx, 420 + advanceOffset, 740, 65, 16);
    const soldierBp = CharacterProfiles.createProfile('British EIC Soldier', 'Infantry Soldier', 'British EIC');
    AnimeCharacterEngine.drawAnimeActor(ctx, 420 + advanceOffset, 730, soldierBp, 1.3, progress * 24, 0, false, this.is4K, this.variation, 'walk');

    ctx.restore();
  }

  // SCENE 10: Nawabi Army Disorganized Retreat
  renderPlasseyNawabRetreatScene(ctx, scene, progress) {
    ctx.save();
    ctx.fillStyle = '#1e1b4b';
    ctx.fillRect(0, 0, this.width, this.height);

    ctx.fillStyle = '#111827';
    ctx.fillRect(0, 640, this.width, this.height - 640);

    const retreatX = 1450 - progress * 450;

    this.drawDropShadow(ctx, retreatX, 730, 70, 18);
    const sirajBp = CharacterProfiles.createProfile('Siraj-ud-Daulah', 'Nawab of Bengal', 'Bengal Sultanate');
    AnimeCharacterEngine.drawAnimeActor(ctx, retreatX, 720, sirajBp, 1.4, progress * 20, 0, false, this.is4K, this.variation, 'run');

    ctx.restore();
  }

  // SCENE 12: Historical Turning Point & British Expansion in Bengal
  renderPlasseyConsequencesScene(ctx, scene, progress) {
    ctx.save();
    const goldenSky = ctx.createLinearGradient(0, 0, 0, this.height);
    goldenSky.addColorStop(0, '#0f172a');
    goldenSky.addColorStop(0.5, '#1e293b');
    goldenSky.addColorStop(1, '#0284c7');
    ctx.fillStyle = goldenSky;
    ctx.fillRect(0, 0, this.width, this.height);

    ctx.fillStyle = '#064e3b';
    ctx.fillRect(0, 660, this.width, this.height - 660);

    this.drawDropShadow(ctx, 960, 710, 70, 18);
    const cliveBp = CharacterProfiles.createProfile('Robert Clive', 'British Commander', 'British EIC');
    AnimeCharacterEngine.drawAnimeActor(ctx, 960, 700, cliveBp, 1.35, progress * 10, 0, true, this.is4K, this.variation, 'point');

    ctx.restore();
  }

  /* -------------------------------------------------------------------------- */
  /* CINEMATIC ASSET HELPERS                                                    */
  /* -------------------------------------------------------------------------- */

  drawDropShadow(ctx, x, y, radiusX, radiusY) {
    ctx.save();
    const shadowGrad = ctx.createRadialGradient(x, y, 5, x, y, radiusX);
    shadowGrad.addColorStop(0, 'rgba(0, 0, 0, 0.7)');
    shadowGrad.addColorStop(0.6, 'rgba(0, 0, 0, 0.3)');
    shadowGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = shadowGrad;
    ctx.beginPath();
    ctx.ellipse(x, y, radiusX, radiusY, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  drawPalmTree(ctx, x, y, height, progress) {
    ctx.save();
    const windSway = Math.sin(progress * 4) * 8;

    // Trunk
    ctx.strokeStyle = '#451a03';
    ctx.lineWidth = 14;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.quadraticCurveTo(x + 15, y - height * 0.5, x + windSway, y - height);
    ctx.stroke();

    // Fronds
    ctx.strokeStyle = '#15803d';
    ctx.lineWidth = 6;
    for (let f = 0; f < 7; f++) {
      const angle = (f / 7) * Math.PI * 2;
      const fx = x + windSway + Math.cos(angle) * 75;
      const fy = y - height + Math.sin(angle) * 45;
      ctx.beginPath();
      ctx.moveTo(x + windSway, y - height);
      ctx.quadraticCurveTo(x + windSway + Math.cos(angle) * 35, y - height - 20, fx, fy);
      ctx.stroke();
    }
    ctx.restore();
  }

  drawMilitaryTent(ctx, x, y, w, h) {
    ctx.save();
    ctx.fillStyle = '#e2e8f0';
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(x - w * 0.5, y);
    ctx.lineTo(x, y - h);
    ctx.lineTo(x + w * 0.5, y);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Tent flap entrance
    ctx.fillStyle = '#1e293b';
    ctx.beginPath();
    ctx.moveTo(x, y - h);
    ctx.lineTo(x - 25, y);
    ctx.lineTo(x + 25, y);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  drawRoyalPavillion(ctx, x, y, w, h) {
    ctx.save();
    ctx.fillStyle = '#7f1d1d';
    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(x - w * 0.5, y);
    ctx.quadraticCurveTo(x, y - h - 30, x + w * 0.5, y);
    ctx.lineTo(x + w * 0.5, y + 40);
    ctx.lineTo(x - w * 0.5, y + 40);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  }

  drawFieldCannon(ctx, x, y, scale = 1.0) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scale, scale);

    // Wheel
    ctx.fillStyle = '#78350f';
    ctx.strokeStyle = '#451a03';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(0, 0, 32, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Barrel
    const barrel = ctx.createLinearGradient(-40, -25, 40, -10);
    barrel.addColorStop(0, '#475569');
    barrel.addColorStop(0.5, '#94a3b8');
    barrel.addColorStop(1, '#334155');
    ctx.fillStyle = barrel;
    ctx.beginPath();
    ctx.moveTo(-35, -5);
    ctx.lineTo(45, -28);
    ctx.lineTo(48, -14);
    ctx.lineTo(-30, 8);
    ctx.closePath();
    ctx.fill();

    ctx.restore();
  }

  drawProtectedGunpowder(ctx, x, y, w, h) {
    ctx.save();
    // Casks
    ctx.fillStyle = '#78350f';
    ctx.fillRect(x + 20, y + 40, 50, 70);
    ctx.fillRect(x + 80, y + 40, 50, 70);

    // Waterproof Blue Waxed Tarpaulin
    ctx.fillStyle = '#1e3a8a';
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(x - 20, y + 30);
    ctx.lineTo(x + w * 0.5, y - 20);
    ctx.lineTo(x + w + 20, y + 30);
    ctx.lineTo(x + w, y + h);
    ctx.lineTo(x, y + h);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  }

  /* -------------------------------------------------------------------------- */
  /* WORLD WAR I & GLOBAL HISTORY SCENE RENDERERS                               */
  /* -------------------------------------------------------------------------- */

  renderWWIEuropeMapScene(ctx, scene, progress) {
    ctx.save();
    ctx.fillStyle = '#090d16';
    ctx.fillRect(0, 0, this.width, this.height);

    ctx.strokeStyle = 'rgba(245, 158, 11, 0.18)';
    ctx.lineWidth = 1.5;
    for (let x = 100; x < this.width; x += 160) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, this.height); ctx.stroke();
    }
    for (let y = 100; y < this.height; y += 140) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(this.width, y); ctx.stroke();
    }

    ctx.fillStyle = '#1e293b';
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 3;
    this.drawRoundedRect(ctx, 350, 180, 1220, 680, 24, true, true);

    ctx.fillStyle = 'rgba(2, 132, 199, 0.35)';
    ctx.strokeStyle = '#0284c7';
    ctx.lineWidth = 3;
    this.drawRoundedRect(ctx, 420, 260, 280, 220, 16, true, true);
    this.drawRoundedRect(ctx, 1050, 240, 420, 360, 16, true, true);

    ctx.fillStyle = 'rgba(239, 68, 68, 0.35)';
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 3;
    this.drawRoundedRect(ctx, 720, 280, 300, 300, 16, true, true);

    const pulseOffset = progress * 50;
    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth = 4;
    ctx.setLineDash([12, 8]);
    ctx.lineDashOffset = -pulseOffset;
    ctx.beginPath();
    ctx.moveTo(560, 370);
    ctx.lineTo(870, 430);
    ctx.lineTo(1260, 420);
    ctx.stroke();
    ctx.setLineDash([]);

    const cmd = CharacterProfiles.createProfile('WWI Supreme Commander', 'Supreme Commander', 'Allied');
    this.drawDropShadow(ctx, 960, 720, 70, 18);
    AnimeCharacterEngine.drawAnimeActor(ctx, 960, 710, cmd, 1.4, progress * 10, 0, true, this.is4K, this.variation, 'point');

    ctx.restore();
  }

  renderSarajevo1914Scene(ctx, scene, progress) {
    ctx.save();
    // 1914 Sarajevo Cobblestone Street & Imperial Car
    const sky = ctx.createLinearGradient(0, 0, 0, this.height * 0.55);
    sky.addColorStop(0, '#1e293b');
    sky.addColorStop(1, '#475569');
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, this.width, this.height * 0.55);

    // Sarajevo Austrian Architecture Buildings
    ctx.fillStyle = '#334155';
    for (let b = 0; b < 6; b++) {
      ctx.fillRect(150 + b * 280, 240, 220, 400);
    }

    // Cobblestone Street
    ctx.fillStyle = '#1e1b18';
    ctx.fillRect(0, 620, this.width, this.height - 620);

    // Imperial Open-Top Automobile
    const carX = 350 + progress * 400;
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(carX, 620, 340, 90);
    ctx.fillStyle = '#78350f';
    ctx.beginPath();
    ctx.arc(carX + 60, 710, 34, 0, Math.PI * 2);
    ctx.arc(carX + 280, 710, 34, 0, Math.PI * 2);
    ctx.fill();

    const archduke = CharacterProfiles.createProfile('Archduke Franz Ferdinand', 'Austrian Archduke', 'Central Powers');
    this.drawDropShadow(ctx, carX + 170, 680, 60, 16);
    AnimeCharacterEngine.drawAnimeActor(ctx, carX + 170, 640, archduke, 1.3, progress * 12, 0, true, this.is4K, this.variation, 'talk');

    ctx.restore();
  }

  renderWWITrenchScene(ctx, scene, progress) {
    ctx.save();
    // Cold Muddy Western Front Trenches
    const sky = ctx.createLinearGradient(0, 0, 0, this.height * 0.5);
    sky.addColorStop(0, '#0f172a');
    sky.addColorStop(1, '#334155');
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, this.width, this.height * 0.5);

    // Mud Trench Terrain & Sandbags
    ctx.fillStyle = '#292524';
    ctx.fillRect(0, 500, this.width, this.height - 500);

    // Sandbags
    ctx.fillStyle = '#78350f';
    for (let s = 0; s < this.width; s += 80) {
      this.drawRoundedRect(ctx, s, 540, 75, 30, 8, true, false);
      this.drawRoundedRect(ctx, s + 35, 515, 75, 30, 8, true, false);
    }

    // Barbed Wire Posts
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 2.5;
    for (let p = 120; p < this.width; p += 260) {
      ctx.beginPath();
      ctx.moveTo(p, 460);
      ctx.lineTo(p, 540);
      ctx.moveTo(p - 40, 480);
      ctx.lineTo(p + 40, 500);
      ctx.stroke();
    }

    const soldier = CharacterProfiles.createProfile('WWI Allied Soldier', 'Infantry Soldier', 'Allied');
    this.drawDropShadow(ctx, 600, 730, 65, 16);
    AnimeCharacterEngine.drawAnimeActor(ctx, 600, 720, soldier, 1.35, progress * 20, 0, false, this.is4K, this.variation, 'walk');

    const cmd = CharacterProfiles.createProfile('WWI Commander', 'Commander', 'Allied');
    this.drawDropShadow(ctx, 1300, 730, 65, 16);
    AnimeCharacterEngine.drawAnimeActor(ctx, 1300, 720, cmd, 1.4, progress * 15, 0, true, this.is4K, this.variation, 'command');

    ctx.restore();
  }

  renderWWITechnologyScene(ctx, scene, progress) {
    ctx.save();
    const sky = ctx.createLinearGradient(0, 0, 0, this.height * 0.6);
    sky.addColorStop(0, '#1e293b');
    sky.addColorStop(1, '#475569');
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, this.width, this.height * 0.6);

    // Biplane Flying in Sky
    const planeX = (progress * 1.5 * this.width) % (this.width + 400) - 200;
    ctx.fillStyle = '#f59e0b';
    ctx.fillRect(planeX, 160, 140, 22);
    ctx.fillRect(planeX + 30, 130, 100, 10);
    ctx.fillRect(planeX + 30, 180, 100, 10);

    // Battlefield Ground
    ctx.fillStyle = '#1c1917';
    ctx.fillRect(0, 600, this.width, this.height - 600);

    // Mark IV Armored Tank
    const tankX = 300 + progress * 350;
    ctx.fillStyle = '#334155';
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(tankX, 700);
    ctx.lineTo(tankX + 70, 590);
    ctx.lineTo(tankX + 280, 590);
    ctx.lineTo(tankX + 350, 700);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    const soldier = CharacterProfiles.createProfile('WWI Allied Soldier', 'Infantry Soldier', 'Allied');
    this.drawDropShadow(ctx, tankX + 440, 730, 65, 16);
    AnimeCharacterEngine.drawAnimeActor(ctx, tankX + 440, 720, soldier, 1.35, progress * 20, 0, true, this.is4K, this.variation, 'command');

    ctx.restore();
  }

  renderWWIArmisticeScene(ctx, scene, progress) {
    ctx.save();
    // Peaceful Sunrise of November 11, 1918
    const sunrise = ctx.createLinearGradient(0, 0, 0, this.height);
    sunrise.addColorStop(0, '#0f172a');
    sunrise.addColorStop(0.4, '#1e3a8a');
    sunrise.addColorStop(0.8, '#f59e0b');
    sunrise.addColorStop(1, '#fef08a');
    ctx.fillStyle = sunrise;
    ctx.fillRect(0, 0, this.width, this.height);

    // 11:00 AM Peace Clock
    const cx = this.width / 2;
    const cy = 340;
    ctx.fillStyle = '#fef3c7';
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.arc(cx, cy, 140, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Clock Hands at 11:00 AM
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 6;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx, cy - 90);
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx - 50, cy - 50);
    ctx.stroke();

    ctx.fillStyle = '#14532d';
    ctx.fillRect(0, 640, this.width, this.height - 640);

    const cmd = CharacterProfiles.createProfile('WWI Commander', 'Supreme Commander', 'Allied');
    this.drawDropShadow(ctx, this.width / 2, 730, 70, 18);
    AnimeCharacterEngine.drawAnimeActor(ctx, this.width / 2, 720, cmd, 1.45, progress * 8, 0, true, this.is4K, this.variation, 'talk');

    ctx.restore();
  }

  renderWWIAftermathScene(ctx, scene, progress) {
    ctx.save();
    const goldenSky = ctx.createLinearGradient(0, 0, 0, this.height);
    goldenSky.addColorStop(0, '#090d16');
    goldenSky.addColorStop(0.5, '#1e293b');
    goldenSky.addColorStop(1, '#0284c7');
    ctx.fillStyle = goldenSky;
    ctx.fillRect(0, 0, this.width, this.height);

    ctx.fillStyle = '#064e3b';
    ctx.fillRect(0, 660, this.width, this.height - 660);

    const cmd = CharacterProfiles.createProfile('WWI Commander', 'Supreme Commander', 'Allied');
    this.drawDropShadow(ctx, this.width / 2, 730, 70, 18);
    AnimeCharacterEngine.drawAnimeActor(ctx, this.width / 2, 720, cmd, 1.4, progress * 10, 0, true, this.is4K, this.variation, 'point');

    ctx.restore();
  }

  renderDelhiNightCrowdScene(ctx, scene, progress) {
    ctx.save();
    // Dark Monsoon Night Sky over Delhi (August 14, 1947)
    const nightSky = ctx.createLinearGradient(0, 0, 0, this.height * 0.7);
    nightSky.addColorStop(0, '#030712');
    nightSky.addColorStop(0.5, '#0f172a');
    nightSky.addColorStop(1, '#1e1b4b');
    ctx.fillStyle = nightSky;
    ctx.fillRect(0, 0, this.width, this.height * 0.7);

    // Constituent Assembly Building Silhouette & Lights
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(200, 220, this.width - 400, 380);

    // Illuminated Windows
    ctx.fillStyle = 'rgba(254, 240, 138, 0.85)';
    for (let w = 260; w < this.width - 300; w += 90) {
      ctx.fillRect(w, 320, 50, 90);
    }

    // Street Ground
    ctx.fillStyle = '#0a0e17';
    ctx.fillRect(0, 600, this.width, this.height - 600);

    // Cheering Crowd of Indian Citizens
    const citizen = CharacterProfiles.createProfile('Delhi Citizen', 'Public Celebrant', 'Indian Public');
    for (let c = 0; c < 5; c++) {
      const cx = 250 + c * 340;
      this.drawDropShadow(ctx, cx, 730, 60, 15);
      AnimeCharacterEngine.drawAnimeActor(ctx, cx, 720, citizen, 1.3, progress * 15 + c, 0, c % 2 === 0, this.is4K, this.variation, 'talk');
    }

    ctx.restore();
  }

  renderAssemblyChamberScene(ctx, scene, progress) {
    ctx.save();
    // Grand Lit Hall of the Constituent Assembly (New Delhi, Midnight 1947)
    const hallGrad = ctx.createLinearGradient(0, 0, 0, this.height);
    hallGrad.addColorStop(0, '#451a03');
    hallGrad.addColorStop(0.4, '#78350f');
    hallGrad.addColorStop(0.8, '#b45309');
    hallGrad.addColorStop(1, '#fde68a');
    ctx.fillStyle = hallGrad;
    ctx.fillRect(0, 0, this.width, this.height);

    // Classical Marble Assembly Pillars
    ctx.fillStyle = 'rgba(254, 243, 199, 0.9)';
    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth = 3;
    for (let p = 160; p < this.width; p += 320) {
      ctx.fillRect(p, 100, 80, 550);
      ctx.strokeRect(p, 100, 80, 550);
    }

    // Assembly Floor
    ctx.fillStyle = '#1c1917';
    ctx.fillRect(0, 650, this.width, this.height - 650);

    // Indian National Tricolor Banner
    const flagX = this.width / 2 - 120;
    ctx.fillStyle = '#ea580c'; ctx.fillRect(flagX, 160, 240, 40);
    ctx.fillStyle = '#ffffff'; ctx.fillRect(flagX, 200, 240, 40);
    ctx.fillStyle = '#16a34a'; ctx.fillRect(flagX, 240, 240, 40);

    // Jawaharlal Nehru delivering the Tryst with Destiny speech
    const nehru = CharacterProfiles.createProfile('Jawaharlal Nehru', 'Prime Minister of India', 'Constituent Assembly');
    this.drawDropShadow(ctx, this.width / 2, 730, 70, 18);
    AnimeCharacterEngine.drawAnimeActor(ctx, this.width / 2, 720, nehru, 1.45, progress * 20, 0, true, this.is4K, this.variation, 'talk');

    ctx.restore();
  }

  renderColonialMapScene(ctx, scene, progress) {
    ctx.save();
    const mapGrad = ctx.createLinearGradient(0, 0, 0, this.height);
    mapGrad.addColorStop(0, '#1e1b4b');
    mapGrad.addColorStop(0.5, '#312e81');
    mapGrad.addColorStop(1, '#064e3b');
    ctx.fillStyle = mapGrad;
    ctx.fillRect(0, 0, this.width, this.height);

    // Map Board
    ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 4;
    this.drawRoundedRect(ctx, 350, 160, 1220, 520, 20, true, true);

    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 36px "Outfit", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('🇮🇳 1947: Dawn of Indian Independence & End of Colonial Rule', this.width / 2, 240);

    const leader = CharacterProfiles.createProfile('Freedom Fighter', 'National Leader', 'Freedom Movement');
    this.drawDropShadow(ctx, this.width / 2, 730, 70, 18);
    AnimeCharacterEngine.drawAnimeActor(ctx, this.width / 2, 720, leader, 1.4, progress * 15, 0, true, this.is4K, this.variation, 'point');

    ctx.restore();
  }

  renderTickingClockScene(ctx, scene, progress) {
    ctx.save();
    // Midnight 12:00 Countdown Clock (August 14–15, 1947)
    ctx.fillStyle = '#030712';
    ctx.fillRect(0, 0, this.width, this.height);

    const cx = this.width / 2;
    const cy = this.height / 2 - 30;
    const radius = 220;

    // Glowing Radial Aura
    const aura = ctx.createRadialGradient(cx, cy, 30, cx, cy, 350);
    aura.addColorStop(0, 'rgba(251, 191, 36, 0.4)');
    aura.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = aura;
    ctx.fillRect(0, 0, this.width, this.height);

    // Clock Face
    ctx.fillStyle = '#fef3c7';
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 10;
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Clock Hour Marks
    ctx.fillStyle = '#0f172a';
    for (let h = 0; h < 12; h++) {
      const angle = (h / 12) * Math.PI * 2 - Math.PI / 2;
      const hx = cx + Math.cos(angle) * (radius - 30);
      const hy = cy + Math.sin(angle) * (radius - 30);
      ctx.beginPath();
      ctx.arc(hx, hy, 6, 0, Math.PI * 2);
      ctx.fill();
    }

    // Ticking Hands approaching Midnight (12:00:00)
    const secondAngle = (progress * Math.PI * 2) - Math.PI / 2;
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 8;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx, cy - 140); // Hour Hand at 12
    ctx.stroke();

    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + Math.cos(secondAngle) * 160, cy + Math.sin(secondAngle) * 160); // Ticking Second Hand
    ctx.stroke();

    ctx.restore();
  }

  drawRainPhysics(ctx) {
    ctx.save();
    ctx.strokeStyle = 'rgba(186, 230, 253, 0.55)';
    ctx.lineWidth = this.is4K ? 2.5 : 1.5;
    this.rainDrops.forEach(drop => {
      drop.y += drop.speed;
      drop.x -= 4;
      if (drop.y > this.height) {
        drop.y = -20;
        drop.x = Math.random() * this.width;
      }
      ctx.beginPath();
      ctx.moveTo(drop.x, drop.y);
      ctx.lineTo(drop.x - 5, drop.y + drop.length);
      ctx.stroke();
    });
    ctx.restore();
  }

  drawParticles(ctx) {
    ctx.save();
    this.particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0) p.x = this.width;
      if (p.x > this.width) p.x = 0;
      if (p.y < 0) p.y = this.height;
      if (p.y > this.height) p.y = 0;

      ctx.fillStyle = `rgba(251, 191, 36, ${p.alpha})`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.restore();
  }

  applyVariationFilters(ctx) {
    ctx.save();
    if (this.variation === 'cinematic_characters') {
      ctx.fillStyle = 'rgba(245, 158, 11, 0.03)';
      ctx.fillRect(0, 0, this.width, this.height);
    }
    ctx.restore();
  }

  drawSubtitles(ctx, text) {
    ctx.save();
    const boxW = this.width - 240;
    const boxH = 75;
    const boxX = 120;
    const boxY = this.height - 125;

    ctx.fillStyle = 'rgba(10, 14, 23, 0.88)';
    ctx.strokeStyle = 'rgba(245, 158, 11, 0.4)';
    ctx.lineWidth = 2;
    this.drawRoundedRect(ctx, boxX, boxY, boxW, boxH, 12, true, true);

    ctx.fillStyle = '#ffffff';
    ctx.font = '500 24px "Inter", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(text, this.width / 2, boxY + 46);
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
}
