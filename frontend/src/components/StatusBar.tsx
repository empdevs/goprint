import { useGoPrint } from "../hooks/useGoPrint";

export function StatusBar() {
  const { message, isLoading } = useGoPrint();

  return (
    <section className="status-bar">
      <span>{message}</span>
      {isLoading ? <strong>Memproses...</strong> : <strong>Siap</strong>}
    </section>
  );
}
