import { Keyboard } from "lucide-react";
import { useState, useEffect } from "react";

const shortcuts = [
  { keys: ["⌘/Ctrl", "K"], label: "Toggle filters" },
  { keys: ["⌘/Ctrl", "J"], label: "Toggle theme" },
  { keys: ["1-4"], label: "Jump to section" },
  { keys: ["?"], label: "Show shortcuts" },
];

const KeyboardShortcutsHelp = () => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (
        e.key === "?" &&
        !(e.target instanceof HTMLInputElement) &&
        !(e.target instanceof HTMLTextAreaElement)
      ) {
        setOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm" onClick={() => setOpen(false)}>
      <div className="bg-card border border-border rounded-xl p-6 shadow-xl max-w-sm w-full mx-4 animate-scale-in" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-2 mb-4">
          <Keyboard className="h-4 w-4 text-primary" />
          <h2 className="text-sm font-semibold text-foreground font-mono">KEYBOARD SHORTCUTS</h2>
        </div>
        <div className="space-y-3">
          {shortcuts.map((s) => (
            <div key={s.label} className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">{s.label}</span>
              <div className="flex items-center gap-1">
                {s.keys.map((k) => (
                  <kbd
                    key={k}
                    className="px-2 py-0.5 rounded bg-muted text-muted-foreground text-[10px] font-mono border border-border"
                  >
                    {k}
                  </kbd>
                ))}
              </div>
            </div>
          ))}
        </div>
        <p className="text-[10px] text-muted-foreground mt-4 text-center font-mono">
          Press ? or click outside to close
        </p>
      </div>
    </div>
  );
};

export default KeyboardShortcutsHelp;
