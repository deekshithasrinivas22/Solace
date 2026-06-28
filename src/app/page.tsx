import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Camera, Music, Heart } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-background to-background" />

      <header className="relative z-10 flex items-center justify-between px-6 py-5 max-w-6xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary">
            <span className="text-sm font-bold text-primary-foreground">E</span>
          </div>
          <span className="text-xl font-semibold tracking-tight">Echoes</span>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/login">
            <Button variant="ghost">Sign in</Button>
          </Link>
          <Link href="/signup">
            <Button>Get started</Button>
          </Link>
        </div>
      </header>

      <main className="relative z-10 max-w-6xl mx-auto px-6 pt-20 pb-32">
        <div className="text-center max-w-3xl mx-auto">
          <p className="text-primary text-sm font-medium tracking-wide uppercase mb-4">
            Memory journal reimagined
          </p>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.1]">
            Every memory has a{" "}
            <span className="gradient-text">soundtrack</span>
          </h1>
          <p className="mt-6 text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Preserve meaningful moments by combining photos, music snippets, and
            personal notes. Relive memories through emotion, not just images.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/signup">
              <Button size="lg" className="gap-2 h-12 px-8 text-base">
                Start your journal
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="outline" size="lg" className="h-12 px-8 text-base">
                Sign in
              </Button>
            </Link>
          </div>
        </div>

        <div className="mt-32 grid md:grid-cols-3 gap-6">
          {[
            {
              icon: Camera,
              title: "Capture moments",
              description:
                "Upload multiple photos and attach personal notes to every memory.",
            },
            {
              icon: Music,
              title: "Add a soundtrack",
              description:
                "Pair memories with music snippets that bring each moment back to life.",
            },
            {
              icon: Heart,
              title: "Relive & reflect",
              description:
                "Browse your timeline, calendar, and cinematic replays anytime.",
            },
          ].map(({ icon: Icon, title, description }) => (
            <div key={title} className="glass-card p-6">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/15 mb-4">
                <Icon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="font-semibold text-lg">{title}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                {description}
              </p>
            </div>
          ))}
        </div>
      </main>

      <footer className="relative z-10 border-t border-border py-8 text-center text-sm text-muted-foreground">
        <p>© {new Date().getFullYear()} Echoes. Every memory has a soundtrack.</p>
      </footer>
    </div>
  );
}
