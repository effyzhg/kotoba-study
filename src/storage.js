export const STORAGE_KEY = 'kotoba-study-data-v1';
export const DEFAULT_STATE = Object.freeze({
  schemaVersion: 1,
  schedules: {},
  customCards: [],
  history: [],
  daily: { date: '', newSeen: [] },
  settings: { newPerDay: 10, language: 'en', theme: 'system', speech: true },
});

export function validateCard(card) {
  return Boolean(card && typeof card === 'object'
    && typeof card.id === 'string' && /^[a-zA-Z0-9_-]{1,48}$/.test(card.id)
    && typeof card.jp === 'string' && card.jp.trim().length > 0 && card.jp.length <= 80
    && typeof card.kana === 'string' && card.kana.length <= 100
    && typeof card.en === 'string' && card.en.trim().length > 0 && card.en.length <= 240
    && typeof card.zh === 'string' && card.zh.length <= 240);
}

export function validateState(value) {
  if (!value || typeof value !== 'object' || value.schemaVersion !== 1) throw new TypeError('Unsupported backup format.');
  if (!value.schedules || typeof value.schedules !== 'object' || Array.isArray(value.schedules)) throw new TypeError('Invalid schedules.');
  if (!Array.isArray(value.customCards) || value.customCards.length > 2000 || !value.customCards.every(validateCard)) throw new TypeError('Invalid custom cards.');
  if (!Array.isArray(value.history) || value.history.length > 100000) throw new TypeError('Invalid review history.');
  const daily = value.daily || {};
  if (!(typeof daily.date === 'string' && (daily.date === '' || /^\d{4}-\d{2}-\d{2}$/.test(daily.date)))
    || !Array.isArray(daily.newSeen) || daily.newSeen.length > 50000
    || !daily.newSeen.every(id => typeof id === 'string' && /^[a-zA-Z0-9_-]{1,48}$/.test(id))) throw new TypeError('Invalid daily state.');
  const settings = value.settings || {};
  if (settings.newPerDay !== undefined && (!Number.isInteger(settings.newPerDay) || settings.newPerDay < 0 || settings.newPerDay > 100)) throw new TypeError('Invalid daily limit.');
  if (settings.language !== undefined && !['en','zh'].includes(settings.language)) throw new TypeError('Invalid language.');
  if (settings.theme !== undefined && !['system','light','dark'].includes(settings.theme)) throw new TypeError('Invalid theme.');
  if (settings.speech !== undefined && typeof settings.speech !== 'boolean') throw new TypeError('Invalid speech setting.');
  const historyRatings = new Set(['again','hard','good','easy']);
  for (const record of value.history) {
    if (!record || typeof record !== 'object' || typeof record.cardId !== 'string' || !/^[a-zA-Z0-9_-]{1,48}$/.test(record.cardId)
      || !historyRatings.has(record.rating) || typeof record.reviewedAt !== 'string' || record.reviewedAt.length > 40
      || !Number.isInteger(record.intervalDays) || record.intervalDays < 0) throw new TypeError('Invalid review history entry.');
  }
  for (const [id, schedule] of Object.entries(value.schedules)) {
    if (!/^[a-zA-Z0-9_-]{1,48}$/.test(id) || !schedule || typeof schedule !== 'object'
      || !Number.isInteger(schedule.repetitions) || schedule.repetitions < 0
      || !Number.isFinite(schedule.easeFactor) || schedule.easeFactor < 1.3 || schedule.easeFactor > 5
      || !Number.isInteger(schedule.intervalDays) || schedule.intervalDays < 0
      || (schedule.dueDate !== null && !/^\d{4}-\d{2}-\d{2}$/.test(schedule.dueDate))) throw new TypeError('Invalid schedule entry.');
  }
  return {
    ...DEFAULT_STATE,
    ...value,
    daily: { ...DEFAULT_STATE.daily, ...daily },
    settings: { ...DEFAULT_STATE.settings, ...settings },
  };
}

export function loadState(storage) {
  if (storage === undefined) {
    try { storage = globalThis.localStorage; } catch { storage = null; }
  }
  if (!storage) return { state: structuredClone(DEFAULT_STATE), persistent: false };
  try {
    const raw = storage.getItem(STORAGE_KEY);
    if (!raw) return { state: structuredClone(DEFAULT_STATE), persistent: true };
    return { state: validateState(JSON.parse(raw)), persistent: true };
  } catch {
    return { state: structuredClone(DEFAULT_STATE), persistent: false };
  }
}

export function saveState(state, storage) {
  if (storage === undefined) {
    try { storage = globalThis.localStorage; } catch { storage = null; }
  }
  try {
    if (!storage) return false;
    storage.setItem(STORAGE_KEY, JSON.stringify(state));
    return true;
  } catch {
    return false;
  }
}
