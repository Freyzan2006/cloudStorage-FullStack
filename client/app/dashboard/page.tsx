import { Dashboard } from "@/common/components/layout/Dashboard/Dashboard";

export const metadata = {
  title: "Dashboard",
  description: "Загрузка файлов через Dashboard",
};

export default function DashboardPage() {
  return (
    <section className="w-full flex justify-center items-center">
      <Dashboard />
    </section>
  );
}
