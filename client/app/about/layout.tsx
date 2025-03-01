import { Metadata } from "next";

export const metadata: Metadata = {
  title: "О проекте",
  description:
    "На этой странице, раскалывается о самом проекте, и как им пользовался",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
      <div className="inline-block max-w-lg text-center justify-center">
        {children}
      </div>
    </section>
  );
}
