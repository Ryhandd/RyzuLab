import { useEffect, useState } from "react";
import { useAuth } from "./store/useAuth";
import Header from "./components/Header";
import Dashboard from "./components/Dashboard";
import AdminDashboard from "./components/AdminDashboard";
import AuthScreen from "./components/AuthScreen";
import ChallengeModal from "./components/ChallengeModal";
import ActivityFeed from "./components/ActivityFeed";
import Leaderboard from "./components/Leaderboard";
import LogoMark from "./components/LogoMark";
import { ToastContainer } from "./components/useToast";
import { Loader2 } from "lucide-react";

export default function App() {
  const { bootstrap, loading, session, profile } = useAuth();
  const [modalOpen, setModalOpen] = useState(false);
  const [activeChallengeId, setActiveChallengeId] = useState(null);
  const [showAdmin, setShowAdmin] = useState(false);

  useEffect(() => {
    bootstrap();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return <BootScreen label="Initializing RyzuLab" />;
  }

  if (!session) {
    return (
      <>
        <ToastContainer />
        <AuthScreen />
      </>
    );
  }

  if (!profile) {
    return <BootScreen label="Loading your profile" />;
  }

  const handleChallengeSelect = (challengeId) => {
    setActiveChallengeId(challengeId);
    setModalOpen(true);
  };

  const handleChallengeSolved = () => {
    setTimeout(() => {
      setModalOpen(false);
      setActiveChallengeId(null);
    }, 1200);
  };

  return (
    <div className="min-h-screen">
      <ToastContainer />
      <Header onOpenAdmin={() => setShowAdmin((v) => !v)} adminView={showAdmin} />

      {showAdmin && profile.is_admin ? (
        <main className="max-w-[1400px] mx-auto">
          <AdminDashboard onBack={() => setShowAdmin(false)} />
        </main>
      ) : (
        <div className="max-w-[1400px] mx-auto lg:flex lg:items-start">
          <main className="flex-1 min-w-0">
            <Dashboard onChallengeSelect={handleChallengeSelect} />
          </main>

          <aside className="hidden lg:block w-[320px] shrink-0 sticky top-16 h-[calc(100vh-64px)] overflow-y-auto p-5 space-y-4">
            <Leaderboard />
            <ActivityFeed />
          </aside>
        </div>
      )}

      {activeChallengeId && (
        <ChallengeModal
          challengeId={activeChallengeId}
          onClose={() => {
            setModalOpen(false);
            setActiveChallengeId(null);
          }}
          onSolved={handleChallengeSolved}
        />
      )}
    </div>
  );
}

function BootScreen({ label }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-5">
      <LogoMark className="w-14 h-14" />
      <div className="flex items-center gap-2 text-cyber-dim text-sm">
        <Loader2 className="w-4 h-4 animate-spin" />
        {label}…
      </div>
    </div>
  );
}
