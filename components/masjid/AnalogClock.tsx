"use client";

import { useEffect, useRef } from "react";
import styles from "./AnalogClock.module.css";

const HOURS = Array.from({ length: 12 }, (_, i) => i);
const DASHES = Array.from({ length: 60 }, (_, i) => i);

/**
 * Jam analog (diadaptasi dari pen Paul Noble di CodePen).
 * Sudut dihitung ulang tiap frame dari jam perangkat (mulus, tanpa transition).
 */
export default function AnalogClock({
  className = "",
  light = false,
}: {
  className?: string;
  light?: boolean;
}) {
  const secRef = useRef<HTMLDivElement>(null);
  const secBackRef = useRef<HTMLDivElement>(null);
  const minRef = useRef<HTMLDivElement>(null);
  const hourRef = useRef<HTMLDivElement>(null);

  // Jarum digerakkan langsung ke DOM lewat requestAnimationFrame (bukan
  // setState + setInterval + CSS transition). Sebelumnya setInterval 1000ms
  // tidak sejajar dengan batas detik sehingga sesekali tick terlewat/ganda,
  // dan transition "overshoot" ikut bertabrakan -> jarum detik berkedip.
  // Sekarang sudutnya dihitung dari waktu nyata di setiap frame, jadi
  // selalu mulus dan tidak bergantung pada pengaturan animasi Windows.
  useEffect(() => {
    let raf = 0;
    const frame = () => {
      const now = new Date();
      const sec = now.getSeconds() + now.getMilliseconds() / 1000; // 0..60
      const min = now.getMinutes() + sec / 60; // 0..60
      const hr = (now.getHours() % 12) + min / 60; // 0..12
      const s = sec * 6;
      const m = min * 6;
      const h = hr * 30;
      if (secRef.current) secRef.current.style.transform = `rotate(${s}deg)`;
      if (secBackRef.current)
        secBackRef.current.style.transform = `rotate(${s + 180}deg)`;
      if (minRef.current) minRef.current.style.transform = `rotate(${m}deg)`;
      if (hourRef.current) hourRef.current.style.transform = `rotate(${h}deg)`;
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
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
                <span style={{ transform: `rotate(${-angle}deg)` }}>
                  {hour}
                </span>
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
          <div ref={secRef} className={styles.second} />
          <div ref={secBackRef} className={styles.secondBack} />
          <div ref={minRef} className={`${styles.hand} ${styles.handMinute}`} />
          <div ref={hourRef} className={styles.hand} />
          <div className={styles.center} />
        </div>
      </div>
    </div>
  );
}
