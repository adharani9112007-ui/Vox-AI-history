/* ==========================================================================
   Smart History Education AI - Storyboard Editor & Character Panel Manager
   ========================================================================== */

import { CharacterProfiles } from './characterProfiles.js';

export class StoryboardEditor {
  constructor(storyboardContainer, characterContainer, onUpdateCallback) {
    this.container = storyboardContainer;
    this.characterContainer = characterContainer;
    this.onUpdate = onUpdateCallback;
    this.scenes = [];
    this.characters = [];
  }

  loadData(scenes, figures) {
    this.scenes = scenes || [];
    this.characters = (figures || []).map(f => CharacterProfiles.createProfile(f.name, f.role, f.faction));
    this.render();
  }

  render() {
    this.renderStoryboardGrid();
    this.renderCharacterRoster();
  }

  renderStoryboardGrid() {
    if (!this.container) return;
    this.container.innerHTML = '';

    if (this.scenes.length === 0) {
      this.container.innerHTML = '<div style="color: var(--text-muted); font-size: 0.9rem;">No scenes generated yet. Speak a lesson to generate storyboard!</div>';
      return;
    }

    this.scenes.forEach((scene, index) => {
      const card = document.createElement('div');
      card.className = 'storyboard-card';
      
      let cameraBadge = scene.cameraAngle || 'Wide Shot';
      let icon = '🎬';
      if (scene.type === 'animated_map') icon = '🗺️';
      if (scene.type === 'character_cards') icon = '👑';
      if (scene.type === 'animated_timeline') icon = '⏳';
      if (scene.type === 'cause_effect') icon = '⚡';
      if (scene.type === 'lesson_summary') icon = '🎓';

      card.innerHTML = `
        <div class="storyboard-card-header">
          <div class="scene-badge"><i class="fa-solid fa-film"></i> Scene ${index + 1}</div>
          <div class="scene-actions">
            <button class="btn-scene-action move-up" title="Move Up" ${index === 0 ? 'disabled' : ''}><i class="fa-solid fa-arrow-up"></i></button>
            <button class="btn-scene-action move-down" title="Move Down" ${index === this.scenes.length - 1 ? 'disabled' : ''}><i class="fa-solid fa-arrow-down"></i></button>
            <button class="btn-scene-action edit-scene" title="Edit Scene Script"><i class="fa-solid fa-pen-to-square"></i></button>
            <button class="btn-scene-action regen-scene" title="Regenerate Scene"><i class="fa-solid fa-rotate"></i></button>
            <button class="btn-scene-action delete-scene" title="Delete Scene"><i class="fa-solid fa-trash"></i></button>
          </div>
        </div>

        <div class="storyboard-card-title">${icon} ${scene.title}</div>
        
        <div class="storyboard-meta-row">
          <span class="meta-tag gold"><i class="fa-solid fa-camera"></i> ${cameraBadge}</span>
          <span class="meta-tag indigo"><i class="fa-solid fa-clock"></i> ${scene.duration}s</span>
          <span class="meta-tag emerald"><i class="fa-solid fa-location-dot"></i> ${scene.locationName || 'Historical Site'}</span>
        </div>

        <p class="storyboard-desc">${scene.text}</p>
      `;

      // Event Listeners for actions
      card.querySelector('.move-up').addEventListener('click', () => this.moveScene(index, -1));
      card.querySelector('.move-down').addEventListener('click', () => this.moveScene(index, 1));
      card.querySelector('.delete-scene').addEventListener('click', () => this.deleteScene(index));
      card.querySelector('.edit-scene').addEventListener('click', () => this.editScene(index));
      card.querySelector('.regen-scene').addEventListener('click', () => this.regenerateScene(index));

      this.container.appendChild(card);
    });

    // Add Scene Button
    const addBtn = document.createElement('button');
    addBtn.className = 'btn-add-scene';
    addBtn.innerHTML = '<i class="fa-solid fa-plus"></i> Add Custom Movie Scene';
    addBtn.addEventListener('click', () => this.addCustomScene());
    this.container.appendChild(addBtn);
  }

  renderCharacterRoster() {
    if (!this.characterContainer) return;
    this.characterContainer.innerHTML = '';

    this.characters.forEach((char, idx) => {
      const card = document.createElement('div');
      card.className = 'character-roster-card';
      card.innerHTML = `
        <div class="character-avatar-large">${char.avatar || '👤'}</div>
        <div class="character-info">
          <div class="character-name">${char.name}</div>
          <div class="character-role">${char.role}</div>
          <div class="character-traits">
            <span class="trait-pill">Outfit: ${char.headwear}</span>
            <span class="trait-pill">Weapon: ${char.weapon}</span>
            <span class="trait-pill">Stance: ${char.stance}</span>
          </div>
        </div>
      `;
      this.characterContainer.appendChild(card);
    });
  }

  moveScene(index, direction) {
    const targetIdx = index + direction;
    if (targetIdx < 0 || targetIdx >= this.scenes.length) return;
    const temp = this.scenes[index];
    this.scenes[index] = this.scenes[targetIdx];
    this.scenes[targetIdx] = temp;
    this.render();
    if (this.onUpdate) this.onUpdate(this.scenes);
  }

  deleteScene(index) {
    if (this.scenes.length <= 1) return;
    this.scenes.splice(index, 1);
    this.render();
    if (this.onUpdate) this.onUpdate(this.scenes);
  }

  editScene(index) {
    const scene = this.scenes[index];
    const newText = prompt('Edit Narration & Script for this scene:', scene.text);
    if (newText !== null && newText.trim() !== '') {
      scene.text = newText;
      const newDuration = prompt('Set Scene Duration in Seconds:', scene.duration);
      if (newDuration && !isNaN(newDuration)) {
        scene.duration = parseFloat(newDuration);
      }
      this.render();
      if (this.onUpdate) this.onUpdate(this.scenes);
    }
  }

  regenerateScene(index) {
    const scene = this.scenes[index];
    scene.title = `Regenerated ${scene.title}`;
    scene.duration = 6.0;
    this.render();
    if (this.onUpdate) this.onUpdate(this.scenes);
  }

  addCustomScene() {
    const title = prompt('Enter New Scene Title:', 'Climax Battle Scene');
    if (!title) return;
    const text = prompt('Enter Scene Script / Narration:', 'The commanders gave the signal and forces engaged.');

    this.scenes.push({
      id: `scene-custom-${Date.now()}`,
      type: 'character_cards',
      title,
      text: text || title,
      duration: 6.0,
      cameraAngle: 'Dramatic Close-Up',
      bgTheme: 'gold_imperial',
      figures: this.characters
    });

    this.render();
    if (this.onUpdate) this.onUpdate(this.scenes);
  }
}
