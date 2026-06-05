import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../core/services/api.service';
import { AuthService } from '../../core/services/auth.service';
import { TranslateModule } from '@ngx-translate/core';

type Role = 'user' | 'gestionnaire' | 'chauffeur' | 'admin';

interface UserRow {
  id: number;
  name: string;
  email: string;
  role: Role;
  created_at: string;
  photo_url?: string | null;
}

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="page">
      <div class="head">
        <div>
          <h2>{{ 'ADMIN.USER_MANAGEMENT_TITLE' | translate }}</h2>
        </div>
        <button class="btn" (click)="load()" [disabled]="loading()">{{ 'ADMIN.REFRESH' | translate }}</button>
      </div>

      @if (lastAction()) {
        <div class="ok">{{ lastAction() }}</div>
      }

      @if (error()) {
        <div class="err">{{ error() }}</div>
      }

      @if (loading()) {
        <div class="muted">{{ 'ADMIN.LOADING' | translate }}</div>
      } @else {
        <div class="users-grid">
          @for (u of users(); track u.id) {
            <div class="id-card role-{{ u.role }}">
              <div class="card-header">
                <span class="brand">SMART FLEET</span>
                <span class="role-badge role-badge-{{ u.role }}">{{ u.role }}</span>
              </div>

              <div class="card-body">
                <div class="card-photo">
                  @if (u.photo_url) {
                    <img [src]="u.photo_url" [alt]="u.name" />
                  } @else {
                    <span class="photo-initial">{{ u.name.charAt(0).toUpperCase() }}</span>
                  }
                </div>
                <div class="card-info">
                  <div class="info-row">
                    <span class="info-label">NOM</span>
                    <span class="info-val">{{ u.name }}</span>
                  </div>
                  <div class="info-row">
                    <span class="info-label">EMAIL</span>
                    <span class="info-val info-email">{{ u.email }}</span>
                  </div>
                  <div class="info-row">
                    <span class="info-label">ID</span>
                    <span class="info-val">#{{ u.id }}</span>
                  </div>
                  <div class="info-row">
                    <span class="info-label">DEPUIS</span>
                    <span class="info-val">{{ u.created_at | date:'dd/MM/yyyy' }}</span>
                  </div>
                </div>
              </div>

              @if (isAdmin()) {
                <div class="card-actions">
                  <button
                    class="act-btn btn-gest"
                    type="button"
                    (click)="makeGestionnaire(u)"
                    [disabled]="roleChangeDisabled(u)"
                    [title]="'ADMIN.MAKE_GESTIONNAIRE' | translate"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M20 21a8 8 0 0 0-16 0" /><path d="M12 13a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" /><path d="M19 8v6" /><path d="M16 11h6" />
                    </svg>
                  </button>
                  <button
                    class="act-btn btn-chauf"
                    type="button"
                    (click)="makeChauffeur(u)"
                    [disabled]="roleChangeDisabled(u)"
                    [title]="'ADMIN.MAKE_CHAUFFEUR' | translate"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M3 16l1-4 2-6h12l2 6 1 4" /><path d="M6 12h12" /><path d="M7 16a2 2 0 0 0 4 0" /><path d="M13 16a2 2 0 0 0 4 0" />
                    </svg>
                  </button>
                  <button
                    class="act-btn btn-reset"
                    type="button"
                    (click)="resetToUser(u)"
                    [disabled]="roleChangeDisabled(u)"
                    [title]="'ADMIN.REMOVE_GESTIONNAIRE' | translate"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M3 12a9 9 0 1 0 3-6.7" /><path d="M3 3v6h6" />
                    </svg>
                  </button>
                  <button
                    class="act-btn btn-del"
                    type="button"
                    (click)="deleteUser(u)"
                    [disabled]="deleteDisabled(u)"
                    [title]="'ADMIN.DELETE_USER' | translate"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M3 6h18" /><path d="M8 6V4h8v2" /><path d="M6 6l1 16h10l1-16" /><path d="M10 11v6" /><path d="M14 11v6" />
                    </svg>
                  </button>
                </div>
              }
            </div>
          } @empty {
            <div class="muted">Aucun utilisateur.</div>
          }
        </div>
      }
    </div>
  `,
  styles: [`
    .page { max-width:1200px; margin:0 auto; }
    .head { display:flex; align-items:flex-start; justify-content:space-between; gap:1rem; margin-bottom:1.25rem; }
    h2 { margin:0; font-size:1.5rem; font-weight:900; color:#2d3436; }
    .muted { color:#b2bec3; }

    .users-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:1.25rem; }
    @media (max-width:900px) { .users-grid { grid-template-columns:repeat(2,1fr); } }
    @media (max-width:580px) { .users-grid { grid-template-columns:1fr; } }

    /* ── User card ─────────────────────────────────────────────── */
    .id-card {
      background:#ffffff; border-radius:16px;
      border:1px solid #dfe6e9; padding:1rem;
      display:flex; flex-direction:column; gap:.75rem;
      box-shadow:0 2px 12px rgba(44,62,80,.07);
      transition:transform .18s ease, box-shadow .18s ease;
    }
    .id-card:hover { transform:translateY(-4px); box-shadow:0 8px 32px rgba(0,201,167,.18); border-color:#b3ede3; }

    /* ── Card header ───────────────────────────────────────────── */
    .card-header { display:flex; align-items:center; justify-content:space-between; }
    .brand { font-size:.68rem; font-weight:800; letter-spacing:.1em; color:#b2bec3; text-transform:uppercase; }

    /* ── Role badges ───────────────────────────────────────────── */
    .role-badge { padding:.22rem .65rem; border-radius:999px; font-size:.68rem; font-weight:800; text-transform:uppercase; letter-spacing:.06em; }
    .role-badge-admin        { background:#fdedec; border:1px solid #fadbd8; color:#e74c3c; }
    .role-badge-gestionnaire { background:#e6faf6; border:1px solid #b3ede3; color:#00a886; }
    .role-badge-chauffeur    { background:#eafaf1; border:1px solid #a9dfbf; color:#27ae60; }
    .role-badge-user         { background:#f1f3f5; border:1px solid #dfe6e9; color:#636e72; }

    /* ── Card body ─────────────────────────────────────────────── */
    .card-body { display:flex; gap:.85rem; align-items:flex-start; }

    .card-photo {
      width:72px; height:96px; border-radius:10px; flex-shrink:0;
      overflow:hidden; display:flex; align-items:center; justify-content:center;
      background:#e8f5f1;
    }
    .role-admin       .card-photo { border:2px solid #fadbd8; }
    .role-gestionnaire .card-photo { border:2px solid #b3ede3; }
    .role-chauffeur   .card-photo { border:2px solid #a9dfbf; }
    .role-user        .card-photo { border:2px solid #dfe6e9; }
    .card-photo img { width:100%; height:100%; object-fit:cover; display:block; }
    .photo-initial { font-size:1.8rem; font-weight:900; color:#00a886; }

    /* ── Info rows ─────────────────────────────────────────────── */
    .card-info { flex:1; min-width:0; display:flex; flex-direction:column; gap:.3rem; }
    .info-row { display:flex; flex-direction:column; }
    .info-label { font-size:.6rem; font-weight:800; letter-spacing:.08em; color:#b2bec3; text-transform:uppercase; }
    .info-val { font-size:.82rem; font-weight:600; color:#2d3436; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
    .info-email { font-size:.73rem; }

    /* ── Action buttons ────────────────────────────────────────── */
    .card-actions { display:flex; gap:.4rem; padding-top:.6rem; border-top:1px solid #f1f3f5; }
    .act-btn {
      width:34px; height:34px; border-radius:9px;
      display:inline-grid; place-items:center; cursor:pointer;
      transition:transform .14s, background .14s, color .14s;
    }
    .act-btn svg { width:16px; height:16px; }
    .act-btn:hover:not([disabled]) { transform:translateY(-1px); }
    .act-btn[disabled] { opacity:.4; cursor:not-allowed; transform:none; }

    .btn-gest  { border:1px solid #b3ede3; background:#e6faf6; color:#00a886; }
    .btn-gest:hover:not([disabled])  { background:#00c9a7; color:#fff; border-color:#00c9a7; }

    .btn-chauf { border:1px solid #dce8ff; background:#eef3ff; color:#4a6cf7; }
    .btn-chauf:hover:not([disabled]) { background:#4a6cf7; color:#fff; border-color:#4a6cf7; }

    .btn-reset { border:1px solid #dfe6e9; background:#f5faf8; color:#636e72; }
    .btn-reset:hover:not([disabled]) { background:#636e72; color:#fff; border-color:#636e72; }

    .btn-del { border:1px solid #fadbd8; background:#fdedec; color:#e74c3c; margin-left:auto; }
    .btn-del:hover:not([disabled]) { background:#e74c3c; color:#fff; border-color:#e74c3c; }

    /* ── Refresh button ────────────────────────────────────────── */
    .btn { padding:.45rem 1rem; border:1px solid #b3ede3; background:#e6faf6; color:#00a886; border-radius:10px; font-size:.875rem; font-weight:700; cursor:pointer; transition:transform .14s, background .14s; }
    .btn:hover:not([disabled]) { transform:translateY(-1px); background:#00c9a7; color:#fff; border-color:#00c9a7; }
    .btn[disabled] { opacity:.5; cursor:not-allowed; }

    /* ── Status messages ───────────────────────────────────────── */
    .err { padding:10px 12px; background:#fdedec; border:1px solid #fadbd8; color:#e74c3c; border-radius:12px; margin-bottom:1rem; font-weight:700; }
    .ok  { padding:10px 12px; background:#e6faf6; border:1px solid #b3ede3; color:#00a886;  border-radius:12px; margin-bottom:1rem; font-weight:700; }
  `],
})
export class UserManagementComponent {
  users = signal<UserRow[]>([]);
  loading = signal(false);
  error = signal<string>('');
  lastAction = signal<string>('');

  isAdmin = computed(() => this.auth.currentUser()?.role === 'admin');

  constructor(
    private api: ApiService,
    private auth: AuthService,
  ) {
    this.load();
  }

  load(): void {
    if (!this.isAdmin()) {
      this.error.set('Forbidden');
      return;
    }
    this.loading.set(true);
    this.error.set('');
    this.lastAction.set('');
    this.api.get<{ data: UserRow[] }>('/users').subscribe({
      next: (res) => {
        this.users.set(res.data);
        this.loading.set(false);
      },
      error: (err) => {
        this.loading.set(false);
        const status = err?.status ? `HTTP ${err.status}` : '';
        this.error.set(`${status} ${err?.error?.message || 'Failed to load users.'}`.trim());
      },
    });
  }

  private isSelf(u: UserRow): boolean {
    return u.id === this.auth.currentUser()?.id;
  }

  roleChangeDisabled(u: UserRow): boolean {
    // Only admin can change roles, and admin cannot change himself or any admin.
    return !this.isAdmin() || u.role === 'admin' || this.isSelf(u);
  }

  deleteDisabled(u: UserRow): boolean {
    // Only admin can delete users, and admin cannot delete himself or any admin.
    return !this.isAdmin() || u.role === 'admin' || this.isSelf(u);
  }

  makeGestionnaire(u: UserRow): void {
    if (this.roleChangeDisabled(u)) return;
    const ok = confirm(`Make user #${u.id} (${u.email}) a gestionnaire?`);
    if (!ok) return;
    this.loading.set(true);
    this.error.set('');
    this.api.post(`/users/${u.id}/make-gestionnaire`, {}).subscribe({
      next: () => {
        this.users.set(this.users().map(x => (x.id === u.id ? { ...x, role: 'gestionnaire' } : x)));
        this.lastAction.set(`User #${u.id} promoted.`);
        this.loading.set(false);
      },
      error: (err) => {
        this.loading.set(false);
        const status = err?.status ? `HTTP ${err.status}` : '';
        this.error.set(`${status} ${err?.error?.message || 'Action failed.'}`.trim());
      },
    });
  }

  removeGestionnaire(u: UserRow): void {
    if (this.roleChangeDisabled(u)) return;
    const ok = confirm(`Set user #${u.id} (${u.email}) back to user?`);
    if (!ok) return;
    this.loading.set(true);
    this.error.set('');
    this.api.post(`/users/${u.id}/remove-gestionnaire`, {}).subscribe({
      next: () => {
        this.users.set(this.users().map(x => (x.id === u.id ? { ...x, role: 'user' } : x)));
        this.lastAction.set(`User #${u.id} demoted.`);
        this.loading.set(false);
      },
      error: (err) => {
        this.loading.set(false);
        const status = err?.status ? `HTTP ${err.status}` : '';
        this.error.set(`${status} ${err?.error?.message || 'Action failed.'}`.trim());
      },
    });
  }

  makeChauffeur(u: UserRow): void {
    if (this.roleChangeDisabled(u)) return;
    const ok = confirm(`Make user #${u.id} (${u.email}) a chauffeur?`);
    if (!ok) return;
    this.loading.set(true);
    this.error.set('');
    this.api.post(`/users/${u.id}/make-chauffeur`, {}).subscribe({
      next: () => {
        this.users.set(this.users().map(x => (x.id === u.id ? { ...x, role: 'chauffeur' } : x)));
        this.lastAction.set(`User #${u.id} set as chauffeur.`);
        this.loading.set(false);
      },
      error: (err) => {
        this.loading.set(false);
        const status = err?.status ? `HTTP ${err.status}` : '';
        this.error.set(`${status} ${err?.error?.message || 'Action failed.'}`.trim());
      },
    });
  }

  deleteUser(u: UserRow): void {
    if (this.deleteDisabled(u)) return;
    const ok = confirm(`Delete user #${u.id} (${u.email})?`);
    if (!ok) return;

    this.loading.set(true);
    this.error.set('');
    this.api.delete(`/users/${u.id}`).subscribe({
      next: () => {
        this.users.set(this.users().filter(x => x.id !== u.id));
        this.lastAction.set(`User #${u.id} deleted.`);
        this.loading.set(false);
      },
      error: (err) => {
        this.loading.set(false);
        const status = err?.status ? `HTTP ${err.status}` : '';
        this.error.set(`${status} ${err?.error?.message || 'Delete failed.'}`.trim());
      },
    });
  }

  // Alias to keep UI wording simple: reset to "user"
  resetToUser(u: UserRow): void {
    return this.removeGestionnaire(u);
  }
}

