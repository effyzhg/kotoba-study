export const RATINGS = [
  { id: 'again', quality: 0 },
  { id: 'hard', quality: 3 },
  { id: 'good', quality: 4 },
  { id: 'easy', quality: 5 },
];

export function freshSchedule() {
  return { repetitions: 0, easeFactor: 2.5, intervalDays: 0, dueDate: null, reviews: 0, lastReviewed: null };
}

export function scheduleReview(schedule = freshSchedule(), quality, today = new Date().toISOString().slice(0, 10)) {
  if (!Number.isInteger(quality) || quality < 0 || quality > 5) throw new RangeError('Quality must be an integer from 0 to 5.');
  const next = { ...freshSchedule(), ...schedule };
  const easeFactor = Math.max(1.3, next.easeFactor + 0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
  let repetitions = next.repetitions;
  let intervalDays;
  if (quality < 3) {
    repetitions = 0;
    intervalDays = 1;
  } else {
    repetitions += 1;
    intervalDays = repetitions === 1 ? 1 : repetitions === 2 ? 6 : Math.max(1, Math.round(next.intervalDays * easeFactor));
    if (quality === 5) intervalDays = Math.max(1, Math.round(intervalDays * 1.3));
  }
  const due = new Date(`${today}T12:00:00`);
  due.setDate(due.getDate() + intervalDays);
  return {
    repetitions,
    easeFactor: Math.round(easeFactor * 1000) / 1000,
    intervalDays,
    dueDate: due.toISOString().slice(0, 10),
    reviews: next.reviews + 1,
    lastReviewed: today,
  };
}

export function buildQueue(cards, schedules, { today = new Date().toISOString().slice(0, 10), newLimit = 10, newSeen = [] } = {}) {
  const due = [];
  const fresh = [];
  for (const card of cards) {
    const schedule = schedules[card.id];
    if (!schedule) fresh.push(card);
    else if (schedule.dueDate && schedule.dueDate <= today) due.push(card);
  }
  due.sort((a, b) => (schedules[a.id].dueDate || '').localeCompare(schedules[b.id].dueDate || '') || a.id.localeCompare(b.id));
  fresh.sort((a, b) => a.id.localeCompare(b.id));
  const seen = new Set(newSeen);
  const remaining = Math.max(0, Number(newLimit) - seen.size);
  const newCards = fresh.filter(card => !seen.has(card.id)).slice(0, remaining);
  return [...due.map(card => ({ card, kind: 'due' })), ...newCards.map(card => ({ card, kind: 'new' }))];
}
