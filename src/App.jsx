import { useEffect, useState } from "react";
import { useAuth } from "./store/useAuth";
import Header from "./components/Header";
import Dashboard from "./components/Dashboard";
import AdminDashboard from "./components/AdminDashboard";
import AuthScreen from "./components/AuthScreen";
import ChallengeModal from "./components/ChallengeModal";
import ActivityFeed from "./components/ActivityFeed";
import Leaderboard from "./components/Leaderboard";
import { ToastContainer } from "./components/useToast";
import { Loader2, Zap } from "lucide-react";

export default function App() {
  const { bootstrap, loading, session, profile } = useAuth();
  const [modalOpen, setModalOpen] = useState(false);
  const [activeChallengeId, setActiveChallengeId] = useState(null);
  const [showAdmin, setShowAdmin] = useState(false);

  useEffect(() => {
    bootstrap();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Boot screen
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <div className="w-14 h-14 rounded-lg border border-cyber-cyan flex items-center justify-center bg-cyber-cyan/10 shadow-cyber-cyan">
          <Zap className="w-8 h-8 text-cyber-cyan" />
        </div>
        <div className="flex items-center gap-2 text-cyber-dim font-mono text-sm">
          <Loader2 className="w-4 h-4 animate-spin" /> Initializing RyzuLab…
        </div>
      </div>
    );
  }

  // Not signed in
  if (!session) {
    return (
      <>
        <ToastContainer />
        <AuthScreen />
      </>
    );
  }

  // Loading profile right after login
  if (!profile) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <div className="flex items-center gap-2 text-cyber-dim font-mono text-sm">
          <Loader2 className="w-4 h-4 animate-spin" /> Loading your profile…
        </div>
      </div>
    );
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
    <div className="min-h-screen relative overflow-hidden">
      <ToastContainer />
      <Header
        onOpenAdmin={() => setShowAdmin((v) => !v)}
        adminView={showAdmin}
      />

      {showAdmin && profile.is_admin ? (
        <main className="relative z-0">
          <AdminDashboard onBack={() => setShowAdmin(false)} />
        </main>
      ) : (
        <>
          <main className="relative z-0">
            <Dashboard onChallengeSelect={handleChallengeSelect} />
          </main>

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

          <aside className="fixed right-0 top-16 w-80 h-[calc(100vh-64px)] overflow-y-auto p-6 hidden lg:block border-l border-cyber-border bg-cyber-panel/80 backdrop-blur-md z-20">
            <ActivityFeed />
            <div className="mt-8">
              <Leaderboard />
            </div>
          </aside>
        </>
      )}
    </div>
  );
}
