import { OrderCreateCard } from "./OrderCreateCard";
import { OrdersBoard } from "./OrdersBoard";
import { ProfileSummary } from "./ProfileSummary";
import { UsersCard } from "./UsersCard";

export function DashboardScreen() {
  return (
    <section className="dashboard-layout">
      <ProfileSummary />
      <OrderCreateCard />
      <OrdersBoard />
      <UsersCard />
    </section>
  );
}
