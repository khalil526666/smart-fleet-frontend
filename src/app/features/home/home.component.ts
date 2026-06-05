import { Component, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { LanguageService } from '../../core/services/language.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <!-- ═══ NAVBAR ═══ -->
    <nav class="landing-nav">
      <a routerLink="/" class="nav-logo">
        <img src="assets/smart-fleet-logo.png" alt="Smart Fleet" class="nav-logo-img" />
        <span>Smart <strong>Fleet</strong></span>
      </a>
      <div class="nav-actions">
        <button class="btn-lang" [class.active]="lang.lang() === 'fr'" (click)="lang.set('fr')">FR</button>
        <button class="btn-lang" [class.active]="lang.lang() === 'en'" (click)="lang.set('en')">EN</button>
        @if (auth.isAuthenticated()) {
          <button class="btn-login" (click)="router.navigate(['/dashboard'])">
            Tableau de bord →
          </button>
        } @else {
          <a routerLink="/login" class="btn-login">Se connecter</a>
        }
      </div>
    </nav>

    <!-- ═══ HERO ═══ -->
    <section class="hero">
      <div class="hero-bg-orb orb1"></div>
      <div class="hero-bg-orb orb2"></div>

      <div class="hero-left">
        <div class="badge-powered">
          <span class="badge-dot"></span>
          Système de gestion de flotte intelligent
        </div>

        <h1 class="hero-title">
          <span class="line1">Smart Fleet</span>
          <span class="line2">Management</span>
        </h1>

        <p class="hero-subtitle">
          Prenez le contrôle total de votre flotte.<br>
          <span class="accent-text">Temps réel · IA · Maintenance prédictive</span>
        </p>

        <div class="hero-buttons">
          @if (auth.isAuthenticated()) {
            <button class="btn-primary" (click)="router.navigate(['/dashboard'])">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3v18h18"/><path d="M7 14v4"/><path d="M12 10v8"/><path d="M17 6v12"/></svg>
              Accéder au tableau de bord
            </button>
          } @else {
            <a routerLink="/login" class="btn-primary">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><path d="M10 17l5-5-5-5"/><path d="M15 12H3"/></svg>
              Commencer maintenant
            </a>
          }
          <a href="#features" class="btn-outline">
            Découvrir les fonctionnalités
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14"/><path d="M19 12l-7 7-7-7"/></svg>
          </a>
        </div>

        <div class="hero-trust">
          <div class="trust-item">
            <span class="trust-check">✓</span> +500 véhicules gérés
          </div>
          <div class="trust-item">
            <span class="trust-check">✓</span> +200 conducteurs actifs
          </div>
          <div class="trust-item">
            <span class="trust-check">✓</span> 99.9% disponibilité
          </div>
        </div>
      </div>

      <div class="hero-right">
        <div class="vehicle-scene">
          <!-- Floating icons -->
          <div class="float-icon fi-gps"   style="--d:0s">
            <svg viewBox="0 0 24 24" fill="none" stroke="#1565C0" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21s-7-5.5-7-11a7 7 0 1 1 14 0c0 5.5-7 11-7 11Z"/><circle cx="12" cy="10" r="2.5"/></svg>
            <span>GPS Live</span>
          </div>
          <div class="float-icon fi-fuel"  style="--d:0.4s">
            <svg viewBox="0 0 24 24" fill="none" stroke="#FF8F00" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 22h10V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2Z"/><path d="M7 9h2"/><path d="M13 13h2a2 2 0 0 0 2-2V6l-2-2"/><path d="M17 6h1a2 2 0 0 1 2 2v11a3 3 0 0 1-3 3h-1"/></svg>
            <span>Carburant</span>
          </div>
          <div class="float-icon fi-wrench" style="--d:0.8s">
            <svg viewBox="0 0 24 24" fill="none" stroke="#2E7D32" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0-1.4 0l-7.1 7.1a2 2 0 0 0-.5 1.9l.3 1.1 1.1.3a2 2 0 0 0 1.9-.5l7.1-7.1a1 1 0 0 0 0-1.4Z"/><path d="M15 7l2-2"/><path d="M19 11l2-2"/></svg>
            <span>Maintenance</span>
          </div>
          <div class="float-icon fi-user"  style="--d:1.2s">
            <svg viewBox="0 0 24 24" fill="none" stroke="#6A1B9A" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21a8 8 0 0 0-16 0"/><circle cx="12" cy="8" r="4"/></svg>
            <span>Conducteur</span>
          </div>
          <div class="float-icon fi-chart" style="--d:1.6s">
            <svg viewBox="0 0 24 24" fill="none" stroke="#0277BD" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3v18h18"/><path d="M7 14v4"/><path d="M12 10v8"/><path d="M17 6v12"/></svg>
            <span>Analytics</span>
          </div>
          <div class="float-icon fi-alert" style="--d:2s">
            <svg viewBox="0 0 24 24" fill="none" stroke="#C62828" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.3 3.3 1.6 18a2 2 0 0 0 1.7 3h17.4a2 2 0 0 0 1.7-3L13.7 3.3a2 2 0 0 0-3.4 0Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>
            <span>Alertes</span>
          </div>

          <!-- Vehicle -->
          <div class="vehicle-wrapper">
            <div class="vehicle-glow"></div>
            <svg class="vehicle-svg" viewBox="0 0 320 160" fill="none" xmlns="http://www.w3.org/2000/svg">
              <!-- Van body -->
              <rect x="10" y="55" width="240" height="80" rx="12" fill="#1565C0"/>
              <rect x="10" y="55" width="240" height="80" rx="12" fill="url(#bodyGrad)"/>
              <!-- Cab -->
              <path d="M140 55 L200 30 L260 30 L270 55 Z" fill="#1976D2"/>
              <path d="M140 55 L200 30 L260 30 L270 55 Z" fill="url(#cabGrad)"/>
              <!-- Windows van -->
              <rect x="20"  y="62" width="50" height="30" rx="4" fill="#90CAF9" opacity=".85"/>
              <rect x="78"  y="62" width="50" height="30" rx="4" fill="#90CAF9" opacity=".85"/>
              <!-- Cab window -->
              <path d="M148 55 L195 34 L255 34 L262 55 Z" fill="#90CAF9" opacity=".85"/>
              <!-- Logo on van -->
              <rect x="36"  y="96" width="100" height="24" rx="4" fill="rgba(255,255,255,.15)"/>
              <text x="86" y="113" text-anchor="middle" font-family="Arial" font-weight="900" font-size="11" fill="white" letter-spacing="1">SMART FLEET</text>
              <!-- Rear door lines -->
              <line x1="10" y1="95" x2="250" y2="95" stroke="rgba(255,255,255,.25)" stroke-width="1"/>
              <!-- Wheels -->
              <circle cx="60"  cy="142" r="22" fill="#263238"/>
              <circle cx="60"  cy="142" r="14" fill="#455A64"/>
              <circle cx="60"  cy="142" r="6"  fill="#90A4AE"/>
              <circle cx="210" cy="142" r="22" fill="#263238"/>
              <circle cx="210" cy="142" r="14" fill="#455A64"/>
              <circle cx="210" cy="142" r="6"  fill="#90A4AE"/>
              <!-- Headlight -->
              <ellipse cx="271" cy="80" rx="8" ry="6" fill="#FFF9C4"/>
              <ellipse cx="271" cy="80" rx="4" ry="3" fill="#FFEE58"/>
              <!-- Stripe -->
              <rect x="10" y="110" width="240" height="6" rx="3" fill="rgba(255,255,255,.2)"/>
              <!-- Defs -->
              <defs>
                <linearGradient id="bodyGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stop-color="rgba(255,255,255,.15)"/>
                  <stop offset="1" stop-color="rgba(0,0,0,.1)"/>
                </linearGradient>
                <linearGradient id="cabGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stop-color="rgba(255,255,255,.2)"/>
                  <stop offset="1" stop-color="rgba(0,0,0,.15)"/>
                </linearGradient>
              </defs>
            </svg>
          </div>

          <!-- Road -->
          <div class="road-track">
            <div class="road-dashes"></div>
          </div>
        </div>
      </div>
    </section>

    <!-- ═══ WELCOME BANNER (logged in) ═══ -->
    @if (auth.isAuthenticated() && auth.currentUser()) {
      <div class="welcome-banner">
        <div class="welcome-avatar">{{ initials() }}</div>
        <div class="welcome-text">
          <div class="welcome-greeting">Bonjour, <strong>{{ auth.currentUser()!.name }}</strong> 👋</div>
          <div class="welcome-role">{{ roleLabel() }}</div>
        </div>
        <button class="welcome-cta" (click)="router.navigate(['/dashboard'])">
          Accéder au tableau de bord
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="M12 5l7 7-7 7"/></svg>
        </button>
      </div>
    }

    <!-- ═══ STATS ═══ -->
    <section class="stats-section" id="stats">
      <div class="stats-grid">
        @for (s of stats; track s.label) {
          <div class="stat-card" [attr.data-target]="s.target ?? null">
            <div class="stat-icon-wrap">{{ s.icon }}</div>
            <div class="stat-number-wrap">
              <span class="stat-number">{{ s.display }}</span>
              <span class="stat-suffix">{{ s.suffix }}</span>
            </div>
            <div class="stat-label">{{ s.label }}</div>
          </div>
        }
      </div>
    </section>

    <!-- ═══ FEATURES ═══ -->
    <section class="features-section" id="features">
      <div class="section-header">
        <span class="section-tag">Fonctionnalités</span>
        <h2 class="section-title">Tout ce dont vous avez besoin</h2>
        <p class="section-subtitle">Une plateforme complète pour gérer votre flotte intelligemment</p>
      </div>

      <div class="features-grid">
        @for (f of features; track f.title; let i = $index) {
          <div class="feature-card" [style.--i]="i">
            <div class="feature-icon-wrap">
              <span class="feature-icon">{{ f.icon }}</span>
            </div>
            <h3>{{ f.title }}</h3>
            <p>{{ f.description }}</p>
            <div class="feature-arrow">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="M12 5l7 7-7 7"/></svg>
            </div>
          </div>
        }
      </div>
    </section>

    <!-- ═══ CTA ═══ -->
    <section class="cta-section">
      <div class="cta-content">
        <h2>Prêt à optimiser votre flotte ?</h2>
        <p>Rejoignez des entreprises qui font confiance à Smart Fleet</p>
        @if (auth.isAuthenticated()) {
          <button class="btn-cta" (click)="router.navigate(['/dashboard'])">
            Accéder à l'application →
          </button>
        } @else {
          <a routerLink="/login" class="btn-cta">Accéder à l'application →</a>
        }
      </div>
    </section>

    <!-- ═══ FOOTER ═══ -->
    <footer class="landing-footer">
      <div class="footer-inner">
        <div class="footer-brand">
          <img src="assets/smart-fleet-logo.png" alt="Smart Fleet" class="footer-logo-img" />
          <div>
            <div class="footer-logo-text">Smart Fleet Management</div>
            <div class="footer-tagline">Système intelligent de gestion de flotte</div>
          </div>
        </div>
        <nav class="footer-links">
          <a routerLink="/dashboard">Tableau de bord</a>
          <a routerLink="/vehicles">Véhicules</a>
          <a routerLink="/drivers">Conducteurs</a>
          <a routerLink="/missions">Missions</a>
        </nav>
        <div class="footer-copy">© 2026 Smart Fleet Management. Tous droits réservés.</div>
      </div>
    </footer>
  `,
  styles: [`
    :host {
      display: block;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      --primary:       #00a886;
      --primary-light: #00c9a7;
      --primary-dark:  #007a63;
      --accent:        #2ecc71;
      --text:          #2d3436;
      --muted:         #636e72;
    }

    /* ── NAVBAR ─────────────────────────────────────────────── */
    .landing-nav {
      position: sticky; top: 0; z-index: 100;
      display: flex; align-items: center; justify-content: space-between;
      padding: 0.85rem 3rem;
      background: rgba(255,255,255,.92);
      backdrop-filter: blur(12px);
      border-bottom: 1px solid rgba(21,101,192,.1);
      box-shadow: 0 2px 20px rgba(0,0,0,.06);
    }
    .nav-logo {
      display: flex; align-items: center; gap: .55rem;
      text-decoration: none; color: var(--text);
      font-size: 1.15rem; font-weight: 700;
      strong { color: var(--primary); }
    }
    .nav-logo-img { width: 32px; height: 32px; border-radius: 8px; }
    .nav-actions { display: flex; align-items: center; gap: .6rem; }
    .btn-lang {
      padding: .32rem .7rem; border-radius: 8px;
      border: 1px solid rgba(21,101,192,.2); background: transparent;
      color: var(--muted); font-weight: 700; font-size: .78rem;
      cursor: pointer; transition: all .14s;
      &.active { background: var(--primary); color: white; border-color: var(--primary); }
      &:hover:not(.active) { border-color: var(--primary); color: var(--primary); }
    }
    .btn-login {
      padding: .5rem 1.2rem; border-radius: 50px;
      background: var(--primary); color: white;
      font-weight: 700; font-size: .875rem;
      text-decoration: none; border: none; cursor: pointer;
      transition: transform .14s, box-shadow .14s;
      box-shadow: 0 4px 16px rgba(21,101,192,.3);
      &:hover { transform: translateY(-1px); box-shadow: 0 8px 24px rgba(21,101,192,.4); }
    }

    /* ── HERO ───────────────────────────────────────────────── */
    .hero {
      min-height: 88vh;
      display: flex; align-items: center;
      padding: 5rem 3rem 4rem;
      gap: 4rem;
      background: linear-gradient(135deg, #e3f2fd 0%, #ffffff 50%, #e8f5e9 100%);
      position: relative; overflow: hidden;
    }
    .hero-bg-orb {
      position: absolute; border-radius: 50%; pointer-events: none;
      animation: orbPulse 6s ease-in-out infinite;
    }
    .orb1 {
      width: 600px; height: 600px; top: -200px; left: -100px;
      background: radial-gradient(circle, rgba(21,101,192,.07) 0%, transparent 70%);
    }
    .orb2 {
      width: 500px; height: 500px; bottom: -150px; right: -50px;
      background: radial-gradient(circle, rgba(66,165,245,.07) 0%, transparent 70%);
      animation-delay: -3s;
    }
    @keyframes orbPulse {
      0%,100% { transform: scale(1); }
      50%      { transform: scale(1.15); }
    }

    .hero-left { flex: 1; max-width: 580px; z-index: 1; }

    .badge-powered {
      display: inline-flex; align-items: center; gap: .45rem;
      padding: .42rem 1rem; border-radius: 50px;
      background: rgba(21,101,192,.08); border: 1px solid rgba(21,101,192,.2);
      color: var(--primary); font-size: .8rem; font-weight: 700;
      letter-spacing: .02em; margin-bottom: 1.25rem;
      animation: fadeInDown .6s ease forwards;
    }
    .badge-dot {
      width: 8px; height: 8px; border-radius: 50%;
      background: #22c55e;
      box-shadow: 0 0 0 3px rgba(34,197,94,.2);
      animation: badgePulse 2s ease-in-out infinite;
    }
    @keyframes badgePulse { 50% { box-shadow: 0 0 0 6px rgba(34,197,94,.1); } }
    @keyframes fadeInDown { from { opacity:0; transform:translateY(-16px); } to { opacity:1; transform:none; } }

    .hero-title {
      font-size: clamp(2.4rem, 5vw, 4rem);
      font-weight: 950; line-height: 1.08;
      color: var(--text); margin: 0 0 1.25rem;
    }
    .hero-title .line1 {
      display: block;
      overflow: hidden; white-space: nowrap;
      animation: typewriter 0.9s steps(11, end) .2s both;
    }
    .hero-title .line2 {
      display: block;
      color: var(--primary);
      overflow: hidden; white-space: nowrap;
      animation: typewriter 0.9s steps(10, end) 1.2s both;
    }
    @keyframes typewriter { from { width:0; } to { width:100%; } }

    .hero-subtitle {
      font-size: 1.1rem; color: var(--muted); line-height: 1.65;
      margin-bottom: 2rem;
      animation: fadeInUp .6s ease .8s both;
    }
    .accent-text { color: var(--primary); font-weight: 600; }
    @keyframes fadeInUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:none; } }

    .hero-buttons {
      display: flex; gap: 1rem; flex-wrap: wrap;
      margin-bottom: 2rem;
      animation: fadeInUp .6s ease 1s both;
    }
    .btn-primary {
      display: inline-flex; align-items: center; gap: .5rem;
      padding: .9rem 2rem; border-radius: 50px;
      background: linear-gradient(135deg, var(--primary-dark), var(--primary-light));
      color: white; font-weight: 700; font-size: .95rem;
      text-decoration: none; border: none; cursor: pointer;
      box-shadow: 0 6px 24px rgba(21,101,192,.35);
      transition: transform .2s, box-shadow .2s;
      animation: glowPulse 3s ease-in-out infinite;
      &:hover { transform: translateY(-2px); box-shadow: 0 12px 36px rgba(21,101,192,.5); }
    }
    @keyframes glowPulse {
      0%,100% { box-shadow: 0 6px 24px rgba(21,101,192,.35); }
      50%      { box-shadow: 0 6px 36px rgba(66,165,245,.6); }
    }
    .btn-outline {
      display: inline-flex; align-items: center; gap: .4rem;
      padding: .9rem 1.75rem; border-radius: 50px;
      border: 2px solid var(--primary); color: var(--primary);
      font-weight: 700; font-size: .95rem; text-decoration: none;
      transition: all .2s;
      &:hover { background: var(--primary); color: white; transform: translateY(-2px); }
    }

    .hero-trust {
      display: flex; gap: 1.25rem; flex-wrap: wrap;
      animation: fadeInUp .6s ease 1.2s both;
    }
    .trust-item { font-size: .82rem; color: var(--muted); font-weight: 600; }
    .trust-check { color: #22c55e; margin-right: .2rem; }

    /* ── VEHICLE SCENE ──────────────────────────────────────── */
    .hero-right { flex: 1; display: flex; justify-content: center; z-index: 1; }

    .vehicle-scene {
      position: relative;
      width: min(480px, 100%); height: 340px;
      animation: fadeInRight .9s ease .4s both;
    }
    @keyframes fadeInRight { from { opacity:0; transform:translateX(60px); } to { opacity:1; transform:none; } }

    /* Floating icons */
    .float-icon {
      position: absolute;
      display: flex; flex-direction: column; align-items: center; gap: .25rem;
      padding: .6rem .75rem; border-radius: 14px;
      background: white;
      box-shadow: 0 8px 32px rgba(0,0,0,.12);
      border: 1px solid rgba(0,0,0,.06);
      font-size: .65rem; font-weight: 700; color: var(--muted);
      animation: float 3s ease-in-out infinite;
      animation-delay: var(--d, 0s);
      svg { width: 24px; height: 24px; }
      span { white-space: nowrap; }
    }
    @keyframes float {
      0%,100% { transform: translateY(0) rotate(0deg); }
      50%      { transform: translateY(-10px) rotate(2deg); }
    }
    .fi-gps    { top: 20px;  left: 10px; }
    .fi-fuel   { top: 10px;  right: 20px; }
    .fi-wrench { top: 45%;   left: 0;   transform: translateY(-50%); }
    .fi-user   { top: 45%;   right: 5px; transform: translateY(-50%); }
    .fi-chart  { bottom: 70px; left: 25px; }
    .fi-alert  { bottom: 70px; right: 25px; }

    /* Vehicle */
    .vehicle-wrapper {
      position: absolute;
      bottom: 40px; left: 50%;
      transform: translateX(-50%);
      width: 320px;
    }
    .vehicle-glow {
      position: absolute; bottom: -20px; left: 50%;
      transform: translateX(-50%);
      width: 220px; height: 40px;
      background: radial-gradient(ellipse, rgba(21,101,192,.25) 0%, transparent 70%);
      animation: glowBounce 3s ease-in-out infinite;
    }
    @keyframes glowBounce {
      0%,100% { opacity:.6; transform: translateX(-50%) scaleX(1); }
      50%      { opacity:1;  transform: translateX(-50%) scaleX(.85); }
    }
    .vehicle-svg { width: 100%; height: auto; filter: drop-shadow(0 12px 32px rgba(0,0,0,.18)); }

    /* Road */
    .road-track {
      position: absolute; bottom: 20px; left: 10%; right: 10%;
      height: 14px; background: #cfd8dc; border-radius: 7px; overflow: hidden;
    }
    .road-dashes {
      position: absolute; top: 50%; transform: translateY(-50%);
      width: 200%; height: 4px;
      background: repeating-linear-gradient(
        90deg, var(--accent) 0, var(--accent) 24px, transparent 24px, transparent 48px
      );
      animation: roadScroll 1.2s linear infinite;
    }
    @keyframes roadScroll { to { transform: translateY(-50%) translateX(-50%); } }

    /* ── WELCOME BANNER ─────────────────────────────────────── */
    .welcome-banner {
      display: flex; align-items: center; gap: 1rem;
      padding: 1.25rem 3rem;
      background: linear-gradient(135deg, rgba(21,101,192,.08), rgba(66,165,245,.05));
      border-top: 1px solid rgba(21,101,192,.12);
      border-bottom: 1px solid rgba(21,101,192,.12);
      animation: fadeInUp .5s ease forwards;
    }
    .welcome-avatar {
      width: 44px; height: 44px; border-radius: 14px;
      background: linear-gradient(135deg, var(--primary), var(--primary-light));
      color: white; font-weight: 900; font-size: 1.1rem;
      display: grid; place-items: center; flex-shrink: 0;
    }
    .welcome-greeting { font-weight: 700; color: var(--text); }
    .welcome-role { font-size: .8rem; color: var(--muted); margin-top: .1rem; }
    .welcome-text { flex: 1; }
    .welcome-cta {
      display: inline-flex; align-items: center; gap: .4rem;
      padding: .6rem 1.25rem; border-radius: 50px;
      background: var(--primary); color: white;
      font-weight: 700; font-size: .875rem; border: none; cursor: pointer;
      transition: transform .14s, box-shadow .14s;
      &:hover { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(21,101,192,.35); }
    }

    /* ── STATS ──────────────────────────────────────────────── */
    .stats-section {
      background: #ffffff;
      padding: 4rem 3rem;
      border-top: 1px solid #dfe6e9;
      border-bottom: 1px solid #dfe6e9;
    }
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 1.5rem;
      max-width: 1000px; margin: 0 auto;
    }
    @media (max-width: 768px) { .stats-grid { grid-template-columns: repeat(2, 1fr); } }

    .stat-card {
      text-align: center;
      padding: 2rem 1.25rem;
      background: #f5faf8;
      border: 1px solid #b3ede3;
      border-radius: 18px;
      transition: transform .25s, box-shadow .25s;
      cursor: default;
      &:hover {
        transform: translateY(-6px);
        box-shadow: 0 8px 32px rgba(0,201,167,.2);
        border-color: #00c9a7;
        background: #e6faf6;
      }
    }
    .stat-icon-wrap { font-size: 2.2rem; margin-bottom: .75rem; }
    .stat-number-wrap { display: flex; align-items: baseline; justify-content: center; gap: .1rem; }
    .stat-number { font-size: 2.6rem; font-weight: 950; color: #00a886; line-height: 1; }
    .stat-suffix { font-size: 1.5rem; font-weight: 800; color: #00a886; }
    .stat-label  {
      font-size: .72rem; color: #636e72;
      margin-top: .5rem; text-transform: uppercase; letter-spacing: .1em;
    }

    /* ── FEATURES ───────────────────────────────────────────── */
    .features-section {
      padding: 5rem 3rem;
      background: #f8fafc;
    }
    .section-header { text-align: center; margin-bottom: 3rem; }
    .section-tag {
      display: inline-block; padding: .3rem .9rem; border-radius: 50px;
      background: rgba(21,101,192,.1); color: var(--primary);
      font-size: .75rem; font-weight: 800; letter-spacing: .08em; text-transform: uppercase;
      margin-bottom: .75rem;
    }
    .section-title { font-size: 2.2rem; font-weight: 900; color: var(--text); margin: .5rem 0 .75rem; }
    .section-subtitle { color: var(--muted); font-size: 1rem; }

    .features-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1.5rem;
      max-width: 1100px; margin: 0 auto;
    }
    @media (max-width: 900px) { .features-grid { grid-template-columns: repeat(2, 1fr); } }
    @media (max-width: 600px) { .features-grid { grid-template-columns: 1fr; } }

    .feature-card {
      background: white; border-radius: 20px;
      padding: 2rem 1.5rem;
      box-shadow: 0 4px 20px rgba(0,0,0,.06);
      border: 1px solid rgba(0,0,0,.05);
      position: relative; overflow: hidden;
      opacity: 0; transform: translateY(36px);
      transition: opacity .5s ease, transform .5s ease, box-shadow .25s;
      transition-delay: calc(var(--i, 0) * 0.08s);
      &.visible { opacity: 1; transform: translateY(0); }
      &:hover {
        transform: translateY(-6px);
        box-shadow: 0 16px 48px rgba(21,101,192,.14);
        border-color: rgba(21,101,192,.15);
        .feature-arrow { opacity: 1; transform: translateX(0); }
      }
      &::before {
        content: '';
        position: absolute; top: 0; left: 0; right: 0; height: 3px;
        background: linear-gradient(90deg, var(--primary), var(--primary-light));
        transform: scaleX(0); transform-origin: left;
        transition: transform .3s ease;
      }
      &:hover::before { transform: scaleX(1); }
    }
    .feature-icon-wrap {
      width: 56px; height: 56px; border-radius: 16px;
      background: linear-gradient(135deg, rgba(21,101,192,.1), rgba(66,165,245,.08));
      display: grid; place-items: center;
      margin-bottom: 1rem;
    }
    .feature-icon { font-size: 1.75rem; }
    .feature-card h3 { font-size: 1.1rem; font-weight: 800; color: var(--text); margin: 0 0 .5rem; }
    .feature-card p  { font-size: .875rem; color: var(--muted); line-height: 1.6; margin: 0; }
    .feature-arrow {
      position: absolute; bottom: 1.25rem; right: 1.25rem;
      color: var(--primary); opacity: 0;
      transform: translateX(-6px);
      transition: opacity .25s, transform .25s;
    }

    /* ── CTA ────────────────────────────────────────────────── */
    .cta-section {
      background: linear-gradient(135deg, #007a63 0%, #00a886 50%, #00c9a7 100%);
      padding: 5rem 3rem;
      text-align: center;
      position: relative; overflow: hidden;
      &::before {
        content: '';
        position: absolute; inset: 0;
        background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
      }
    }
    .cta-content { position: relative; }
    .cta-section h2 { font-size: 2.2rem; font-weight: 900; color: white; margin: 0 0 .75rem; }
    .cta-section p  { font-size: 1.1rem; color: rgba(255,255,255,.8); margin-bottom: 2rem; }
    .btn-cta {
      display: inline-flex; align-items: center; gap: .5rem;
      padding: 1rem 2.5rem; border-radius: 50px;
      background: white; color: var(--primary);
      font-weight: 800; font-size: 1rem;
      text-decoration: none; border: none; cursor: pointer;
      box-shadow: 0 8px 32px rgba(0,0,0,.2);
      transition: transform .2s, box-shadow .2s;
      &:hover { transform: scale(1.05); box-shadow: 0 12px 40px rgba(0,0,0,.3); }
    }

    /* ── FOOTER ─────────────────────────────────────────────── */
    .landing-footer {
      background: var(--dark); padding: 2.5rem 3rem;
      border-top: 1px solid rgba(255,255,255,.06);
    }
    .footer-inner {
      max-width: 1100px; margin: 0 auto;
      display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1.5rem;
    }
    .footer-brand { display: flex; align-items: center; gap: .75rem; }
    .footer-logo-img { width: 36px; height: 36px; border-radius: 10px; }
    .footer-logo-text { font-weight: 800; color: white; font-size: .95rem; }
    .footer-tagline  { font-size: .75rem; color: rgba(255,255,255,.35); margin-top: .1rem; }
    .footer-links {
      display: flex; gap: 1.5rem; flex-wrap: wrap;
      a { color: rgba(255,255,255,.45); text-decoration: none; font-size: .85rem; font-weight: 600; transition: color .14s; }
      a:hover { color: white; }
    }
    .footer-copy { font-size: .75rem; color: rgba(255,255,255,.25); }

    /* ── RESPONSIVE ─────────────────────────────────────────── */
    @media (max-width: 900px) {
      .landing-nav { padding: .75rem 1.5rem; }
      .hero { flex-direction: column; padding: 3rem 1.5rem 2rem; min-height: auto; gap: 2.5rem; }
      .hero-right { width: 100%; justify-content: center; }
      .vehicle-scene { height: 260px; }
      .fi-wrench, .fi-user { top: 40%; }
      .features-section, .stats-section, .cta-section { padding: 3rem 1.5rem; }
      .welcome-banner { padding: 1rem 1.5rem; }
      .footer-inner { flex-direction: column; text-align: center; }
      .footer-links { justify-content: center; }
    }
    @media (max-width: 600px) {
      .hero-title { font-size: 2.2rem; }
      .stats-grid { grid-template-columns: repeat(2, 1fr); }
      .hero-trust { flex-direction: column; gap: .5rem; }
    }
  `],
})
export class HomeComponent implements AfterViewInit, OnDestroy {
  private observers: IntersectionObserver[] = [];

  features = [
    { icon: '🗺️', title: 'Flotte Live',   description: 'Suivez vos véhicules en temps réel sur la carte interactive avec historique de trajet.' },
    { icon: '🔧', title: 'Maintenance',   description: 'Planifiez les entretiens avec alertes automatiques et prédictions IA.' },
    { icon: '⛽', title: 'Carburant',     description: 'Contrôlez la consommation, détectez les anomalies et optimisez les coûts.' },
    { icon: '👥', title: 'Conducteurs',   description: 'Gérez les profils, permis de conduire et assignations facilement.' },
    { icon: '📋', title: 'Missions',      description: 'Créez, planifiez et suivez toutes vos missions avec suivi GPS embarqué.' },
    { icon: '🔔', title: 'Alertes',       description: 'Notifications en temps réel pour chaque événement critique de la flotte.' },
  ];

  stats: { icon: string; label: string; target?: number; display: string; suffix: string }[] = [
    { icon: '🚗', label: 'Véhicules gérés',   target: 500,  display: '0',    suffix: '+' },
    { icon: '👨‍✈️', label: 'Conducteurs actifs', target: 200,  display: '0',    suffix: '+' },
    { icon: '📡', label: 'Disponibilité',      target: 9999, display: '0',    suffix: '%' },
    { icon: '⚡', label: 'Surveillance',        target: undefined, display: '24/7', suffix: '' },
  ];

  constructor(
    public auth: AuthService,
    public lang: LanguageService,
    public router: Router,
  ) {}

  ngAfterViewInit(): void {
    this.initCounters();
    this.initScrollAnimations();
  }

  ngOnDestroy(): void {
    this.observers.forEach(o => o.disconnect());
  }

  initials(): string {
    const name = this.auth.currentUser()?.name ?? 'U';
    return name.charAt(0).toUpperCase();
  }

  roleLabel(): string {
    const r = this.auth.currentUser()?.role;
    if (r === 'admin')       return '🛡️ Administrateur';
    if (r === 'gestionnaire') return '📊 Gestionnaire de flotte';
    if (r === 'chauffeur')   return '🚗 Chauffeur';
    return '👤 Utilisateur';
  }

  private initCounters(): void {
    const cards = document.querySelectorAll<HTMLElement>('.stat-card[data-target]');
    if (!cards.length) return;

    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const card   = entry.target as HTMLElement;
        const target = parseInt(card.dataset['target'] ?? '0', 10);
        const numEl  = card.querySelector<HTMLElement>('.stat-number');
        const sufEl  = card.querySelector<HTMLElement>('.stat-suffix');
        if (!numEl) return;

        let current  = 0;
        const isUptime = target === 9999;
        const final    = isUptime ? 9999 : target;
        const duration = 1800;
        const steps    = 60;
        const step     = final / steps;
        const interval = duration / steps;

        const timer = setInterval(() => {
          current = Math.min(current + step, final);
          if (isUptime) {
            numEl.textContent = (current / 100).toFixed(1);
            if (sufEl) sufEl.textContent = '%';
          } else {
            numEl.textContent = '+' + Math.floor(current).toLocaleString();
            if (sufEl) sufEl.textContent = '';
          }
          if (current >= final) {
            clearInterval(timer);
            numEl.textContent = isUptime ? '99.9' : '+' + final.toLocaleString();
          }
        }, interval);

        obs.unobserve(card);
      });
    }, { threshold: 0.4 });

    cards.forEach(c => obs.observe(c));
    this.observers.push(obs);
  }

  private initScrollAnimations(): void {
    const cards = document.querySelectorAll<HTMLElement>('.feature-card');
    if (!cards.length) return;

    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    cards.forEach(c => obs.observe(c));
    this.observers.push(obs);
  }
}
