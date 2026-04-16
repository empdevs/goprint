import { AuthPanel } from "../components/auth/AuthPanel";
import { StatusBar } from "../components/StatusBar";
import { useGoPrint } from "../hooks/useGoPrint";
import { Navigate } from "react-router-dom";

export function AuthLandingPage() {
  const { session } = useGoPrint();

  if (session) {
    return <Navigate replace to="/redirect" />;
  }

  return (
    <main className="app-shell">
      <StatusBar />
      <AuthPanel />
    </main>
  );
}
