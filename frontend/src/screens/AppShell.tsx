import { AuthPanel } from "../components/auth/AuthPanel";
import { DashboardScreen } from "../components/dashboard/DashboardScreen";
import { HeroSection } from "../components/HeroSection";
import { StatusBar } from "../components/StatusBar";
import { useGoPrint } from "../hooks/useGoPrint";

export function AppShell() {
  const { session } = useGoPrint();

  return (
    <main className="app-shell">
      <HeroSection />
      <StatusBar />
      {session ? <DashboardScreen /> : <AuthPanel />}
    </main>
  );
}
