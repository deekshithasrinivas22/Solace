"use client";

import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export default function SettingsPage() {
  return (
    <div className="max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-8">Settings</h1>

      <div className="glass-card divide-y divide-border">
        <section className="p-6 space-y-4">
          <h2 className="font-semibold">Appearance</h2>
          <div className="flex items-center justify-between">
            <div>
              <Label>Dark mode</Label>
              <p className="text-xs text-muted-foreground mt-0.5">
                Always enabled for the Echoes experience
              </p>
            </div>
            <Switch checked disabled />
          </div>
        </section>

        <section className="p-6 space-y-4">
          <h2 className="font-semibold">Notifications</h2>
          <div className="flex items-center justify-between">
            <div>
              <Label>On This Day reminders</Label>
              <p className="text-xs text-muted-foreground mt-0.5">
                Get notified about memories from this day in past years
              </p>
            </div>
            <Switch />
          </div>
        </section>

        <section className="p-6">
          <h2 className="font-semibold mb-2">About</h2>
          <p className="text-sm text-muted-foreground">
            Echoes v0.1.0 — Every memory has a soundtrack.
          </p>
        </section>
      </div>
    </div>
  );
}
