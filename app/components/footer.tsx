"use client";

import { useEffect, useState } from "react";
import styles from "./footer.module.css";

export default function Footer() {
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);

  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        <p id={styles.footerCopyright}>
          &copy; {currentYear} BY Aurorp1g. 保留所有权利.
        </p>
        <div className={styles.footerLinks}>
          <a href="https://github.com/Aurorp1g" target="_blank" rel="noopener noreferrer">
            <i className="fab fa-github"></i>
          </a>
          <a href="https://space.bilibili.com/2066996205" target="_blank" rel="noopener noreferrer">
            <i className="fab fa-bilibili"></i>
          </a>
          <a href="https://aurorp1g.github.io/" target="_blank" rel="noopener noreferrer">
            <i className="fas fa-blog"></i>
          </a>
        </div>
      </div>
    </footer>
  );
}