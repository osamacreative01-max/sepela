"use client";
import { useEffect, useState } from "react";

const MIN_AGE_LABEL = "21"; // apne qanoon ke mutabiq badlo

export default function AgeGate() {
  const [ok, setOk] = useState(null); // null = abhi check ho raha hai

  useEffect(() => {
    let v = false;
    try { v = localStorage.getItem("sepela-age") === "yes"; } catch (e) {}
    setOk(v);
  }, []);

  if (ok) return null;

  const confirm = () => {
    try { localStorage.setItem("sepela-age", "yes"); } catch (e) {}
    setOk(true);
  };

  return (
    <div className="gate" role="dialog" aria-modal="true" aria-labelledby="gate-title">
      <div className="gate-box">
        <img className="gate-logo" src="/logo.png" alt="SEPELA" />
        <h2 id="gate-title">Are you {MIN_AGE_LABEL} or older?</h2>
        <p>This site is for adults only. Please confirm your age to continue.</p>
        <div className="gate-actions">
          <button className="btn gold" onClick={confirm} disabled={ok === null}>Yes, I am {MIN_AGE_LABEL}+</button>
          <a className="btn outline" href="https://www.google.com">No, leave</a>
        </div>
      </div>
    </div>
  );
}
