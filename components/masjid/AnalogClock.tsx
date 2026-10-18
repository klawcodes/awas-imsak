"use client";

import { useEffect, useState } from "react";
import styles from "./AnalogClock.module.css";

const HOURS = Array.from({ length: 12 }, (_, i) => i);
const DASHES = Array.from({ length: 60 }, (_, i) => i);

/**
 * Jam analog (diadaptasi dari pen Paul Noble di CodePen).
 * Sudut dihitung dari detik lokal yang terus bertambah supaya jarum
 * tidak "berputar balik" saat melewati angka 12.
 */
export default function AnalogClock({
  className = "",
  light = false,
}: {
  className?: string;
  light?: boolean;
}) {
  const [angles, setAngles] = useState<{ s: number; m: number; h: number } | null>(
    null,
  );

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      const local = now.getTime() / 1000 - now.getTimezoneOffset() * 60;
      const wholeSeconds = Math.floor(local);
      setAngles({
        s: wholeSeconds * 6,
        m: local * 0.1,
        h: local / 120,
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div
      className={`${styles.wrap} ${light ? styles.light : ""} ${className}`}
      role="img"
      aria-label="Jam analog"
    >
      <div className={styles.bezel} />
      <div className={styles.clock}>
      <div className={styles.numbers}>
        {HOURS.map((i) => {
          const hour = i === 0 ? 12 : i;
          const angle = i * 30;
          return (
            <div
              key={`h-${i}`}
              className={styles.number}
              style={{
                transform: `rotate(${angle}deg) translateY(var(--dim-numerals-offset))`,
              }}
            >
              <span style={{ transform: `rotate(${-angle}deg)` }}>{hour}</span>
            </div>
          );
        })}
        {DASHES.map((i) => (
          <span
            key={`d-${i}`}
            className={`${styles.dash} ${i % 5 === 0 ? styles.dashMajor : ""}`}
            style={{
              transform: `rotate(${i * 6}deg) translateY(var(--dim-dash-offset))`,
            }}
          >
            <span>&nbsp;</span>
          </span>
        ))}
      </div>

      <div className={styles.dial}>
        <div
          className={styles.second}
          style={{ transform: `rotate(${angles ? angles.s : 0}deg)` }}
        />
        <div
          className={styles.secondBack}
          style={{ transform: `rotate(${angles ? angles.s + 180 : 180}deg)` }}
        />
        <div
          className={`${styles.hand} ${styles.handMinute}`}
          style={{ transform: `rotate(${angles ? angles.m : 0}deg)` }}
        />
        <div
          className={styles.hand}
          style={{ transform: `rotate(${angles ? angles.h : 0}deg)` }}
        />
        <div className={styles.center} />
      </div>
      </div>
    </div>
  );
}
