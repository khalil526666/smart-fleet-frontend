import { ChangeDetectionStrategy, Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/services/api.service';
import { AuthService } from '../../core/services/auth.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

interface Driver {
  id: number;
  name: string;
  phone: string | null;
  license_number: string | null;
  address: string | null;
  photo_url?: string | null;
  vehicle?: { id: number; brand: string; model: string; license_plate: string } | null;
}

interface Paginated<T> {
  data: T[];
  current_page: number;
  last_page: number;
  total: number;
}

@Component({
  selector: 'app-driver-list',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, RouterLink, FormsModule, TranslateModule],
  template: `
    <div class="container">
      <div class="page-header">
        <h1 class="page-title">{{ 'DRIVERS.TITLE' | translate }}</h1>
        <a routerLink="/drivers/new" class="btn btn-primary">{{ 'DRIVERS.ADD' | translate }}</a>
      </div>

      <div class="toolbar">
        <input type="text" class="search-input" [placeholder]="'DRIVERS.SEARCH_PLACEHOLDER' | translate" [(ngModel)]="search" (ngModelChange)="load()" />
      </div>

      @if (loading()) {
        <div class="loading-state">
          <span class="spinner"></span>
          <span>{{ 'COMMON.LOADING' | translate }}</span>
        </div>
      } @else {
        <div class="drivers-grid">
          @for (d of drivers(); track d.id) {
            <div class="driver-card" [class.assigned]="!!d.vehicle">
              <div class="card-header">
                <span class="brand-label">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" width="14" height="14">
                    <path d="M3 16l1-4 2-6h12l2 6 1 4"/><path d="M6 12h12"/><path d="M7 16a2 2 0 0 0 4 0"/><path d="M13 16a2 2 0 0 0 4 0"/>
                  </svg>
                  SMART FLEET
                </span>
                <span class="status-dot" [class.status-assigned]="!!d.vehicle" [class.status-free]="!d.vehicle">
                  {{ d.vehicle ? ('DRIVERS.ASSIGNED' | translate) : ('DRIVERS.NO_VEHICLE' | translate) }}
                </span>
              </div>

              <div class="card-body">
                <div class="card-photo">
                  @if (d.photo_url) {
                    <img [src]="d.photo_url" [alt]="d.name" />
                  } @else {
                    <span class="photo-initial">{{ d.name.slice(0, 2).toUpperCase() }}</span>
                  }
                </div>

                <div class="card-info">
                  <div class="info-row">
                    <span class="info-label">{{ 'DRIVERS.NAME' | translate }}</span>
                    <span class="info-val">{{ d.name }}</span>
                  </div>
                  <div class="info-row">
                    <span class="info-label">{{ 'DRIVERS.LICENSE' | translate }}</span>
                    <span class="info-val">{{ d.license_number ?? '—' }}</span>
                  </div>
                  <div class="info-row">
                    <span class="info-label">{{ 'DRIVERS.PHONE' | translate }}</span>
                    <span class="info-val">{{ d.phone ?? '—' }}</span>
                  </div>
                  @if (d.vehicle) {
                    <div class="info-row">
                      <span class="info-label">{{ 'DRIVERS.ASSIGNED_VEHICLE' | translate }}</span>
                      <span class="info-val">{{ d.vehicle.brand }} {{ d.vehicle.model }}</span>
                    </div>
                    <div class="info-row">
                      <span class="info-label">{{ 'VEHICLES.PLATE' | translate }}</span>
                      <span class="info-val immat">{{ d.vehicle.license_plate }}</span>
                    </div>
                  } @else {
                    <div class="info-row">
                      <span class="info-label">{{ 'DRIVERS.ASSIGNED_VEHICLE' | translate }}</span>
                      <span class="info-val muted">{{ 'DRIVERS.NO_VEHICLE' | translate }}</span>
                    </div>
                  }
                </div>
              </div>

              <div class="card-actions">
                <a [routerLink]="['/drivers', d.id, 'edit']" class="act-btn btn-edit">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" width="15" height="15">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5Z"/>
                  </svg>
                  {{ 'COMMON.EDIT' | translate }}
                </a>
                @if (isAdmin()) {
                  <button type="button" class="act-btn btn-del" (click)="delete(d)">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" width="15" height="15">
                      <path d="M3 6h18"/><path d="M8 6V4h8v2"/><path d="M6 6l1 16h10l1-16"/>
                    </svg>
                    {{ 'COMMON.DELETE' | translate }}
                  </button>
                }
              </div>
            </div>
          } @empty {
            <div class="muted">{{ 'DRIVERS.NO_RESULTS' | translate }}</div>
          }
        </div>

        @if (lastPage() > 1) {
          <div class="pagination">
            <button type="button" class="btn" [disabled]="page() <= 1" (click)="setPage(page() - 1)">{{ 'COMMON.PREVIOUS' | translate }}</button>
            <span class="page-info">{{ 'COMMON.PAGE_OF' | translate:{ page: page(), total: lastPage() } }}</span>
            <button type="button" class="btn" [disabled]="page() >= lastPage()" (click)="setPage(page() + 1)">{{ 'COMMON.NEXT' | translate }}</button>
          </div>
        }
      }
    </div>
  `,
  styles: [`
    .page-header { display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem; }
    .page-title { margin:0; font-size:1.5rem; font-weight:900; color:#2d3436; }
    .toolbar { margin-bottom:1.25rem; }
    .search-input { padding:.55rem .85rem; border:1px solid #dfe6e9; border-radius:50px; background:#f5faf8; color:#2d3436; font-size:.9rem; outline:none; min-width:280px; transition:border-color .14s, box-shadow .14s; }
    .search-input:focus { border-color:#b3ede3; box-shadow:0 0 0 3px rgba(0,201,167,.1); }
    .search-input::placeholder { color:#b2bec3; }
    .muted { color:#b2bec3; padding:.5rem 0; }
    .loading-state { display:flex; align-items:center; gap:.75rem; padding:3rem 0; color:#b2bec3; font-size:.9rem; }
    .spinner { width:22px; height:22px; border:2.5px solid rgba(0,201,167,.2); border-top-color:#00c9a7; border-radius:50%; animation:spin .7s linear infinite; flex-shrink:0; }
    @keyframes spin { to { transform:rotate(360deg); } }

    .drivers-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:1.25rem; }
    @media (max-width:900px) { .drivers-grid { grid-template-columns:repeat(2,1fr); } }
    @media (max-width:560px) { .drivers-grid { grid-template-columns:1fr; } }

    .driver-card {
      background:#ffffff; border-radius:16px;
      border:1px solid #dfe6e9; padding:1rem;
      display:flex; flex-direction:column; gap:.75rem;
      box-shadow:0 2px 12px rgba(44,62,80,.07);
      transition:transform .18s ease, box-shadow .18s ease;
    }
    .driver-card:hover { transform:translateY(-4px); box-shadow:0 8px 32px rgba(0,201,167,.18); border-color:#b3ede3; }
    .driver-card.assigned { border-left:4px solid #00c9a7; }

    .card-header { display:flex; align-items:center; justify-content:space-between; }
    .brand-label { display:flex; align-items:center; gap:.3rem; font-size:.68rem; font-weight:800; letter-spacing:.1em; color:#b2bec3; text-transform:uppercase; }

    .status-dot { padding:.18rem .6rem; border-radius:999px; font-size:.68rem; font-weight:700; }
    .status-assigned { background:#e6faf6; border:1px solid #b3ede3; color:#00a886; }
    .status-free     { background:#f1f3f5; border:1px solid #dfe6e9; color:#636e72; }

    .card-body { display:flex; gap:.85rem; align-items:flex-start; }

    .card-photo {
      width:72px; height:96px; border-radius:10px; flex-shrink:0;
      overflow:hidden; display:flex; align-items:center; justify-content:center;
      background:#e8f5f1; border:2px solid #b3ede3;
    }
    .card-photo img { width:100%; height:100%; object-fit:cover; display:block; }
    .photo-initial { font-size:1.4rem; font-weight:900; color:#00a886; }

    .card-info { flex:1; min-width:0; display:flex; flex-direction:column; gap:.28rem; }
    .info-row { display:flex; flex-direction:column; }
    .info-label { font-size:.6rem; font-weight:800; letter-spacing:.08em; color:#b2bec3; text-transform:uppercase; }
    .info-val { font-size:.83rem; font-weight:600; color:#2d3436; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
    .immat { font-family:monospace; font-size:.78rem; letter-spacing:.06em; color:#00a886; background:#e6faf6; padding:.1rem .4rem; border-radius:4px; display:inline-block; }
    .info-val.muted { color:#b2bec3; font-weight:400; font-style:italic; }

    .card-actions { display:flex; gap:.5rem; padding-top:.6rem; border-top:1px solid #f1f3f5; }
    .act-btn {
      display:inline-flex; align-items:center; gap:.3rem;
      padding:.38rem .7rem; border-radius:8px; font-size:.78rem; font-weight:700;
      cursor:pointer; text-decoration:none; transition:transform .14s, box-shadow .14s;
    }
    .act-btn:hover { transform:translateY(-1px); }
    .btn-edit { border:1px solid #b3ede3; background:#e6faf6; color:#00a886; }
    .btn-edit:hover { background:#00c9a7; color:#ffffff; border-color:#00c9a7; }
    .btn-del  { border:1px solid #fadbd8; background:#fdedec; color:#e74c3c; margin-left:auto; }
    .btn-del:hover { background:#e74c3c; color:#ffffff; border-color:#e74c3c; }

    .btn { padding:.45rem .9rem; border:1px solid #dfe6e9; background:#ffffff; color:#2d3436; border-radius:10px; font-size:.875rem; font-weight:700; cursor:pointer; transition:transform .14s, border-color .14s; text-decoration:none; display:inline-flex; align-items:center; }
    .btn:hover:not([disabled]) { transform:translateY(-1px); border-color:#b3ede3; color:#00a886; }
    .btn[disabled] { opacity:.5; cursor:not-allowed; }
    .btn-primary { border-color:#00a886; background:linear-gradient(135deg,#00a886,#00c9a7); color:#ffffff; }

    .pagination { display:flex; align-items:center; gap:1rem; margin-top:1.5rem; }
    .page-info { color:#b2bec3; font-size:.875rem; }
  `],
})
export class DriverListComponent implements OnInit {
  drivers = signal<Driver[]>([]);
  loading = signal(false);
  page = signal(1);
  lastPage = signal(1);
  search = '';

  isAdmin = () => this.auth.currentUser()?.role === 'admin';

  constructor(
    private api: ApiService,
    private t: TranslateService,
    private auth: AuthService,
  ) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    const params: Record<string, string | number> = { page: this.page() };
    if (this.search) params['search'] = this.search;
    this.api.get<Paginated<Driver>>('/drivers', params).subscribe({
      next: (res) => {
        this.drivers.set(res.data);
        this.lastPage.set(res.last_page);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  setPage(p: number): void {
    this.page.set(p);
    this.load();
  }

  delete(d: Driver): void {
    if (!confirm(this.t.instant('DRIVERS.CONFIRM_DELETE', { name: d.name }))) return;
    this.api.delete(`/drivers/${d.id}`).subscribe({ next: () => this.load() });
  }
}
