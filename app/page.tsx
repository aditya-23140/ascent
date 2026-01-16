"use client";

import { useAppState } from "@/context/app-context";
import Dashboard from "@/components/dashboard";
import { useEffect } from "react";

export default function Home() {
  const { initializeDemoData } = useAppState();

  useEffect(() => {
    // Initialize demo data on first load
    const isInitialized = localStorage.getItem("focusNexus_initialized");
    if (!isInitialized) {
      initializeDemoData();
      localStorage.setItem("focusNexus_initialized", "true");
    }
  }, [initializeDemoData]);

  return <Dashboard />;
}
