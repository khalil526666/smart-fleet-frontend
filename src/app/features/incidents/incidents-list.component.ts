import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ApiService } from '../../core/services/api.service';

type IncidentRow = {
  id: number;
  type?: string | null;
  description: string;
  status: string;
  created_at: string;
  mission?: { id: number; title: string; status: string } | null;
};

@Component({
  selector: 'app-incidents-list',
  standalone: true,
  imports: [CommonModule, RouterLink, TranslateModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="page">
      <div class="head">
        <div>
          <h2>{{ 'NAV.INCIDENTS' | translate }}</h2>
          <p class="muted">{{ 'INCIDENTS.LIST_SUBTITLE' | translate }}</p>
        </div>
        <a class="btn primary" routerLink="/incidents/report">{{ 'INCIDENTS.REPORT_TITLE' | translate }}</a>
      </div>

      @if (error()) { <div class="error">{{ error() }}</div> }

      <div class="card">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>{{ 'INCIDENTS.TYPE' | translate }}</th>
              <th>{{ 'MISSIONS.NAME' | translate }}</th>
              <th>Status</th>
              <th>{{ 'INCIDENTS.DESCRIPTION' | translate }}</th>
            </tr>
          </thead>
          <tbody>
            @for (i of items(); track i.id) {
              <tr>
                <td>{{ i.id }}</td>
                <td class="muted">{{ i.type || '—' }}</td>
                <td class="muted">{{ i.mission?.title || '—' }}</td>
                <td><span class="pill">{{ i.status }}</span></td>
                <td>{{ i.description }}</td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: [`
    .page { max-width: 1100px; margin: 0 auto; }
    .head { display:flex; align-items:flex-start; justify-content:space-between; gap: 1rem; margin-bottom: 1rem; }
    .muted { color: var(--text-muted); margin:.25rem 0 0; }
    .btn { padding: 6px 10px; border: 1px solid var(--border); background: var(--bg-surface-2); color: var(--text-primary); border-radius: 10px; cursor: pointer; font-weight: 750; text-decoration:none; }
    .btn.primary { background: var(--accent); border-color: var(--accent); color: var(--bg-app); }
    .card { background: var(--bg-surface); border: 1px solid var(--border); border-radius:16px; overflow:hidden; }
    table { width:100%; border-collapse: collapse; }
    th, td { padding: 10px 12px; border-bottom: 1px solid var(--border); text-align:left; color: var(--text-primary); }
    th { color: var(--text-muted); font-size: 0.8125rem; text-transform: uppercase; letter-spacing: 0.03em; }
    .pill { display:inline-block; padding: 2px 8px; border-radius: 999px; font-size: 12px; background: var(--bg-surface-2); color: var(--text-secondary); text-transform: capitalize; }
    .error { padding: 10px 12px; background: rgba(248,81,73,.1); border: 1px solid rgba(248,81,73,.3); color: var(--danger); border-radius: 12px; margin-bottom: 1rem; }
  `],
})
export class IncidentsListComponent {
  items = signal<IncidentRow[]>([]);
  error = signal('');

  constructor(private api: ApiService) {
    this.load();
  }

  load(): void {
    this.error.set('');
    this.api.get<{ data: IncidentRow[] }>('/incidents').subscribe({
      next: (r) => this.items.set(r.data),
      error: (err) => this.error.set(err?.error?.message || 'Failed to load incidents.'),
    });
  }
}

