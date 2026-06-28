"use client";

import { Sidebar, Navbar } from "@/components/layout/Sidebar";
import { FloatingMusicPlayer } from "@/components/FloatingMusicPlayer";
import { Toaster } from "@/components/ui/sonner";

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-y-auto p-4 lg:p-6 pb-24">
          {children}
        </main>
      </div>
      <FloatingMusicPlayer />
      <Toaster richColors position="top-right" theme="dark" />
    </div>
  );
}
