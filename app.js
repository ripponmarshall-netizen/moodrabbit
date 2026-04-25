const APP_VERSION = "1.0.1";
const STORAGE_KEY = "moodrabbit:v1";

const app = document.querySelector("#app");
const root = document.documentElement;
const backdrop = document.querySelector("#sheetBackdrop");
const toastRegion = document.querySelector("#toastRegion");
const habitSheet = document.querySelector("#habitSheet");
const moodSheet = document.querySelector("#moodSheet");
const settingsSheet = document.querySelector("#settingsSheet");
const habitForm = document.querySelector("#habitForm");
const moodForm = document.querySelector("#moodForm");
const moodEnergy = document.querySelector("#moodEnergy");
const moodEnergyValue = document.querySelector("#moodEnergyValue");
const tabButtons = document.querySelectorAll(".tab");
const themeMeta = document.querySelector("meta[name='theme-color']");
const removeSampleDataButton = document.querySelector("#removeSampleData");
const exportBackupButton = document.querySelector("#exportBackup");
const importBackupButton = document.querySelector("#importBackupButton");
const importBackupFile = document.querySelector("#importBackupFile");

const today = new Date();
const pages = ["today", "habits", "mood", "patterns"];
let activePage = pages.includes(window.location.hash.slice(1)) ? window.location.hash.slice(1) : "today";
let editingHabitId = null;

const icons = {
  plus: `<svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>`,
  gear: `<svg viewBox="0 0 24 24"><path d="M12 8.25a3.75 3.75 0 1 0 0 7.5 3.75 3.75 0 0 0 0-7.5Z"/><path d="M19.3 13.8a7.9 7.9 0 0 0 .05-1.8l2-1.55-2-3.45-2.5 1a8.35 8.35 0 0 0-1.55-.9L14.9 4h-4l-.4 3.1c-.55.24-1.07.54-1.55.9l-2.5-1-2 3.45 2 1.55a7.9 7.9 0 0 0 .05 1.8l-2 1.55 2 3.45 2.5-1c.48.36 1 .66 1.55.9l.4 3.1h4l.4-3.1c.55-.24 1.07-.54 1.55-.9l2.5 1 2-3.45-2.1-1.55Z"/></svg>`,
  moon: `<svg viewBox="0 0 24 24"><path d="M20 15.2A7.7 7.7 0 0 1 8.8 4a8.3 8.3 0 1 0 11.2 11.2Z"/></svg>`,
  sun: `<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3.5"/><path d="M12 3.5v2M12 18.5v2M4.8 4.8l1.4 1.4M17.8 17.8l1.4 1.4M3.5 12h2M18.5 12h2M4.8 19.2l1.4-1.4M17.8 6.2l1.4-1.4"/></svg>`,
  check: `<svg viewBox="0 0 24 24"><path d="m5 12.5 4.2 4.2L19 7"/></svg>`,
  heart: `<svg viewBox="0 0 24 24"><path d="M12 20s-7-4.35-7-10a4 4 0 0 1 7-2.65A4 4 0 0 1 19 10c0 5.65-7 10-7 10Z"/></svg>`,
  leaf: `<svg viewBox="0 0 24 24"><path d="M5 14c5.7 0 10-3.7 12.5-9.5C20 11.8 17.2 19 9.8 19 7 19 5 17 5 14Z"/><path d="M5 19c2.4-3.7 5.6-6 9.8-7"/></svg>`,
  note: `<svg viewBox="0 0 24 24"><path d="M6.5 4.5h9l3 3v12h-12z"/><path d="M15.5 4.5v4h4M9 12h6M9 15.5h5"/></svg>`,
  bell: `<svg viewBox="0 0 24 24"><path d="M6 9a6 6 0 1 1 12 0c0 6 2 7.5 2 7.5H4S6 15 6 9"/><path d="M10 19a2 2 0 0 0 4 0"/></svg>`,
  water: `<svg viewBox="0 0 24 24"><path d="M12 3.5S6.5 10 6.5 14.2a5.5 5.5 0 0 0 11 0C17.5 10 12 3.5 12 3.5Z"/><path d="M9.4 14.5c.4 1.4 1.3 2.1 2.7 2.1"/></svg>`,
  sleep: `<svg viewBox="0 0 24 24"><path d="M18.5 15.5A7.5 7.5 0 0 1 8.6 5.6a8 8 0 1 0 9.9 9.9Z"/><path d="M14.5 5h4l-4 4h4"/></svg>`,
  workout: `<svg viewBox="0 0 24 24"><path d="M6.5 8v8M17.5 8v8M4 10v4M20 10v4M8 12h8"/></svg>`,
  reading: `<svg viewBox="0 0 24 24"><path d="M5 5.5h5.5A2.5 2.5 0 0 1 13 8v11a3.5 3.5 0 0 0-3-1.5H5z"/><path d="M19 5.5h-5.5A2.5 2.5 0 0 0 11 8v11a3.5 3.5 0 0 1 3-1.5H19z"/></svg>`,
  meditation: `<svg viewBox="0 0 24 24"><circle cx="12" cy="6" r="2.2"/><path d="M8 13.5c1.5-1 2.8-1.5 4-1.5s2.5.5 4 1.5"/><path d="M6 18c2.2-2 4.2-3 6-3s3.8 1 6 3"/><path d="M8.5 20.5h7"/></svg>`,
  vitamins: `<svg viewBox="0 0 24 24"><path d="M7.6 16.4 16.4 7.6a3 3 0 1 1 4.2 4.2l-8.8 8.8a3 3 0 1 1-4.2-4.2Z"/><path d="m12 12 4 4"/></svg>`,
  coding: `<svg viewBox="0 0 24 24"><path d="m8.5 8-4 4 4 4M15.5 8l4 4-4 4M13 5.5l-2 13"/></svg>`,
  journaling: `<svg viewBox="0 0 24 24"><path d="M7 4.5h9.5A1.5 1.5 0 0 1 18 6v13.5H7A2 2 0 0 1 5 17.5v-11a2 2 0 0 1 2-2Z"/><path d="M8 8h6M8 11.5h7M8 15h4"/></svg>`,
  stretching: `<svg viewBox="0 0 24 24"><circle cx="12" cy="5.5" r="2"/><path d="M12 8v5.5M8 11.5h8M9 20l3-6.5 3 6.5"/></svg>`,
  walking: `<svg viewBox="0 0 24 24"><circle cx="13" cy="5" r="2"/><path d="M12 8.5 9.5 13H14l-1.5 7"/><path d="M9.5 13 6 20M14 13l4 3"/></svg>`,
  happy: `<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="8"/><path d="M8.5 10h.01M15.5 10h.01M8.7 14c.8 1.4 1.9 2.1 3.3 2.1s2.5-.7 3.3-2.1"/></svg>`,
  calm: `<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="8"/><path d="M8.5 10.5h.01M15.5 10.5h.01M8 14c1.4.9 2.7 1.3 4 1.3s2.6-.4 4-1.3"/></svg>`,
  focused: `<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="3"/><path d="M12 4v3M12 17v3M4 12h3M17 12h3"/></svg>`,
  tired: `<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="8"/><path d="M8.5 10.5h2M13.5 10.5h2M9 15h6"/></svg>`,
  stressed: `<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="8"/><path d="m8 9 2 1.5L8 12M16 9l-2 1.5 2 1.5M9 16c1.7-.8 3.3-.8 5 0"/></svg>`,
  low: `<svg viewBox="0 0 24 24"><path d="M7 15.5h10a4 4 0 0 0-.8-7.9 5.6 5.6 0 0 0-10.5 2A3.1 3.1 0 0 0 7 15.5Z"/><path d="M9 19h6"/></svg>`,
  motivated: `<svg viewBox="0 0 24 24"><path d="M5 14c4.5 0 7-2.5 7-7 0 4.5 2.5 7 7 7-4.5 0-7 2.5-7 7 0-4.5-2.5-7-7-7Z"/><path d="M5 6h4M15 6h4"/></svg>`,
  anxious: `<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="8"/><path d="M8.5 10h.01M15.5 10h.01M9 15c1.8-1 4.2-1 6 0"/><path d="M4 4.5 2.5 7M20 4.5 21.5 7"/></svg>`,
  energized: `<svg viewBox="0 0 24 24"><path d="M13 2 6 13h5l-1 9 8-13h-5l1-7Z"/></svg>`,
  grateful: `<svg viewBox="0 0 24 24"><path d="M12 20s-6.5-4.15-6.5-9.6A3.7 3.7 0 0 1 12 8a3.7 3.7 0 0 1 6.5 2.4C18.5 15.85 12 20 12 20Z"/><path d="M8.5 5.5h.01M15.5 5.5h.01"/></svg>`,
  peaceful: `<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="8"/><path d="M8 11c1.3-.8 2.7-.8 4 0s2.7.8 4 0M8 14.5c1.3.8 2.7.8 4 0s2.7-.8 4 0"/></svg>`,
  hopeful: `<svg viewBox="0 0 24 24"><path d="M5 16.5c2.2-4.5 4.5-6.8 7-6.8s4.8 2.3 7 6.8"/><path d="M12 4.5v2.5M7 7l1.7 1.7M17 7l-1.7 1.7"/><path d="M9 16.5h6"/></svg>`,
  proud: `<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="8"/><path d="M8.5 10h.01M15.5 10h.01M8.5 14.5c1.1 1.3 2.3 2 3.5 2s2.4-.7 3.5-2"/><path d="M9 6.5h6"/></svg>`,
  content: `<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="8"/><path d="M8.5 10.5h.01M15.5 10.5h.01M9 14.5h6"/></svg>`,
  bored: `<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="8"/><path d="M8.5 10h2M13.5 10h2M8.5 15h7"/></svg>`,
  overwhelmed: `<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="8"/><path d="m8 9 2 2-2 2M16 9l-2 2 2 2M8.5 16c2-1 5-1 7 0"/><path d="M4 12H2.5M21.5 12H20"/></svg>`,
  frustrated: `<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="8"/><path d="m8 9 3 1M16 9l-3 1M9 16h6"/><path d="M7 5.5 5.5 4M17 5.5 18.5 4"/></svg>`,
  lonely: `<svg viewBox="0 0 24 24"><path d="M8 15.5a4 4 0 1 1 8 0v2H8z"/><circle cx="12" cy="8" r="2.5"/><path d="M4.5 19.5h15"/></svg>`,
  excited: `<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="8"/><path d="M8.5 10h.01M15.5 10h.01M8 14c1 2 2.3 3 4 3s3-1 4-3"/><path d="M4.5 5.5 3 4M19.5 5.5 21 4"/></svg>`,
  irritable: `<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="8"/><path d="M8 9.5h3M13 9.5h3M9 15.5c2-.8 4-.8 6 0"/><path d="M5.5 7.5 4 6M18.5 7.5 20 6"/></svg>`
};

const habitPalette = {
  water: "#2f736b",
  sleep: "#5d7580",
  workout: "#916f49",
  reading: "#6d7650",
  meditation: "#497b56",
  vitamins: "#8b6d37",
  coding: "#4e776f",
  journaling: "#786f63",
  stretching: "#85695b",
  walking: "#6f7c53"
};

const moods = [
  { id: "calm", label: "Calm", score: 8 },
  { id: "happy", label: "Happy", score: 9 },
  { id: "focused", label: "Focused", score: 8 },
  { id: "tired", label: "Tired", score: 5 },
  { id: "stressed", label: "Stressed", score: 4 },
  { id: "low", label: "Low", score: 3 },
  { id: "motivated", label: "Motivated", score: 9 },
  { id: "anxious", label: "Anxious", score: 4 },
  { id: "energized", label: "Energized", score: 9 },
  { id: "grateful", label: "Grateful", score: 9 },
  { id: "peaceful", label: "Peaceful", score: 8 },
  { id: "hopeful", label: "Hopeful", score: 8 },
  { id: "proud", label: "Proud", score: 9 },
  { id: "content", label: "Content", score: 8 },
  { id: "bored", label: "Bored", score: 5 },
  { id: "overwhelmed", label: "Overwhelmed", score: 3 },
  { id: "frustrated", label: "Frustrated", score: 3 },
  { id: "lonely", label: "Lonely", score: 3 },
  { id: "excited", label: "Excited", score: 9 },
  { id: "irritable", label: "Irritable", score: 4 }
];

const starterState = {
  theme: "light",
  selectedMood: "calm",
  energy: 7,
  habits: [
    { id: 1, name: "Morning walk", category: "Body", icon: "walking", frequency: "Daily", streak: 12, status: "done", due: "7:00 AM", last: "Today" },
    { id: 2, name: "Water balance", category: "Care", icon: "water", frequency: "Daily", streak: 8, status: "due", due: "All day", last: "2 of 6 logged" },
    { id: 3, name: "Sleep wind-down", category: "Rest", icon: "sleep", frequency: "Daily", streak: 3, status: "missed", due: "10:30 PM", last: "Missed yesterday" },
    { id: 4, name: "Reading", category: "Mind", icon: "reading", frequency: "3x weekly", streak: 5, status: "due-later", due: "Evening", last: "Due later" },
    { id: 5, name: "Vitamins", category: "Care", icon: "vitamins", frequency: "Daily", streak: 15, status: "done", due: "8:30 AM", last: "Today" }
  ],
  entries: [
    { id: 101, type: "habit", icon: "walking", title: "Morning walk completed", meta: "Body - 12 day streak", time: "7:21 AM" },
    { id: 102, type: "mood", icon: "calm", title: "Mood logged as calm", meta: "Energy 7/10 - clear start", time: "8:05 AM" },
    { id: 103, type: "habit", icon: "journaling", title: "Journaled before bed", meta: "Mind - reflection note", time: "Yesterday" },
    { id: 104, type: "habit", icon: "sleep", title: "Sleep wind-down missed", meta: "Rest - 3 misses this week", time: "Yesterday" }
  ],
  moodLogs: [
    { mood: "calm", energy: 7, date: "Today", note: "Clear start after walking." },
    { mood: "focused", energy: 8, date: "Yesterday", note: "Good work block after lunch." },
    { mood: "tired", energy: 5, date: "Tue", note: "Late bedtime." },
    { mood: "happy", energy: 8, date: "Mon", note: "Finished reading." }
  ]
};

const starterHabitIds = new Set(starterState.habits.map((habit) => habit.id));
const starterEntryIds = new Set(starterState.entries.map((entry) => entry.id));
const starterMoodCount = starterState.moodLogs.length;
const timestampIdFloor = 1000000000000;

let state = loadState();

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return saved ? { ...starterState, ...saved } : structuredClone(starterState);
  } catch {
    return structuredClone(starterState);
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function mergeById(currentItems, importedItems, type) {
  const currentIds = new Set(currentItems.map((item) => String(item.id)));
  const normalized = importedItems
    .filter((item) => item && item.id !== undefined && item.id !== null)
    .map((item) => normalizeImportedRecord(item, type))
    .filter((item) => !currentIds.has(String(item.id)));

  return [...currentItems, ...normalized];
}

function normalizeImportedRecord(record, type) {
  const normalized = { ...record };
  const starterIds = type === "habit" ? starterHabitIds : starterEntryIds;
  const looksUserCreated = normalized.source === "user"
    || Boolean(normalized.createdAt)
    || isTimestampLikeId(normalized.id)
    || !starterIds.has(normalized.id);

  if (looksUserCreated && !normalized.source) {
    normalized.source = "user";
  }

  return normalized;
}

function moodLogKey(log) {
  if (log.id !== undefined && log.id !== null) return `id:${log.id}`;
  if (log.createdAt) return `created:${log.createdAt}`;
  return `log:${log.mood || ""}|${log.energy || ""}|${log.date || ""}|${log.note || ""}`;
}

function normalizeImportedMoodLog(log) {
  const normalized = { ...log };
  const looksUserCreated = normalized.source === "user" || Boolean(normalized.createdAt) || isTimestampLikeId(normalized.id);

  if (looksUserCreated && !normalized.source) {
    normalized.source = "user";
  }

  return normalized;
}

function mergeMoodLogs(currentLogs, importedLogs) {
  const currentKeys = new Set(currentLogs.map(moodLogKey));
  const normalized = importedLogs
    .filter((log) => log && typeof log === "object")
    .map(normalizeImportedMoodLog)
    .filter((log) => !currentKeys.has(moodLogKey(log)));

  return [...currentLogs, ...normalized];
}

function createBackupPayload() {
  return {
    app: "MoodRabbit",
    version: APP_VERSION,
    exportedAt: new Date().toISOString(),
    storageKey: STORAGE_KEY,
    state
  };
}

function exportBackup() {
  const payload = JSON.stringify(createBackupPayload(), null, 2);
  const blob = new Blob([payload], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  const dateStamp = new Date().toISOString().slice(0, 10);

  anchor.href = url;
  anchor.download = `moodrabbit-backup-${dateStamp}.json`;
  document.body.append(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
  showToast("Backup exported");
}

function parseBackup(text) {
  const parsed = JSON.parse(text);
  const importedState = parsed?.state || parsed;

  if (!importedState || typeof importedState !== "object") {
    throw new Error("Backup is missing app state.");
  }

  return {
    theme: importedState.theme,
    selectedMood: importedState.selectedMood,
    energy: importedState.energy,
    habits: Array.isArray(importedState.habits) ? importedState.habits : [],
    entries: Array.isArray(importedState.entries) ? importedState.entries : [],
    moodLogs: Array.isArray(importedState.moodLogs) ? importedState.moodLogs : []
  };
}

function mergeImportedState(importedState) {
  let added = 0;
  const nextHabits = mergeById(state.habits, importedState.habits, "habit");
  const nextEntries = mergeById(state.entries, importedState.entries, "entry");
  const nextMoodLogs = mergeMoodLogs(state.moodLogs, importedState.moodLogs);

  added += nextHabits.length - state.habits.length;
  added += nextEntries.length - state.entries.length;
  added += nextMoodLogs.length - state.moodLogs.length;

  state = {
    ...state,
    habits: nextHabits,
    entries: nextEntries,
    moodLogs: nextMoodLogs
  };

  if (importedState.theme === "light" || importedState.theme === "dark") {
    state.theme = importedState.theme;
  }

  if (moods.some((mood) => mood.id === importedState.selectedMood)) {
    state.selectedMood = importedState.selectedMood;
  }

  if (Number.isFinite(Number(importedState.energy))) {
    state.energy = Math.min(10, Math.max(1, Number(importedState.energy)));
  }

  return added;
}

function importBackupFileContents(file) {
  if (!file) return;

  const reader = new FileReader();
  reader.addEventListener("load", () => {
    try {
      const importedState = parseBackup(String(reader.result || ""));
      const added = mergeImportedState(importedState);
      saveState();
      closeSheets();
      renderApp();
      showToast(added ? `Imported ${added} records` : "Backup already imported");
    } catch {
      showToast("Could not import backup");
    } finally {
      importBackupFile.value = "";
    }
  });
  reader.addEventListener("error", () => {
    showToast("Could not read backup");
    importBackupFile.value = "";
  });
  reader.readAsText(file);
}

function removeSampleData() {
  const confirmed = window.confirm("Remove starter sample data from this device? Your own habits, moods, and entries will be kept.");
  if (!confirmed) return;

  state = {
    ...state,
    habits: state.habits.filter(isUserHabit),
    entries: getUserEntries(),
    moodLogs: getUserMoodLogs()
  };
  saveState();
  closeSheets();
  renderApp();
  showToast("Sample data removed");
}

function isTimestampLikeId(id) {
  return Number(id) >= timestampIdFloor;
}

function isUserHabit(habit) {
  return habit?.source === "user" || Boolean(habit?.createdAt) || isTimestampLikeId(habit?.id) || !starterHabitIds.has(habit?.id);
}

function getUserEntries() {
  const extraEntryCount = Math.max(0, state.entries.length - starterState.entries.length);
  return state.entries.filter((entry, index) => {
    return entry?.source === "user"
      || Boolean(entry?.createdAt)
      || isTimestampLikeId(entry?.id)
      || !starterEntryIds.has(entry?.id)
      || index < extraEntryCount;
  });
}

function getUserMoodLogs() {
  const extraMoodCount = Math.max(0, state.moodLogs.length - starterMoodCount);
  return state.moodLogs.filter((log, index) => {
    return log?.source === "user" || Boolean(log?.createdAt) || index < extraMoodCount;
  });
}

function getMoodLogKey(log) {
  return log?.createdAt || String(log?.id || `${log?.mood || ""}-${log?.date || ""}-${log?.note || ""}`);
}

function getHabitById(id) {
  return state.habits.find((habit) => String(habit.id) === String(id));
}

function getMoodLabel(id) {
  return moods.find((mood) => mood.id === id)?.label || "Mood";
}

function getMoodScore(id) {
  return moods.find((mood) => mood.id === id)?.score || 0;
}

function icon(name) {
  return icons[name] || icons.leaf;
}

function formatDateContext(date) {
  return new Intl.DateTimeFormat("en", { weekday: "long", month: "long", day: "numeric" }).format(date);
}

function monthName(date = today) {
  return new Intl.DateTimeFormat("en", { month: "long" }).format(date);
}

function statusClass(status) {
  if (status === "done") return "is-done";
  if (status === "missed") return "is-missed";
  return "";
}

function statusPill(status) {
  const labels = {
    done: ["Done today", "is-success"],
    missed: ["Missed", "is-danger"],
    due: ["Due today", "is-warning"],
    "due-later": ["Due later", ""]
  };
  const [label, klass] = labels[status] || ["Open", ""];
  return `<span class="state-pill ${klass}">${label}</span>`;
}

function renderBadge(name, label = "", accent = "var(--brand)") {
  return `<span class="icon-badge" style="--accent: ${accent}" aria-label="${label}">${icon(name)}</span>`;
}

function renderTopbar(page = activePage) {
  const pageMeta = {
    today: {
      title: "MoodRabbit Tracker",
      copy: "Track habits, log moods, and notice the quiet patterns that shape your day.",
      icon: "leaf"
    },
    habits: {
      title: "Habit streaks",
      copy: "See what is due, what is done, and which routines need a little care.",
      icon: "walking"
    },
    mood: {
      title: "Mood check-in",
      copy: "Log today’s emotion and energy with calm, consistent visual notes.",
      icon: "calm"
    },
    patterns: {
      title: "Patterns",
      copy: "Review weekly consistency and the wellbeing signals worth noticing.",
      icon: "focused"
    }
  }[page] || {
    title: "MoodRabbit Tracker",
    copy: "Track habits, log moods, and notice the quiet patterns that shape your day.",
    icon: "leaf"
  };

  return `
    <header class="topbar" id="today">
      <div class="brand-line">
        <div class="brandmark" aria-hidden="true">${icon(pageMeta.icon)}</div>
        <div>
          <p class="kicker">${monthName()} - ${formatDateContext(today)}</p>
          <h1>${pageMeta.title}</h1>
          <p class="hero-copy">${pageMeta.copy}</p>
        </div>
      </div>
    </header>
  `;
}

function renderQuickActions() {
  const themeIcon = state.theme === "dark" ? icon("sun") : icon("moon");
  return `
    <section class="quick-actions" aria-label="Quick actions">
      <button class="primary-action" data-open-habit type="button">${icon("plus")} Add habit</button>
      <button class="secondary-action" data-open-mood type="button">${icon("heart")} Log mood</button>
      <button class="secondary-action" data-open-settings type="button">${icon("gear")} Settings</button>
      <button class="secondary-action" data-toggle-theme type="button">${themeIcon} Theme</button>
    </section>
  `;
}

function renderPageAction(type) {
  const actions = {
    habit: {
      label: "Add habit",
      action: "data-open-habit",
      iconName: "plus"
    },
    mood: {
      label: "Log mood",
      action: "data-open-mood",
      iconName: "heart"
    }
  };
  const pageAction = actions[type] || actions.mood;

  return `
    <section class="page-action-row" aria-label="Page action">
      <button class="primary-action page-action" ${pageAction.action} type="button">${icon(pageAction.iconName)} ${pageAction.label}</button>
    </section>
  `;
}

function renderKpis() {
  const due = state.habits.filter((habit) => habit.status !== "done").length;
  const done = state.habits.filter((habit) => habit.status === "done").length;
  const bestStreak = state.habits.length ? Math.max(...state.habits.map((habit) => habit.streak || 0)) : 0;
  const energyAverage = state.moodLogs.length
    ? `${Math.round(state.moodLogs.reduce((sum, log) => sum + Number(log.energy || 0), 0) / state.moodLogs.length)}/10`
    : "--";
  const cards = [
    ["Habits due today", due, "open routines"],
    ["Completed today", done, `${state.habits.length} tracked`],
    ["Current streak", `${bestStreak}d`, "best active habit"],
    ["Weekly consistency", "82%", "steady week"],
    ["Mood trend", "Steady", "last 4 logs"],
    ["Energy average", energyAverage, "this week"]
  ];

  return `
    <section class="kpi-grid" aria-label="Wellbeing summary">
      ${cards.map(([label, value, meta]) => `
        <article class="kpi-card">
          <p class="mini-label">${label}</p>
          <div>
            <strong>${value}</strong>
            <span>${meta}</span>
          </div>
        </article>
      `).join("")}
    </section>
  `;
}

function renderAttention() {
  const missedHabits = state.habits.filter((habit) => habit.status === "missed");
  const dueHabits = state.habits.filter((habit) => habit.status === "due" || habit.status === "due-later");
  const lowMood = getUserMoodLogs().find((log) => Number(log.energy || 0) <= 4 || ["low", "stressed", "anxious"].includes(log.mood));
  const items = [
    ...missedHabits.slice(0, 1).map((habit) => ({
      icon: habit.icon,
      title: `${habit.name} needs attention`,
      meta: `${habit.category} routine was marked missed.`,
      tone: "is-danger",
      accent: habitPalette[habit.icon] || "var(--brand)"
    })),
    ...dueHabits.slice(0, 1).map((habit) => ({
      icon: habit.icon,
      title: `${habit.name} is still open`,
      meta: `${habit.frequency} target due ${String(habit.due || "today").toLowerCase()}.`,
      tone: "is-warning",
      accent: habitPalette[habit.icon] || "var(--brand)"
    })),
    ...(lowMood ? [{
      icon: lowMood.mood || "low",
      title: "Low mood signal",
      meta: `${getMoodLabel(lowMood.mood)} with ${lowMood.energy}/10 energy.`,
      tone: "is-warning",
      accent: "#9a7464"
    }] : [])
  ];

  return `
    <section class="section-block">
      <div class="section-heading">
        <div>
          <h2>Needs attention</h2>
          <p>Gentle nudges for routines and mood patterns.</p>
        </div>
        <span class="mini-label">${items.length} items</span>
      </div>
      <div class="attention-grid">
        ${items.length ? items.map((item) => `
          <article class="attention-card">
            ${renderBadge(item.icon, item.title, item.accent)}
            <div>
              <strong>${item.title}</strong>
              <p>${item.meta}</p>
            </div>
            <span class="state-pill ${item.tone}">Review</span>
          </article>
        `).join("") : `
          <article class="attention-card">
            ${renderBadge("check", "Clear", "var(--brand)")}
            <div>
              <strong>Nothing needs attention</strong>
              <p>Add a habit or log a mood to start tracking your day.</p>
            </div>
            <span class="state-pill is-success">Clear</span>
          </article>
        `}
      </div>
    </section>
  `;
}

function renderHabitCard(habit) {
  const accent = habitPalette[habit.icon] || "var(--brand)";
  const action = habit.status === "done"
    ? `<button class="secondary-action icon-action" data-undo-habit="${habit.id}" type="button" aria-label="Move ${habit.name} back to due">${icon("check")}</button>`
    : `<button class="mark-button icon-action" data-complete-habit="${habit.id}" type="button" aria-label="Complete ${habit.name}">${icon("check")}</button>`;

  return `
    <article class="habit-card ${statusClass(habit.status)}" style="--accent: ${accent}">
      <div class="habit-card-top">
        <div class="habit-title">
          ${renderBadge(habit.icon, habit.name, accent)}
          <div>
            <h3>${habit.name}</h3>
            <p class="habit-category">${habit.category}</p>
          </div>
        </div>
        ${statusPill(habit.status)}
      </div>
      <p class="habit-streak">${habit.streak} day streak</p>
      <div class="habit-meta">
        <div>
          <span>Target</span>
          <strong>${habit.frequency}</strong>
        </div>
        <div>
          <span>Due</span>
          <strong>${habit.due}</strong>
        </div>
        <div>
          <span>Last note</span>
          <strong>${habit.last}</strong>
        </div>
      </div>
      <div class="habit-card-bottom">
        <p class="mini-label">Habit streaks</p>
        <div class="habit-card-actions">
          <button class="secondary-action" data-edit-habit="${habit.id}" type="button">${icon("gear")} Edit</button>
          <button class="secondary-action danger-action" data-delete-habit="${habit.id}" type="button">Delete</button>
          ${action}
        </div>
      </div>
    </article>
  `;
}

function renderHabits() {
  return `
    <section class="section-block" id="habits">
      <div class="section-heading">
        <div>
          <h2>Today's habits</h2>
          <p>Clean cards for the routines that matter today.</p>
        </div>
        <span class="mini-label">${state.habits.length} active</span>
      </div>
      <div class="habit-stack">
        ${state.habits.length ? state.habits.map(renderHabitCard).join("") : `
          <article class="insight-card">
            <div class="habit-title">
              ${renderBadge("plus", "Add a habit", "var(--brand)")}
              <div>
                <h3>No habits yet</h3>
                <p>Add your first routine to start building streaks.</p>
              </div>
            </div>
          </article>
        `}
      </div>
    </section>
  `;
}

function renderMoodPicker(selected = state.selectedMood) {
  return moods.map((mood) => `
    <button class="mood-option ${selected === mood.id ? "is-selected" : ""}" data-select-mood="${mood.id}" type="button">
      ${renderBadge(mood.id, mood.label, "var(--brand)")}
      <span>${mood.label}</span>
    </button>
  `).join("");
}

function renderMoodSection() {
  const selected = moods.find((mood) => mood.id === state.selectedMood) || moods[0];
  return `
    <section class="section-block" id="mood">
      <div class="section-heading">
        <div>
          <h2>Mood check-in</h2>
          <p>Choose an emotion icon, add energy, and keep the record light.</p>
        </div>
        <span class="state-pill is-success">${selected.label}</span>
      </div>
      <article class="mood-panel">
        <div class="mood-panel-head">
          <div>
            <p class="mini-label">Today</p>
            <h3>${selected.label} with ${state.energy}/10 energy</h3>
          </div>
          ${renderBadge(selected.id, selected.label, "var(--brand)")}
        </div>
        <div class="mood-picker" id="dashboardMoodPicker">
          ${renderMoodPicker()}
        </div>
        <div class="mood-lock-row">
          <button class="primary-action mood-lock-action" data-lock-mood type="button">${icon("check")} Log ${selected.label}</button>
        </div>
        <div class="energy-row">
          <div class="section-heading">
            <p class="mini-label">Energy average</p>
            <p>${state.energy}/10 today</p>
          </div>
          <div class="energy-meter" aria-label="Energy ${state.energy} out of 10" style="--energy: ${state.energy * 10}%"><span></span></div>
        </div>
      </article>
    </section>
  `;
}

function renderMoodHistory() {
  const userMoodLogs = getUserMoodLogs();

  return `
    <section class="section-block">
      <div class="section-heading">
        <div>
          <h2>Mood history</h2>
          <p>User-created mood logs you can keep or remove.</p>
        </div>
        <span class="mini-label">${userMoodLogs.length} logs</span>
      </div>
      <div class="entry-list">
        ${userMoodLogs.length ? userMoodLogs.slice(0, 8).map((log) => {
          const moodLabel = getMoodLabel(log.mood);
          return `
            <article class="entry-row">
              ${renderBadge(log.mood || "calm", moodLabel, "var(--brand)")}
              <div>
                <strong>${moodLabel}</strong>
                <p>Energy ${log.energy}/10 - ${log.note || "Mood check-in"}</p>
              </div>
              <button class="icon-button inline-delete" data-delete-mood-log="${encodeURIComponent(getMoodLogKey(log))}" type="button" aria-label="Delete ${moodLabel} mood log">×</button>
            </article>
          `;
        }).join("") : `
          <article class="insight-card">
            <div class="habit-title">
              ${renderBadge("heart", "No mood logs", "var(--brand)")}
              <div>
                <h3>No user mood logs yet</h3>
                <p>Select a mood and tap the check button to create one.</p>
              </div>
            </div>
          </article>
        `}
      </div>
    </section>
  `;
}

function renderMoodTrendChart() {
  const userMoodLogs = getUserMoodLogs();
  if (!userMoodLogs.length) return "";

  const chartLogs = userMoodLogs.slice(0, 7).reverse();
  const width = 260;
  const height = 104;
  const xStart = 16;
  const yStart = 18;
  const chartWidth = width - 32;
  const chartHeight = height - 38;
  const points = chartLogs.map((log, index) => {
    const energy = Math.min(10, Math.max(1, Number(log.energy || 1)));
    const x = chartLogs.length === 1 ? width / 2 : xStart + (index * chartWidth) / (chartLogs.length - 1);
    const y = yStart + chartHeight - ((energy - 1) / 9) * chartHeight;
    return { x, y, energy, mood: getMoodLabel(log.mood) };
  });
  const path = points.map((point, index) => `${index ? "L" : "M"} ${point.x.toFixed(1)} ${point.y.toFixed(1)}`).join(" ");
  const latest = userMoodLogs[0];
  const averageEnergy = Math.round(userMoodLogs.reduce((sum, log) => sum + Number(log.energy || 0), 0) / userMoodLogs.length);
  const summary = userMoodLogs.length > 1
    ? `${averageEnergy}/10 average energy across ${userMoodLogs.length} user mood logs.`
    : "Add another mood log to see a trend line.";

  return `
    <section class="section-block">
      <div class="section-heading">
        <div>
          <h2>Mood trend</h2>
          <p>A small chart based only on moods you logged.</p>
        </div>
        <span class="state-pill is-success">${getMoodLabel(latest.mood)}</span>
      </div>
      <article class="chart-card">
        <div class="chart-summary">
          ${renderBadge(latest.mood || "calm", getMoodLabel(latest.mood), "var(--brand)")}
          <div>
            <strong>${summary}</strong>
            <p>Latest check-in: ${getMoodLabel(latest.mood)} with ${latest.energy}/10 energy.</p>
          </div>
        </div>
        <svg class="mood-trend-chart" viewBox="0 0 ${width} ${height}" role="img" aria-label="Mood energy trend chart">
          <path class="chart-grid-line" d="M 14 20 H 246M 14 52 H 246M 14 84 H 246"/>
          ${points.length > 1 ? `<path class="chart-line" d="${path}"/>` : ""}
          ${points.map((point) => `
            <circle class="chart-dot" cx="${point.x.toFixed(1)}" cy="${point.y.toFixed(1)}" r="4.5">
              <title>${point.mood}, energy ${point.energy}/10</title>
            </circle>
          `).join("")}
        </svg>
        <div class="chart-axis-labels" aria-hidden="true">
          <span>Low</span>
          <span>Energy</span>
          <span>High</span>
        </div>
      </article>
    </section>
  `;
}

function renderEntries() {
  return `
    <section class="section-block">
      <div class="section-heading">
        <div>
          <h2>Recent entries</h2>
          <p>Habit completions and mood logs in one calm feed.</p>
        </div>
      </div>
      <div class="entry-list">
        ${state.entries.slice(0, 5).map((entry) => {
          const accent = habitPalette[entry.icon] || "var(--brand)";
          return `
            <article class="entry-row">
              ${renderBadge(entry.icon, entry.title, accent)}
              <div>
                <strong>${entry.title}</strong>
                <p>${entry.meta}</p>
              </div>
              <span class="entry-time">${entry.time}</span>
            </article>
          `;
        }).join("")}
      </div>
    </section>
  `;
}

function renderInsights() {
  const userEntries = getUserEntries();
  const userMoodLogs = getUserMoodLogs();
  const userHabits = state.habits.filter(isUserHabit);
  const completedEntries = userEntries.filter((entry) => entry.type === "habit" && (
    entry.action === "complete" || entry.title?.toLowerCase().includes("completed")
  ));
  const insights = [];

  if (completedEntries.length) {
    const completedCounts = completedEntries.reduce((counts, entry) => {
      const key = entry.habitName || entry.title.replace(/\s+completed$/i, "");
      counts.set(key, (counts.get(key) || 0) + 1);
      return counts;
    }, new Map());
    const [habitName, count] = [...completedCounts.entries()].sort((a, b) => b[1] - a[1])[0];
    const habit = state.habits.find((item) => item.name === habitName) || state.habits.find((item) => item.id === completedEntries[0].habitId);
    insights.push({
      title: "Most completed",
      text: `${habitName} has ${count} user completion${count === 1 ? "" : "s"} logged locally.`,
      iconName: habit?.icon || completedEntries[0].icon || "check"
    });
  }

  const openUserHabits = userHabits.filter((habit) => habit.status !== "done");
  if (openUserHabits.length) {
    const missed = openUserHabits.find((habit) => habit.status === "missed") || openUserHabits[0];
    insights.push({
      title: missed.status === "missed" ? "Needs attention" : "Still due",
      text: `${missed.name} is ${missed.status === "missed" ? "missed" : "still open"} with a ${missed.streak} day streak recorded.`,
      iconName: missed.icon
    });
  }

  if (userMoodLogs.length) {
    const averageEnergy = Math.round(userMoodLogs.reduce((sum, log) => sum + Number(log.energy || 0), 0) / userMoodLogs.length);
    const latestMood = userMoodLogs[0];
    insights.push({
      title: "Energy average",
      text: `${averageEnergy}/10 across ${userMoodLogs.length} user mood log${userMoodLogs.length === 1 ? "" : "s"}; latest mood is ${getMoodLabel(latestMood.mood).toLowerCase()}.`,
      iconName: latestMood.mood || "calm"
    });
  }

  if (userMoodLogs.length >= 2) {
    const latest = getMoodScore(userMoodLogs[0].mood);
    const previousAverage = userMoodLogs.slice(1).reduce((sum, log) => sum + getMoodScore(log.mood), 0) / (userMoodLogs.length - 1);
    const trend = latest > previousAverage + 0.5 ? "rising" : latest < previousAverage - 0.5 ? "lower" : "steady";
    insights.push({
      title: "Mood trend",
      text: `Your user-entered mood trend is ${trend} based on ${userMoodLogs.length} mood check-ins.`,
      iconName: userMoodLogs[0].mood || "calm"
    });
  }

  return `
    <section class="section-block" id="patterns">
      <div class="section-heading">
        <div>
          <h2>Patterns</h2>
          <p>Understated wellbeing signals, not a wall of analytics.</p>
        </div>
      </div>
      <div class="insight-list">
        ${insights.length ? insights.map(({ title, text, iconName }) => `
          <article class="insight-card">
            <div class="habit-title">
              ${renderBadge(iconName, title, habitPalette[iconName] || "var(--brand)")}
              <div>
                <h3>${title}</h3>
                <p>${text}</p>
              </div>
            </div>
          </article>
        `).join("") : `
          <article class="insight-card">
            <div class="habit-title">
              ${renderBadge("note", "Not enough user data", "var(--brand)")}
              <div>
                <h3>Log a mood or complete a habit</h3>
                <p>Patterns will unlock after you add your own habit completions or mood check-ins.</p>
              </div>
            </div>
          </article>
        `}
      </div>
    </section>
  `;
}

function renderWeeklyView() {
  const userEntries = getUserEntries();
  const userMoodLogs = getUserMoodLogs();
  const userActivityCount = userEntries.length + userMoodLogs.length;
  const completionCount = userEntries.filter((entry) => entry.type === "habit" && (
    entry.action === "complete" || entry.title?.toLowerCase().includes("completed")
  )).length;
  const averageEnergy = userMoodLogs.length
    ? Math.round(userMoodLogs.reduce((sum, log) => sum + Number(log.energy || 0), 0) / userMoodLogs.length)
    : 0;
  const score = Math.min(100, Math.round(((completionCount * 12) + (userMoodLogs.length * 10) + (averageEnergy * 4))));
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, index) => [
    day,
    userActivityCount && index < Math.min(7, userActivityCount) ? "is-ok" : "is-empty"
  ]);
  const summary = userActivityCount
    ? `${completionCount} habit completion${completionCount === 1 ? "" : "s"} and ${userMoodLogs.length} mood log${userMoodLogs.length === 1 ? "" : "s"} are shaping this local weekly view.`
    : "Not enough user activity yet. Log a mood or complete a habit to build a real weekly view.";

  return `
    <section class="section-block">
      <div class="section-heading">
        <div>
          <h2>Weekly view</h2>
          <p>A compact rhythm check for consistency and energy.</p>
        </div>
        <span class="mini-label">${userActivityCount ? `${score}%` : "No data"}</span>
      </div>
      <article class="weekly-card">
        <p>${summary}</p>
        <div class="week-grid" aria-label="Weekly consistency">
          ${days.map(([day, klass]) => `
            <div class="week-day ${klass}">
              <span>${day}</span>
              <i class="week-dot" aria-hidden="true"></i>
            </div>
          `).join("")}
        </div>
      </article>
    </section>
  `;
}

function renderTodayPage() {
  return `
    ${renderQuickActions()}
    ${renderKpis()}
    <div class="dashboard-grid">
      <div>
        ${renderAttention()}
      </div>
      <div>
        ${renderEntries()}
      </div>
    </div>
  `;
}

function renderHabitsPage() {
  return `
    ${renderPageAction("habit")}
    ${renderHabits()}
  `;
}

function renderMoodPage() {
  return `
    ${renderMoodSection()}
    ${renderMoodHistory()}
  `;
}

function renderPatternsPage() {
  return `
    <div class="dashboard-grid">
      <div>
        ${renderInsights()}
        ${renderMoodTrendChart()}
      </div>
      <div>
        ${renderWeeklyView()}
      </div>
    </div>
  `;
}

function renderPageContent() {
  if (activePage === "habits") return renderHabitsPage();
  if (activePage === "mood") return renderMoodPage();
  if (activePage === "patterns") return renderPatternsPage();
  return renderTodayPage();
}

function updateActiveTab() {
  tabButtons.forEach((tab) => {
    tab.classList.toggle("is-active", tab.dataset.page === activePage);
  });
}

function renderApp() {
  root.dataset.theme = state.theme;
  themeMeta?.setAttribute("content", state.theme === "dark" ? "#121313" : "#f4efe5");
  app.innerHTML = `
    ${renderTopbar()}
    ${renderPageContent()}
  `;
  updateActiveTab();
  bindAppEvents();
}

function bindAppEvents() {
  app.querySelectorAll("[data-open-habit]").forEach((button) => {
    button.addEventListener("click", () => openHabitSheet());
  });
  app.querySelectorAll("[data-open-mood]").forEach((button) => {
    button.addEventListener("click", () => openMoodSheet());
  });
  app.querySelectorAll("[data-open-settings]").forEach((button) => {
    button.addEventListener("click", () => openSheet(settingsSheet));
  });
  app.querySelectorAll("[data-toggle-theme]").forEach((button) => {
    button.addEventListener("click", toggleTheme);
  });
  app.querySelectorAll("[data-complete-habit]").forEach((button) => {
    button.addEventListener("click", () => completeHabit(Number(button.dataset.completeHabit)));
  });
  app.querySelectorAll("[data-undo-habit]").forEach((button) => {
    button.addEventListener("click", () => undoHabit(Number(button.dataset.undoHabit)));
  });
  app.querySelectorAll("[data-edit-habit]").forEach((button) => {
    button.addEventListener("click", () => openHabitSheet(getHabitById(button.dataset.editHabit)));
  });
  app.querySelectorAll("[data-delete-habit]").forEach((button) => {
    button.addEventListener("click", () => deleteHabit(button.dataset.deleteHabit));
  });
  app.querySelectorAll("[data-select-mood]").forEach((button) => {
    button.addEventListener("click", () => selectMood(button.dataset.selectMood));
  });
  app.querySelector("[data-lock-mood]")?.addEventListener("click", lockSelectedMood);
  app.querySelectorAll("[data-delete-mood-log]").forEach((button) => {
    button.addEventListener("click", () => deleteMoodLog(decodeURIComponent(button.dataset.deleteMoodLog)));
  });
}

function openHabitSheet(habit = null) {
  const title = habitSheet.querySelector("#habitSheetTitle");
  const eyebrow = habitSheet.querySelector(".eyebrow");
  const submit = habitForm.querySelector("button[type='submit']");

  editingHabitId = habit?.id || null;
  habitForm.reset();

  if (habit) {
    title.textContent = "Edit habit";
    eyebrow.textContent = "Routine details";
    submit.textContent = "Save habit";
    habitForm.elements.name.value = habit.name || "";
    habitForm.elements.category.value = habit.category || "Body";
    habitForm.elements.icon.value = habit.icon || "stretching";
    habitForm.elements.frequency.value = habit.frequency || "Daily";
    habitForm.elements.due.value = habit.due || "Today";
    habitForm.elements.streak.value = Number(habit.streak || 0);
    habitForm.elements.status.value = habit.status || "due";
  } else {
    title.textContent = "Add habit";
    eyebrow.textContent = "New routine";
    submit.textContent = "Add habit";
    habitForm.elements.category.value = "Body";
    habitForm.elements.icon.value = "stretching";
    habitForm.elements.frequency.value = "Daily";
    habitForm.elements.due.value = "Today";
    habitForm.elements.streak.value = 0;
    habitForm.elements.status.value = "due";
  }

  openSheet(habitSheet);
}

function openMoodSheet() {
  document.querySelector("#sheetMoodPicker").innerHTML = renderMoodPicker();
  moodEnergy.value = state.energy;
  updateMoodEnergyValue();
  document.querySelectorAll("#sheetMoodPicker [data-select-mood]").forEach((button) => {
    button.addEventListener("click", () => selectSheetMood(button.dataset.selectMood));
  });
  openSheet(moodSheet);
}

function selectSheetMood(mood) {
  state.selectedMood = mood;
  document.querySelector("#sheetMoodPicker").innerHTML = renderMoodPicker();
  document.querySelectorAll("#sheetMoodPicker [data-select-mood]").forEach((button) => {
    button.addEventListener("click", () => selectSheetMood(button.dataset.selectMood));
  });
}

function updateMoodEnergyValue() {
  moodEnergyValue.value = `${moodEnergy.value}/10`;
}

function openSheet(sheet) {
  backdrop.hidden = false;
  sheet.hidden = false;
}

function closeSheets() {
  backdrop.hidden = true;
  [habitSheet, moodSheet, settingsSheet].forEach((sheet) => {
    sheet.hidden = true;
  });
  editingHabitId = null;
}

function toggleTheme() {
  state.theme = state.theme === "dark" ? "light" : "dark";
  saveState();
  renderApp();
  showToast(`${state.theme === "dark" ? "Dark" : "Light"} theme on`);
}

function completeHabit(id) {
  const habit = state.habits.find((item) => item.id === id);
  if (!habit) return;
  const createdAt = new Date().toISOString();
  habit.status = "done";
  habit.streak += 1;
  habit.last = "Completed today";
  state.entries.unshift({
    id: Date.now(),
    source: "user",
    action: "complete",
    habitId: habit.id,
    habitName: habit.name,
    createdAt,
    type: "habit",
    icon: habit.icon,
    title: `${habit.name} completed`,
    meta: `${habit.category} - ${habit.streak} day streak`,
    time: "Just now"
  });
  saveState();
  renderApp();
  showToast(`${habit.name} marked complete`);
}

function undoHabit(id) {
  const habit = state.habits.find((item) => item.id === id);
  if (!habit) return;
  habit.status = "due";
  habit.streak = Math.max(0, habit.streak - 1);
  habit.last = "Due today";
  saveState();
  renderApp();
  showToast(`${habit.name} moved back to due`);
}

function deleteHabit(id) {
  const habit = getHabitById(id);
  if (!habit) return;

  const confirmed = window.confirm(`Delete ${habit.name}? This removes the habit and its local habit entries, but keeps mood logs.`);
  if (!confirmed) return;

  state.habits = state.habits.filter((item) => String(item.id) !== String(id));
  state.entries = state.entries.filter((entry) => {
    const entryTitle = String(entry.title || "").toLowerCase();
    const habitName = String(habit.name || "").toLowerCase();
    return String(entry.habitId) !== String(id)
      && entry.habitName !== habit.name
      && !entryTitle.startsWith(habitName);
  });
  saveState();
  renderApp();
  showToast(`${habit.name} deleted`);
}

function deleteMoodLog(key) {
  const log = state.moodLogs.find((item) => getMoodLogKey(item) === key);
  if (!log) return;

  const confirmed = window.confirm(`Delete this ${getMoodLabel(log.mood).toLowerCase()} mood log?`);
  if (!confirmed) return;

  state.moodLogs = state.moodLogs.filter((item) => getMoodLogKey(item) !== key);
  state.entries = state.entries.filter((entry) => {
    return !(entry.type === "mood" && entry.createdAt === key);
  });
  saveState();
  renderApp();
  showToast("Mood log deleted");
}

function selectMood(moodId) {
  const mood = moods.find((item) => item.id === moodId);
  if (!mood) return;
  state.selectedMood = moodId;
  saveState();
  renderApp();
  showToast(`${mood.label} selected`);
}

function createMoodLog({ mood, energy, note }) {
  const createdAt = new Date().toISOString();
  state.energy = energy;
  state.selectedMood = mood.id;
  state.moodLogs.unshift({ mood: mood.id, energy, date: "Today", note, source: "user", createdAt });
  state.entries.unshift({
    id: Date.now(),
    source: "user",
    action: "mood",
    createdAt,
    type: "mood",
    icon: mood.id,
    title: `Mood logged as ${mood.label.toLowerCase()}`,
    meta: `Energy ${energy}/10 - ${note}`,
    time: "Just now"
  });
}

function lockSelectedMood() {
  const mood = moods.find((item) => item.id === state.selectedMood) || moods[0];
  createMoodLog({ mood, energy: state.energy, note: "Quick mood check-in" });
  saveState();
  renderApp();
  showToast(`${mood.label} logged`);
}

function showToast(message) {
  toastRegion.innerHTML = `<div class="toast">${message}</div>`;
  window.setTimeout(() => {
    toastRegion.innerHTML = "";
  }, 2200);
}

function addHabit(event) {
  event.preventDefault();
  const formData = new FormData(habitForm);
  const createdAt = new Date().toISOString();
  const status = formData.get("status")?.toString() || "due";
  const due = formData.get("due")?.toString().trim() || "Today";
  const streak = Math.max(0, Number.parseInt(formData.get("streak"), 10) || 0);
  const name = formData.get("name").toString().trim();
  const category = formData.get("category").toString();
  const iconName = formData.get("icon").toString();
  const frequency = formData.get("frequency").toString();

  if (editingHabitId) {
    const habit = getHabitById(editingHabitId);
    if (!habit) return;

    habit.updatedAt = createdAt;
    habit.name = name;
    habit.category = category;
    habit.icon = iconName;
    habit.frequency = frequency;
    habit.streak = streak;
    habit.status = status;
    habit.due = due;
    habit.last = "Updated today";
    saveState();
    closeSheets();
    renderApp();
    showToast("Habit updated");
    return;
  }

  const habit = {
    id: Date.now(),
    source: "user",
    createdAt,
    name,
    category,
    icon: iconName,
    frequency,
    streak,
    status,
    due,
    last: "Created today"
  };
  state.habits.unshift(habit);
  state.entries.unshift({
    id: Date.now() + 1,
    source: "user",
    action: "add",
    habitId: habit.id,
    habitName: habit.name,
    createdAt,
    type: "habit",
    icon: habit.icon,
    title: `${habit.name} added`,
    meta: `${habit.category} - ${habit.frequency}`,
    time: "Just now"
  });
  habitForm.reset();
  saveState();
  closeSheets();
  renderApp();
  showToast("Habit added");
}

function addMood(event) {
  event.preventDefault();
  const formData = new FormData(moodForm);
  const mood = moods.find((item) => item.id === state.selectedMood) || moods[0];
  const energy = Number(formData.get("energy"));
  const note = formData.get("note").toString().trim() || "Quick daily check-in.";
  createMoodLog({ mood, energy, note });
  moodForm.reset();
  moodForm.elements.energy.value = energy;
  updateMoodEnergyValue();
  saveState();
  closeSheets();
  renderApp();
  showToast("Mood logged");
}

tabButtons.forEach((button) => {
  button.addEventListener("click", () => {
    setActivePage(button.dataset.page);
  });
});

function setActivePage(page) {
  if (!pages.includes(page)) return;
  activePage = page;
  if (window.location.hash.slice(1) !== page) {
    window.history.pushState(null, "", `#${page}`);
  }
  window.scrollTo({ top: 0, behavior: "smooth" });
  renderApp();
}

window.addEventListener("hashchange", () => {
  const page = window.location.hash.slice(1);
  if (pages.includes(page) && page !== activePage) {
    activePage = page;
    renderApp();
  }
});

function registerServiceWorker() {
  if (!("serviceWorker" in navigator)) return;

  window.addEventListener("load", () => {
    navigator.serviceWorker.register("sw.js").catch(() => {
      console.warn("MoodRabbit service worker registration failed.");
    });
  });
}

document.querySelectorAll("[data-close-sheet]").forEach((button) => {
  button.addEventListener("click", closeSheets);
});

removeSampleDataButton?.addEventListener("click", removeSampleData);
exportBackupButton?.addEventListener("click", exportBackup);
importBackupButton?.addEventListener("click", () => importBackupFile?.click());
importBackupFile?.addEventListener("change", () => importBackupFileContents(importBackupFile.files?.[0]));
backdrop.addEventListener("click", closeSheets);
habitForm.addEventListener("submit", addHabit);
moodForm.addEventListener("submit", addMood);
moodEnergy.addEventListener("input", updateMoodEnergyValue);

renderApp();
registerServiceWorker();
