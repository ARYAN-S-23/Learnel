import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ToastProvider } from './components/UI/Toast';
import { ConfirmProvider } from './components/UI/ConfirmDialog';
import SearchModal from './components/UI/SearchModal';
import Onboarding from './components/UI/Onboarding';
import useStore from './store/useStore';
import Layout from './components/Layout/Layout';
import Dashboard from './components/Dashboard/Dashboard';
import SubjectList from './components/Subjects/SubjectList';
import SubjectPage from './components/Subjects/SubjectPage';
import TopicDetail from './components/Topics/TopicDetail';
import TopicList from './components/Topics/TopicList';
import NotesEditor from './components/Notes/NotesEditor';
import Planner from './components/Planner/Planner';
import Analytics from './components/Analytics/Analytics';
import QuizEngine from './components/Quiz/QuizEngine';
import Goals from './components/Goals/Goals';
import ResourceLibrary from './components/Resources/ResourceLibrary';
import SmartSearch from './components/Search/SmartSearch';
import Achievements from './components/Achievements/Achievements';
import StudyTimer from './components/Timer/StudyTimer';
import RevisionSystem from './components/Revision/RevisionSystem';
import WeakTopics from './components/WeakTopics/WeakTopics';
import KnowledgeGraph from './components/KnowledgeGraph/KnowledgeGraph';
import Settings from './components/Settings/Settings';

const ONBOARDING_KEY = 'learning-os-onboarded';

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.2 }}
        className="h-full"
      >
        <Routes location={location}>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="subjects" element={<SubjectList />} />
            <Route path="subjects/:id" element={<SubjectPage />} />
            <Route path="topics" element={<TopicList />} />
            <Route path="topics/:topicId" element={<TopicDetail />} />
            <Route path="notes/:topicId" element={<NotesEditor />} />
            <Route path="knowledge-graph" element={<KnowledgeGraph />} />
            <Route path="planner" element={<Planner />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="quiz" element={<QuizEngine />} />
            <Route path="goals" element={<Goals />} />
            <Route path="resources" element={<ResourceLibrary />} />
            <Route path="search" element={<SmartSearch />} />
            <Route path="achievements" element={<Achievements />} />
            <Route path="timer" element={<StudyTimer />} />
            <Route path="revision" element={<RevisionSystem />} />
            <Route path="weak-topics" element={<WeakTopics />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
}

function KeyboardShortcuts() {
  const setSearchOpen = useStore((s) => s.setSearchOpen);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setSearchOpen]);
  return null;
}

function App() {
  const [onboarded, setOnboarded] = useState(() => localStorage.getItem(ONBOARDING_KEY) === 'true');
  const searchOpen = useStore((s) => s.searchOpen);
  const setSearchOpen = useStore((s) => s.setSearchOpen);

  const handleOnboardingComplete = () => {
    localStorage.setItem(ONBOARDING_KEY, 'true');
    setOnboarded(true);
  };

  return (
    <ToastProvider>
      <ConfirmProvider>
        <BrowserRouter>
          <KeyboardShortcuts />
          {!onboarded && <Onboarding onComplete={handleOnboardingComplete} />}
          <AnimatedRoutes />
          <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
        </BrowserRouter>
      </ConfirmProvider>
    </ToastProvider>
  );
}

export default App;
