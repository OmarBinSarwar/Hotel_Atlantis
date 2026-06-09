import Link from 'next/link';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerTop}>
        <div className={styles.footerLogo}>
          <span className={styles.logoText}>AURUM ROYAL</span>
          <span className={styles.logoSub}>ARABIAN GULF · DUBAI</span>
          <p className={styles.tagline}>Where the extraordinary becomes your everyday</p>
        </div>
        <div className={styles.footerLinks}>
          <div className={styles.col}>
            <h5>HOTEL</h5>
            <a href="#">About Us</a><a href="#">Location</a><a href="#">Awards</a><a href="#">Press</a>
          </div>
          <div className={styles.col}>
            <h5>STAYS</h5>
            <Link href="/booking">Rooms & Suites</Link>
            <Link href="/booking">Villas</Link>
            <Link href="/booking">Penthouses</Link>
            <Link href="/booking">Special Offers</Link>
          </div>
          <div className={styles.col}>
            <h5>EXPERIENCES</h5>
            <a href="#">Dining</a><a href="#">Wellness & Spa</a><a href="#">Aquaventure</a><a href="#">Private Beach</a>
          </div>
          <div className={styles.col}>
            <h5>CONTACT</h5>
            <a href="#">+971 4 426 2000</a>
            <a href="#">reservations@aurumroyal.com</a>
            <a href="#">Palm Jumeirah, Dubai</a>
          </div>
        </div>
      </div>
      <div className={styles.footerBottom}>
        <p>© 2026 Aurum Royal. All rights reserved.</p>
        <div className={styles.legal}>
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Use</a>
          <a href="#">Cookie Settings</a>
        </div>
      </div>
    </footer>
  );
}
