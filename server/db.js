import { DatabaseSync } from 'node:sqlite';
import fs from 'node:fs';
import path from 'node:path';

function toSql(val) {
  if (val === undefined || val === null) return null;
  return val;
}

/**
 * Initializes SQLite database connection and ensures all relational tables exist.
 */
export function initDatabase(dbPath) {
  const dir = path.dirname(dbPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  const db = new DatabaseSync(dbPath);

  // Enable WAL mode for high performance concurrency
  db.exec('PRAGMA journal_mode = WAL;');

  // Create tables matching the BecomingMe LifeState data models
  db.exec(`
    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT
    );

    CREATE TABLE IF NOT EXISTS books (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      author TEXT,
      status TEXT,
      format TEXT,
      total_pages INTEGER DEFAULT 0,
      current_page INTEGER DEFAULT 0,
      audio_duration_minutes INTEGER DEFAULT 0,
      current_audio_minutes INTEGER DEFAULT 0,
      rating INTEGER,
      cover_url TEXT,
      start_date TEXT,
      finish_date TEXT,
      favorite_quotes TEXT,
      notes TEXT
    );

    CREATE TABLE IF NOT EXISTS routines (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      category TEXT,
      time TEXT,
      streak INTEGER DEFAULT 0,
      completed_dates TEXT,
      tags TEXT
    );

    CREATE TABLE IF NOT EXISTS meals (
      id TEXT PRIMARY KEY,
      date TEXT NOT NULL,
      meal_type TEXT,
      title TEXT,
      description TEXT,
      calories INTEGER DEFAULT 0,
      tags TEXT,
      image_url TEXT
    );

    CREATE TABLE IF NOT EXISTS transactions (
      id TEXT PRIMARY KEY,
      date TEXT NOT NULL,
      type TEXT,
      category TEXT,
      amount REAL DEFAULT 0,
      title TEXT,
      notes TEXT
    );

    CREATE TABLE IF NOT EXISTS water_logs (
      date TEXT PRIMARY KEY,
      amount_ml INTEGER DEFAULT 0,
      target_ml INTEGER DEFAULT 2500
    );

    CREATE TABLE IF NOT EXISTS moods (
      id TEXT PRIMARY KEY,
      date TEXT NOT NULL,
      score INTEGER DEFAULT 3,
      energy_level INTEGER DEFAULT 3,
      label TEXT,
      factors TEXT,
      journal_note TEXT
    );

    CREATE TABLE IF NOT EXISTS journal_cards (
      id TEXT PRIMARY KEY,
      date TEXT NOT NULL,
      title TEXT,
      content TEXT,
      color_scheme TEXT,
      tags TEXT,
      image_url TEXT,
      is_pinned INTEGER DEFAULT 0,
      sticker TEXT,
      song TEXT
    );

    CREATE TABLE IF NOT EXISTS hobbies (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      category TEXT,
      level TEXT,
      hours_spent REAL DEFAULT 0,
      target_weekly_hours REAL DEFAULT 0,
      current_project TEXT,
      milestones TEXT,
      notes TEXT,
      icon TEXT
    );

    CREATE TABLE IF NOT EXISTS workouts (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      category TEXT,
      day_of_week TEXT,
      duration_min INTEGER DEFAULT 0,
      exercises TEXT,
      completed_history TEXT
    );

    CREATE TABLE IF NOT EXISTS ideas (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT,
      category TEXT,
      status TEXT,
      priority TEXT,
      target_date TEXT,
      action_items TEXT,
      tags TEXT
    );

    CREATE TABLE IF NOT EXISTS events (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      date TEXT NOT NULL,
      time TEXT,
      end_time TEXT,
      category TEXT,
      color TEXT,
      notes TEXT,
      reminder INTEGER DEFAULT 0
    );
  `);

  return db;
}

/**
 * Reads entire state from the SQLite database.
 * Returns null if the database has not been populated yet.
 */
export function getState(db) {
  try {
    const bookRows = db.prepare('SELECT * FROM books').all();
    const routineRows = db.prepare('SELECT * FROM routines').all();
    const mealRows = db.prepare('SELECT * FROM meals').all();
    const txRows = db.prepare('SELECT * FROM transactions').all();
    const waterRows = db.prepare('SELECT * FROM water_logs').all();
    const moodRows = db.prepare('SELECT * FROM moods').all();
    const journalRows = db.prepare('SELECT * FROM journal_cards').all();
    const hobbyRows = db.prepare('SELECT * FROM hobbies').all();
    const workoutRows = db.prepare('SELECT * FROM workouts').all();
    const ideaRows = db.prepare('SELECT * FROM ideas').all();
    const eventRows = db.prepare('SELECT * FROM events').all();
    const settingRows = db.prepare('SELECT * FROM settings').all();

    const totalRecords =
      bookRows.length +
      routineRows.length +
      mealRows.length +
      txRows.length +
      waterRows.length +
      moodRows.length +
      journalRows.length +
      hobbyRows.length +
      workoutRows.length +
      ideaRows.length +
      eventRows.length;

    if (totalRecords === 0) {
      return null;
    }

    const settingsMap = {};
    for (const s of settingRows) {
      settingsMap[s.key] = s.value;
    }

    const waterTarget = settingsMap['water_daily_target_ml']
      ? parseInt(settingsMap['water_daily_target_ml'], 10)
      : 2500;

    const waterLogs = {};
    for (const w of waterRows) {
      waterLogs[w.date] = {
        date: w.date,
        amountMl: w.amount_ml,
        targetMl: w.target_ml,
      };
    }

    const books = bookRows.map((b) => ({
      id: b.id,
      title: b.title,
      author: b.author,
      status: b.status,
      format: b.format || 'physical',
      totalPages: b.total_pages || 0,
      currentPage: b.current_page || 0,
      audioDurationMinutes: b.audio_duration_minutes || undefined,
      currentAudioMinutes: b.current_audio_minutes || undefined,
      rating: b.rating || undefined,
      coverUrl: b.cover_url || undefined,
      startDate: b.start_date || undefined,
      finishDate: b.finish_date || undefined,
      favoriteQuotes: b.favorite_quotes ? JSON.parse(b.favorite_quotes) : undefined,
      notes: b.notes || undefined,
    }));

    const routines = routineRows.map((r) => ({
      id: r.id,
      title: r.title,
      category: r.category,
      time: r.time || undefined,
      streak: r.streak || 0,
      completedDates: r.completed_dates ? JSON.parse(r.completed_dates) : [],
      tags: r.tags ? JSON.parse(r.tags) : [],
    }));

    const meals = mealRows.map((m) => ({
      id: m.id,
      date: m.date,
      mealType: m.meal_type || 'breakfast',
      title: m.title || '',
      description: m.description || undefined,
      calories: m.calories || 0,
      tags: m.tags ? JSON.parse(m.tags) : [],
      imageUrl: m.image_url || undefined,
    }));

    const transactions = txRows.map((t) => ({
      id: t.id,
      date: t.date,
      type: t.type || 'expense',
      category: t.category || 'General',
      amount: t.amount || 0,
      title: t.title || '',
      notes: t.notes || undefined,
    }));

    const moods = moodRows.map((m) => ({
      id: m.id,
      date: m.date,
      score: m.score || 3,
      energyLevel: m.energy_level || 3,
      label: m.label || 'Neutral',
      factors: m.factors ? JSON.parse(m.factors) : [],
      journalNote: m.journal_note || undefined,
    }));

    const journalEntries = journalRows.map((j) => ({
      id: j.id,
      date: j.date,
      title: j.title || '',
      content: j.content || '',
      colorScheme: j.color_scheme || 'rose',
      tags: j.tags ? JSON.parse(j.tags) : [],
      imageUrl: j.image_url || undefined,
      isPinned: Boolean(j.is_pinned),
      sticker: j.sticker || undefined,
      song: j.song ? JSON.parse(j.song) : undefined,
    }));

    const hobbies = hobbyRows.map((h) => ({
      id: h.id,
      name: h.name,
      category: h.category,
      level: h.level || 'Beginner',
      hoursSpent: h.hours_spent || 0,
      targetWeeklyHours: h.target_weekly_hours || 0,
      currentProject: h.current_project || undefined,
      milestones: h.milestones ? JSON.parse(h.milestones) : [],
      notes: h.notes || undefined,
      icon: h.icon || undefined,
    }));

    const workouts = workoutRows.map((w) => ({
      id: w.id,
      title: w.title,
      category: w.category || 'strength',
      dayOfWeek: w.day_of_week || undefined,
      durationMin: w.duration_min || 0,
      exercises: w.exercises ? JSON.parse(w.exercises) : [],
      completedHistory: w.completed_history ? JSON.parse(w.completed_history) : [],
    }));

    const ideas = ideaRows.map((i) => ({
      id: i.id,
      title: i.title,
      description: i.description || '',
      category: i.category || 'Personal Growth',
      status: i.status || 'spark',
      priority: i.priority || 'medium',
      targetDate: i.target_date || undefined,
      actionItems: i.action_items ? JSON.parse(i.action_items) : [],
      tags: i.tags ? JSON.parse(i.tags) : [],
    }));

    const events = eventRows.map((e) => ({
      id: e.id,
      title: e.title,
      date: e.date,
      time: e.time || undefined,
      endTime: e.end_time || undefined,
      category: e.category || 'personal',
      color: e.color || '#10b981',
      notes: e.notes || undefined,
      reminder: Boolean(e.reminder),
    }));

    return {
      waterDailyTargetMl: waterTarget,
      waterLogs,
      routines,
      meals,
      transactions,
      books,
      moods,
      journalEntries,
      hobbies,
      workouts,
      ideas,
      events,
    };
  } catch (err) {
    console.error('Error reading from SQLite database:', err);
    return null;
  }
}

/**
 * Saves entire state atomically into SQLite relational tables.
 */
export function saveState(db, state) {
  if (!state || typeof state !== 'object') return;

  db.exec('BEGIN TRANSACTION;');

  try {
    // 1. Settings
    const setSetting = db.prepare('INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)');
    if (state.waterDailyTargetMl) {
      setSetting.run('water_daily_target_ml', String(state.waterDailyTargetMl));
    }
    setSetting.run('last_sync_timestamp', new Date().toISOString());

    // 2. Books
    db.exec('DELETE FROM books;');
    if (Array.isArray(state.books)) {
      const insertBook = db.prepare(`
        INSERT INTO books (
          id, title, author, status, format,
          total_pages, current_page, audio_duration_minutes, current_audio_minutes,
          rating, cover_url, start_date, finish_date, favorite_quotes, notes
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      for (const b of state.books) {
        insertBook.run(
          toSql(b.id),
          toSql(b.title || 'Untitled'),
          toSql(b.author || 'Unknown Author'),
          toSql(b.status || 'want_to_read'),
          toSql(b.format || 'physical'),
          toSql(b.totalPages || 0),
          toSql(b.currentPage || 0),
          toSql(b.audioDurationMinutes || 0),
          toSql(b.currentAudioMinutes || 0),
          toSql(b.rating),
          toSql(b.coverUrl),
          toSql(b.startDate),
          toSql(b.finishDate),
          b.favoriteQuotes ? JSON.stringify(b.favoriteQuotes) : null,
          toSql(b.notes)
        );
      }
    }

    // 3. Routines
    db.exec('DELETE FROM routines;');
    if (Array.isArray(state.routines)) {
      const insertRoutine = db.prepare(`
        INSERT INTO routines (id, title, category, time, streak, completed_dates, tags)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `);
      for (const r of state.routines) {
        insertRoutine.run(
          toSql(r.id),
          toSql(r.title || ''),
          toSql(r.category || 'daily'),
          toSql(r.time),
          toSql(r.streak || 0),
          r.completedDates ? JSON.stringify(r.completedDates) : '[]',
          r.tags ? JSON.stringify(r.tags) : '[]'
        );
      }
    }

    // 4. Meals
    db.exec('DELETE FROM meals;');
    if (Array.isArray(state.meals)) {
      const insertMeal = db.prepare(`
        INSERT INTO meals (id, date, meal_type, title, description, calories, tags, image_url)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `);
      for (const m of state.meals) {
        insertMeal.run(
          toSql(m.id),
          toSql(m.date),
          toSql(m.mealType || 'breakfast'),
          toSql(m.title || ''),
          toSql(m.description),
          toSql(m.calories || 0),
          m.tags ? JSON.stringify(m.tags) : '[]',
          toSql(m.imageUrl)
        );
      }
    }

    // 5. Transactions
    db.exec('DELETE FROM transactions;');
    if (Array.isArray(state.transactions)) {
      const insertTx = db.prepare(`
        INSERT INTO transactions (id, date, type, category, amount, title, notes)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `);
      for (const t of state.transactions) {
        insertTx.run(
          toSql(t.id),
          toSql(t.date),
          toSql(t.type || 'expense'),
          toSql(t.category || 'General'),
          toSql(t.amount || 0),
          toSql(t.title || ''),
          toSql(t.notes)
        );
      }
    }

    // 6. Water logs
    db.exec('DELETE FROM water_logs;');
    if (state.waterLogs && typeof state.waterLogs === 'object') {
      const insertWater = db.prepare(`
        INSERT INTO water_logs (date, amount_ml, target_ml)
        VALUES (?, ?, ?)
      `);
      for (const [date, log] of Object.entries(state.waterLogs)) {
        insertWater.run(toSql(date), toSql(log.amountMl || 0), toSql(log.targetMl || 2500));
      }
    }

    // 7. Moods
    db.exec('DELETE FROM moods;');
    if (Array.isArray(state.moods)) {
      const insertMood = db.prepare(`
        INSERT INTO moods (id, date, score, energy_level, label, factors, journal_note)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `);
      for (const m of state.moods) {
        insertMood.run(
          toSql(m.id),
          toSql(m.date),
          toSql(m.score || 3),
          toSql(m.energyLevel || 3),
          toSql(m.label || 'Neutral'),
          m.factors ? JSON.stringify(m.factors) : '[]',
          toSql(m.journalNote)
        );
      }
    }

    // 8. Journal cards / entries
    db.exec('DELETE FROM journal_cards;');
    const journalList = state.journalEntries || state.journalCards;
    if (Array.isArray(journalList)) {
      const insertCard = db.prepare(`
        INSERT INTO journal_cards (id, date, title, content, color_scheme, tags, image_url, is_pinned, sticker, song)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      for (const j of journalList) {
        insertCard.run(
          toSql(j.id),
          toSql(j.date),
          toSql(j.title || ''),
          toSql(j.content || ''),
          toSql(j.colorScheme || 'rose'),
          j.tags ? JSON.stringify(j.tags) : '[]',
          toSql(j.imageUrl),
          j.isPinned ? 1 : 0,
          toSql(j.sticker),
          j.song ? JSON.stringify(j.song) : null
        );
      }
    }

    // 9. Hobbies
    db.exec('DELETE FROM hobbies;');
    if (Array.isArray(state.hobbies)) {
      const insertHobby = db.prepare(`
        INSERT INTO hobbies (id, name, category, level, hours_spent, target_weekly_hours, current_project, milestones, notes, icon)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      for (const h of state.hobbies) {
        insertHobby.run(
          toSql(h.id),
          toSql(h.name),
          toSql(h.category),
          toSql(h.level || 'Beginner'),
          toSql(h.hoursSpent || 0),
          toSql(h.targetWeeklyHours || 0),
          toSql(h.currentProject),
          h.milestones ? JSON.stringify(h.milestones) : '[]',
          toSql(h.notes),
          toSql(h.icon)
        );
      }
    }

    // 10. Workouts
    db.exec('DELETE FROM workouts;');
    if (Array.isArray(state.workouts)) {
      const insertWorkout = db.prepare(`
        INSERT INTO workouts (id, title, category, day_of_week, duration_min, exercises, completed_history)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `);
      for (const w of state.workouts) {
        insertWorkout.run(
          toSql(w.id),
          toSql(w.title),
          toSql(w.category || 'strength'),
          toSql(w.dayOfWeek),
          toSql(w.durationMin || 0),
          w.exercises ? JSON.stringify(w.exercises) : '[]',
          w.completedHistory ? JSON.stringify(w.completedHistory) : '[]'
        );
      }
    }

    // 11. Ideas
    db.exec('DELETE FROM ideas;');
    if (Array.isArray(state.ideas)) {
      const insertIdea = db.prepare(`
        INSERT INTO ideas (id, title, description, category, status, priority, target_date, action_items, tags)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      for (const i of state.ideas) {
        insertIdea.run(
          toSql(i.id),
          toSql(i.title),
          toSql(i.description || ''),
          toSql(i.category || 'Personal Growth'),
          toSql(i.status || 'spark'),
          toSql(i.priority || 'medium'),
          toSql(i.targetDate),
          i.actionItems ? JSON.stringify(i.actionItems) : '[]',
          i.tags ? JSON.stringify(i.tags) : '[]'
        );
      }
    }

    // 12. Events
    db.exec('DELETE FROM events;');
    if (Array.isArray(state.events)) {
      const insertEvent = db.prepare(`
        INSERT INTO events (id, title, date, time, end_time, category, color, notes, reminder)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      for (const e of state.events) {
        insertEvent.run(
          toSql(e.id),
          toSql(e.title),
          toSql(e.date),
          toSql(e.time),
          toSql(e.endTime),
          toSql(e.category || 'personal'),
          toSql(e.color || '#10b981'),
          toSql(e.notes),
          e.reminder ? 1 : 0
        );
      }
    }

    db.exec('COMMIT;');
  } catch (err) {
    db.exec('ROLLBACK;');
    console.error('Failed to save state to SQLite database:', err);
    throw err;
  }
}

/**
 * Automatically migrates existing JSON state into SQLite database if database is currently empty.
 */
export function migrateFromJsonIfNeeded(db, jsonFilePath) {
  try {
    const existing = getState(db);
    if (existing) {
      return existing; // Database already populated
    }

    if (fs.existsSync(jsonFilePath)) {
      console.log(`[SQLite] Migrating existing state from ${jsonFilePath} into SQLite database...`);
      const raw = fs.readFileSync(jsonFilePath, 'utf-8');
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object') {
        saveState(db, parsed);
        console.log('[SQLite] Successfully migrated state into SQLite tables!');
        return parsed;
      }
    }
  } catch (err) {
    console.error('[SQLite] Error during automatic JSON migration:', err);
  }
  return null;
}
