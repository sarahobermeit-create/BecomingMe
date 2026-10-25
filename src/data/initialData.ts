import { LifeState } from '../types';

export const getTodayDateString = (): string => {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const today = getTodayDateString();

// Helper to get past days
const getDateAgo = (days: number): string => {
  const d = new Date();
  d.setDate(d.getDate() - days);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const initialLifeState: LifeState = {
  waterDailyTargetMl: 2500,
  waterLogs: {
    [today]: {
      date: today,
      amountMl: 1750,
      targetMl: 2500,
    },
    [getDateAgo(1)]: {
      date: getDateAgo(1),
      amountMl: 2500,
      targetMl: 2500,
    },
    [getDateAgo(2)]: {
      date: getDateAgo(2),
      amountMl: 2000,
      targetMl: 2500,
    },
    [getDateAgo(3)]: {
      date: getDateAgo(3),
      amountMl: 2750,
      targetMl: 2500,
    },
  },

  routines: [
    {
      id: 'routine-1',
      title: '5-minute morning meditation & deep breaths',
      category: 'morning',
      time: '07:00',
      streak: 12,
      completedDates: [today, getDateAgo(1), getDateAgo(2), getDateAgo(3)],
      tags: ['Mindfulness', 'Wellness'],
    },
    {
      id: 'routine-2',
      title: 'Large glass of lemon water',
      category: 'morning',
      time: '07:15',
      streak: 15,
      completedDates: [today, getDateAgo(1), getDateAgo(2)],
      tags: ['Hydration', 'Health'],
    },
    {
      id: 'routine-3',
      title: '15-minute spine & hip mobility stretch',
      category: 'morning',
      time: '07:30',
      streak: 4,
      completedDates: [getDateAgo(1), getDateAgo(2)],
      tags: ['Movement'],
    },
    {
      id: 'routine-4',
      title: 'Review today’s 3 major priorities',
      category: 'morning',
      time: '08:00',
      streak: 9,
      completedDates: [today, getDateAgo(1)],
      tags: ['Focus', 'Productivity'],
    },
    {
      id: 'routine-5',
      title: 'Read 20 pages of current book',
      category: 'daily',
      time: '18:00',
      streak: 7,
      completedDates: [getDateAgo(1), getDateAgo(2)],
      tags: ['Growth', 'Reading'],
    },
    {
      id: 'routine-6',
      title: 'Screen-free bedtime unwind & chamomile tea',
      category: 'evening',
      time: '22:00',
      streak: 6,
      completedDates: [getDateAgo(1), getDateAgo(2), getDateAgo(3)],
      tags: ['Sleep', 'Rest'],
    },
    {
      id: 'routine-7',
      title: 'Quick 5-minute tidy & prep for tomorrow',
      category: 'evening',
      time: '22:30',
      streak: 8,
      completedDates: [getDateAgo(1), getDateAgo(2)],
      tags: ['Environment'],
    },
  ],

  meals: [
    {
      id: 'meal-1',
      date: today,
      mealType: 'breakfast',
      title: 'Sourdough avocado toast with poached eggs & chili flakes',
      calories: 420,
      tags: ['High Protein', 'Homemade'],
      description: 'Topped with microgreens and hemp seeds alongside a warm matcha latte.',
    },
    {
      id: 'meal-2',
      date: today,
      mealType: 'lunch',
      title: 'Mediterranean quinoa bowl with roasted veggies & tahini',
      calories: 580,
      tags: ['Plant Power', 'Fiber Rich'],
      description: 'Cucumber, kalamata olives, cherry tomatoes, and warm roasted chickpeas.',
    },
    {
      id: 'meal-3',
      date: today,
      mealType: 'snack',
      title: 'Greek yogurt with fresh berries & crushed walnuts',
      calories: 210,
      tags: ['Protein', 'Antioxidants'],
      description: 'Drizzled with local wildflower honey.',
    },
    {
      id: 'meal-4',
      date: getDateAgo(1),
      mealType: 'dinner',
      title: 'Pan-seared Atlantic salmon with asparagus and brown rice',
      calories: 640,
      tags: ['Omega-3', 'Dinner'],
      description: 'Lemon butter sauce with roasted garlic asparagus.',
    },
  ],

  transactions: [
    {
      id: 'tx-1',
      date: today,
      type: 'expense',
      category: 'Groceries',
      amount: 64.50,
      title: 'Organic Market & fresh produce',
      notes: 'Weekly fresh greens, fruit, sourdough, and oat milk',
    },
    {
      id: 'tx-2',
      date: today,
      type: 'expense',
      category: 'Dining Out',
      amount: 14.80,
      title: 'Artisan coffee & croissant',
      notes: 'Working afternoon at local roastery',
    },
    {
      id: 'tx-3',
      date: getDateAgo(3),
      type: 'income',
      category: 'Salary',
      amount: 2850.00,
      title: 'Bi-weekly paycheck deposit',
      notes: 'Primary consulting contract',
    },
    {
      id: 'tx-4',
      date: getDateAgo(5),
      type: 'expense',
      category: 'Health & Fitness',
      amount: 45.00,
      title: 'Yoga studio monthly pass',
      notes: 'Unlimited weekly classes',
    },
    {
      id: 'tx-5',
      date: getDateAgo(7),
      type: 'expense',
      category: 'Subscriptions',
      amount: 18.99,
      title: 'Audiobook & Cloud storage',
      notes: 'Monthly recurring',
    },
  ],

  books: [
    {
      id: 'book-1',
      title: 'Atomic Habits',
      author: 'James Clear',
      status: 'reading',
      format: 'physical',
      totalPages: 320,
      currentPage: 214,
      rating: 5,
      coverUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=400',
      startDate: getDateAgo(14),
      favoriteQuotes: [
        'You do not rise to the level of your goals. You fall to the level of your systems.',
        'Every action you take is a vote for the type of person you wish to become.'
      ],
      notes: 'The focus on identity-based habits makes huge sense. Implementing the 2-minute rule.',
    },
    {
      id: 'book-2',
      title: 'The Psychology of Money',
      author: 'Morgan Housel',
      status: 'completed',
      format: 'physical',
      totalPages: 256,
      currentPage: 256,
      rating: 5,
      coverUrl: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80&w=400',
      startDate: getDateAgo(40),
      finishDate: getDateAgo(12),
      favoriteQuotes: [
        'Spending money to show people how much money you have is the fastest way to have less money.'
      ],
      notes: 'Changed how I think about independence vs sheer luxury. True wealth is freedom of time.',
    },
    {
      id: 'book-3',
      title: 'The Picture of Dorian Gray',
      author: 'Oscar Wilde',
      status: 'reading',
      format: 'physical',
      totalPages: 254,
      currentPage: 168,
      rating: 5,
      coverUrl: 'https://images.unsplash.com/photo-1476275466078-4007374efbbe?auto=format&fit=crop&q=80&w=400',
      favoriteQuotes: [
        'To define is to limit.',
        'The only way to get rid of a temptation is to yield to it.'
      ],
      notes: 'A quintessential Victorian gothic masterpiece for rainy nights by the hearth.',
    },
    {
      id: 'book-4',
      title: 'Jane Eyre',
      author: 'Charlotte Brontë',
      status: 'completed',
      format: 'physical',
      totalPages: 532,
      currentPage: 532,
      rating: 5,
      coverUrl: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&q=80&w=400',
      favoriteQuotes: [
        'I am no bird; and no net ensnares me; I am a free human being with an independent will.'
      ],
      notes: 'Atmospheric, passionate, and classic Victorian literature.',
    },
    {
      id: 'book-5',
      title: 'Wuthering Heights',
      author: 'Emily Brontë',
      status: 'want_to_read',
      format: 'physical',
      totalPages: 416,
      currentPage: 0,
      coverUrl: 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&q=80&w=400',
      notes: 'Haunting classic set on the Yorkshire moors.',
    },
    {
      id: 'book-6',
      title: 'Four Thousand Weeks: Time Management for Mortals',
      author: 'Oliver Burkeman',
      status: 'want_to_read',
      format: 'ebook',
      totalPages: 288,
      currentPage: 0,
      coverUrl: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=400',
      notes: 'Downloaded to e-reader. Recommended by two close friends on embracing human finitude.',
    },
    {
      id: 'book-7',
      title: 'Klara and the Sun',
      author: 'Kazuo Ishiguro',
      status: 'reading',
      format: 'ebook',
      totalPages: 303,
      currentPage: 124,
      rating: 4,
      coverUrl: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&q=80&w=400',
      notes: 'E-book on bedside tablet for relaxing evening reading.',
    },
    {
      id: 'book-8',
      title: 'The Midnight Library',
      author: 'Matt Haig',
      status: 'completed',
      format: 'ebook',
      totalPages: 304,
      currentPage: 304,
      rating: 5,
      coverUrl: 'https://images.unsplash.com/photo-1532012164546-f432f2e37257?auto=format&fit=crop&q=80&w=400',
      notes: 'Between life and death there is a library, and within that library, the shelves go on forever.',
    },
    {
      id: 'book-9',
      title: 'The Hound of the Baskervilles',
      author: 'Arthur Conan Doyle',
      status: 'reading',
      format: 'audiobook',
      totalPages: 250,
      currentPage: 145,
      audioDurationMinutes: 380,
      currentAudioMinutes: 220,
      rating: 5,
      coverUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&q=80&w=400',
      favoriteQuotes: [
        'The world is full of obvious things which nobody by any chance ever observes.'
      ],
      notes: 'Narrated by Stephen Fry. Perfect for evening walks and rainy nights.',
    },
    {
      id: 'book-10',
      title: 'Educated',
      author: 'Tara Westover',
      status: 'completed',
      format: 'audiobook',
      totalPages: 350,
      currentPage: 350,
      audioDurationMinutes: 730,
      currentAudioMinutes: 730,
      rating: 5,
      coverUrl: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&q=80&w=400',
      notes: 'Incredible memoir on resilience and the power of knowledge.',
    },
  ],

  moods: [
    {
      id: 'mood-1',
      date: today,
      score: 5,
      energyLevel: 4,
      label: 'Invigorated & Focused',
      factors: ['Good Sleep', 'Morning Walk', 'Productive Deep Work', 'Healthy Meals'],
      journalNote: 'Woke up feeling refreshed. Completed the project architecture smoothly with clear head.',
    },
    {
      id: 'mood-2',
      date: getDateAgo(1),
      score: 4,
      energyLevel: 4,
      label: 'Peaceful & Content',
      factors: ['Yoga', 'Reading', 'Friends Call'],
      journalNote: 'Slow sunny afternoon, caught up with Sarah and made a delicious pasta dinner.',
    },
    {
      id: 'mood-3',
      date: getDateAgo(2),
      score: 3,
      energyLevel: 3,
      label: 'A Bit Scattered',
      factors: ['Rainy Weather', 'Screen Fatigue'],
      journalNote: 'Needed more breaks today. Went for an evening walk which helped reset my mind.',
    },
    {
      id: 'mood-4',
      date: getDateAgo(3),
      score: 5,
      energyLevel: 5,
      label: 'Super Inspired',
      factors: ['Creative Flow', 'Good Coffee', 'Workout'],
      journalNote: 'Felt on top of the world. Finished three goals ahead of schedule.',
    },
  ],

  journalEntries: [
    {
      id: 'junk-1',
      date: today,
      title: 'Sunday Morning Golden Hour ☕',
      content: 'Woke up before the alarm. The light coming through the blinds was this warm amber slice across the rug. Fresh coffee brewed with Ethiopian beans, notes of jasmine and bergamot. Feeling centered and ready for this new season.',
      colorScheme: 'amber',
      tags: ['Morning Aesthetic', 'Gratitude', 'Coffee'],
      sticker: '☕',
      song: {
        title: 'Mystery of Love',
        artist: 'Sufjan Stevens',
      },
      isPinned: true,
    },
    {
      id: 'junk-2',
      date: getDateAgo(2),
      title: 'Found pressed wildflower in my notebook 🌿',
      content: 'Found that little sprig of lavender from last spring tucked between page 45 and 46. It still has the faint sweet herbal scent. Reminded me that time moves gently if we notice it.',
      colorScheme: 'lavender',
      tags: ['Memories', 'Nature', 'Vintage'],
      sticker: '🌿',
      isPinned: true,
    },
    {
      id: 'junk-3',
      date: getDateAgo(4),
      title: 'Midnight Ideas & Starry Sky ✨',
      content: 'Sketching out ideas for the balcony garden. Thinking of climbing sweet peas on a bamboo trellis and potted dwarf lemon tree. Ideas flowing like water tonight.',
      colorScheme: 'cyan',
      tags: ['Creativity', 'Garden', 'Night Thoughts'],
      sticker: '✨',
      isPinned: false,
    },
  ],

  hobbies: [
    {
      id: 'hobby-1',
      name: 'Film Photography & Darkroom',
      category: 'Creative',
      level: 'Intermediate',
      hoursSpent: 48,
      targetWeeklyHours: 4,
      currentProject: 'Autumn 35mm Street & Architecture Series on Ilford HP5',
      milestones: [
        { id: 'm1', title: 'Master manual exposure metering', completed: true },
        { id: 'm2', title: 'Develop first black and white roll at home', completed: true },
        { id: 'm3', title: 'Print a 10-shot zine collection', completed: false },
      ],
      notes: 'Ordered 3 rolls of Portra 400 for golden hour captures.',
      icon: '📸',
    },
    {
      id: 'hobby-2',
      name: 'Sourdough Baking',
      category: 'Craft',
      level: 'Intermediate',
      hoursSpent: 35,
      targetWeeklyHours: 3,
      currentProject: '75% Hydration country loaf with roasted sesame crust',
      milestones: [
        { id: 'm4', title: 'Build healthy starter (named Bubbles)', completed: true },
        { id: 'm5', title: 'Achieve consistent open crumb structure', completed: true },
        { id: 'm6', title: 'Bake Dutch crunch artisan baguettes', completed: false },
      ],
      notes: 'Fermentation temperature makes all the difference! Keep proofing box around 26°C.',
      icon: '🍞',
    },
    {
      id: 'hobby-3',
      name: 'Classical & Fingerstyle Guitar',
      category: 'Music',
      level: 'Beginner',
      hoursSpent: 26,
      targetWeeklyHours: 3.5,
      currentProject: 'Learning "Dust in the Wind" intro & Romanza',
      milestones: [
        { id: 'm7', title: 'Clean bar chords transition (F major & B minor)', completed: true },
        { id: 'm8', title: 'Master Travis picking rhythm', completed: false },
        { id: 'm9', title: 'Record a full 3-minute performance', completed: false },
      ],
      notes: '20 minutes daily practice is way better than a 2-hour cram session once a week.',
      icon: '🎸',
    },
  ],

  workouts: [
    {
      id: 'workout-1',
      title: 'Full Body Mobility & Core Flow',
      category: 'flexibility',
      dayOfWeek: 'Monday',
      durationMin: 35,
      exercises: [
        {
          id: 'ex-1',
          name: 'World’s Greatest Stretch',
          sets: [{ reps: 6 }, { reps: 6 }],
          notes: 'Focus on thoracic rotation and hip flexor stretch',
        },
        {
          id: 'ex-2',
          name: 'Dead Bug with Controlled Pause',
          sets: [{ reps: 12 }, { reps: 12 }, { reps: 12 }],
          notes: 'Keep lower back glued to floor',
        },
        {
          id: 'ex-3',
          name: 'Plank with Shoulder Taps',
          sets: [{ reps: 20 }, { reps: 20 }, { reps: 20 }],
          notes: 'Prevent hips from swaying',
        },
        {
          id: 'ex-4',
          name: 'Deep Squat Hold to Hamstring Stretch',
          sets: [{ durationMin: 1 }, { durationMin: 1 }],
          notes: 'Breathe into hips',
        },
      ],
      completedHistory: [
        { date: getDateAgo(6), notes: 'Felt very loose and energized afterward' },
      ],
    },
    {
      id: 'workout-2',
      title: 'Upper Body Strength & Posture',
      category: 'strength',
      dayOfWeek: 'Wednesday',
      durationMin: 45,
      exercises: [
        {
          id: 'ex-5',
          name: 'Dumbbell Overhead Press',
          sets: [{ reps: 10, weightKg: 12 }, { reps: 10, weightKg: 14 }, { reps: 8, weightKg: 14 }],
          notes: 'Strict core bracing',
        },
        {
          id: 'ex-6',
          name: 'Single Arm Dumbbell Rows',
          sets: [{ reps: 12, weightKg: 16 }, { reps: 12, weightKg: 16 }, { reps: 10, weightKg: 18 }],
          notes: 'Pull to hip pocket',
        },
        {
          id: 'ex-7',
          name: 'Push-Ups (Chest to floor)',
          sets: [{ reps: 15 }, { reps: 12 }, { reps: 10 }],
          notes: 'Slow eccentric tempo',
        },
        {
          id: 'ex-8',
          name: 'Face Pulls / Band Pull-Aparts',
          sets: [{ reps: 15 }, { reps: 15 }, { reps: 15 }],
          notes: 'Rear delt squeeze for posture',
        },
      ],
      completedHistory: [
        { date: getDateAgo(4), notes: 'Hit personal record on DB rows (18kg)' },
      ],
    },
    {
      id: 'workout-3',
      title: 'Zone 2 Outdoor Trail Run',
      category: 'cardio',
      dayOfWeek: 'Saturday',
      durationMin: 40,
      exercises: [
        {
          id: 'ex-9',
          name: 'Aerobic Trail Jog',
          sets: [{ distanceKm: 5.5, durationMin: 36 }],
          notes: 'Keep heart rate in conversational zone 2 (135-145 bpm)',
        },
      ],
      completedHistory: [
        { date: getDateAgo(1), notes: 'Crisp morning air, 5.5km along the river path' },
      ],
    },
  ],

  ideas: [
    {
      id: 'idea-1',
      title: 'Solo Backpacking Trip to Kyoto & Japanese Alps',
      description: 'Spend 2 weeks hiking the Nakasendo trail, staying in traditional ryokans, and visiting serene tea gardens.',
      category: 'Travel',
      status: 'planning',
      priority: 'high',
      targetDate: '2027-04-15',
      tags: ['Travel', 'Adventure', 'Culture'],
      actionItems: [
        { id: 'ai-1', text: 'Research JR Pass & train routes from Tokyo to Kiso Valley', done: true },
        { id: 'ai-2', text: 'Book historic Ryokan in Magome & Tsumago', done: false },
        { id: 'ai-3', text: 'Practice 50 basic conversational Japanese phrases', done: false },
      ],
    },
    {
      id: 'idea-2',
      title: 'Build a Cozy Balcony Herb & Tea Garden',
      description: 'Transform outdoor balcony with terracotta pots, drip irrigation, fresh basil, rosemary, mint, and fairy lights.',
      category: 'Home',
      status: 'in_progress',
      priority: 'medium',
      targetDate: '2026-11-20',
      tags: ['Home', 'Greenery', 'Cozy'],
      actionItems: [
        { id: 'ai-4', text: 'Measure balcony sunlight exposure and dimensions', done: true },
        { id: 'ai-5', text: 'Pick up cedar planter box & potting soil', done: true },
        { id: 'ai-6', text: 'Plant sweet mint, Thai basil, and thyme starters', done: false },
      ],
    },
    {
      id: 'idea-3',
      title: 'Launch a Monthly Creative Substack Newsletter',
      description: 'Curating thoughts on intentional living, design aesthetics, favorite books, and analog photography prints.',
      category: 'Projects',
      status: 'spark',
      priority: 'medium',
      tags: ['Writing', 'Creative', 'Sharing'],
      actionItems: [
        { id: 'ai-7', text: 'Decide on publication name & visual branding', done: false },
        { id: 'ai-8', text: 'Draft first issue outline & welcoming intro', done: false },
      ],
    },
  ],

  events: [
    {
      id: 'event-1',
      title: 'Farmers Market & Flower Stand',
      date: today,
      time: '09:00',
      endTime: '11:00',
      category: 'personal',
      color: '#10b981', // emerald
      notes: 'Pick up sourdough, heirloom tomatoes, and fresh eucalyptus',
    },
    {
      id: 'event-2',
      title: 'Photography Club Meetup',
      date: today,
      time: '15:30',
      endTime: '17:30',
      category: 'social',
      color: '#8b5cf6', // violet
      notes: 'Meet at Botanical Gardens glasshouse with 35mm film camera',
    },
    {
      id: 'event-3',
      title: 'Quarterly Project Milestone Review',
      date: getDateAgo(-2), // 2 days in future
      time: '14:00',
      endTime: '15:00',
      category: 'work',
      color: '#06b6d4', // cyan
      notes: 'Prepare slide deck & roadmap summary',
      reminder: true,
    },
    {
      id: 'event-4',
      title: 'Dinner with Mom & Dad',
      date: getDateAgo(-4),
      time: '18:30',
      endTime: '21:00',
      category: 'social',
      color: '#f43f5e', // rose
      notes: 'Book table at Italian bistro',
    },
  ],
};
