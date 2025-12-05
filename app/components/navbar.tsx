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
            <span className={styles.logoText}>My Heart</span>
          </Link>
        </div>

        {/* Desktop Menu */}
        <div className={styles.menu}>
          <Link href="/" className={styles.menuLink}>
            首页
          </Link>
          <Link href="/gallery-wall" className={styles.menuLink}>
            照片墙
          </Link>
          <Link href="/letter-gallery" className={styles.menuLink}>
            信廊
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
            照片墙
          </Link>
          <Link href="/letter-gallery" className={styles.mobileMenuLink} onClick={() => setIsMenuOpen(false)}>
            信廊
          </Link>
        </div>
      </div>
    </nav>
  );
}