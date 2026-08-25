/* ==========================================================================
   Smart History Education AI - Character Reference Image Manager
   ========================================================================== */6

export class CharacterReferenceManager {
  constructor() {
    this.references = new Map();
  }

  addReference(id, name, role, dataUrl, imageElement, strength = 'strong') {
    const charId = id || `char_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`;
    const charRecord = {
      characterId: charId,
      id: charId,
      name: name || 'Historical Leader',
      role: role || 'Leader',
      referenceImageUrl: dataUrl,
      dataUrl,
      imageElement,
      characterType: 'human',
      visualReferenceRequired: true,
      fallbackToDummy: false,
      strength: strength || 'strong', // 'exact', 'strong', 'flexible'
      sceneAssignments: [],
      createdAt: new Date().toISOString()
    };

    this.references.set(charRecord.id, charRecord);
    console.log(`[Character Reference] Added character "${charRecord.name}" (${charRecord.role}) - RefImage: ${dataUrl ? (dataUrl.substring(0, 30) + '...') : 'none'}`);
    return charRecord;
  }

  removeReference(id) {
    if (this.references.has(id)) {
      this.references.delete(id);
      console.log(`[Character Reference] Removed character ${id}`);
    }
  }

  updateStrength(id, strength) {
    const ref = this.references.get(id);
    if (ref) {
      ref.strength = strength || 'strong';
      console.log(`[Character Reference] Updated strength for ${ref.name}: ${ref.strength}`);
    }
  }

  getAllReferences() {
    return Array.from(this.references.values());
  }

  findMatchingReference(nameOrRole) {
    if (!nameOrRole) return null;
    const lower = nameOrRole.toLowerCase();

    for (const ref of this.references.values()) {
      if (ref.name.toLowerCase().includes(lower) || lower.includes(ref.name.toLowerCase())) {
        return ref;
      }
      if (ref.role.toLowerCase().includes(lower) || lower.includes(ref.role.toLowerCase())) {
        return ref;
      }
    }

    const first = this.getAllReferences()[0];
    return first || null;
  }

  clear() {
    this.references.clear();
  }
}

export const globalCharacterRefMgr = new CharacterReferenceManager();
