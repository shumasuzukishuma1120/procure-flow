"use client";

import { DropdownMenuItem } from "@/components/ui/dropdown-menu";

export default function ThemeToggleMenuItem() {
  const handleThemeToggle = () => {
    const isDark = document.documentElement.classList.contains("dark");
    document.documentElement.classList.toggle("dark", !isDark);
    
  };

  return (
    <DropdownMenuItem onClick={handleThemeToggle}>
      テーマ切り替え
    </DropdownMenuItem>
  );
}
