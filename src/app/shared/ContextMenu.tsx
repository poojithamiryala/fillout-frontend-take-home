import { useEffect, useRef, useState } from "react";

export default function  ContextMenu({
  position,
  onClose,
  items,
}: {
  position: { x: number; y: number };
  onClose: () => void;
  items: { label: React.ReactNode; onClick: () => void; className?: string }[];
}) {
  const menuRef = useRef<HTMLDivElement>(null);
  const [menuHeight, setMenuHeight] = useState(0);

  useEffect(() => {
    if (menuRef.current) {
      setMenuHeight(menuRef.current.offsetHeight);
    }
  }, [items.length]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  return (
    <div
      ref={menuRef}
      style={{
        position: "absolute",
        top: position.y - menuHeight, // ← bottom of menu touches top of trigger
        left: position.x,
        background: "white",
        boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
        borderRadius: 4,
        zIndex: 99,
        width: 160,
      }}
      role="menu"
      aria-label="Context menu"
    >
      {items.map(({ label, onClick, className }, i) => (
        <button
          key={i}
          onClick={onClick}
          className={`w-full text-left p-2 hover:bg-gray-200 focus:outline-none text-xs cursor-pointer ${
            className ?? ""
          }`}
          type="button"
          role="menuitem"
        >
          {label}
        </button>
      ))}
    </div>
  );
}
