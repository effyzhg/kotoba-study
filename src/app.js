import { buildQueue, freshSchedule, RATINGS, scheduleReview } from './scheduler.js';
import { loadState, saveState, validateCard, validateState } from './storage.js';

const COPY = {
  en: {
    skip:'Skip to study',privacy:'Your progress stays in this browser',theme:'Theme',eyebrow:'A small practice, kept close',title:'Japanese, one recall at a time.',intro:'Build a steady habit with short vocabulary sessions. Rate what you remember; the next review date follows your recall.',today:'today',yourStudy:'Your study',starterDeck:'Everyday words',starterMeta:'Starter set · 16 words',myWords:'My words',cards:'cards',newLimit:'New cards today',newLimitHint:'Reviews due today are always included.',autoSpeak:'Speak Japanese after reveal',start:'Start a session',startOver:'Start another session',keyboardReveal:'reveal',keyboardRate:'rate recall',ready:'Ready for a short session',newWord:'New word',dueWord:'Due for review',prompt:'Recall the reading and meaning',reading:'Reading',meaning:'Meaning',example:'In a sentence',pressSpace:'Press Space or reveal to begin.',reveal:'Reveal answer',again:'Again',hard:'Hard',good:'Good',easy:'Easy',setComplete:'Session complete',niceWork:'A little more familiar.',studyAgain:'Study again',storageWarning:'Browser storage is unavailable. This session will work, but progress will be lost when you leave. Export a backup before closing.',keepBuilding:'Keep building your deck',yourLibrary:'Your word library',libraryIntro:'Add a word yourself, or bring in a deck you already use. Everything here stays on this device.',japanese:'Japanese',readingLabel:'Reading',meaningEn:'Meaning · English',meaningZh:'Meaning · Chinese',addWord:'Add word',export:'Export backup',import:'Import backup',privacyDetail:'No account, server or analytics. Your study history is stored in this browser only; use Export backup to move it to another device.',emptyMy:'Your personal deck is empty. Add a word or import a Kotoba backup to begin.',emptyLibrary:'No words yet. Add one above, or import a backup.',noWork:'No cards are due, and today’s new-card limit has been reached.',noCards:'This deck has no cards yet.',reviewRemaining:'{count} left · {due} due · {fresh} new',startHint:'Start a session',completion:'You reviewed {count} {word}. {again} marked Again, {remembered} marked Hard, Good or Easy.',word:'word',words:'words',saved:'Saved in this browser.',added:'Word added to your personal deck.',removed:'Word removed.',exported:'Backup downloaded.',imported:'Backup imported. Your current local data was replaced.',invalidImport:'That backup could not be read. Your current data was left unchanged.',invalidWord:'Add a Japanese word and an English meaning. Reading and Chinese meaning are optional.',sessionEmpty:'There is nothing to review in this deck right now.',limitRange:'Choose a daily limit from 0 to 100.',remaining:'{count} remaining',first:'You are all caught up.',speechUnavailable:'Speech playback is not available in this browser.',notSaved:'Not saved — export a backup before leaving.',remove:'Remove',confirmRemove:'Remove this word from your personal deck?',systemTheme:'System',lightTheme:'Light',darkTheme:'Dark',sessions:'A calm review set',nextUp:'Next, at your pace',startWithWord:'Start with one word.',startAdviceLong:'Recall first, then reveal the reading and meaning. Your rating sets the next review date.',startAdvice:'Choose the rating that best matches your recall.',ratingAgain:'Again · tomorrow',ratingHard:'Hard',ratingGood:'Good',ratingEasy:'Easy',backupTooLarge:'Backup exceeds the 5 MB import limit.'
  },
  zh: {
    skip:'跳到学习区',privacy:'学习进度只保存在此浏览器',theme:'主题',eyebrow:'把练习留在身边',title:'一次回忆，一点日语。',intro:'用简短的词汇练习建立稳定习惯。根据记忆情况评分，系统会据此安排下次复习。',today:'今天',yourStudy:'开始学习',starterDeck:'日常词汇',starterMeta:'入门词集 · 16 个词',myWords:'我的词库',cards:'张卡片',newLimit:'今日新卡上限',newLimitHint:'今天到期的复习卡会全部保留。',autoSpeak:'查看答案后朗读日语',start:'开始本轮练习',startOver:'再开始一轮',keyboardReveal:'查看答案',keyboardRate:'评估记忆',ready:'准备好进行短时练习',newWord:'新词',dueWord:'到期复习',prompt:'回忆读音和词义',reading:'读音',meaning:'词义',example:'例句',pressSpace:'按空格键或点击查看答案。',reveal:'查看答案',again:'重来',hard:'困难',good:'记得',easy:'轻松',setComplete:'本轮完成',niceWork:'又熟悉了一点。',studyAgain:'再学一轮',storageWarning:'浏览器存储不可用。本轮仍可继续，但离开后进度会丢失。请在关闭页面前导出备份。',keepBuilding:'继续整理词库',yourLibrary:'我的词汇',libraryIntro:'手动添加词汇，或导入已有词库。所有内容都保存在这台设备上。',japanese:'日语',readingLabel:'读音',meaningEn:'词义 · 英文',meaningZh:'词义 · 中文',addWord:'添加词汇',export:'导出备份',import:'导入备份',privacyDetail:'无需账户、服务器或分析追踪。学习记录只保存在此浏览器中；可导出备份后转移到另一台设备。',emptyMy:'个人词库还是空的。添加词汇或导入 Kotoba 备份即可开始。',emptyLibrary:'暂无词汇。可以在上方添加或导入备份。',noWork:'当前没有到期复习卡，今日新卡上限也已用完。',noCards:'这个词集中还没有卡片。',reviewRemaining:'还剩 {count} 张 · 到期 {due} 张 · 新卡 {fresh} 张',startHint:'开始本轮练习',completion:'本轮复习 {count} 个词。{again} 个标记为“重来”，{remembered} 个标记为“困难、记得或轻松”。',word:'个词',words:'个词',saved:'已保存在此浏览器。',added:'已添加到个人词库。',removed:'已移除。',exported:'备份已下载。',imported:'备份已导入，现有本地数据已替换。',invalidImport:'无法读取此备份，现有数据未作更改。',invalidWord:'请输入日语词汇和英文词义。读音和中文词义可选。',sessionEmpty:'这个词集目前没有待复习的卡片。',limitRange:'每日新卡上限请设为 0–100。',remaining:'还剩 {count} 张',first:'今天已经复习完了。',speechUnavailable:'此浏览器不支持语音播放。',notSaved:'未能保存；离开前请先导出备份。',remove:'移除',confirmRemove:'要从个人词库中移除此词吗？',systemTheme:'跟随系统',lightTheme:'浅色',darkTheme:'深色',sessions:'一轮平静的复习',nextUp:'按自己的节奏开始',startWithWord:'从一个词开始。',startAdviceLong:'先凭记忆作答，再查看读音和词义。你给出的评分会决定下次复习时间。',startAdvice:'选择最符合实际记忆情况的评分。',ratingAgain:'重来 · 明天复习',ratingHard:'困难',ratingGood:'记得',ratingEasy:'轻松',backupTooLarge:'备份超过 5 MB，无法导入。'
  },
};

const storage = (() => { try { return window.localStorage; } catch { return null; } })();
const loaded = loadState(storage);
let state = loaded.state;
let persistent = loaded.persistent;
let starterCards = [];
let activeDeck = 'starter';
let queue = [];
let queueIndex = 0;
let currentCard = null;
let revealed = false;
let ratingsThisSession = [];
let sessionStarted = false;
const today = () => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`; };
const $ = selector => document.querySelector(selector);
const t = (key, vars = {}) => Object.entries(vars).reduce((text,[name,value]) => text.replaceAll(`{${name}}`, String(value)), COPY[language()][key] || key);
const language = () => state.settings.language === 'zh' ? 'zh' : 'en';
const allCards = () => [...starterCards, ...state.customCards];
const chosenCards = () => activeDeck === 'starter' ? starterCards : state.customCards;

function persist() {
  persistent = saveState(state, storage);
  $('#storage-warning').hidden = persistent;
  $('#data-status').textContent = persistent ? t('saved') : t('notSaved');
}

function applyTheme() {
  const choice = state.settings.theme;
  const actual = choice === 'system' ? (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light') : choice;
  document.documentElement.dataset.theme = actual;
  document.querySelector('meta[name="theme-color"]').content = actual === 'dark' ? '#1f2924' : '#f3f2ec';
  $('#theme-toggle').setAttribute('aria-label', `${t('theme')}: ${choice === 'system' ? t('systemTheme') : t(`${choice}Theme`)}`);
}

function applyLanguage() {
  document.documentElement.lang = language() === 'zh' ? 'zh-CN' : 'en';
  document.querySelectorAll('[data-copy]').forEach(node => { node.textContent = t(node.dataset.copy); });
  $('#language-toggle').textContent = language() === 'zh' ? 'EN' : '中文';
  $('#language-toggle').setAttribute('aria-label', language() === 'zh' ? 'Switch to English' : '切换到中文');
  $('#display-settings').setAttribute('aria-label', language() === 'zh' ? '显示设置' : 'Display settings');
  $('#study-workspace').setAttribute('aria-label', language() === 'zh' ? '日语学习区' : 'Japanese study workspace');
  $('#deck-picker').setAttribute('aria-label', language() === 'zh' ? '选择词集' : 'Choose a deck');
  $('#rating-row').setAttribute('aria-label', language() === 'zh' ? '评估记忆情况' : 'Rate your recall');
  $('#cap-down').setAttribute('aria-label', language() === 'zh' ? '减少每日新卡上限' : 'Decrease daily new card limit');
  $('#cap-up').setAttribute('aria-label', language() === 'zh' ? '增加每日新卡上限' : 'Increase daily new card limit');
  $('#import-file').setAttribute('aria-label', language() === 'zh' ? '选择 Kotoba 备份文件' : 'Choose a Kotoba backup file');
  $('#new-cap').value = state.settings.newPerDay;
  $('#speech-toggle').checked = state.settings.speech !== false;
  const now = new Date();
  $('#today-label').textContent = language() === 'zh' ? `${now.getMonth()+1}月` : now.toLocaleString('en', { month:'short' });
  $('#today-number').textContent = String(now.getDate()).padStart(2,'0');
  $('#today-label').parentElement.setAttribute('aria-label', language() === 'zh' ? '今日学习' : 'Study today');
  $('#my-words-count').textContent = `${state.customCards.length} ${t('cards')}`;
  renderLibrary();
  applyTheme();
  if (sessionStarted) renderCard();
}

function activeSchedule(card) { return state.schedules[card.id] || freshSchedule(); }
function intervalPreview(card, rating) {
  try { return scheduleReview(activeSchedule(card), rating.quality, today()).intervalDays; } catch { return 1; }
}
function intervalText(days) {
  if (days === 1) return language() === 'zh' ? '1 天后' : '1 day';
  return language() === 'zh' ? `${days} 天后` : `${days} days`;
}

function buildCurrentQueue() {
  const date = today();
  if (state.daily.date !== date) state.daily = { date, newSeen: [] };
  const allowed = chosenCards();
  return buildQueue(allowed, state.schedules, { today: date, newLimit: state.settings.newPerDay, newSeen: state.daily.newSeen });
}

function updateDeckSummary() {
  $('#my-words-count').textContent = `${state.customCards.length} ${t('cards')}`;
  const items = buildCurrentQueue();
  const due = items.filter(item => item.kind === 'due').length;
  const fresh = items.filter(item => item.kind === 'new').length;
  $('#queue-count').textContent = t('reviewRemaining', { count: items.length, due, fresh });
  $('#start-session').disabled = items.length === 0;
  $('#start-session').querySelector('span:first-child').textContent = items.length === 0 ? t('first') : t('start');
  $('#session-label').textContent = items.length === 0 ? (chosenCards().length ? t('noWork') : t('noCards')) : t('ready');
  $('#ready-count').textContent = language() === 'zh' ? `${items.length} 张待练习` : `${items.length} ready`;
}

function startSession() {
  queue = buildCurrentQueue();
  queueIndex = 0; currentCard = null; revealed = false; ratingsThisSession = []; sessionStarted = true;
  $('#pre-session').hidden = true;
  $('#study-card').hidden = queue.length === 0;
  $('#session-complete').hidden = queue.length !== 0;
  $('#start-session').querySelector('span:first-child').textContent = t('startOver');
  if (!queue.length) {
    $('#pre-session').hidden = true;
    $('#completion-copy').textContent = t('sessionEmpty');
    $('#session-label').textContent = chosenCards().length ? t('noWork') : t('noCards');
    $('#progress-bar').style.transform = 'scaleX(1)';
  } else renderCard();
  (queue.length ? $('#study-card') : $('#session-complete')).scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'center' });
}

function renderCard() {
  if (!sessionStarted || !queue.length || queueIndex >= queue.length) return;
  currentCard = queue[queueIndex].card;
  const kind = queue[queueIndex].kind;
  const word = currentCard;
  $('#study-card').hidden = false;
  $('#pre-session').hidden = true;
  $('#session-complete').hidden = true;
  $('#card-kind').textContent = kind === 'due' ? t('dueWord') : t('newWord');
  $('#card-position').textContent = `${String(queueIndex+1).padStart(2,'0')} / ${String(queue.length).padStart(2,'0')}`;
  $('#card-front').textContent = word.jp;
  $('#card-kana').textContent = word.kana || word.jp;
  $('#card-meaning').textContent = language() === 'zh' ? (word.zh || word.en) : word.en;
  $('#card-example').textContent = word.example || '';
  $('#card-example-translation').textContent = language() === 'zh' ? (word.exampleZh || word.exampleEn || '') : (word.exampleEn || word.exampleZh || '');
  $('#card-answer').hidden = !revealed;
  $('#rating-row').hidden = !revealed;
  $('#reveal-button').hidden = revealed;
  $('#reveal-button').disabled = revealed;
  $('#card-status').textContent = revealed ? t('startAdvice') : t('pressSpace');
  $('#progress-bar').style.transform = `scaleX(${queueIndex / queue.length})`;
  $('#session-label').textContent = t('sessions');
  $('#queue-count').textContent = t('remaining', { count: queue.length - queueIndex });
  for (const rating of RATINGS) $(`#interval-${rating.id}`).textContent = intervalText(intervalPreview(word, rating));
  $('#speak-button').hidden = !('speechSynthesis' in window);
  $('#speak-button').setAttribute('aria-label', language() === 'zh' ? '播放日语发音' : 'Play Japanese pronunciation');
}

function revealAnswer() {
  if (!currentCard || revealed) return;
  revealed = true;
  renderCard();
  document.querySelector('[data-rating="again"]').focus();
  if (state.settings.speech) speakCurrent();
}

function speakCurrent() {
  if (!('speechSynthesis' in window) || !currentCard) { $('#data-status').textContent = t('speechUnavailable'); return; }
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(currentCard.kana || currentCard.jp);
  utterance.lang = 'ja-JP';
  window.speechSynthesis.speak(utterance);
}

function recordRating(id) {
  if (!currentCard || !revealed) return;
  const definition = RATINGS.find(item => item.id === id);
  if (!definition) return;
  const kind = queue[queueIndex].kind;
  const next = scheduleReview(activeSchedule(currentCard), definition.quality, today());
  state.schedules[currentCard.id] = next;
  state.history.push({ cardId: currentCard.id, rating: id, reviewedAt: new Date().toISOString(), intervalDays: next.intervalDays });
  if (state.history.length > 100000) state.history = state.history.slice(-100000);
  if (kind === 'new' && !state.daily.newSeen.includes(currentCard.id)) state.daily.newSeen.push(currentCard.id);
  ratingsThisSession.push(id);
  persist();
  queueIndex += 1;
  revealed = false;
  if (queueIndex >= queue.length) finishSession();
  else { renderCard(); $('#reveal-button').focus(); }
  updateDeckSummary();
}

function finishSession() {
  $('#study-card').hidden = true;
  $('#session-complete').hidden = false;
  $('#progress-bar').style.transform = 'scaleX(1)';
  const again = ratingsThisSession.filter(value => value === 'again').length;
  const remembered = ratingsThisSession.length - again;
  const n = ratingsThisSession.length;
  $('#completion-copy').textContent = t('completion', { count:n, word:n === 1 ? t('word') : t('words'), again, remembered });
  $('#session-label').textContent = t('setComplete');
  $('#queue-count').textContent = t('remaining', { count:0 });
  $('#another-session').focus();
}

function renderLibrary() {
  const root = $('#library-list');
  const cards = [...state.customCards].sort((a,b) => a.jp.localeCompare(b.jp, 'ja'));
  if (!cards.length) {
    root.innerHTML = `<p class="empty-library">${escapeHtml(t('emptyLibrary'))}</p>`;
    return;
  }
  root.innerHTML = cards.map(card => `<div class="library-row" data-card-id="${escapeAttr(card.id)}"><strong lang="ja">${escapeHtml(card.jp)}</strong><span lang="ja">${escapeHtml(card.kana || '—')}</span><span>${escapeHtml(language() === 'zh' ? card.zh || card.en : card.en)}</span><button type="button" data-remove="${escapeAttr(card.id)}">${escapeHtml(t('remove'))}</button></div>`).join('');
}

function escapeHtml(text) { return String(text).replace(/[&<>"']/g, char => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' })[char]); }
function escapeAttr(text) { return escapeHtml(text); }

function addCard(event) {
  event.preventDefault();
  const form = new FormData(event.currentTarget);
  const fields = Object.fromEntries(form.entries());
  const randomId = globalThis.crypto?.randomUUID?.().replaceAll('-','') || `${Date.now()}_${Math.random().toString(36).slice(2,8)}`;
  const card = { id: `custom_${randomId}`, jp: fields.jp.trim(), kana: fields.kana.trim(), en: fields.en.trim(), zh: fields.zh.trim(), example:'', exampleEn:'', exampleZh:'' };
  if (!validateCard(card)) { $('#data-status').textContent = t('invalidWord'); return; }
  state.customCards.push(card);
  event.currentTarget.reset();
  persist(); renderLibrary(); updateDeckSummary(); applyLanguage();
  $('#data-status').textContent = t('added');
  $('#library-title').scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block:'start' });
}

function removeCard(id) {
  if (!window.confirm(t('confirmRemove'))) return;
  state.customCards = state.customCards.filter(card => card.id !== id);
  delete state.schedules[id];
  state.daily.newSeen = state.daily.newSeen.filter(value => value !== id);
  state.history = state.history.filter(record => record.cardId !== id);
  if (currentCard?.id === id && activeDeck === 'mine') { sessionStarted = false; $('#study-card').hidden = true; }
  persist(); applyLanguage(); updateDeckSummary(); $('#data-status').textContent = t('removed');
}

function exportBackup() {
  const payload = { ...state, exportedAt: new Date().toISOString(), product: 'Kotoba Study' };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type:'application/json' });
  const url = URL.createObjectURL(blob);
  const link = Object.assign(document.createElement('a'), { href:url, download:`kotoba-backup-${today()}.json` });
  link.click(); setTimeout(() => URL.revokeObjectURL(url), 1000); $('#data-status').textContent = t('exported');
}

async function importBackup(file) {
  if (!file) return;
  if (file.size > 5 * 1024 * 1024) { $('#data-status').textContent = t('backupTooLarge'); return; }
  try {
    const incoming = validateState(JSON.parse(await file.text()));
    const ids = new Set(starterCards.map(card => card.id));
    for (const card of incoming.customCards) {
      if (ids.has(card.id)) throw new TypeError('Duplicate card id.');
      ids.add(card.id);
    }
    state = incoming;
    if (!['en','zh'].includes(state.settings.language)) state.settings.language = 'en';
    if (!['system','light','dark'].includes(state.settings.theme)) state.settings.theme = 'system';
    if (!Number.isInteger(state.settings.newPerDay) || state.settings.newPerDay < 0 || state.settings.newPerDay > 100) state.settings.newPerDay = 10;
    persist(); applyLanguage(); updateDeckSummary(); $('#data-status').textContent = t('imported');
  } catch {
    $('#data-status').textContent = t('invalidImport');
  } finally { $('#import-file').value = ''; }
}

function selectDeck(deck) {
  activeDeck = deck;
  document.querySelectorAll('.deck-choice').forEach(button => {
    const active = button.dataset.deck === deck;
    button.classList.toggle('is-active', active); button.setAttribute('aria-pressed', String(active));
  });
  sessionStarted = false; currentCard = null;
  $('#study-card').hidden = true; $('#session-complete').hidden = true;
  $('#pre-session').hidden = false;
  $('#session-label').textContent = chosenCards().length ? t('ready') : t('noCards');
  $('#queue-count').textContent = '—'; $('#progress-bar').style.transform = 'scaleX(0)';
  updateDeckSummary();
}

async function init() {
  try {
    const response = await fetch('./data/starter.json');
    if (!response.ok) throw new Error(`Starter deck failed: ${response.status}`);
    starterCards = await response.json();
    if (!Array.isArray(starterCards) || !starterCards.every(validateCard)) throw new TypeError('Starter deck is invalid.');
  } catch {
    starterCards = [];
    $('#data-status').textContent = language() === 'zh' ? '入门词集加载失败，请刷新页面。' : 'The starter deck could not load. Refresh this page to try again.';
  }
  document.documentElement.classList.add('js-enabled');
  state.settings.newPerDay = Number.isInteger(state.settings.newPerDay) ? Math.max(0, Math.min(100, state.settings.newPerDay)) : 10;
  state.settings.language = state.settings.language === 'zh' ? 'zh' : 'en';
  if (state.daily.date !== today()) state.daily = { date:today(), newSeen:[] };
  $('#storage-warning').hidden = persistent;
  $('#language-toggle').addEventListener('click', () => { state.settings.language = language() === 'en' ? 'zh' : 'en'; persist(); applyLanguage(); });
  $('#theme-toggle').addEventListener('click', () => {
    const actual = document.documentElement.dataset.theme;
    state.settings.theme = actual === 'light' ? 'dark' : 'light'; persist(); applyTheme();
  });
  document.querySelectorAll('.deck-choice').forEach(button => button.addEventListener('click', () => selectDeck(button.dataset.deck)));
  $('#start-session').addEventListener('click', startSession);
  $('#another-session').addEventListener('click', startSession);
  $('#reveal-button').addEventListener('click', revealAnswer);
  $('#speak-button').addEventListener('click', speakCurrent);
  $('#speech-toggle').addEventListener('change', event => { state.settings.speech = event.target.checked; persist(); });
  document.querySelectorAll('[data-rating]').forEach(button => button.addEventListener('click', () => recordRating(button.dataset.rating)));
  $('#add-card-form').addEventListener('submit', addCard);
  $('#new-cap').addEventListener('change', event => {
    const value = Number(event.target.value);
    if (!Number.isInteger(value) || value < 0 || value > 100) { event.target.value = state.settings.newPerDay; $('#data-status').textContent = t('limitRange'); return; }
    state.settings.newPerDay = value; persist(); updateDeckSummary();
  });
  $('#cap-down').addEventListener('click', () => setCap(state.settings.newPerDay - 1));
  $('#cap-up').addEventListener('click', () => setCap(state.settings.newPerDay + 1));
  $('#export-button').addEventListener('click', exportBackup);
  $('#import-file').addEventListener('change', event => importBackup(event.target.files?.[0]));
  $('#library-list').addEventListener('click', event => { const button = event.target.closest('[data-remove]'); if (button) removeCard(button.dataset.remove); });
  document.addEventListener('keydown', event => {
    if (event.altKey || event.ctrlKey || event.metaKey || /INPUT|TEXTAREA|SELECT/.test(event.target.tagName)) return;
    if (event.code === 'Space' && currentCard && !revealed) { event.preventDefault(); revealAnswer(); }
    if (revealed && /^[1-4]$/.test(event.key)) recordRating(RATINGS[Number(event.key)-1].id);
  });
  matchMedia('(prefers-color-scheme: dark)').addEventListener?.('change', () => { if (state.settings.theme === 'system') applyTheme(); });
  applyLanguage(); updateDeckSummary(); $('#study-card').hidden = true;
}

function setCap(value) {
  const next = Math.max(0, Math.min(100, value));
  state.settings.newPerDay = next; $('#new-cap').value = next; persist(); updateDeckSummary();
}

init();
