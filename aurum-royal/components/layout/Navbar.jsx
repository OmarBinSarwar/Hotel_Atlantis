'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './Navbar.module.css';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <nav className={`${styles.navbar} ${scrolled ? styles.scrolled : ''}`}>
        <div className={styles.navLeft}>
          <Link href="/" className={styles.navLink}>STAYS</Link>
          <Link href="/" className={styles.navLink}>DINING</Link>
          <Link href="/" className={styles.navLink}>WELLNESS</Link>
        </div>
        <div className={styles.navLogo}>
          <Link href="/" className={styles.logoLink}>
            <span className={styles.logoText}>AURUM ROYAL</span>
            <span className={styles.logoSub}>ARABIAN GULF</span>
          </Link>
        </div>
        <div className={styles.navRight}>
          <Link href="/" className={styles.navLink}>EXPERIENCES</Link>
          <Link href="/" className={styles.navLink}>OFFERS</Link>
          <Link href="/booking" className={styles.navBtn}>BOOK NOW</Link>
        </div>
        <button className={styles.menuToggle} onClick={() => setMobileOpen(true)} aria-label="Open menu">
          <span /><span /><span />
        </button>
      </nav>

      {/* Mobile Menu */}
      <div className={`${styles.mobileMenu} ${mobileOpen ? styles.open : ''}`}>
        <button className={styles.mobileClose} onClick={() => setMobileOpen(false)}>✕</button>
        <nav className={styles.mobileNav}>
          {['STAYS','DINING','WELLNESS','EXPERIENCES','OFFERS'].map(item => (
            <Link key={item} href="/" className={styles.mobileNavLink} onClick={() => setMobileOpen(false)}>{item}</Link>
          ))}
          <Link href="/booking" className={`${styles.mobileNavLink} ${styles.mobileBook}`} onClick={() => setMobileOpen(false)}>BOOK NOW</Link>
        </nav>
      </div>
    </>
  );
}
