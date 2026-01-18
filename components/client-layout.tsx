"use client";

import FloatingCoachButton from "@/components/ai/floating-coach-button";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
      <FloatingCoachButton />
    </>
  );
}
