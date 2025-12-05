"use client";

import Navbar from "./navbar";
import Footer from "./footer";
import styles from "./layout.module.css";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className={styles.layout}>
      <Navbar />
      <main className={styles.mainContent}>
        {children}
      </main>
      <Footer />
    </div>
  );
}