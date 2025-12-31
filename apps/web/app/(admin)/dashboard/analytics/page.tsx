import { redirect } from "next/navigation";

export default function AnalyticsPage() {
  // Redirect to sales analytics by default
  redirect("/dashboard/analytics/sales");
}
