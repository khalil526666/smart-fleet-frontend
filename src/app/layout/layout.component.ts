import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../core/services/auth.service';
import { TranslateModule } from '@ngx-translate/core';
import { LanguageService } from '../core/services/language.service';
import { NotificationService } from '../core/services/notification.service';
import { ApiService } from '../core/services/api.service';
import { take } from 'rxjs';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive, TranslateModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="sf-shell">
      <header class="sf-topbar">
        <div class="tb-left">
          <input id="sbToggle" class="sb-toggle" type="checkbox" aria-label="Toggle sidebar" />
          <label class="icon-btn" for="sbToggle" title="Collapse sidebar" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">
              <path d="M4 6h16" />
              <path d="M4 12h16" />
              <path d="M4 18h16" />
            </svg>
          </label>

          <div class="tb-search">
            <span class="s-ic" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="11" cy="11" r="7"></circle>
                <path d="M21 21l-4.3-4.3"></path>
              </svg>
            </span>
            <input
              class="s-input"
              type="search"
              [value]="search"
              (input)="search = $any($event.target).value"
              [placeholder]="'HEADER.SEARCH_PLACEHOLDER' | translate"
              [attr.aria-label]="'HEADER.SEARCH' | translate"
            />
            @if (search) {
              <button type="button" class="s-clear" (click)="search = ''" aria-label="Clear search">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M18 6L6 18"></path>
                  <path d="M6 6l12 12"></path>
                </svg>
              </button>
            }
          </div>
        </div>

        <div class="tb-right">
          <div class="tb-date">
            <button type="button" class="chip" (click)="isDateOpen = !isDateOpen" aria-label="Date selector">
              <span class="chip-ic" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="3"></rect>
                  <path d="M16 2v4M8 2v4M3 10h18"></path>
                </svg>
              </span>
              <span class="chip-txt">{{ selectedDateLabel }}</span>
              <span class="chip-caret" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M6 9l6 6 6-6"></path>
                </svg>
              </span>
            </button>
            @if (isDateOpen) {
              <div class="date-pop" (click)="$event.stopPropagation()">
                <input class="date-input" type="date" [value]="selectedDate" (change)="onDateChange($any($event.target).value)" />
              </div>
            }
          </div>

          @if (notif.isEnabled()) {
            <div class="notif">
              <button type="button" class="icon-btn" (click)="toggleNotif()" title="Notifications" aria-label="Notifications">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M18 8a6 6 0 1 0-12 0c0 7-3 7-3 7h18s-3 0-3-7" />
                  <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                </svg>
                @if (notif.unreadCount() > 0) {
                  <span class="dot">{{ notif.unreadCount() }}</span>
                }
              </button>
              @if (notifOpen) {
                <div class="notif-panel" (click)="$event.stopPropagation()">
                  <div class="notif-header">
                    <span class="notif-title">{{ 'COMMON.NOTIFICATIONS' | translate }}</span>
                    <button type="button" class="btn-link" (click)="notif.markAllRead()">{{ 'COMMON.MARK_ALL_READ' | translate }}</button>
                  </div>
                  <div class="notif-list">
                    @if (notif.items().length === 0) {
                      <div class="notif-empty">{{ 'COMMON.NO_NOTIFICATIONS' | translate }}</div>
                    } @else {
                      @for (n of notif.items(); track n.id ?? n.data.created_at) {
                        <button type="button" class="notif-item" [class.unread]="!n.read_at" (click)="openNotif(n)">
                          <div class="notif-item-title">{{ n.data.title }}</div>
                          <div class="notif-item-msg">{{ n.data.message }}</div>
                        </button>
                      }
                    }
                  </div>
                </div>
              }
            </div>
          }

          <a class="tb-profile" routerLink="/profile" title="Mon profil">
            @if (auth.currentUser()?.photo_url) {
              <div class="p-avatar p-avatar-photo" aria-hidden="true">
                <img [src]="auth.currentUser()!.photo_url!" alt="" />
              </div>
            } @else {
              <div class="p-avatar" aria-hidden="true">
                <span class="p-initial">{{
                  (((auth.currentUser()?.name && auth.currentUser()?.name !== 'null') ? auth.currentUser()?.name : 'Utilisateur') || 'U')
                    .charAt(0)
                    .toUpperCase()
                }}</span>
              </div>
            }
            <div class="p-meta">
              <div class="p-name">{{ (auth.currentUser()?.name && auth.currentUser()?.name !== 'null') ? auth.currentUser()?.name : 'Utilisateur' }}</div>
              <div class="p-role">{{
                auth.currentUser()?.role === 'admin'
                  ? ('HEADER.ROLE_ADMIN' | translate)
                  : auth.currentUser()?.role === 'gestionnaire'
                    ? ('HEADER.ROLE_GESTIONNAIRE' | translate)
                    : auth.currentUser()?.role === 'chauffeur'
                      ? ('HEADER.ROLE_CHAUFFEUR' | translate)
                      : ('HEADER.ROLE_USER' | translate)
              }}</div>
            </div>
          </a>

          <button type="button" class="ghost" (click)="lang.toggle()">
            {{ lang.lang() === 'fr' ? ('HEADER.LANG_FR' | translate) : ('HEADER.LANG_EN' | translate) }}
          </button>
          <button type="button" class="primary" (click)="auth.logout()">{{ 'HEADER.LOGOUT' | translate }}</button>
        </div>
      </header>

      <aside class="sf-sidebar" aria-label="Sidebar">
        <a class="sb-brand" routerLink="/dashboard" aria-label="Smart Fleet">
          <img class="sb-logo" src="assets/smart-fleet-logo.png" alt="Smart Fleet logo" />
            <div class="sb-wordmark">
            <div class="sb-name">SMART FLEET</div>
            <div class="sb-sub">{{ 'LAYOUT.FLEET_SUBTITLE' | translate }}</div>
          </div>
        </a>

        <nav class="sf-nav" aria-label="Main navigation">
          <a routerLink="/dashboard" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }" class="erp-nav-link">
            <span class="nav-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                <path d="M3 3v18h18" />
                <path d="M7 14v4" />
                <path d="M12 10v8" />
                <path d="M17 6v12" />
              </svg>
            </span>
            {{ 'NAV.DASHBOARD' | translate }}
          </a>

          <a routerLink="/profile" routerLinkActive="active" class="erp-nav-link">
            <span class="nav-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="8" r="4"/>
                <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
              </svg>
            </span>
            {{ 'NAV.PROFILE' | translate }}
          </a>

          @if (auth.currentUser()?.role === 'admin' || auth.currentUser()?.role === 'gestionnaire') {
            <a routerLink="/vehicles" routerLinkActive="active" class="erp-nav-link">
            <span class="nav-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                <path d="M3 16l1-4 2-6h12l2 6 1 4" />
                <path d="M6 12h12" />
                <path d="M7 16a2 2 0 0 0 4 0" />
                <path d="M13 16a2 2 0 0 0 4 0" />
              </svg>
            </span>
            {{ 'NAV.VEHICLES' | translate }}
            </a>
          }

          @if (auth.isAdmin()) {
            <a routerLink="/drivers" routerLinkActive="active" class="erp-nav-link">
              <span class="nav-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M20 21a8 8 0 0 0-16 0" />
                  <path d="M12 13a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" />
                </svg>
              </span>
              {{ 'NAV.DRIVERS' | translate }}
            </a>
          }

          <!-- Just added: Missions -->
          @if (auth.currentUser()?.role === 'admin' || auth.currentUser()?.role === 'gestionnaire') {
            <a routerLink="/missions" routerLinkActive="active" class="erp-nav-link">
              <span class="nav-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M9 11l3 3L22 4" />
                  <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
                </svg>
              </span>
              {{ 'NAV.MISSIONS' | translate }}
            </a>

            <a routerLink="/fleet/live" routerLinkActive="active" class="erp-nav-link">
              <span class="nav-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M12 21s7-4.5 7-10a7 7 0 1 0-14 0c0 5.5 7 10 7 10Z" />
                  <circle cx="12" cy="11" r="2.5" />
                </svg>
              </span>
              {{ 'NAV.FLEET_LIVE' | translate }}
              <span class="nav-badge nav-badge-live">Live</span>
            </a>
          }

          @if (auth.currentUser()?.role === 'admin' || auth.currentUser()?.role === 'gestionnaire') {
            <a routerLink="/maintenances" routerLinkActive="active" class="erp-nav-link">
            <span class="nav-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                <path d="M14.7 6.3a1 1 0 0 0-1.4 0l-7.1 7.1a2 2 0 0 0-.5 1.9l.3 1.1 1.1.3a2 2 0 0 0 1.9-.5l7.1-7.1a1 1 0 0 0 0-1.4Z" />
                <path d="M15 7l2-2" />
                <path d="M19 11l2-2" />
              </svg>
            </span>
            {{ 'NAV.MAINTENANCE' | translate }}
            </a>
          }

          @if (auth.currentUser()?.role === 'admin' || auth.currentUser()?.role === 'gestionnaire') {
            <a routerLink="/fuel" routerLinkActive="active" class="erp-nav-link">
            <span class="nav-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                <path d="M3 22h10V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2Z" />
                <path d="M7 9h2" />
                <path d="M13 13h2a2 2 0 0 0 2-2V6l-2-2" />
                <path d="M17 6h1a2 2 0 0 1 2 2v11a3 3 0 0 1-3 3h-1" />
              </svg>
            </span>
            {{ 'NAV.FUEL' | translate }}
            </a>
          }

          @if (auth.currentUser()?.role === 'admin' || auth.currentUser()?.role === 'gestionnaire') {
            <a routerLink="/alerts" routerLinkActive="active" class="erp-nav-link">
            <span class="nav-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                <path d="M10.3 3.3 1.6 18a2 2 0 0 0 1.7 3h17.4a2 2 0 0 0 1.7-3L13.7 3.3a2 2 0 0 0-3.4 0Z" />
                <path d="M12 9v4" />
                <path d="M12 17h.01" />
              </svg>
            </span>
            {{ 'NAV.ALERTS' | translate }}
            @if (alertsCount() > 0) {
              <span class="nav-badge nav-badge-alert">{{ alertsCount() > 99 ? '99+' : alertsCount() }}</span>
            }
            </a>
          }

          @if (auth.currentUser()?.role === 'chauffeur') {
            <a routerLink="/my-missions" routerLinkActive="active" class="erp-nav-link">
              <span class="nav-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M9 11l3 3L22 4" />
                  <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
                </svg>
              </span>
              {{ 'NAV.MY_MISSIONS' | translate }}
            </a>

            <a routerLink="/trajets" routerLinkActive="active" class="erp-nav-link">
              <span class="nav-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M3 6h5l1 2h12" />
                  <path d="M5 16l-1-5h16l-1 5" />
                  <path d="M7 18h.01" />
                  <path d="M17 18h.01" />
                </svg>
              </span>
              {{ 'NAV.TRAJETS' | translate }}
            </a>

            <a routerLink="/incidents" routerLinkActive="active" class="erp-nav-link">
              <span class="nav-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M10.3 3.3 1.6 18a2 2 0 0 0 1.7 3h17.4a2 2 0 0 0 1.7-3L13.7 3.3a2 2 0 0 0-3.4 0Z" />
                  <path d="M12 9v4" />
                  <path d="M12 17h.01" />
                </svg>
              </span>
              {{ 'NAV.INCIDENTS' | translate }}
            </a>
          }

          <a *ngIf="auth.currentUser()?.role === 'admin'" routerLink="/admin/users" routerLinkActive="active" class="erp-nav-link">
            <span class="nav-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                <path d="M20 21a8 8 0 0 0-16 0" />
                <path d="M12 13a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" />
              </svg>
            </span>
            {{ 'NAV.USER_MANAGEMENT' | translate }}
          </a>
        </nav>

        <div class="sb-footer glass-foot" aria-label="System status">
          <div class="sf-row">
            <span class="sf-pulse" aria-hidden="true"></span>
            <div>
              <div class="sf-title">{{ 'LAYOUT.SYSTEM_STATUS' | translate }}</div>
              <div class="sf-sub">{{ 'LAYOUT.SYSTEM_ONLINE' | translate }}</div>
            </div>
          </div>
          <div class="sf-spark" aria-hidden="true">
            <svg viewBox="0 0 120 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M2 24 L22 18 L38 22 L54 10 L70 16 L86 8 L102 14 L118 6" stroke="url(#g1)" stroke-width="2" stroke-linecap="round" />
              <defs><linearGradient id="g1" x1="0" y1="0" x2="120" y2="0"><stop stop-color="#22c55e"/><stop offset="1" stop-color="#38bdf8"/></linearGradient></defs>
            </svg>
          </div>
        </div>
      </aside>

      <main class="sf-main">
        <router-outlet />
      </main>
    </div>
  `,
  styles: [`
    :host { display: block; }

    /* ── Shell ────────────────────────────────────────────── */
    .sf-shell {
      --stroke:  rgba(0,201,167,0.15);
      --stroke2: rgba(0,201,167,0.10);
      --accent:  #00c9a7;
      --accent2: #2ecc71;
      --danger:  #e74c3c;
      --warn:    #f39c12;
      --shadow:  0 4px 20px rgba(0,201,167,.12);
      --shadow2: 0 2px 12px rgba(0,201,167,.08);
      --radius:  14px;
      min-height: 100vh;
      background: #f0f7f5;
      color: #2d3436;
      display: grid;
      grid-template-columns: 280px minmax(0, 1fr);
      grid-template-rows: 68px minmax(0, 1fr);
      grid-template-areas: "sidebar topbar" "sidebar main";
    }

    /* ── Topbar ───────────────────────────────────────────── */
    .sf-topbar {
      grid-area: topbar;
      position: sticky; top: 0; z-index: 30;
      display: flex; align-items: center; justify-content: space-between;
      gap: 1rem; padding: 0.75rem 1.25rem;
      background: #ffffff;
      border-bottom: 1px solid #dfe6e9;
      box-shadow: 0 2px 12px rgba(0,201,167,.08);
    }
    .tb-left  { display:flex; align-items:center; gap:.85rem; min-width:0; }
    .tb-right { display:flex; align-items:center; justify-content:flex-end; gap:.65rem; min-width:0; }
    .sb-toggle { position:absolute; width:1px; height:1px; overflow:hidden; clip:rect(0,0,0,0); white-space:nowrap; }

    .icon-btn {
      width:40px; height:40px; border-radius:12px;
      border:1px solid #dfe6e9; background:#ffffff;
      color:#636e72; display:inline-grid; place-items:center;
      box-shadow:0 2px 8px rgba(0,0,0,.06);
      transition:transform .14s, box-shadow .14s, border-color .14s; cursor:pointer;
    }
    .icon-btn:hover { transform:translateY(-1px); border-color:#b3ede3; box-shadow:0 4px 16px rgba(0,201,167,.15); color:#00a886; }
    .icon-btn svg { width:18px; height:18px; }

    .tb-search {
      flex:1; min-width:220px; max-width:620px;
      display:flex; align-items:center; gap:.5rem;
      padding:.5rem .85rem; border-radius:50px;
      border:1px solid #dfe6e9; background:#f5faf8;
      transition:border-color .14s, box-shadow .14s;
    }
    .tb-search:focus-within { border-color:#b3ede3; box-shadow:0 0 0 3px rgba(0,201,167,.12); }
    .s-ic { width:18px; height:18px; display:inline-grid; place-items:center; color:#b2bec3; }
    .s-ic svg { width:18px; height:18px; }
    .s-input {
      width:100%; border:none; outline:none; background:transparent;
      color:#2d3436; font-size:.9rem;
    }
    .s-input::placeholder { color:#b2bec3; }
    .s-clear {
      width:26px; height:26px; border-radius:8px;
      border:1px solid #dfe6e9; background:#ffffff; color:#b2bec3;
      display:inline-grid; place-items:center; cursor:pointer; transition:border-color .14s;
    }
    .s-clear:hover { border-color:#b3ede3; color:#00a886; }
    .s-clear svg { width:13px; height:13px; }

    .tb-date { position:relative; }
    .chip {
      display:inline-flex; align-items:center; gap:.5rem; height:40px;
      padding:0 .85rem; border-radius:50px; border:1px solid #dfe6e9;
      background:#f5faf8; color:#636e72;
      cursor:pointer; transition:border-color .14s; user-select:none;
    }
    .chip:hover { border-color:#b3ede3; color:#00a886; }
    .chip-ic { width:16px; height:16px; display:inline-grid; place-items:center; color:#00c9a7; }
    .chip-ic svg { width:16px; height:16px; }
    .chip-txt { font-weight:700; font-size:.84rem; }
    .chip-caret { width:13px; height:13px; display:inline-grid; place-items:center; color:#b2bec3; }
    .chip-caret svg { width:13px; height:13px; }
    .date-pop {
      position:absolute; right:0; top:50px; padding:.6rem;
      border-radius:14px; border:1px solid #dfe6e9; background:#ffffff;
      box-shadow:0 8px 32px rgba(0,0,0,.1); z-index:60;
    }
    .date-input {
      height:40px; border-radius:10px;
      border:1px solid #dfe6e9; background:#f5faf8;
      color:#2d3436; padding:0 .75rem; outline:none;
    }

    .notif { position:relative; }
    .dot {
      position:absolute; top:-4px; right:-4px;
      min-width:16px; height:16px; padding:0 4px; border-radius:999px;
      background:linear-gradient(135deg,#00c9a7,#2ecc71);
      color:#fff; font-weight:900; font-size:10px;
      display:grid; place-items:center;
      border:2px solid #ffffff; box-shadow:0 2px 8px rgba(0,201,167,.35);
    }
    .notif-panel {
      position:absolute; right:0; top:50px; width:340px;
      background:#ffffff; border:1px solid #dfe6e9;
      border-radius:18px; box-shadow:0 8px 32px rgba(0,0,0,.1);
      overflow:hidden; z-index:50;
    }
    .notif-header { display:flex; align-items:center; justify-content:space-between; padding:.85rem .95rem; border-bottom:1px solid #dfe6e9; }
    .notif-title { font-weight:800; color:#2d3436; }
    .btn-link { border:none; background:transparent; color:#00a886; font-weight:700; cursor:pointer; font-size:.78rem; }
    .notif-list { max-height:340px; overflow:auto; }
    .notif-empty { padding:1rem; color:#b2bec3; font-size:.875rem; }
    .notif-item { width:100%; text-align:left; border:none; background:transparent; padding:.75rem .95rem; cursor:pointer; border-bottom:1px solid #f1f3f5; color:#2d3436; }
    .notif-item.unread { background:#e6faf6; }
    .notif-item-title { font-weight:700; font-size:.85rem; color:#2d3436; }
    .notif-item-msg { font-size:.8rem; color:#636e72; margin-top:.12rem; }

    .tb-profile {
      display:flex; align-items:center; gap:.6rem; padding:.35rem .6rem;
      border-radius:50px; border:1px solid #dfe6e9; background:#f5faf8;
      text-decoration:none; transition:border-color .14s, box-shadow .14s;
    }
    .tb-profile:hover { border-color:#b3ede3; box-shadow:0 2px 10px rgba(0,201,167,.12); }
    .p-avatar {
      width:36px; height:36px; border-radius:12px; display:grid; place-items:center;
      background:linear-gradient(135deg,#00c9a7,#33d9be);
      border:2px solid #b3ede3; overflow:hidden;
    }
    .p-avatar-photo img { width:100%; height:100%; object-fit:cover; border-radius:10px; display:block; }
    .p-initial { font-weight:900; color:#ffffff; font-size:.9rem; }
    .p-meta { display:flex; flex-direction:column; line-height:1.1; }
    .p-name { font-weight:700; font-size:.84rem; color:#2d3436; max-width:140px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
    .p-role { font-size:.72rem; color:#636e72; text-transform:capitalize; }

    .ghost, .primary {
      height:40px; padding:0 .9rem; border-radius:50px;
      font-weight:700; font-size:.82rem; cursor:pointer;
      transition:transform .14s, box-shadow .14s, border-color .14s;
    }
    .ghost {
      border:1px solid #dfe6e9; background:#ffffff; color:#636e72;
    }
    .ghost:hover { transform:translateY(-1px); border-color:#b3ede3; color:#00a886; }
    .primary {
      border:1px solid #00a886;
      background:linear-gradient(135deg,#00a886,#00c9a7);
      color:#ffffff;
      box-shadow:0 4px 14px rgba(0,201,167,.3);
    }
    .primary:hover { transform:translateY(-1px); box-shadow:0 6px 20px rgba(0,201,167,.4); }

    /* ── Sidebar ──────────────────────────────────────────── */
    .sf-sidebar {
      grid-area: sidebar;
      position: sticky; top:0; height:100vh;
      padding: 1rem .85rem;
      border-right: 1px solid #dfe6e9;
      background: linear-gradient(180deg, #ffffff 0%, #f5faf8 100%);
      box-shadow: 2px 0 12px rgba(0,201,167,.06);
      display:flex; flex-direction:column; gap:.85rem; overflow-y:auto;
    }
    .sb-brand {
      display:flex; align-items:center; gap:.75rem;
      padding:.6rem .7rem; border-radius:14px;
      border:1px solid #b3ede3; background:#e6faf6;
      text-decoration:none;
      box-shadow:0 2px 10px rgba(0,201,167,.1);
    }
    .sb-logo { width:36px; height:36px; object-fit:contain; border-radius:8px; }
    .sb-wordmark { min-width:0; display:flex; flex-direction:column; gap:.1rem; }
    .sb-name { font-weight:900; letter-spacing:.1em; font-size:.84rem; color:#2d3436; }
    .sb-sub  { font-size:.72rem; color:#636e72; }

    .sf-nav { flex:1; display:flex; flex-direction:column; gap:.1rem; padding-top:.1rem; min-height:0; overflow:auto; }
    .nav-badge {
      margin-left:auto; font-size:10px; font-weight:800;
      letter-spacing:.06em; padding:.18rem .45rem;
      border-radius:999px; border:1px solid #dfe6e9; flex-shrink:0;
    }
    .nav-badge-live {
      color:#7c3aed; border-color:rgba(124,58,237,.3); background:rgba(124,58,237,.08);
    }
    .nav-badge-alert {
      min-width:20px; text-align:center;
      color:#e74c3c; border-color:rgba(231,76,60,.35); background:rgba(231,76,60,.08);
    }
    .sb-footer {
      margin-top:auto; padding:.7rem .65rem; border-radius:14px;
      border:1px solid #b3ede3; background:#e6faf6;
    }
    .sf-row { display:flex; align-items:center; gap:.5rem; }
    .sf-pulse {
      width:9px; height:9px; border-radius:50%;
      background:#00c9a7;
      box-shadow:0 0 0 5px rgba(0,201,167,.15), 0 0 16px rgba(0,201,167,.3);
      animation:pulse 2s ease-in-out infinite;
    }
    @keyframes pulse {
      50% { box-shadow:0 0 0 8px rgba(0,201,167,.07), 0 0 20px rgba(0,201,167,.2); }
    }
    .sf-title { font-size:.68rem; font-weight:800; letter-spacing:.1em; text-transform:uppercase; color:#b2bec3; }
    .sf-sub   { margin-top:.1rem; font-size:.82rem; font-weight:700; color:#00a886; }
    .sf-spark { margin-top:.4rem; opacity:.8; }
    .sf-spark svg { width:100%; height:26px; display:block; }

    .erp-nav-link {
      display:flex; align-items:center; gap:.6rem;
      padding:.58rem .75rem; border-radius:12px;
      color:#636e72; text-decoration:none; font-size:.9rem;
      transition:background .12s, color .12s, transform .12s, border-color .12s;
      border:1px solid transparent;
    }
    .erp-nav-link:hover {
      background:#e8f5f1; color:#00a886;
      border-color:#b3ede3; transform:translateX(2px);
    }
    .erp-nav-link.active {
      background:linear-gradient(135deg,rgba(0,201,167,.12),rgba(46,204,113,.07));
      border-color:#b3ede3; color:#00a886; font-weight:700;
      box-shadow:0 2px 10px rgba(0,201,167,.1);
    }
    .nav-icon { width:18px; height:18px; display:inline-grid; place-items:center; color:#b2bec3; }
    .erp-nav-link:hover .nav-icon,
    .erp-nav-link.active .nav-icon { color:#00c9a7; }
    .nav-icon svg { width:18px; height:18px; }

    /* ── Main ─────────────────────────────────────────────── */
    .sf-main {
      grid-area:main; min-width:0; min-height:0;
      padding:1.1rem 1.1rem 1.4rem; overflow:auto;
      background:#f0f7f5;
    }

    /* ── Collapsed sidebar ────────────────────────────────── */
    .sf-shell:has(#sbToggle:checked) { grid-template-columns:80px minmax(0,1fr); }
    .sf-shell:has(#sbToggle:checked) .sb-wordmark { display:none; }
    .sf-shell:has(#sbToggle:checked) .sb-brand { justify-content:center; }
    .sf-shell:has(#sbToggle:checked) .erp-nav-link { justify-content:center; gap:0; padding:.58rem 0; }
    .sf-shell:has(#sbToggle:checked) .erp-nav-link .nav-icon { width:20px; }
    .sf-shell:has(#sbToggle:checked) .erp-nav-link { font-size:0; }
    .sf-shell:has(#sbToggle:checked) .erp-nav-link *:not(.nav-icon):not(svg):not(.nav-badge) { display:none; }
    .sf-shell:has(#sbToggle:checked) .nav-badge { display:none; }
    .sf-shell:has(#sbToggle:checked) .sb-footer { display:none; }

    @media (max-width:1100px) { .tb-search { min-width:160px; } .p-meta { display:none; } }
    @media (max-width:920px) {
      .sf-shell { grid-template-columns:80px minmax(0,1fr); }
      .sb-wordmark { display:none; }
      .tb-search { display:none; }
    }
  `],
})
export class LayoutComponent implements OnInit, OnDestroy {
  currentYear = new Date().getFullYear();
  notifOpen = false;
  isDateOpen = false;
  search = '';
  selectedDate = new Date().toISOString().slice(0, 10);
  alertsCount = signal(0);

  constructor(
    public auth: AuthService,
    public lang: LanguageService,
    public notif: NotificationService,
    private api: ApiService,
  ) {}

  get selectedDateLabel(): string {
    // Keep a stable, premium-looking label without depending on i18n files.
    const d = new Date(this.selectedDate);
    if (Number.isNaN(d.getTime())) return this.selectedDate;
    return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: '2-digit' });
  }

  ngOnInit(): void {
    this.notif.init();
    window.addEventListener('click', this.closeNotifOnOutside);
    const r = this.auth.currentUser()?.role;
    if (r === 'admin' || r === 'gestionnaire') {
      this.api
        .get<{ count?: number; alerts?: unknown[] }>('/alerts')
        .pipe(take(1))
        .subscribe({
          next: (res) => this.alertsCount.set(res.count ?? res.alerts?.length ?? 0),
          error: () => this.alertsCount.set(0),
        });
    }
  }

  ngOnDestroy(): void {
    window.removeEventListener('click', this.closeNotifOnOutside);
  }

  private closeNotifOnOutside = () => {
    this.notifOpen = false;
    this.isDateOpen = false;
  };

  toggleNotif(): void {
    this.notifOpen = !this.notifOpen;
  }

  onDateChange(v: string): void {
    this.selectedDate = v;
    this.isDateOpen = false;
  }

  openNotif(n: any): void {
    if (n?.id && !n.read_at) {
      this.notif.markRead(n.id);
    }
  }
}
