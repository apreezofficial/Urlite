import { DashboardApp } from "@/components/DashboardApp";
import { Suspense } from "react";

export const metadata = {
  title: "Dashboard — UrLite",
  description: "Manage your short links",
};

export default function DashboardPage() {
  return (
    <Suspense fallback={<div className="min-h-screen forge-sky-bg" />}>
      <DashboardApp />
    </Suspense>
  );
}
