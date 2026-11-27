import test from 'node:test';
import assert from 'node:assert/strict';
import { buildQueue, freshSchedule, scheduleReview } from '../src/scheduler.js';

test('first successful recall schedules tomorrow and lowers ease only when appropriate', () => {
  const next = scheduleReview(freshSchedule(), 4, '2026-11-27');
  assert.equal(next.repetitions, 1);
  assert.equal(next.intervalDays, 1);
  assert.equal(next.dueDate, '2026-11-28');
  assert.equal(next.easeFactor, 2.5);
});

test('again resets repetitions and schedules one day later', () => {
  const next = scheduleReview({ ...freshSchedule(), repetitions: 4, intervalDays: 20 }, 0, '2026-11-27');
  assert.equal(next.repetitions, 0);
  assert.equal(next.intervalDays, 1);
  assert.equal(next.dueDate, '2026-11-28');
  assert.ok(next.easeFactor >= 1.3);
});

test('good intervals progress through one day, six days and ease-adjusted spacing', () => {
  const first = scheduleReview(freshSchedule(), 4, '2026-11-27');
  const second = scheduleReview(first, 4, '2026-11-28');
  const third = scheduleReview(second, 4, '2026-12-04');
  assert.equal(first.intervalDays, 1);
  assert.equal(second.intervalDays, 6);
  assert.equal(third.intervalDays, 15);
});

test('invalid ratings fail closed', () => {
  for (const rating of [-1, 6, 2.5, 'good']) assert.throws(() => scheduleReview(freshSchedule(), rating), RangeError);
});

test('queue orders due cards before new cards and respects the daily cap', () => {
  const cards = [{ id:'new-b' }, { id:'due' }, { id:'new-a' }, { id:'future' }];
  const schedules = {
    due: { dueDate:'2026-11-25' },
    future: { dueDate:'2026-12-01' },
  };
  const queue = buildQueue(cards, schedules, { today:'2026-11-27', newLimit:1, newSeen:[] });
  assert.deepEqual(queue.map(item => [item.card.id,item.kind]), [['due','due'],['new-a','new']]);
});

test('already-seen new cards count against the new-card cap', () => {
  const cards = [{ id:'a' }, { id:'b' }];
  const queue = buildQueue(cards, {}, { today:'2026-11-27', newLimit:1, newSeen:['a'] });
  assert.deepEqual(queue, []);
});
