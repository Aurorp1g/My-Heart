import styles from "./footer.module.css";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.footerContainer}>
        <div className={styles.footerContent}>
          <div className={styles.footerSection}>
            <h3 className={styles.footerTitle}>Gallery Wall</h3>
            <p className={styles.footerDescription}>
              记录美好瞬间，分享生活点滴
            </p>
          </div>
          
          <div className={styles.footerSection}>
            <h4 className={styles.footerSubtitle}>快速链接</h4>
            <ul className={styles.footerLinks}>
              <li><a href="/" className={styles.footerLink}>首页</a></li>
              <li><a href="/gallery-wall" className={styles.footerLink}>画廊</a></li>
              <li><a href="/about" className={styles.footerLink}>关于我们</a></li>
            </ul>
          </div>
          
          <div className={styles.footerSection}>
            <h4 className={styles.footerSubtitle}>联系方式</h4>
            <ul className={styles.footerLinks}>
              <li>邮箱: contact@example.com</li>
              <li>电话: +86 138-0000-0000</li>
            </ul>
          </div>
        </div>
        
        <div className={styles.footerBottom}>
          <p>&copy; {currentYear} Gallery Wall. 保留所有权利.</p>
        </div>
      </div>
    </footer>
  );
}