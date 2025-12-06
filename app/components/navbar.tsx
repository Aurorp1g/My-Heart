"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import styles from "./navbar.module.css";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // 检查认证状态
  useEffect(() => {
    const checkAuthStatus = () => {
      const encryptedAuth = localStorage.getItem('encrypted-auth');
      const authTime = localStorage.getItem('auth-time');
      
      if (encryptedAuth && authTime) {
        try {
          const decrypted = atob(encryptedAuth);
          const [storedPassword, timestamp] = decrypted.split('|');
          
          // 检查认证是否有效（24小时内）
          if (Date.now() - parseInt(timestamp) < 24 * 60 * 60 * 1000) {
            setIsAuthenticated(true);
          } else {
            // 认证过期，清除数据
            localStorage.removeItem('encrypted-auth');
            localStorage.removeItem('auth-time');
            setIsAuthenticated(false);
          }
        } catch (e) {
          // 数据损坏，清除数据
          localStorage.removeItem('encrypted-auth');
          localStorage.removeItem('auth-time');
          setIsAuthenticated(false);
        }
      } else {
        setIsAuthenticated(false);
      }
    };

    checkAuthStatus();
    
    // 监听存储变化（用于跨标签页同步）
    const handleStorageChange = () => {
      checkAuthStatus();
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset;
      setIsScrolled(scrollTop > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 重新加密功能
  const handleReEncrypt = () => {
    // 清除认证信息
    localStorage.removeItem('encrypted-auth');
    localStorage.removeItem('auth-time');
    
    // 更新状态
    setIsAuthenticated(false);
    
    // 显示成功提示
    alert('加密状态已重置，下次访问需要重新输入密码');
    
    // 如果当前在受保护页面，刷新页面
    const currentPath = window.location.pathname;
    if (currentPath.includes('/gallery-wall') || currentPath.includes('/letter-gallery')) {
      window.location.reload();
    }
  };

  return (
    <nav className={`${styles.navbar} ${isScrolled ? styles.scrolled : ''}`}>
      <div className={styles.navbarContainer}>
        {/* Logo */}
        <div className={styles.logo}>
          <Link href="/" className={styles.logoLink}>
            <span className={styles.logoText}>💘 𝕸𝖞 𝖍𝖊𝖆𝖗𝖙</span>
          </Link>
        </div>

        {/* Desktop Menu */}
        <div className={styles.menu}>
          <Link href="/" className={styles.menuLink}>
            🏠 首页
          </Link>
          <Link href="/gallery-wall" className={styles.menuLink}>
            📸 照片墙
          </Link>
          <Link href="/letter-gallery" className={styles.menuLink}>
            💌 信廊
          </Link>
          
          {/* 重新加密按钮（仅在已认证时显示） */}
          {isAuthenticated && (
            <button 
              className={styles.reEncryptButton}
              onClick={handleReEncrypt}
              title="重新加密 - 清除当前认证状态"
            >
              🔒 重新加密
            </button>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button 
          className={styles.mobileMenuButton}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="菜单"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        {/* Mobile Menu */}
        <div className={`${styles.mobileMenu} ${isMenuOpen ? styles.mobileMenuOpen : ''}`}>
          <Link href="/" className={styles.mobileMenuLink} onClick={() => setIsMenuOpen(false)}>
            🏠 首页
          </Link>
          <Link href="/gallery-wall" className={styles.mobileMenuLink} onClick={() => setIsMenuOpen(false)}>
            📸 照片墙
          </Link>
          <Link href="/letter-gallery" className={styles.mobileMenuLink} onClick={() => setIsMenuOpen(false)}>
            💌 信廊
          </Link>
          
          {/* 移动端重新加密按钮 */}
          {isAuthenticated && (
            <button 
              className={styles.mobileReEncryptButton}
              onClick={() => {
                handleReEncrypt();
                setIsMenuOpen(false);
              }}
            >
              🔒 重新加密
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}