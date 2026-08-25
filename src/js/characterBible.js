/* ==========================================================================
   Smart History Education AI - Procedural & Persistent Character Bible Engine
   ========================================================================== */

export class CharacterBible {
  static characterRegistry = new Map();

  static clear() {
    this.characterRegistry.clear();
    console.log('[CharacterBible] Cleared previous topic character registry.');
  }

  /**
   * Retrieves or procedurally generates a persistent character blueprint for ANY name or title.
   */
  static getOrRegisterCharacter(name, role = 'Historical Figure', defaultFaction = 'General') {
    if (!name || typeof name !== 'string') name = 'Historical Commander';
    const key = name.toLowerCase().trim();

    if (this.characterRegistry.has(key)) {
      return this.characterRegistry.get(key);
    }

    // Deterministic hash calculation from character name for procedural generation
    let hash = 0;
    for (let i = 0; i < key.length; i++) {
      hash = key.charCodeAt(i) + ((hash << 5) - hash);
    }
    const absHash = Math.abs(hash);

    // Procedural attributes
    const skinTones = ['#ffdbac', '#f1c27d', '#e0ac69', '#c68642', '#8d5524', '#d1a36a'];
    const hairColors = ['#1a1a1a', '#4a2c11', '#291d09', '#000000', '#ffffff', '#808080'];
    const outfitColors = ['#7f1d1d', '#1e3a8a', '#365314', '#1e1b4b', '#b91c1c', '#4338ca', '#f8fafc', '#78350f'];
    const accentColors = ['#fbbf24', '#ffffff', '#f59e0b', '#cbd5e1', '#e2e8f0', '#ef4444'];
    const headwears = ['turban', 'crown', 'tricorne', 'helmet', 'bicorne', 'none'];
    const weapons = ['scimitar', 'sword', 'saber', 'musket', 'dagger', 'walking_stick'];
    const expressions = ['determined', 'stern', 'heroic', 'calm'];

    let blueprint = {
      id: key.replace(/\s+/g, '-'),
      name,
      role,
      faction: defaultFaction,
      avatar: this.getAvatarForName(key),
      skinTone: skinTones[absHash % skinTones.length],
      hairColor: hairColors[absHash % hairColors.length],
      outfitColor: outfitColors[absHash % outfitColors.length],
      accentColor: accentColors[absHash % accentColors.length],
      headwear: headwears[absHash % headwears.length],
      weapon: weapons[absHash % weapons.length],
      height: 0.95 + (absHash % 15) * 0.01,
      expression: expressions[absHash % expressions.length],
      stance: 'heroic',
      description: `Dynamically registered historical actor: ${name}`
    };

    // Specific overrides for known historical icons
    if (key.includes('siraj')) {
      blueprint.outfitColor = '#7f1d1d'; blueprint.accentColor = '#fbbf24'; blueprint.headwear = 'turban'; blueprint.weapon = 'scimitar'; blueprint.avatar = '👑';
    } else if (key.includes('clive') || key.includes('robert')) {
      blueprint.outfitColor = '#b91c1c'; blueprint.accentColor = '#ffffff'; blueprint.headwear = 'tricorne'; blueprint.weapon = 'sword'; blueprint.avatar = '⚔️';
    } else if (key.includes('gandhi') || key.includes('mahatma')) {
      blueprint.outfitColor = '#f8fafc'; blueprint.accentColor = '#cbd5e1'; blueprint.headwear = 'none'; blueprint.weapon = 'walking_stick'; blueprint.avatar = '🕊️';
    } else if (key.includes('ashoka')) {
      blueprint.outfitColor = '#b45309'; blueprint.accentColor = '#fbbf24'; blueprint.headwear = 'crown'; blueprint.weapon = 'sword'; blueprint.avatar = '🏛️';
    } else if (key.includes('napoleon')) {
      blueprint.outfitColor = '#1e1b4b'; blueprint.accentColor = '#f59e0b'; blueprint.headwear = 'bicorne'; blueprint.weapon = 'saber'; blueprint.avatar = '⚔️';
    }

    this.characterRegistry.set(key, blueprint);
    return blueprint;
  }

  static getAvatarForName(key) {
    if (key.includes('king') || key.includes('nawab') || key.includes('emperor') || key.includes('monarch')) return '👑';
    if (key.includes('general') || key.includes('commander') || key.includes('soldier') || key.includes('army')) return '⚔️';
    if (key.includes('gandhi') || key.includes('peace') || key.includes('saint')) return '🕊️';
    return '👤';
  }

  /**
   * Renders procedural high-detail puppet onto Canvas.
   */
  static drawPhotorealisticPuppet(ctx, x, y, blueprint, scale = 1.0, animPhase = 0, is4K = false) {
    ctx.save();
    ctx.translate(x, y);

    const mult = is4K ? 1.2 : 1.0;
    const finalScale = scale * blueprint.height * mult;
    ctx.scale(finalScale, finalScale);

    const bounceY = Math.sin(animPhase * 3) * 3;
    ctx.translate(0, bounceY);

    // Realistic Ground Shadow
    const shadowGrad = ctx.createRadialGradient(0, 15, 5, 0, 15, 45);
    shadowGrad.addColorStop(0, 'rgba(0, 0, 0, 0.6)');
    shadowGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = shadowGrad;
    ctx.beginPath();
    ctx.ellipse(0, 15, 45, 12, 0, 0, Math.PI * 2);
    ctx.fill();

    // 1. Legs / Boots
    const legSwing = Math.sin(animPhase * 5) * 0.15;
    ctx.fillStyle = '#0a0e17';

    ctx.save(); ctx.translate(-14, -45); ctx.rotate(legSwing); ctx.fillRect(-7, 0, 14, 50); ctx.restore();
    ctx.save(); ctx.translate(14, -45); ctx.rotate(-legSwing); ctx.fillRect(-7, 0, 14, 50); ctx.restore();

    // 2. Apparel Coat / Tunic
    const tunicGrad = ctx.createLinearGradient(-30, -120, 30, -40);
    tunicGrad.addColorStop(0, blueprint.outfitColor);
    tunicGrad.addColorStop(1, '#090d16');

    ctx.fillStyle = tunicGrad;
    ctx.strokeStyle = blueprint.accentColor;
    ctx.lineWidth = 2.5;

    ctx.beginPath();
    ctx.roundRect(-28, -120, 56, 75, [12, 12, 6, 6]);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = blueprint.accentColor;
    ctx.fillRect(-5, -110, 10, 55);

    // 3. Arms & Weapon
    const armSwing = Math.sin(animPhase * 5) * 0.25;

    ctx.save(); ctx.translate(-30, -110); ctx.rotate(-armSwing); ctx.fillStyle = blueprint.outfitColor; ctx.fillRect(-6, 0, 12, 48); ctx.restore();
    ctx.save(); ctx.translate(30, -110); ctx.rotate(armSwing - 0.2); ctx.fillStyle = blueprint.outfitColor; ctx.fillRect(-6, 0, 12, 48);

    if (['scimitar', 'sword', 'saber'].includes(blueprint.weapon)) {
      const bladeGrad = ctx.createLinearGradient(0, 45, 20, 95);
      bladeGrad.addColorStop(0, '#f8fafc'); bladeGrad.addColorStop(1, '#64748b');
      ctx.strokeStyle = bladeGrad; ctx.lineWidth = 4;
      ctx.beginPath(); ctx.moveTo(0, 45); ctx.lineTo(20, 95); ctx.stroke();
    } else if (blueprint.weapon === 'walking_stick') {
      ctx.strokeStyle = '#78350f'; ctx.lineWidth = 4;
      ctx.beginPath(); ctx.moveTo(0, 45); ctx.lineTo(0, 105); ctx.stroke();
    }
    ctx.restore();

    // 4. Head & Skin
    const skinGrad = ctx.createRadialGradient(-5, -150, 4, 0, -145, 26);
    skinGrad.addColorStop(0, '#ffedd5'); skinGrad.addColorStop(1, blueprint.skinTone);
    ctx.fillStyle = skinGrad;
    ctx.beginPath(); ctx.arc(0, -145, 24, 0, Math.PI * 2); ctx.fill();

    // Eyes
    ctx.fillStyle = '#0f172a';
    ctx.beginPath(); ctx.arc(-8, -147, 2.5, 0, Math.PI * 2); ctx.arc(8, -147, 2.5, 0, Math.PI * 2); ctx.fill();

    ctx.strokeStyle = blueprint.hairColor; ctx.lineWidth = 2.5;
    ctx.beginPath();
    if (blueprint.expression === 'stern') {
      ctx.moveTo(-13, -154); ctx.lineTo(-4, -150); ctx.moveTo(13, -154); ctx.lineTo(4, -150);
    } else {
      ctx.moveTo(-13, -152); ctx.lineTo(-4, -152); ctx.moveTo(13, -152); ctx.lineTo(4, -152);
    }
    ctx.stroke();

    // 5. Headwear
    if (blueprint.headwear === 'turban') {
      ctx.fillStyle = blueprint.accentColor; ctx.beginPath(); ctx.arc(0, -158, 26, Math.PI, 0); ctx.fill();
      ctx.fillStyle = '#ef4444'; ctx.beginPath(); ctx.arc(0, -162, 6, 0, Math.PI * 2); ctx.fill();
    } else if (blueprint.headwear === 'crown') {
      ctx.fillStyle = '#f59e0b'; ctx.beginPath();
      ctx.moveTo(-22, -160); ctx.lineTo(-11, -180); ctx.lineTo(0, -164); ctx.lineTo(11, -180); ctx.lineTo(22, -160);
      ctx.closePath(); ctx.fill();
    } else if (['tricorne', 'bicorne'].includes(blueprint.headwear)) {
      ctx.fillStyle = '#0f172a'; ctx.beginPath(); ctx.ellipse(0, -166, 35, 14, 0, 0, Math.PI * 2); ctx.fill();
    }

    ctx.restore();
  }
}
