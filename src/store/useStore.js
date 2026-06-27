import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const generateId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

const defaultAchievements = [
  { id: 'ach-1', title: 'First Steps', description: 'Complete your first study session', icon: 'footprints', unlocked: false, unlockedAt: null },
  { id: 'ach-2', title: 'Week Warrior', description: 'Study for 7 days in a row', icon: 'flame', unlocked: false, unlockedAt: null },
  { id: 'ach-3', title: 'Quiz Master', description: 'Score 100% on any quiz', icon: 'trophy', unlocked: false, unlockedAt: null },
  { id: 'ach-4', title: 'Knowledge Seeker', description: 'Add 10 topics to your library', icon: 'book-open', unlocked: false, unlockedAt: null },
  { id: 'ach-5', title: 'Goal Getter', description: 'Complete your first goal', icon: 'target', unlocked: false, unlockedAt: null },
  { id: 'ach-6', title: 'Speed Learner', description: 'Study 10 hours in a week', icon: 'zap', unlocked: false, unlockedAt: null },
  { id: 'ach-7', title: 'Subject Master', description: 'Complete all topics in a subject', icon: 'award', unlocked: false, unlockedAt: null },
  { id: 'ach-8', title: 'Note Taker', description: 'Write notes for 5 topics', icon: 'pencil', unlocked: false, unlockedAt: null },
];

const useStore = create(
  persist(
    (set, get) => ({
      version: 'v2',
      searchOpen: false,
      subjects: [],
      topics: [],
      tasks: [],
      studySessions: [],
      studyPlans: [],
      goals: [],
      quizzes: [],
      achievements: defaultAchievements,
      streak: 0,
      lastStudyDate: null,
      searchHistory: [],
      userName: 'Student',

      // ─── User Settings ──────────────────────────────────
      setUserName: (name) => set({ userName: name }),
      setSearchOpen: (open) => set({ searchOpen: open }),

      // ─── Subjects ───────────────────────────────────────
      addSubject: (subject) =>
        set((state) => ({
          subjects: [...state.subjects, { ...subject, id: generateId(), createdAt: new Date().toISOString() }],
        })),

      updateSubject: (id, updates) =>
        set((state) => ({
          subjects: state.subjects.map((s) => (s.id === id ? { ...s, ...updates } : s)),
        })),

      deleteSubject: (id) =>
        set((state) => ({
          subjects: state.subjects.filter((s) => s.id !== id),
          topics: state.topics.filter((t) => t.subjectId !== id),
          tasks: state.tasks.filter((t) => t.subjectId !== id),
          studySessions: state.studySessions.filter((s) => s.subjectId !== id),
          studyPlans: state.studyPlans.filter((p) => p.subjectId !== id),
          quizzes: state.quizzes.filter((q) => q.subjectId !== id),
        })),

      // ─── Topics ─────────────────────────────────────────
      addTopic: (topic) =>
        set((state) => {
          const subjectTopics = state.topics.filter((t) => t.subjectId === topic.subjectId);
          return {
            topics: [
              ...state.topics,
              { ...topic, id: generateId(), order: subjectTopics.length, notes: topic.notes || '', resources: topic.resources || [], createdAt: new Date().toISOString() },
            ],
          };
        }),

      updateTopic: (id, updates) =>
        set((state) => ({
          topics: state.topics.map((t) => (t.id === id ? { ...t, ...updates } : t)),
        })),

      deleteTopic: (id) =>
        set((state) => ({
          topics: state.topics.filter((t) => t.id !== id),
          tasks: state.tasks.filter((t) => t.topicId !== id),
        })),

      reorderTopics: (subjectId, reorderedIds) =>
        set((state) => ({
          topics: state.topics.map((t) => {
            if (t.subjectId !== subjectId) return t;
            const newOrder = reorderedIds.indexOf(t.id);
            return newOrder !== -1 ? { ...t, order: newOrder } : t;
          }),
        })),

      addResource: (topicId, resource) =>
        set((state) => ({
          topics: state.topics.map((t) =>
            t.id === topicId
              ? { ...t, resources: [...(t.resources || []), { ...resource, id: generateId() }] }
              : t
          ),
        })),

      deleteResource: (topicId, resourceId) =>
        set((state) => ({
          topics: state.topics.map((t) =>
            t.id === topicId
              ? { ...t, resources: (t.resources || []).filter((r) => r.id !== resourceId) }
              : t
          ),
        })),

      // ─── Tasks ──────────────────────────────────────────
      addTask: (task) =>
        set((state) => ({
          tasks: [...state.tasks, { ...task, id: generateId(), completed: false, createdAt: new Date().toISOString() }],
        })),

      updateTask: (id, updates) =>
        set((state) => ({
          tasks: state.tasks.map((t) => (t.id === id ? { ...t, ...updates } : t)),
        })),

      deleteTask: (id) =>
        set((state) => ({
          tasks: state.tasks.filter((t) => t.id !== id),
        })),

      toggleTask: (id) =>
        set((state) => ({
          tasks: state.tasks.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)),
        })),

      // ─── Study Sessions ─────────────────────────────────
      addStudySession: (session) =>
        set((state) => {
          const newSessions = [...state.studySessions, { ...session, id: generateId() }];
          const todayStr = new Date().toISOString().split('T')[0];
          let newStreak = state.streak;
          let newLastStudy = state.lastStudyDate;
          if (state.lastStudyDate !== todayStr) {
            const yesterdayStr = new Date(Date.now() - 86400000).toISOString().split('T')[0];
            newStreak = state.lastStudyDate === yesterdayStr ? state.streak + 1 : 1;
            newLastStudy = todayStr;
          }
          return { studySessions: newSessions, streak: newStreak, lastStudyDate: newLastStudy };
        }),

      deleteStudySession: (id) =>
        set((state) => ({
          studySessions: state.studySessions.filter((s) => s.id !== id),
        })),

      // ─── Study Plans ────────────────────────────────────
      addStudyPlan: (plan) =>
        set((state) => ({
          studyPlans: [...state.studyPlans, { ...plan, id: generateId() }],
        })),

      updateStudyPlan: (id, updates) =>
        set((state) => ({
          studyPlans: state.studyPlans.map((p) => (p.id === id ? { ...p, ...updates } : p)),
        })),

      deleteStudyPlan: (id) =>
        set((state) => ({
          studyPlans: state.studyPlans.filter((p) => p.id !== id),
        })),

      // ─── Goals ──────────────────────────────────────────
      addGoal: (goal) =>
        set((state) => ({
          goals: [...state.goals, { ...goal, id: generateId(), completed: false, subGoals: (goal.subGoals || []).map(sg => ({ ...sg, id: generateId(), completed: false })) }],
        })),

      updateGoal: (id, updates) =>
        set((state) => ({
          goals: state.goals.map((g) => (g.id === id ? { ...g, ...updates } : g)),
        })),

      deleteGoal: (id) =>
        set((state) => ({
          goals: state.goals.filter((g) => g.id !== id),
        })),

      toggleGoal: (id) =>
        set((state) => ({
          goals: state.goals.map((g) => (g.id === id ? { ...g, completed: !g.completed } : g)),
        })),

      toggleSubGoal: (goalId, subGoalId) =>
        set((state) => ({
          goals: state.goals.map((g) =>
            g.id === goalId
              ? {
                  ...g,
                  subGoals: g.subGoals.map((sg) => (sg.id === subGoalId ? { ...sg, completed: !sg.completed } : sg)),
                }
              : g
          ),
        })),

      addSubGoal: (goalId, title) =>
        set((state) => ({
          goals: state.goals.map((g) =>
            g.id === goalId
              ? { ...g, subGoals: [...g.subGoals, { id: generateId(), title, completed: false }] }
              : g
          ),
        })),

      // ─── Quizzes ────────────────────────────────────────
      addQuiz: (quiz) =>
        set((state) => ({
          quizzes: [...state.quizzes, { ...quiz, id: generateId(), results: [] }],
        })),

      updateQuiz: (id, updates) =>
        set((state) => ({
          quizzes: state.quizzes.map((q) => (q.id === id ? { ...q, ...updates } : q)),
        })),

      deleteQuiz: (id) =>
        set((state) => ({
          quizzes: state.quizzes.filter((q) => q.id !== id),
        })),

      saveQuizResult: (quizId, score, total) =>
        set((state) => {
          const newQuizzes = state.quizzes.map((q) =>
            q.id === quizId
              ? { ...q, results: [...q.results, { date: new Date().toISOString(), score, total }] }
              : q
          );
          const newAchievements = [...state.achievements];
          if (score === total) {
            const idx = newAchievements.findIndex((a) => a.id === 'ach-3' && !a.unlocked);
            if (idx !== -1) {
              newAchievements[idx] = { ...newAchievements[idx], unlocked: true, unlockedAt: new Date().toISOString() };
            }
          }
          return { quizzes: newQuizzes, achievements: newAchievements };
        }),

      // ─── Achievements ───────────────────────────────────
      unlockAchievement: (id) =>
        set((state) => ({
          achievements: state.achievements.map((a) =>
            a.id === id && !a.unlocked ? { ...a, unlocked: true, unlockedAt: new Date().toISOString() } : a
          ),
        })),

      checkAchievements: () => {
        const state = get();
        const updates = {};
        const newAchievements = state.achievements.map((a) => {
          if (a.unlocked) return a;
          let shouldUnlock = false;
          switch (a.id) {
            case 'ach-1': shouldUnlock = state.studySessions.length >= 1; break;
            case 'ach-2': shouldUnlock = state.streak >= 7; break;
            case 'ach-4': shouldUnlock = state.topics.length >= 10; break;
            case 'ach-5': shouldUnlock = state.goals.some((g) => g.completed); break;
            case 'ach-6': {
              const now = new Date();
              const weekStart = new Date(now);
              weekStart.setDate(now.getDate() - now.getDay());
              weekStart.setHours(0, 0, 0, 0);
              const weeklyMinutes = state.studySessions
                .filter((s) => new Date(s.date) >= weekStart)
                .reduce((sum, s) => sum + s.duration, 0);
              shouldUnlock = weeklyMinutes >= 600;
              break;
            }
            case 'ach-7': {
              const subjectIds = [...new Set(state.topics.map((t) => t.subjectId))];
              shouldUnlock = subjectIds.some((sid) => {
                const topics = state.topics.filter((t) => t.subjectId === sid);
                return topics.length > 0 && topics.every((t) => t.status === 'mastered');
              });
              break;
            }
            case 'ach-8': {
              const topicsWithNotes = state.topics.filter((t) => t.notes && t.notes.length > 20);
              shouldUnlock = topicsWithNotes.length >= 5;
              break;
            }
          }
          if (shouldUnlock) return { ...a, unlocked: true, unlockedAt: new Date().toISOString() };
          return a;
        });
        set({ achievements: newAchievements });
      },

      // ─── Search ─────────────────────────────────────────
      addSearchHistory: (term) =>
        set((state) => ({
          searchHistory: [term, ...state.searchHistory.filter((h) => h !== term)].slice(0, 10),
        })),

      clearSearchHistory: () => set({ searchHistory: [] }),

      // ─── Reset ──────────────────────────────────────────
      resetAllData: () =>
        set({
          subjects: [],
          topics: [],
          tasks: [],
          studySessions: [],
          studyPlans: [],
          goals: [],
          quizzes: [],
          achievements: defaultAchievements.map((a) => ({ ...a, unlocked: false, unlockedAt: null })),
          streak: 0,
          lastStudyDate: null,
          searchHistory: [],
        }),

      // ─── Selectors ──────────────────────────────────────
      getTopicsBySubject: (subjectId) => {
        return get().topics.filter((t) => t.subjectId === subjectId).sort((a, b) => a.order - b.order);
      },

      getTasksBySubject: (subjectId) => {
        return get().tasks.filter((t) => t.subjectId === subjectId);
      },

      getTasksByTopic: (topicId) => {
        return get().tasks.filter((t) => t.topicId === topicId);
      },

      getSubjectProgress: (subjectId) => {
        const topics = get().topics.filter((t) => t.subjectId === subjectId);
        if (topics.length === 0) return 0;
        const statusWeights = { mastered: 100, practicing: 75, learning: 40, not_started: 0 };
        const total = topics.reduce((sum, t) => sum + (statusWeights[t.status] || 0), 0);
        return Math.round(total / topics.length);
      },

      getOverallProgress: () => {
        const subjects = get().subjects;
        if (subjects.length === 0) return 0;
        const total = subjects.reduce((sum, s) => sum + get().getSubjectProgress(s.id), 0);
        return Math.round(total / subjects.length);
      },

      getUpcomingExams: () => {
        const now = new Date().toISOString().split('T')[0];
        return get()
          .subjects.filter((s) => s.examDate && s.examDate >= now)
          .sort((a, b) => a.examDate.localeCompare(b.examDate));
      },

      getDueTasks: () => {
        const now = new Date().toISOString().split('T')[0];
        return get()
          .tasks.filter((t) => !t.completed && t.dueDate && t.dueDate <= now)
          .sort((a, b) => (a.dueDate || '').localeCompare(b.dueDate || ''));
      },

      getPendingTasks: () => {
        return get().tasks.filter((t) => !t.completed);
      },

      getWeakTopics: () => {
        return get().topics.filter((t) => t.status === 'not_started' || t.status === 'learning');
      },

      getStudyTimeBySubject: (subjectId) => {
        const sessions = get().studySessions.filter((s) => s.subjectId === subjectId);
        return Math.round(sessions.reduce((sum, s) => sum + s.duration, 0) / 60 * 10) / 10;
      },

      getWeeklyStudyTime: () => {
        const now = new Date();
        const weekStart = new Date(now);
        weekStart.setDate(now.getDate() - now.getDay());
        weekStart.setHours(0, 0, 0, 0);
        const sessions = get().studySessions.filter((s) => new Date(s.date) >= weekStart);
        return Math.round(sessions.reduce((sum, s) => sum + s.duration, 0) / 60 * 10) / 10;
      },

      getMonthlyStudyTime: () => {
        const now = new Date();
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        const sessions = get().studySessions.filter((s) => new Date(s.date) >= monthStart);
        return Math.round(sessions.reduce((sum, s) => sum + s.duration, 0) / 60 * 10) / 10;
      },

      getTotalStudyTime: () => {
        const sessions = get().studySessions;
        return Math.round(sessions.reduce((sum, s) => sum + s.duration, 0) / 60 * 10) / 10;
      },

      getWeeklyChartData: () => {
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const now = new Date();
        return days.map((day, i) => {
          const date = new Date(now);
          date.setDate(now.getDate() - now.getDay() + i);
          const dateStr = date.toISOString().split('T')[0];
          const daySessions = get().studySessions.filter((s) => s.date === dateStr);
          const hours = Math.round(daySessions.reduce((sum, s) => sum + s.duration, 0) / 60 * 10) / 10;
          return { day, hours };
        });
      },

      getMonthlyChartData: () => {
        const now = new Date();
        const weeks = [];
        for (let i = 3; i >= 0; i--) {
          const weekEnd = new Date(now);
          weekEnd.setDate(now.getDate() - i * 7);
          const weekStart = new Date(weekEnd);
          weekStart.setDate(weekEnd.getDate() - 6);
          const sessions = get().studySessions.filter((s) => {
            const d = new Date(s.date);
            return d >= weekStart && d <= weekEnd;
          });
          const hours = Math.round(sessions.reduce((sum, s) => sum + s.duration, 0) / 60 * 10) / 10;
          weeks.push({ week: `Week ${4 - i}`, hours });
        }
        return weeks;
      },
    }),
    {
      name: 'learning-os-storage',
    }
  )
);

export { useStore };
export default useStore;
