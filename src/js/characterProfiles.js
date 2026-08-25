/* ==========================================================================
   Smart History Education AI - Persistent Character Profiles & Puppet Animator
   ========================================================================== */

export class CharacterProfiles {
  static profileRegistry = new Map();

  static clear() {
    this.profileRegistry.clear();
    console.log('[CharacterProfiles] Cleared previous topic profile registry.');
  }
  /**
   * Generates or retrieves a persistent visual character profile.
   */
  static createProfile(name, role = 'Historical Figure', defaultFaction = 'General') {
    const lower = name.toLowerCase();

    // Default template attributes
    let profile = {
      name,
      role,
      faction: defaultFaction,
      avatar: '👤',
      skinTone: '#e0ac69',
      hairColor: '#1a1a1a',
      outfitColor: '#1e293b',
      accentColor: '#f59e0b',
      headwear: 'none', // crown, turban, tricorne, helmet, none
      weapon: 'sword', // sword, musket, banner, scroll
      height: 1.0,
      expression: 'determined', // stern, heroic, determined, calm
      stance: 'heroic'
    };

    // Specific Historical Leaders Recognition
    if (lower.includes('siraj')) {
      profile = {
        name: 'Siraj-ud-Daulah',
        role: 'Nawab of Bengal',
        faction: 'Bengal Sultanate',
        avatar: '👳',
        skinTone: '#c68642',
        hairColor: '#1c1917',
        outfitColor: '#f8fafc', // White traditional clothing
        shawlColor: '#b45309',  // Brown/gold draped shawl
        accentColor: '#ea580c', // Orange turban
        headwear: 'orange_turban',
        weapon: 'scimitar',
        height: 1.05,
        expression: 'stern',
        stance: 'royal'
      };
    } else if (lower.includes('clive') || lower.includes('robert')) {
      profile = {
        name: 'Robert Clive',
        role: 'Commander, East India Co.',
        faction: 'British EIC',
        avatar: '💂',
        skinTone: '#ffdbac',
        hairColor: '#4a2c11',
        outfitColor: '#dc2626', // Red military coat
        vestColor: '#f8fafc',   // White uniform
        accentColor: '#ffffff', // White cross-belts
        headwear: 'tricorne',   // Black tricorne hat
        weapon: 'sword',
        height: 1.0,
        expression: 'determined',
        stance: 'commanding'
      };
    } else if (lower.includes('mir jafar')) {
      profile = {
        name: 'Mir Jafar',
        role: 'Commander-in-Chief (Conspirator)',
        faction: 'Bengal Conspirators',
        avatar: '👤',
        skinTone: '#d1a36a',
        hairColor: '#1c1917',
        outfitColor: '#111827', // Black clothing
        robeColor: '#1f2937',   // Dark outer robe
        accentColor: '#374151', // Dark headwear
        headwear: 'dark_turban',
        weapon: 'dagger',
        height: 0.98,
        expression: 'cautious',
        stance: 'subtle'
      };
    } else if (lower.includes('british soldier') || lower.includes('soldier')) {
      profile = {
        name: 'British EIC Soldier',
        role: 'Infantry Soldier',
        faction: 'British EIC',
        avatar: '🪖',
        skinTone: '#f1c27d',
        hairColor: '#334155',
        outfitColor: '#4d7c0f', // Green/brown military uniform
        accentColor: '#78350f', // Equipment pouches & webbing
        headwear: 'period_helmet',
        weapon: 'musket',
        height: 0.98,
        expression: 'heroic',
        stance: 'commanding'
      };
    } else if (lower.includes('eisenhower') || lower.includes('ike')) {
      profile = {
        name: 'General Eisenhower',
        role: 'Supreme Commander',
        faction: 'Allied Forces',
        avatar: '🪖',
        skinTone: '#f1c27d',
        hairColor: '#808080',
        outfitColor: '#365314', // Military Olive
        accentColor: '#f59e0b', // General Stars
        headwear: 'helmet',
        weapon: 'binoculars',
        height: 1.02,
        expression: 'heroic',
        stance: 'commanding'
      };
    } else if (lower.includes('gandhi') || lower.includes('mahatma')) {
      profile = {
        name: 'Mahatma Gandhi',
        role: 'Leader of Freedom Movement',
        faction: 'Satyagrahis',
        avatar: '🕊️',
        skinTone: '#c68642',
        hairColor: '#ffffff',
        outfitColor: '#f8fafc', // White Khadi
        accentColor: '#cbd5e1',
        headwear: 'none',
        weapon: 'walking_stick',
        height: 0.95,
        expression: 'calm',
        stance: 'peaceful'
      };
    } else if (lower.includes('napoleon')) {
      profile = {
        name: 'Napoleon Bonaparte',
        role: 'Emperor of France',
        faction: 'French Empire',
        avatar: '⚔️',
        skinTone: '#ffdbac',
        hairColor: '#291d09',
        outfitColor: '#1e1b4b', // Imperial Blue
        accentColor: '#f59e0b', // Gold epaulettes
        headwear: 'bicorne',
        weapon: 'saber',
        height: 0.92,
        expression: 'stern',
        stance: 'royal'
      };
    }

    return profile;
  }

  /**
   * Renders an animated character puppet onto HTML5 canvas with full skeletal joint motion.
   */
  static drawCharacterPuppet(ctx, x, y, profile, scale = 1.0, animationPhase = 0, style = 'cinematic', actionName = 'walk') {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scale * profile.height, scale * profile.height);

    // Calculate Skeletal Joint Kinematics based on actionName
    let leftLegAngle = 0;
    let rightLegAngle = 0;
    let leftArmAngle = 0;
    let rightArmAngle = 0;
    let headTilt = 0;
    let bounceY = 0;
    let mouthOpen = 0;

    if (actionName === 'walk') {
      leftLegAngle = Math.sin(animationPhase * 6) * 0.45;
      rightLegAngle = -Math.sin(animationPhase * 6) * 0.45;
      leftArmAngle = -Math.sin(animationPhase * 6) * 0.4;
      rightArmAngle = Math.sin(animationPhase * 6) * 0.4;
      bounceY = Math.abs(Math.sin(animationPhase * 6)) * 6;
    } else if (actionName === 'run') {
      leftLegAngle = Math.sin(animationPhase * 10) * 0.8;
      rightLegAngle = -Math.sin(animationPhase * 10) * 0.8;
      leftArmAngle = -Math.sin(animationPhase * 10) * 0.7;
      rightArmAngle = Math.sin(animationPhase * 10) * 0.7;
      bounceY = Math.abs(Math.sin(animationPhase * 10)) * 12;
    } else if (actionName === 'point') {
      leftLegAngle = 0.05;
      rightLegAngle = -0.05;
      leftArmAngle = 0.2;
      rightArmAngle = -1.2 + Math.sin(animationPhase * 4) * 0.1; // Raised pointing arm
      headTilt = -0.15;
      bounceY = Math.sin(animationPhase * 3) * 2;
    } else if (actionName === 'command' || actionName === 'give_command') {
      leftLegAngle = 0.1;
      rightLegAngle = -0.1;
      leftArmAngle = 0.3;
      rightArmAngle = -1.6 + Math.sin(animationPhase * 5) * 0.15; // Arm raised high in command gesture
      headTilt = -0.1;
      bounceY = Math.sin(animationPhase * 4) * 3;
    } else if (actionName === 'talk' || actionName === 'speak') {
      leftLegAngle = 0.02;
      rightLegAngle = -0.02;
      leftArmAngle = -0.2 + Math.sin(animationPhase * 3) * 0.1;
      rightArmAngle = -0.5 + Math.sin(animationPhase * 5) * 0.25; // Gesture cadence
      headTilt = Math.sin(animationPhase * 8) * 0.1;
      mouthOpen = Math.abs(Math.sin(animationPhase * 12)) * 3.5;
      bounceY = Math.sin(animationPhase * 4) * 2;
    } else {
      // Stand / Idle
      leftLegAngle = 0.05;
      rightLegAngle = -0.05;
      leftArmAngle = -0.1;
      rightArmAngle = 0.1;
      bounceY = Math.sin(animationPhase * 3) * 3;
    }

    ctx.translate(0, -bounceY);

    // Shadow on ground
    ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
    ctx.beginPath();
    ctx.ellipse(0, 10, 35, 10, 0, 0, Math.PI * 2);
    ctx.fill();

    // 1. Skeletal Legs & Feet Motion
    ctx.fillStyle = profile.outfitColor === '#f8fafc' ? '#e2e8f0' : '#0f172a';
    
    // Left Leg & Knee Joint
    ctx.save();
    ctx.translate(-12, -40);
    ctx.rotate(leftLegAngle);
    ctx.fillRect(-6, 0, 12, 45);
    ctx.restore();

    // Right Leg & Knee Joint
    ctx.save();
    ctx.translate(12, -40);
    ctx.rotate(rightLegAngle);
    ctx.fillRect(-6, 0, 12, 45);
    ctx.restore();

    // 2. Torso / Costume Coat
    ctx.fillStyle = profile.outfitColor;
    ctx.strokeStyle = profile.accentColor;
    ctx.lineWidth = 2;

    ctx.beginPath();
    ctx.roundRect(-25, -110, 50, 70, [10, 10, 4, 4]);
    ctx.fill();
    ctx.stroke();

    // Special Reference Costume Features:
    if (profile.shawlColor) {
      // Siraj-ud-Daulah: Brown/gold draped shawl across shoulder
      ctx.fillStyle = profile.shawlColor;
      ctx.beginPath();
      ctx.moveTo(-25, -110);
      ctx.lineTo(25, -60);
      ctx.lineTo(15, -40);
      ctx.lineTo(-25, -90);
      ctx.closePath();
      ctx.fill();
    }

    if (profile.name === 'Robert Clive' || profile.accentColor === '#ffffff') {
      // Robert Clive: White cross-belts across red military coat
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(-22, -108); ctx.lineTo(22, -45);
      ctx.moveTo(22, -108); ctx.lineTo(-22, -45);
      ctx.stroke();
    }

    if (profile.robeColor) {
      // Mir Jafar: Dark outer robe draped over dark clothing
      ctx.fillStyle = profile.robeColor;
      ctx.fillRect(-28, -108, 12, 68);
      ctx.fillRect(16, -108, 12, 68);
    }

    if (profile.name === 'British EIC Soldier' || profile.headwear === 'period_helmet') {
      // British Soldier: Pouches & Chest Webbing
      ctx.fillStyle = '#78350f';
      ctx.fillRect(-18, -90, 12, 16);
      ctx.fillRect(6, -90, 12, 16);
    }

    // 3. Arms & Weapon Articulation
    // Left Arm Joint
    ctx.save();
    ctx.translate(-26, -100);
    ctx.rotate(leftArmAngle);
    ctx.fillStyle = profile.outfitColor;
    ctx.fillRect(-5, 0, 10, 45);
    ctx.restore();

    // Right Arm Joint (Holding Weapon / Gesturing)
    ctx.save();
    ctx.translate(26, -100);
    ctx.rotate(rightArmAngle);
    ctx.fillStyle = profile.outfitColor;
    ctx.fillRect(-5, 0, 10, 45);

    // Weapon rendering
    if (profile.weapon === 'scimitar' || profile.weapon === 'sword' || profile.weapon === 'saber') {
      ctx.strokeStyle = '#e2e8f0';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(0, 40);
      ctx.lineTo(15, 80);
      ctx.stroke();
    } else if (profile.weapon === 'musket') {
      ctx.strokeStyle = '#78350f';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(0, 30);
      ctx.lineTo(0, 90);
      ctx.stroke();
    }
    ctx.restore();

    // 4. Head & Face Joint Kinematics
    ctx.save();
    ctx.translate(0, -135);
    ctx.rotate(headTilt);

    ctx.fillStyle = profile.skinTone;
    ctx.beginPath();
    ctx.arc(0, 0, 22, 0, Math.PI * 2);
    ctx.fill();

    // Beard for Nawabi / Dark characters (Siraj-ud-Daulah & Mir Jafar)
    if (profile.name.includes('Siraj') || profile.name.includes('Mir Jafar')) {
      ctx.fillStyle = '#1c1917';
      ctx.beginPath();
      ctx.arc(0, 5, 22, 0.2 * Math.PI, 0.8 * Math.PI);
      ctx.fill();
    }

    // Eyes
    ctx.fillStyle = '#000000';
    ctx.beginPath();
    ctx.arc(-7, -2, 2.5, 0, Math.PI * 2);
    ctx.arc(7, -2, 2.5, 0, Math.PI * 2);
    ctx.fill();

    // Mouth Dialogue Kinematics
    if (mouthOpen > 0) {
      ctx.fillStyle = '#7f1d1d';
      ctx.beginPath();
      ctx.ellipse(0, 8, 4, mouthOpen, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    // Eyebrows
    ctx.strokeStyle = profile.hairColor;
    ctx.lineWidth = 2;
    ctx.beginPath();
    if (profile.expression === 'stern' || profile.expression === 'cautious') {
      ctx.moveTo(-11, -9); ctx.lineTo(-4, -5);
      ctx.moveTo(11, -9); ctx.lineTo(4, -5);
    } else {
      ctx.moveTo(-11, -7); ctx.lineTo(-4, -7);
      ctx.moveTo(11, -7); ctx.lineTo(4, -7);
    }
    ctx.stroke();

    // 5. Headwear
    if (profile.headwear === 'orange_turban') {
      ctx.fillStyle = '#ea580c';
      ctx.beginPath();
      ctx.arc(0, -13, 25, Math.PI, 0);
      ctx.fill();
      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.ellipse(0, -20, 18, 10, 0, 0, Math.PI * 2);
      ctx.fill();
    } else if (profile.headwear === 'dark_turban') {
      ctx.fillStyle = '#1f2937';
      ctx.beginPath();
      ctx.arc(0, -13, 24, Math.PI, 0);
      ctx.fill();
    } else if (profile.headwear === 'tricorne' || profile.headwear === 'bicorne') {
      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.ellipse(0, -20, 34, 13, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(-15, -20, 4, 0, Math.PI * 2);
      ctx.fill();
    } else if (profile.headwear === 'period_helmet' || profile.headwear === 'helmet') {
      ctx.fillStyle = '#65a30d';
      ctx.beginPath();
      ctx.arc(0, -11, 25, Math.PI, 0);
      ctx.fill();
      ctx.fillRect(-27, -13, 54, 4);
    }

    ctx.restore(); // End Head Joint
    ctx.restore(); // End Character Root
  }
}
