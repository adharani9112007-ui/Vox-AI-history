/* ==========================================================================
   Smart History Education AI - Deep Semantic NLP & Event Classifier
   ========================================================================== */

import { CharacterBible } from './characterBible.js';
import { globalCharacterRefMgr } from './characterReferenceManager.js';

export class HistoryAnalyzer {
  /**
   * Deep semantic analysis of FULL spoken history text.
   * Isolates topic context completely so no previous characters/scenes leak.
   */
  static analyzeLesson(text, topicTitle = '') {
    if (!text || text.trim() === '') {
      text = 'World War I, also known as the Great War, began in 1914 and lasted until 1918. Tensions had been growing across Europe because of nationalism, military alliances, imperial competition, and militarism. The immediate cause of the war was the assassination of Archduke Franz Ferdinand of Austria-Hungary in Sarajevo in 1914. Following the assassination, a chain of alliances drew many European nations into war. The Central Powers included Germany, Austria-Hungary, the Ottoman Empire, and Bulgaria. The Allied Powers included Britain, France, Russia, Italy, and later the United States. Soldiers fought across Europe in trenches, where life was difficult and dangerous. New weapons and technology, including machine guns, artillery, tanks, submarines, and aircraft, changed warfare. In 1917, the United States entered the war. By 1918, the Central Powers were collapsing. The fighting ended with an armistice on November 11, 1918. The war caused enormous destruction and changed the political map of Europe.';
    }

    const cleanText = text.trim();
    const lowerText = cleanText.toLowerCase();

    // 1. Detect Event Category
    const eventCategory = this.detectEventCategory(lowerText, topicTitle.toLowerCase());
    const topicId = `${eventCategory}_${Math.abs(this.hashCode(cleanText.substring(0, 80)))}`;

    // 2. Extract Time, Date, Year
    const yearMatch = cleanText.match(/\b(1\d{3}|20\d{2}|[1-9]\d{2}\s*BC|[1-9]\d{3}\s*BC)\b/i);
    let year = yearMatch ? yearMatch[0] : '1914';
    if (eventCategory === 'battle_of_plassey') year = '1757';
    if (eventCategory === 'independence') year = 'August 14–15, 1947';
    if (eventCategory === 'world_war_1') year = '1914–1918';

    const isNight = lowerText.includes('night') || lowerText.includes('evening') || lowerText.includes('midnight');
    const timeOfDay = isNight ? 'Night' : 'Day';
    const timeAndDate = `${year}, ${timeOfDay}`;

    // 3. Extract Geographic Locations dynamically
    let locationName = 'Historical Territory';
    let lat = 48.85; let lng = 2.35;
    const locations = [];

    if (eventCategory === 'battle_of_plassey') {
      locationName = 'Plassey, Bengal, India';
      lat = 23.79; lng = 88.25;
      locations.push('Bhagirathi River', 'Plassey Village, Bengal');
    } else if (eventCategory === 'world_war_1') {
      locationName = 'Western Front & Europe';
      lat = 49.34; lng = 2.85;
      locations.push('Sarajevo, Bosnia', 'Western Front Trenches, Europe', 'Continent of Europe');
    } else if (eventCategory === 'independence') {
      locationName = 'Constituent Assembly, New Delhi, India';
      lat = 28.61; lng = 77.20;
      locations.push('Constituent Assembly Hall, Delhi', 'Streets of Delhi');
    } else {
      const knownLocs = [
        { key: 'sarajevo', name: 'Sarajevo, Bosnia', lat: 43.85, lng: 18.41 },
        { key: 'delhi', name: 'Delhi, India', lat: 28.61, lng: 77.20 },
        { key: 'plassey', name: 'Plassey, Bengal', lat: 23.79, lng: 88.25 },
        { key: 'europe', name: 'Europe', lat: 48.85, lng: 2.35 }
      ];
      for (const loc of knownLocs) {
        if (lowerText.includes(loc.key)) {
          locationName = loc.name;
          locations.push(loc.name);
          lat = loc.lat; lng = loc.lng;
        }
      }
      if (locations.length === 0) locations.push(locationName);
    }

    // 4. Extract Weather & Atmosphere
    let weather = 'Overcast Historical Atmosphere';
    if (eventCategory === 'battle_of_plassey') {
      weather = 'Monsoon Clouds, Sudden Torrential Rain & Mud';
    } else if (eventCategory === 'world_war_1') {
      weather = 'Cold Overcast Sky, Western Front Mud & Smoke';
    } else if (eventCategory === 'independence') {
      weather = 'Warm Monsoon Clouds, Historic Midnight Illumination';
    }

    // 5. Extract Important Objects
    const objects = [];
    if (eventCategory === 'battle_of_plassey') {
      objects.push('18th Century Brass Cannons', 'Waterproof Tarpaulins', 'Gunpowder Casks', 'Flintlock Muskets');
    } else if (eventCategory === 'world_war_1') {
      objects.push('1914 Political Alliance Map', 'Trench Sandbags & Barbed Wire', 'Mark IV Armored Tank', 'Biplane Aircraft', 'November 11 Armistice Document');
    } else if (eventCategory === 'independence') {
      objects.push('Constituent Assembly Podium', 'Indian National Tricolor Flag', 'Midnight 12:00 Clock', 'Historic Constitution Draft');
    } else {
      objects.push('Historical Artifacts & Military Equipment');
    }

    // 6. Topic-Isolated Character Figures
    const extractedFigures = [];
    const uploadedRefs = globalCharacterRefMgr.getAllReferences();

    if (uploadedRefs.length > 0) {
      uploadedRefs.forEach(ref => {
        extractedFigures.push({
          name: ref.name,
          role: ref.role,
          avatar: '🖼️',
          isUploaded: true
        });
      });
    } else {
      // Topic-specific procedural characters
      if (eventCategory === 'battle_of_plassey') {
        extractedFigures.push(CharacterBible.getOrRegisterCharacter('Siraj-ud-Daulah', 'Nawab of Bengal', 'Bengal Sultanate'));
        extractedFigures.push(CharacterBible.getOrRegisterCharacter('Robert Clive', 'British Commander', 'British East India Company'));
        extractedFigures.push(CharacterBible.getOrRegisterCharacter('Mir Jafar', 'Commander-in-Chief (Conspirator)', 'Bengal Conspirators'));
        extractedFigures.push(CharacterBible.getOrRegisterCharacter('British EIC Soldier', 'Infantry Soldier', 'British EIC'));
      } else if (eventCategory === 'world_war_1') {
        extractedFigures.push(CharacterBible.getOrRegisterCharacter('Archduke Franz Ferdinand', 'Austrian Archduke', 'Central Powers'));
        extractedFigures.push(CharacterBible.getOrRegisterCharacter('WWI Allied Soldier', 'Infantry Soldier', 'Allied Powers'));
        extractedFigures.push(CharacterBible.getOrRegisterCharacter('WWI Central Powers Soldier', 'Infantry Soldier', 'Central Powers'));
        extractedFigures.push(CharacterBible.getOrRegisterCharacter('WWI Commander', 'Supreme Commander', 'Allied Powers'));
      } else if (eventCategory === 'independence') {
        extractedFigures.push(CharacterBible.getOrRegisterCharacter('Jawaharlal Nehru', 'Prime Minister of India', 'Constituent Assembly'));
        extractedFigures.push(CharacterBible.getOrRegisterCharacter('Freedom Fighter', 'National Leader', 'Freedom Movement'));
        extractedFigures.push(CharacterBible.getOrRegisterCharacter('Assembly Statesman', 'Parliamentarian', 'Constituent Assembly'));
        extractedFigures.push(CharacterBible.getOrRegisterCharacter('Delhi Citizen', 'Public Celebrant', 'Indian Public'));
      } else {
        extractedFigures.push(CharacterBible.getOrRegisterCharacter('Historical Leader', 'Statesman', 'Nation'));
      }
    }

    // 7. Clause Segmentation & Sentence-by-Sentence Scene Generation
    const clauses = cleanText.split(/(?<=[.?!;])\s+/).filter(c => c.trim().length > 5);
    const scenes = [];

    clauses.forEach((clause, idx) => {
      const sceneAction = this.classifyActionClause(
        clause,
        idx,
        clauses.length,
        year,
        locationName,
        eventCategory,
        weather,
        objects,
        extractedFigures,
        topicId
      );
      scenes.push(sceneAction);
    });

    if (scenes.length === 0) {
      scenes.push(this.classifyActionClause(
        cleanText,
        0,
        1,
        year,
        locationName,
        eventCategory,
        weather,
        objects,
        extractedFigures,
        topicId
      ));
    }

    const totalDuration = scenes.reduce((sum, sc) => sum + sc.duration, 0);

    const defaultTitle = eventCategory === 'battle_of_plassey' ? 'Battle of Plassey (1757)'
      : eventCategory === 'world_war_1' ? 'World War I (1914–1918) The Great War'
        : eventCategory === 'independence' ? 'August 15, 1947 — Indian Independence'
          : 'Spoken History Lesson';

    const contentAnalysisObj = {
      topicId,
      mainTopic: topicTitle || defaultTitle,
      eventType: eventCategory,
      historicalPeriod: year,
      date: timeAndDate,
      locations,
      characters: extractedFigures.map(f => `${f.name} (${f.role})`),
      characterActions: scenes.map(s => s.actionType),
      objects,
      environment: `${locationName} - ${weather}`,
      weather,
      timeOfDay,
      scenePlan: scenes
    };

    console.log('====================================');
    console.log(`[HistoryAnalyzer] TOPIC ID: ${topicId} | EVENT: ${eventCategory.toUpperCase()}`);
    console.log(`[HistoryAnalyzer] CHARACTERS: ${extractedFigures.map(f => f.name).join(', ')}`);
    console.log(`[HistoryAnalyzer] SCENES CREATED: ${scenes.length} scenes, Total Duration: ${totalDuration.toFixed(1)}s`);

    return {
      topicId,
      eventCategory,
      year,
      timeAndDate,
      eventTitle: contentAnalysisObj.mainTopic,
      location: locationName,
      coordinates: { lat, lng },
      weather,
      objects,
      figures: extractedFigures,
      scenes,
      totalDuration,
      analysisObject: contentAnalysisObj,
      rawText: cleanText
    };
  }

  static detectEventCategory(lowerText, lowerTitle = '') {
    const combined = `${lowerTitle} ${lowerText}`;
    if (combined.includes('plassey') || combined.includes('siraj') || combined.includes('clive') || combined.includes('mir jafar') || combined.includes('bhagirathi')) {
      return 'battle_of_plassey';
    } else if (combined.includes('world war i') || combined.includes('ww1') || combined.includes('great war') || combined.includes('franz ferdinand') || combined.includes('trench') || combined.includes('central powers') || combined.includes('allied powers')) {
      return 'world_war_1';
    } else if (combined.includes('independence') || combined.includes('august 14') || combined.includes('august 15') || combined.includes('1947') || combined.includes('constituent assembly') || combined.includes('nehru')) {
      return 'independence';
    } else if (combined.includes('battle') || combined.includes('war') || combined.includes('attack')) {
      return 'battle';
    }
    return 'historical_event';
  }

  static classifyActionClause(clauseText, index, totalClauses, year, locationName, eventCategory, weather, objects, figures, topicId) {
    const lower = clauseText.toLowerCase();
    let envType = 'plassey_bengal_1757';
    let actionType = 'historical_narrative';
    let cameraAngle = 'Wide Cinematic View';
    let sfx = 'palace';
    let requiredCharacters = figures;

    if (eventCategory === 'battle_of_plassey') {
      if (lower.includes('took place') || lower.includes('june 23') || lower.includes('bhagirathi') || lower.includes('village of plassey')) {
        envType = 'plassey_bengal_1757';
        actionType = 'bengal_landscape_1757';
        cameraAngle = 'Wide Pan across Bhagirathi River & Plassey Village';
        sfx = 'palace';
        requiredCharacters = figures.filter(f => f.name.includes('Siraj') || f.name.includes('Clive') || f.isUploaded);
      } else if (lower.includes('fought between') || lower.includes('forces of siraj') || lower.includes('prepared his forces')) {
        envType = 'plassey_british_prep';
        actionType = 'british_forces_preparing';
        cameraAngle = 'Medium Tracking Shot inside British Military Camp';
        sfx = 'palace';
        requiredCharacters = figures.filter(f => f.name.includes('Clive') || f.name.includes('Soldier') || f.isUploaded);
      } else if (lower.includes('much larger army') || lower.includes('observing his army') || lower.includes('assembled')) {
        envType = 'plassey_nawab_army';
        actionType = 'siraj_nawab_army';
        cameraAngle = 'Elevated High-Angle View of Nawabi Royal Encampment';
        sfx = 'palace';
        requiredCharacters = figures.filter(f => f.name.includes('Siraj') || f.isUploaded);
      } else if (lower.includes('dark monsoon') || lower.includes('clouds gathered') || lower.includes('storm')) {
        envType = 'plassey_monsoon_clouds';
        actionType = 'dark_monsoon_clouds';
        cameraAngle = 'Dramatic Low-Angle Sky & Wind Swept Banners';
        sfx = 'rain';
        requiredCharacters = figures.filter(f => f.name.includes('Siraj') || f.name.includes('Clive') || f.isUploaded);
      } else if (lower.includes('heavy rain') || lower.includes('protected their gunpowder')) {
        envType = 'plassey_heavy_rain';
        actionType = 'heavy_rain_gunpowder_protection';
        cameraAngle = 'Close-up of Tarpaulin Covered Gunpowder Barrels';
        sfx = 'rain';
        requiredCharacters = figures.filter(f => f.name.includes('Soldier') || f.name.includes('Clive') || f.isUploaded);
      } else if (lower.includes('ammunition properly') || lower.includes('failed to protect') || lower.includes('soaked')) {
        envType = 'plassey_nawab_ammo';
        actionType = 'nawab_ammunition_ruined';
        cameraAngle = 'Medium Shot of Water-Soaked Nawabi Cannons';
        sfx = 'rain';
        requiredCharacters = figures.filter(f => f.name.includes('Siraj') || f.isUploaded);
      } else if (lower.includes('betrayal') || lower.includes('mir jafar') || lower.includes('inactive')) {
        envType = 'plassey_betrayal';
        actionType = 'betrayal_of_mir_jafar';
        cameraAngle = 'Focus Shot on Inactive Secretive Mir Jafar';
        sfx = 'palace';
        requiredCharacters = figures.filter(f => f.name.includes('Mir Jafar') || f.isUploaded);
      } else if (lower.includes('advanced') || lower.includes('british forces advanced')) {
        envType = 'plassey_british_advance';
        actionType = 'british_forces_advancing';
        cameraAngle = 'Tracking Shot behind Advancing Redcoat Musket Line';
        sfx = 'battle';
        requiredCharacters = figures.filter(f => f.name.includes('Clive') || f.name.includes('Soldier') || f.isUploaded);
      } else if (lower.includes('retreated') || lower.includes('army retreated')) {
        envType = 'plassey_nawab_retreat';
        actionType = 'siraj_army_retreats';
        cameraAngle = 'High Angle of Disorganized Nawabi Retreat';
        sfx = 'battle';
        requiredCharacters = figures.filter(f => f.name.includes('Siraj') || f.isUploaded);
      } else {
        envType = 'plassey_consequences';
        actionType = 'historical_turning_point';
        cameraAngle = '1757 Bengal Political Map & EIC Flag Expansion';
        sfx = 'fanfare';
        requiredCharacters = figures.filter(f => f.name.includes('Clive') || f.isUploaded);
      }
    } else if (eventCategory === 'world_war_1') {
      if (lower.includes('began') || lower.includes('1914') || lower.includes('nationalism') || lower.includes('alliance') || lower.includes('central powers') || lower.includes('allied powers')) {
        envType = 'ww1_europe_map';
        actionType = 'prewar_map_alliances';
        cameraAngle = '1914 Animated Europe Alliance Map View';
        sfx = 'palace';
        requiredCharacters = figures.filter(f => f.name.includes('Commander') || f.isUploaded);
      } else if (lower.includes('archduke') || lower.includes('ferdinand') || lower.includes('assassination') || lower.includes('sarajevo')) {
        envType = 'sarajevo_1914';
        actionType = 'sarajevo_assassination';
        cameraAngle = '1914 Sarajevo Street & Imperial Open-Top Car';
        sfx = 'palace';
        requiredCharacters = figures.filter(f => f.name.includes('Archduke') || f.isUploaded);
      } else if (lower.includes('trench') || lower.includes('difficult') || lower.includes('dangerous') || lower.includes('mud')) {
        envType = 'ww1_trench';
        actionType = 'western_front_trenches';
        cameraAngle = 'Low Tracking Shot Along Trenches with Sandbags';
        sfx = 'battle';
        requiredCharacters = figures.filter(f => f.name.includes('Soldier') || f.isUploaded);
      } else if (lower.includes('technology') || lower.includes('tank') || lower.includes('machine gun') || lower.includes('artillery') || lower.includes('aircraft') || lower.includes('submarine') || lower.includes('weapons')) {
        envType = 'ww1_technology';
        actionType = 'armored_tank_and_biplane';
        cameraAngle = 'Cinematic Highlight of Mark IV Tanks & Biplanes';
        sfx = 'battle';
        requiredCharacters = figures.filter(f => f.name.includes('Soldier') || f.isUploaded);
      } else if (lower.includes('armistice') || lower.includes('november 11') || lower.includes('1918') || lower.includes('ended')) {
        envType = 'ww1_armistice';
        actionType = 'armistice_signed_1918';
        cameraAngle = '11:00 AM Peaceful Horizon & Armistice Clock';
        sfx = 'fanfare';
        requiredCharacters = figures.filter(f => f.name.includes('Commander') || f.isUploaded);
      } else {
        envType = 'ww1_aftermath';
        actionType = 'postwar_destruction_and_map';
        cameraAngle = 'High Aerial View of Rebuilding Europe';
        sfx = 'fanfare';
        requiredCharacters = figures.filter(f => f.name.includes('Commander') || f.isUploaded);
      }
    } else if (eventCategory === 'independence') {
      if (lower.includes('inside') || lower.includes('hall') || lower.includes('politician') || lower.includes('freedom fighters') || lower.includes('lit brightly')) {
        envType = 'assembly_hall';
        actionType = 'constituent_assembly_speech';
        cameraAngle = 'Brightly Lit Assembly Chamber View';
        sfx = 'palace';
        requiredCharacters = figures.filter(f => f.name.includes('Nehru') || f.name.includes('Freedom') || f.isUploaded);
      } else if (lower.includes('clock') || lower.includes('ticking') || lower.includes('minute') || lower.includes('ticking away') || lower.includes('two centuries')) {
        envType = 'clock_ticking';
        actionType = 'midnight_clock_ticking';
        cameraAngle = 'Dramatic Close-Up of Historic Midnight Clock Face';
        sfx = 'fanfare';
        requiredCharacters = figures.filter(f => f.name.includes('Nehru') || f.isUploaded);
      } else if (lower.includes('delhi') || lower.includes('crowd') || lower.includes('streets') || lower.includes('humid night')) {
        envType = 'delhi_night_crowd';
        actionType = 'delhi_night_gathering';
        cameraAngle = 'Wide Shot of Tens of Thousands Outside Constituent Assembly';
        sfx = 'palace';
        requiredCharacters = figures.filter(f => f.name.includes('Citizen') || f.name.includes('Freedom') || f.isUploaded);
      } else {
        envType = 'colonial_map';
        actionType = 'end_of_colonial_rule';
        cameraAngle = '1947 Map of Independent India';
        sfx = 'fanfare';
        requiredCharacters = figures.filter(f => f.name.includes('Nehru') || f.isUploaded);
      }
    } else {
      envType = 'battlefield';
      actionType = 'general_historical_action';
      cameraAngle = 'Wide Panoramic View';
      sfx = 'palace';
    }

    if (!requiredCharacters || requiredCharacters.length === 0) {
      requiredCharacters = figures;
    }

    const figNames = requiredCharacters.map(f => f.name).join(', ') || 'Historical Actors';
    const objStr = objects.join(', ');

    const promptStr = `TOPIC: ${eventCategory.toUpperCase()} | HISTORICAL PERIOD: ${year} | LOCATION: ${locationName} | ENVIRONMENT: ${envType} | CHARACTERS: ${figNames} | ACTION: ${actionType} | OBJECTS: ${objStr} | CAMERA: ${cameraAngle} | NARRATION: "${clauseText}"`;

    const wordsCount = clauseText.split(/\s+/).filter(Boolean).length;
    const duration = Math.max(6.0, Math.min(15.0, wordsCount * 0.45));

    return {
      id: `scene_${eventCategory}_${index + 1}_${Date.now()}`,
      topicId,
      sceneNumber: index + 1,
      type: 'scene_sequence',
      title: `Scene ${index + 1} — ${this.capitalize(actionType)}`,
      subtitle: `${locationName} • ${year}`,
      text: clauseText,
      duration,
      cameraAngle,
      envType,
      actionType,
      sfx,
      figures: requiredCharacters,
      locationName,
      aiPrompt: promptStr
    };
  }

  static capitalize(str) {
    if (!str) return 'Historical';
    return str.charAt(0).toUpperCase() + str.slice(1).replace(/_/g, ' ');
  }

  static hashCode(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = ((hash << 5) - hash) + str.charCodeAt(i);
      hash |= 0;
    }
    return hash;
  }
}
