"use client";

import { useEffect, useState } from "react";
import { Select } from "@/components/atoms";

const THEMES = [
  "light",
  "dark",
  "cupcake",
  "bumblebee",
  "emerald",
  "corporate",
  "synthwave",
  "retro",
  "cyberpunk",
  "valentine",
  "halloween",
  "garden",
  "forest",
  "aqua",
  "lofi",
  "pastel",
  "fantasy",
  "wireframe",
  "black",
  "luxury",
  "dracula",
  "cmyk",
  "autumn",
  "business",
  "acid",
  "lemonade",
  "night",
  "coffee",
  "winter",
  "dim",
  "nord",
  "sunset",
] as const;

const STORAGE_KEY = "napi-abelhas-theme";

const themeOptions = THEMES.map((t) => ({
  value: t,
  label: t.charAt(0).toUpperCase() + t.slice(1),
}));

export function ThemeSwitcher() {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      setTheme(saved);
      document.documentElement.setAttribute("data-theme", saved);
    }
  }, []);

  const handleChange = (newTheme: string) => {
    setTheme(newTheme);
    localStorage.setItem(STORAGE_KEY, newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
  };

  return (
    <Select
      options={themeOptions}
      value={theme}
      onChange={(e) => handleChange(e.target.value)}
      aria-label="Tema"
      className="select-sm"
    />
  );
}
