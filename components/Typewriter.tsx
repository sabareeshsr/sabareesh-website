"use client";

import { useEffect, useState } from "react";

const ROLES = [
  "Writer",
  "SAP GenAI Developer",
  "Growth Marketer",
  "AI Agent Manager",
];

const TYPE_SPEED   = 90;   // ms per character typed
const DELETE_SPEED = 45;   // ms per character deleted
const PAUSE_AFTER  = 2000; // ms pause when word is fully typed
const PAUSE_BEFORE = 300;  // ms pause before typing next word

export default function Typewriter() {
  const [displayed, setDisplayed]   = useState("");
  const [roleIdx,   setRoleIdx]     = useState(0);
  const [phase, setPhase] = useState<"typing" | "pausing" | "deleting" | "waiting">("typing");

  useEffect(() => {
    const role = ROLES[roleIdx];

    let delay: number;

    switch (phase) {
      case "typing":
        if (displayed.length < role.length) {
          delay = TYPE_SPEED;
          const t = setTimeout(() => setDisplayed(role.slice(0, displayed.length + 1)), delay);
          return () => clearTimeout(t);
        } else {
          // word complete → pause
          delay = PAUSE_AFTER;
          const t = setTimeout(() => setPhase("deleting"), delay);
          return () => clearTimeout(t);
        }

      case "deleting":
        if (displayed.length > 0) {
          delay = DELETE_SPEED;
          const t = setTimeout(() => setDisplayed(displayed.slice(0, -1)), delay);
          return () => clearTimeout(t);
        } else {
          // fully deleted → wait before next word
          delay = PAUSE_BEFORE;
          const t = setTimeout(() => {
            setRoleIdx((prev) => (prev + 1) % ROLES.length);
            setPhase("typing");
          }, delay);
          return () => clearTimeout(t);
        }
    }
  }, [displayed, roleIdx, phase]);

  return (
    <span className="font-plus-jakarta font-bold text-[28px] md:text-[34px] tracking-tight">
      <span
        className="bg-clip-text text-transparent"
        style={{ backgroundImage: "linear-gradient(90deg, #60a5fa 0%, #94ccff 100%)" }}
      >
        {displayed}
      </span>
      <span className="cursor-blink text-[#60a5fa] ml-[1px]">|</span>
    </span>
  );
}
