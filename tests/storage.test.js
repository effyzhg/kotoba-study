import test from 'node:test';
import assert from 'node:assert/strict';
import { DEFAULT_STATE, STORAGE_KEY, loadState, saveState, validateCard, validateState } from '../src/storage.js';

function fakeStorage(initial = null, fail = false) {
  return {
    value: initial,
    getItem(key) { if (fail) throw new Error('denied'); return key === STORAGE_KEY ? this.value : null; },
    setItem(key, value) { if (fail) throw new Error('denied'); if (key === STORAGE_KEY) this.value = value; },
  };
}

test('missing storage data returns a fresh persistent state', () => {
  const result = loadState(fakeStorage());
  assert.equal(result.persistent, true);
  assert.deepEqual(result.state, DEFAULT_STATE);
});

test('state saves and reloads without changing the schema', () => {
  const storage = fakeStorage();
  const state = structuredClone(DEFAULT_STATE);
  state.customCards.push({ id:'custom_1', jp:'語', kana:'ご', en:'word', zh:'词' });
  assert.equal(saveState(state, storage), true);
  assert.deepEqual(loadState(storage).state, state);
});

test('storage denial produces a usable non-persistent state', () => {
  const storage = fakeStorage(null, true);
  assert.equal(loadState(storage).persistent, false);
  assert.equal(saveState(DEFAULT_STATE, storage), false);
});

test('unsupported backup schemas and invalid cards are rejected', () => {
  assert.throws(() => validateState({ schemaVersion:2 }), TypeError);
  assert.throws(() => validateState({ ...DEFAULT_STATE, customCards:[{ id:'x' }] }), TypeError);
  assert.equal(validateCard({ id:'ok_1', jp:'水', kana:'みず', en:'water', zh:'水' }), true);
  assert.equal(validateCard({ id:'bad id', jp:'水', kana:'', en:'water', zh:'水' }), false);
});

test('backup validation rejects malformed user-controlled state', () => {
  assert.throws(() => validateState({ ...DEFAULT_STATE, daily:{ date:'2026-11-27', newSeen:'not-an-array' } }), TypeError);
  assert.throws(() => validateState({ ...DEFAULT_STATE, settings:{ ...DEFAULT_STATE.settings, newPerDay:101 } }), TypeError);
  assert.throws(() => validateState({ ...DEFAULT_STATE, history:[{ cardId:'x', rating:'excellent', reviewedAt:'today', intervalDays:1 }] }), TypeError);
});

test('malformed stored JSON does not crash startup', () => {
  const result = loadState(fakeStorage('{bad-json'));
  assert.equal(result.persistent, false);
  assert.deepEqual(result.state, DEFAULT_STATE);
});
