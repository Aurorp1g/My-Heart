"use client";

import Link from "next/link";
import { useState } from "react";
import styles from "./navbar.module.css";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className={styles.navbar}>
      <div className={styles.navbarContainer}>
        {/* Logo */}
        <div className={styles.logo}>
          <Link href="/" className={styles.logoLink}>
            <span className={styles.logoText}>Gallery Wall</span>
          </Link>
        </div>

        {/* Desktop Menu */}
        <div className={styles.menu}>
          <Link href="/" className={styles.menuLink}>
            首页
          </Link>
          <Link href="/gallery-wall" className={styles.menuLink}>
            画廊
          </Link>
          <Link href="/about" className={styles.menuLink}>
            关于
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button 
          className={styles.mobileMenuButton}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        {/* Mobile Menu */}
        <div className={`${styles.mobileMenu} ${isMenuOpen ? styles.mobileMenuOpen : ''}`}>
          <Link href="/" className={styles.mobileMenuLink} onClick={() => setIsMenuOpen(false)}>
            首页
          </Link>
          <Link href="/gallery-wall" className={styles.mobileMenuLink} onClick={() => setIsMenuOpen(false)}>
            画廊
          </Link>
          <Link href="/about" className={styles.mobileMenuLink} onClick={() => setIsMenuOpen(false)}>
            关于
          </Link>
        </div>
      </div>
    </nav>
  );
}
