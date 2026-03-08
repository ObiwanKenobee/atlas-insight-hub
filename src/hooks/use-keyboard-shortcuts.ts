import { useEffect, useCallback } from "react";

interface KeyboardShortcutActions {
  onToggleFilters: () => void;
  onToggleTheme: () => void;
  onScrollToSection: (index: number) => void;
}

export function useKeyboardShortcuts({
  onToggleFilters,
  onToggleTheme,
  onScrollToSection,
}: KeyboardShortcutActions) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      // Ignore when typing in inputs
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      )
        return;

      // Ctrl/Cmd + K → toggle filters
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        onToggleFilters();
        return;
      }

      // Ctrl/Cmd + J → toggle theme
      if ((e.metaKey || e.ctrlKey) && e.key === "j") {
        e.preventDefault();
        onToggleTheme();
        return;
      }

      // 1-4 → scroll to section
      if (!e.metaKey && !e.ctrlKey && !e.altKey) {
        const num = parseInt(e.key);
        if (num >= 1 && num <= 4) {
          e.preventDefault();
          onScrollToSection(num - 1);
        }
      }
    },
    [onToggleFilters, onToggleTheme, onScrollToSection]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);
}
