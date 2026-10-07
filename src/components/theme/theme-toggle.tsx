"use client";

import { MoonIcon, SunIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useTheme } from "./theme-provider";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <Button
      variant="ghost"
      size="icon-lg"
      onClick={toggleTheme}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Light mode" : "Dark mode"}
      className="relative overflow-hidden rounded-full"
    >
      <SunIcon
        className={`absolute transition-all duration-500 ${isDark ? "scale-100 rotate-0 opacity-100" : "scale-50 -rotate-90 opacity-0"}`}
      />
      <MoonIcon
        className={`absolute transition-all duration-500 ${isDark ? "scale-50 rotate-90 opacity-0" : "scale-100 rotate-0 opacity-100"}`}
      />
    </Button>
  );
}
