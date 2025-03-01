import { Metadata } from "next";

export const metadata: Metadata = {
  title: "О проекте",
  description:
    "На этой странице, раскалывается о самом проекте, и как им пользовался",
};

export default function DashboardPage() {
  return (
    <section>
      <h1>It s About</h1>
    </section>
  );
}
