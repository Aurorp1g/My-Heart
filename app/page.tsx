"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Layout from "./components/layout";
import styles from "./home.module.css";
import ClientAuthGuard from "./auth/client-auth-guard";
import { imageLoader } from "./utils/image-loader";

const welcomeMessage = "welcome to my heart💕";
const typingSpeed = 100; // 打字速度（毫秒）
const pauseTime = 2000;  // 暂停时间（毫秒）

export default function Home() {
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [charIndex, setCharIndex] = useState(0);
  const [backgroundStyle, setBackgroundStyle] = useState({});
  const timerRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    // 加载背景图片
    const loadBackground = async () => {
      try {
        const backgroundImage = await imageLoader.getBackgroundImage('home');
        setBackgroundStyle({ 
          background: `${backgroundImage} center/cover no-repeat fixed` 
        });
      } catch (error) {
        console.error('背景图片加载失败:', error);
        // 使用默认背景
        const assetPrefix = process.env.NEXT_PUBLIC_ASSET_PREFIX || '';
        const fallbackImage = `url('${assetPrefix}/bg/home-background.jpg')`;
        setBackgroundStyle({ 
          background: `${fallbackImage} center/cover no-repeat fixed` 
        });
      }
    };

    loadBackground();

    const handleTyping = () => {
      if (!isDeleting) {
        // 打字效果
        if (charIndex < welcomeMessage.length) {
          setDisplayText(welcomeMessage.substring(0, charIndex + 1));
          setCharIndex(charIndex + 1);
          timerRef.current = setTimeout(handleTyping, typingSpeed);
        } else {
          // 打完字后暂停，然后开始删除
          timerRef.current = setTimeout(() => setIsDeleting(true), pauseTime);
        }
      } else {
        // 删除效果
        if (charIndex > 0) {
          setDisplayText(welcomeMessage.substring(0, charIndex - 1));
          setCharIndex(charIndex - 1);
          timerRef.current = setTimeout(handleTyping, typingSpeed / 2);
        } else {
          // 删除完成后重新开始打字
          setIsDeleting(false);
          timerRef.current = setTimeout(handleTyping, typingSpeed);
        }
      }
    };

    // 启动打字机
    timerRef.current = setTimeout(handleTyping, typingSpeed);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [charIndex, isDeleting]);

  return (
    <ClientAuthGuard>
      <Layout>
        <div 
          className={styles.homeContainer}
          style={backgroundStyle}>
          {/* 打印机效果区域 */}
          <div className={styles.printerSection}>
            <div className={styles.printerMachine}>
              {/* 添加红绿灯控制点 */}
              <div className={styles.trafficLights}>
                <div className={styles.trafficLightRed}></div>
                <div className={styles.trafficLightYellow}></div>
                <div className={styles.trafficLightGreen}></div>
              </div>
              <div className={styles.printerTop}></div>
              <div className={styles.printerBody}>
                <div className={styles.paperOutput}>
                  <div className={styles.typingPaper}>
                    <span className={styles.typedText}>{displayText}</span>
                    <span className={styles.cursor}>|</span>
                  </div>
                </div>
              </div>
              <div className={styles.printerBottom}></div>
            </div>
            
            <div className={styles.welcomeMessage}>
              <h1>欢迎小猪猪~~ 🥰</h1>
              <p>选择您想要探索的区域</p>
            </div>
          </div>

          {/* 功能选择区域 */}
          <div className={styles.featureGrid}>
            <Link href="/gallery-wall" className={styles.featureCard}>
              <div className={styles.featureIcon}>🖼️</div>
              <h3>照片墙</h3>
              <p>纪念我们的珍贵瞬间</p>
            </Link>
            
            <Link href="/letter-gallery" className={styles.featureCard}>
              <div className={styles.featureIcon}>💌</div>
              <h3>信廊</h3>
              <p>阅读我们的珍贵信件</p>
            </Link>
          </div>
        </div>
      </Layout>
    </ClientAuthGuard>
  );
}