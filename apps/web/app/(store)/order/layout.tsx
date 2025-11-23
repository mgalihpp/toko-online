import { type ReactNode, Suspense } from "react";

export default function OrderLayout({ children }: { children: ReactNode }) {
  return <Suspense>{children}</Suspense>;
}
