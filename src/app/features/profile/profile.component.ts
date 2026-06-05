import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { AuthService } from '../../core/services/auth.service';
import { ProfileService } from '../../core/services/profile.service';
import { take } from 'rxjs';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TranslateModule],
  template: `
    <div class="profile-page">
      <div class="page-header">
        <div>
          <h1 class="page-title">{{ 'PROFILE.TITLE' | translate }}</h1>
          <p class="page-sub">{{ 'PROFILE.SUBTITLE' | translate }}</p>
        </div>
      </div>

      @if (profileSuccess()) {
        <div class="alert alert-ok">{{ profileSuccess() }}</div>
      }
      @if (profileError()) {
        <div class="alert alert-err">{{ profileError() }}</div>
      }

      <div class="profile-grid">
        <!-- Left: Photo card -->
        <div class="photo-card">
          <div class="photo-frame">
            @if (photoUrl()) {
              <img [src]="photoUrl()" class="photo-img" alt="Photo de profil" />
            } @else {
              <div class="photo-initial">{{ initials() }}</div>
            }
            @if (uploadingPhoto()) {
              <div class="photo-overlay"><span class="spinner"></span></div>
            }
          </div>
          <div class="photo-actions">
            <label class="btn btn-upload" [class.disabled]="uploadingPhoto()">
              <input type="file" accept="image/jpeg,image/png,image/webp" (change)="onPhotoSelected($event)" [disabled]="uploadingPhoto()" />
              {{ 'PROFILE.CHANGE_PHOTO' | translate }}
            </label>
            @if (photoUrl()) {
              <button type="button" class="btn btn-danger-sm" (click)="deletePhoto()" [disabled]="uploadingPhoto()">
                {{ 'PROFILE.DELETE_PHOTO' | translate }}
              </button>
            }
          </div>
          <div class="role-badge role-{{ auth.currentUser()?.role }}">
            {{ roleLabel() }}
          </div>
          @if (auth.currentUser()?.created_at) {
            <div class="member-since">
              {{ 'PROFILE.MEMBER_SINCE' | translate }}
              {{ auth.currentUser()?.created_at | date:'dd/MM/yyyy' }}
            </div>
          }
        </div>

        <!-- Right: Personal info form -->
        <div class="info-card">
          <h3 class="section-title">{{ 'PROFILE.PERSONAL_INFO' | translate }}</h3>

          <form [formGroup]="profileForm" (ngSubmit)="saveProfile()">
            <div class="form-grid">
              <div class="form-group">
                <label>{{ 'PROFILE.NAME' | translate }}</label>
                <input type="text" formControlName="name" class="form-input" />
              </div>

              <div class="form-group">
                <label>{{ 'PROFILE.EMAIL' | translate }}</label>
                <input type="email" [value]="auth.currentUser()?.email ?? ''" class="form-input readonly" readonly />
              </div>

              <div class="form-group">
                <label>{{ 'PROFILE.PHONE' | translate }}</label>
                <input type="tel" formControlName="phone" class="form-input" [placeholder]="'PROFILE.PHONE_PLACEHOLDER' | translate" />
              </div>

              <div class="form-group">
                <label>{{ 'PROFILE.ROLE' | translate }}</label>
                <input type="text" [value]="roleLabel()" class="form-input readonly" readonly />
              </div>

              <div class="form-group">
                <label>{{ 'PROFILE.BIRTHDATE' | translate }}</label>
                <input type="date" formControlName="date_naissance" class="form-input" />
              </div>

              <div class="form-group form-group-full">
                <label>{{ 'PROFILE.ADDRESS' | translate }}</label>
                <textarea formControlName="adresse" class="form-input form-textarea" rows="2" [placeholder]="'PROFILE.ADDRESS_PLACEHOLDER' | translate"></textarea>
              </div>
            </div>

            <div class="form-actions">
              <button type="submit" class="btn btn-primary" [disabled]="savingProfile()">
                {{ savingProfile() ? ('COMMON.SAVING' | translate) : ('PROFILE.SAVE_INFO' | translate) }}
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- CIN Section -->
      <div class="cin-card">
        <h3 class="section-title">{{ 'PROFILE.CIN_TITLE' | translate }}</h3>

        <div class="cin-grid">
          <div class="form-group">
            <label>{{ 'PROFILE.CIN_NUMBER' | translate }}</label>
            <div class="cin-number-row">
              <input type="text" [formControl]="cinNumberCtrl" class="form-input" [placeholder]="'PROFILE.CIN_NUMBER_PLACEHOLDER' | translate" />
              <button type="button" class="btn btn-sm btn-primary" (click)="saveCinNumber()" [disabled]="savingCin()">
                {{ 'COMMON.SAVE' | translate }}
              </button>
            </div>
          </div>

          <div class="cin-photos">
            <div class="cin-photo-slot">
              <div class="cin-label">{{ 'PROFILE.CIN_RECTO' | translate }}</div>
              <div class="cin-frame" [class.has-photo]="cinRectoUrl()">
                @if (cinRectoUrl()) {
                  <img [src]="cinRectoUrl()" alt="CIN Recto" />
                } @else {
                  <div class="cin-placeholder">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                      <rect x="2" y="5" width="20" height="14" rx="2"/>
                      <path d="M7 15h.01M7 12h.01M7 9h.01M10 9h4M10 12h4M10 15h4"/>
                    </svg>
                    <span>{{ 'PROFILE.CIN_NOT_UPLOADED' | translate }}</span>
                  </div>
                }
                @if (uploadingCinRecto()) {
                  <div class="photo-overlay"><span class="spinner"></span></div>
                }
              </div>
              <label class="btn btn-upload-sm" [class.disabled]="uploadingCinRecto()">
                <input type="file" accept="image/jpeg,image/png" (change)="onCinPhoto($event, 'recto')" [disabled]="uploadingCinRecto()" />
                {{ 'PROFILE.UPLOAD' | translate }}
              </label>
            </div>

            <div class="cin-photo-slot">
              <div class="cin-label">{{ 'PROFILE.CIN_VERSO' | translate }}</div>
              <div class="cin-frame" [class.has-photo]="cinVersoUrl()">
                @if (cinVersoUrl()) {
                  <img [src]="cinVersoUrl()" alt="CIN Verso" />
                } @else {
                  <div class="cin-placeholder">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                      <rect x="2" y="5" width="20" height="14" rx="2"/>
                      <path d="M7 15h.01M7 12h.01M7 9h.01M10 9h4M10 12h4M10 15h4"/>
                    </svg>
                    <span>{{ 'PROFILE.CIN_NOT_UPLOADED' | translate }}</span>
                  </div>
                }
                @if (uploadingCinVerso()) {
                  <div class="photo-overlay"><span class="spinner"></span></div>
                }
              </div>
              <label class="btn btn-upload-sm" [class.disabled]="uploadingCinVerso()">
                <input type="file" accept="image/jpeg,image/png" (change)="onCinPhoto($event, 'verso')" [disabled]="uploadingCinVerso()" />
                {{ 'PROFILE.UPLOAD' | translate }}
              </label>
            </div>
          </div>
        </div>
        @if (cinError()) {
          <div class="alert alert-err" style="margin-top:0.75rem">{{ cinError() }}</div>
        }
        @if (cinSuccess()) {
          <div class="alert alert-ok" style="margin-top:0.75rem">{{ cinSuccess() }}</div>
        }
      </div>

      <!-- Password Section -->
      <div class="password-card">
        <h3 class="section-title">{{ 'PROFILE.SECURITY_TITLE' | translate }}</h3>

        @if (passwordSuccess()) {
          <div class="alert alert-ok">{{ passwordSuccess() }}</div>
        }
        @if (passwordError()) {
          <div class="alert alert-err">{{ passwordError() }}</div>
        }

        <form [formGroup]="passwordForm" (ngSubmit)="savePassword()">
          <div class="form-grid">
            <div class="form-group">
              <label>{{ 'PROFILE.CURRENT_PASSWORD' | translate }}</label>
              <input type="password" formControlName="current_password" class="form-input" autocomplete="current-password" />
            </div>
            <div class="form-group"></div>
            <div class="form-group">
              <label>{{ 'PROFILE.NEW_PASSWORD' | translate }}</label>
              <input type="password" formControlName="password" class="form-input" autocomplete="new-password" />
            </div>
            <div class="form-group">
              <label>{{ 'PROFILE.CONFIRM_PASSWORD' | translate }}</label>
              <input type="password" formControlName="password_confirmation" class="form-input" autocomplete="new-password" />
            </div>
          </div>
          <div class="form-actions">
            <button type="submit" class="btn btn-primary" [disabled]="savingPassword()">
              {{ savingPassword() ? ('COMMON.SAVING' | translate) : ('PROFILE.CHANGE_PASSWORD' | translate) }}
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .profile-page { max-width: 1100px; margin: 0 auto; display: flex; flex-direction: column; gap: 1.5rem; }
    .page-header { margin-bottom: 0.25rem; }
    .page-title { margin: 0; font-size: 1.6rem; font-weight: 900; letter-spacing: -0.01em; }
    .page-sub { margin: 0.25rem 0 0; color: var(--text-muted); font-size: 0.9rem; }

    .alert { padding: 0.75rem 1rem; border-radius: 10px; font-size: 0.9rem; font-weight: 600; }
    .alert-ok { background: rgba(63,185,80,.12); border: 1px solid rgba(63,185,80,.3); color: var(--accent); }
    .alert-err { background: rgba(248,81,73,.10); border: 1px solid rgba(248,81,73,.3); color: var(--danger); }

    .profile-grid { display: grid; grid-template-columns: 220px 1fr; gap: 1.5rem; align-items: start; }
    @media (max-width: 720px) { .profile-grid { grid-template-columns: 1fr; } }

    .photo-card,
    .info-card,
    .cin-card,
    .password-card {
      background: var(--bg-surface);
      border: 1px solid var(--border);
      border-radius: 18px;
      padding: 1.5rem;
    }

    .photo-card { display: flex; flex-direction: column; align-items: center; gap: 0.9rem; }

    .photo-frame {
      position: relative;
      width: 120px; height: 160px;
      border-radius: 10px;
      background: var(--bg-surface-2);
      border: 2px solid var(--border);
      overflow: hidden;
      display: flex; align-items: center; justify-content: center;
    }
    .photo-img { width: 100%; height: 100%; object-fit: cover; display: block; }
    .photo-initial {
      font-size: 3rem;
      font-weight: 900;
      color: var(--accent);
      letter-spacing: -0.02em;
    }
    .photo-overlay {
      position: absolute; inset: 0;
      background: rgba(0,0,0,.55);
      display: flex; align-items: center; justify-content: center;
    }
    .spinner {
      width: 28px; height: 28px;
      border: 3px solid rgba(255,255,255,.3);
      border-top-color: var(--accent);
      border-radius: 50%;
      animation: spin .7s linear infinite;
    }
    @keyframes spin { to { transform: rotate(360deg); } }

    .photo-actions { display: flex; flex-direction: column; gap: 0.4rem; width: 100%; }

    .btn {
      display: inline-flex; align-items: center; justify-content: center; gap: 0.35rem;
      padding: 0.5rem 1rem;
      border-radius: 10px;
      border: 1px solid var(--border);
      background: var(--bg-surface-2);
      color: var(--text-primary);
      font-size: 0.875rem; font-weight: 700;
      cursor: pointer;
      transition: transform .14s, border-color .14s;
      text-decoration: none;
    }
    .btn:hover:not([disabled]):not(.disabled) { transform: translateY(-1px); border-color: rgba(56,189,248,.4); }
    .btn[disabled], .btn.disabled { opacity: .5; cursor: not-allowed; }
    .btn-primary { border-color: rgba(56,189,248,.3); background: linear-gradient(135deg, rgba(56,189,248,.18), rgba(59,130,246,.10)); color: rgba(226,232,240,.98); }
    .btn-primary:hover:not([disabled]) { border-color: rgba(56,189,248,.55); }
    .btn-sm { padding: 0.35rem 0.7rem; font-size: 0.8rem; }
    .btn-danger-sm { border-color: rgba(248,81,73,.3); background: rgba(248,81,73,.08); color: var(--danger); font-size: 0.8rem; }
    .btn-upload { width: 100%; text-align: center; }
    .btn-upload input, .btn-upload-sm input { display: none; }
    .btn-upload-sm { display: inline-flex; align-items: center; justify-content: center; padding: 0.3rem 0.65rem; font-size: 0.78rem; border-radius: 8px; border: 1px solid var(--border); background: var(--bg-surface-2); color: var(--text-primary); font-weight: 700; cursor: pointer; transition: transform .14s, border-color .14s; }
    .btn-upload-sm:hover:not(.disabled) { transform: translateY(-1px); border-color: rgba(56,189,248,.4); }
    .btn-upload-sm.disabled { opacity: .5; cursor: not-allowed; }

    .role-badge {
      padding: 0.3rem 0.85rem;
      border-radius: 999px;
      font-size: 0.75rem;
      font-weight: 900;
      text-transform: uppercase;
      letter-spacing: 0.08em;
    }
    .role-admin { background: rgba(255,107,53,.14); border: 1px solid rgba(255,107,53,.3); color: #ff6b35; }
    .role-gestionnaire { background: rgba(74,158,255,.14); border: 1px solid rgba(74,158,255,.3); color: #4a9eff; }
    .role-chauffeur { background: rgba(0,214,143,.14); border: 1px solid rgba(0,214,143,.3); color: #00d68f; }
    .role-user { background: rgba(148,163,184,.12); border: 1px solid rgba(148,163,184,.25); color: var(--text-muted); }

    .member-since { font-size: 0.76rem; color: var(--text-muted); text-align: center; }

    .section-title { margin: 0 0 1.25rem; font-size: 1.05rem; font-weight: 900; letter-spacing: 0.01em; }

    .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
    .form-group { display: flex; flex-direction: column; gap: 0.35rem; }
    .form-group-full { grid-column: span 2; }
    @media (max-width: 620px) { .form-grid { grid-template-columns: 1fr; } .form-group-full { grid-column: 1; } }

    label { font-size: 0.8rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.04em; }
    .form-input {
      padding: 0.55rem 0.8rem;
      border: 1px solid var(--border);
      border-radius: 10px;
      background: var(--bg-surface-2);
      color: var(--text-primary);
      font-size: 0.9rem;
      outline: none;
      transition: border-color .14s;
      width: 100%;
      box-sizing: border-box;
    }
    .form-input:focus { border-color: rgba(56,189,248,.4); }
    .form-input.readonly { opacity: .65; cursor: not-allowed; }
    .form-textarea { resize: vertical; min-height: 60px; font-family: inherit; }
    input[type=date].form-input { color-scheme: dark; }

    .form-actions { margin-top: 1.25rem; display: flex; justify-content: flex-end; }

    .cin-grid { display: flex; flex-direction: column; gap: 1.25rem; }
    .cin-number-row { display: flex; gap: 0.65rem; align-items: center; }
    .cin-number-row .form-input { flex: 1; }

    .cin-photos { display: flex; gap: 1.5rem; flex-wrap: wrap; }
    .cin-photo-slot { display: flex; flex-direction: column; align-items: center; gap: 0.6rem; }
    .cin-label { font-size: 0.78rem; font-weight: 900; text-transform: uppercase; letter-spacing: 0.06em; color: var(--text-muted); }
    .cin-frame {
      position: relative;
      width: 200px; height: 126px;
      border-radius: 10px;
      border: 1px solid var(--border);
      background: var(--bg-surface-2);
      overflow: hidden;
      display: flex; align-items: center; justify-content: center;
    }
    .cin-frame img { width: 100%; height: 100%; object-fit: cover; display: block; }
    .cin-frame.has-photo { border-color: rgba(56,189,248,.35); }
    .cin-placeholder { display: flex; flex-direction: column; align-items: center; gap: 0.4rem; color: var(--text-muted); }
    .cin-placeholder svg { width: 36px; height: 36px; opacity: .55; }
    .cin-placeholder span { font-size: 0.76rem; }

    .password-card { margin-top: 0; }
  `],
})
export class ProfileComponent implements OnInit {
  profileSuccess = signal('');
  profileError = signal('');
  savingProfile = signal(false);

  cinSuccess = signal('');
  cinError = signal('');
  savingCin = signal(false);

  passwordSuccess = signal('');
  passwordError = signal('');
  savingPassword = signal(false);

  uploadingPhoto = signal(false);
  uploadingCinRecto = signal(false);
  uploadingCinVerso = signal(false);

  photoUrl = signal<string | null>(null);
  cinRectoUrl = signal<string | null>(null);
  cinVersoUrl = signal<string | null>(null);

  profileForm!: FormGroup;
  passwordForm!: FormGroup;
  cinNumberCtrl: import('@angular/forms').FormControl;

  initials = computed(() => {
    const name = this.auth.currentUser()?.name ?? 'U';
    return name.split(' ').map(p => p.charAt(0)).slice(0, 2).join('').toUpperCase();
  });

  roleLabel = computed(() => {
    const role = this.auth.currentUser()?.role;
    const map: Record<string, string> = {
      admin: 'Administration',
      gestionnaire: 'Gestionnaire',
      chauffeur: 'Chauffeur',
      user: 'Utilisateur',
    };
    return role ? (map[role] ?? role) : '';
  });

  constructor(
    public auth: AuthService,
    private profileSvc: ProfileService,
    private fb: FormBuilder,
  ) {
    this.cinNumberCtrl = this.fb.control('');
    this.profileForm = this.fb.group({ name: ['', Validators.required], phone: [''], date_naissance: [''], adresse: [''] });
    this.passwordForm = this.fb.group({
      current_password: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(8)]],
      password_confirmation: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    const u = this.auth.currentUser();
    if (u) {
      this.profileForm.patchValue({
        name: u.name ?? '',
        phone: u.phone ?? '',
        date_naissance: u.date_naissance ?? '',
        adresse: u.adresse ?? '',
      });
      this.cinNumberCtrl.setValue(u.cin_number ?? '');
      this.photoUrl.set(u.photo_url ?? null);
      this.cinRectoUrl.set(u.cin_photo_recto_url ?? null);
      this.cinVersoUrl.set(u.cin_photo_verso_url ?? null);
    }
  }

  saveProfile(): void {
    if (this.profileForm.invalid || this.savingProfile()) return;
    this.savingProfile.set(true);
    this.profileError.set('');
    this.profileSuccess.set('');
    const val = this.profileForm.value;
    this.profileSvc.updateProfile({
      name: val.name,
      phone: val.phone || null,
      date_naissance: val.date_naissance || null,
      adresse: val.adresse || null,
    }).pipe(take(1)).subscribe({
      next: (res) => {
        this.savingProfile.set(false);
        this.profileSuccess.set('Profil mis à jour avec succès.');
        this.auth.fetchUser().pipe(take(1)).subscribe();
      },
      error: (err) => {
        this.savingProfile.set(false);
        this.profileError.set(err?.error?.message ?? 'Erreur lors de la mise à jour.');
      },
    });
  }

  saveCinNumber(): void {
    if (this.savingCin()) return;
    this.savingCin.set(true);
    this.cinError.set('');
    this.cinSuccess.set('');
    this.profileSvc.updateProfile({ cin_number: this.cinNumberCtrl.value || null })
      .pipe(take(1)).subscribe({
        next: () => {
          this.savingCin.set(false);
          this.cinSuccess.set('Numéro CIN enregistré.');
          this.auth.fetchUser().pipe(take(1)).subscribe();
        },
        error: (err) => {
          this.savingCin.set(false);
          this.cinError.set(err?.error?.message ?? 'Erreur.');
        },
      });
  }

  savePassword(): void {
    if (this.passwordForm.invalid || this.savingPassword()) return;
    const val = this.passwordForm.value;
    if (val.password !== val.password_confirmation) {
      this.passwordError.set('Les mots de passe ne correspondent pas.');
      return;
    }
    this.savingPassword.set(true);
    this.passwordError.set('');
    this.passwordSuccess.set('');
    this.profileSvc.changePassword(val).pipe(take(1)).subscribe({
      next: () => {
        this.savingPassword.set(false);
        this.passwordSuccess.set('Mot de passe modifié avec succès.');
        this.passwordForm.reset();
      },
      error: (err) => {
        this.savingPassword.set(false);
        const msg = err?.error?.errors?.current_password?.[0]
          ?? err?.error?.message
          ?? 'Erreur lors du changement de mot de passe.';
        this.passwordError.set(msg);
      },
    });
  }

  onPhotoSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) { this.profileError.set('La photo ne doit pas dépasser 2 Mo.'); return; }
    this.uploadingPhoto.set(true);
    this.profileError.set('');
    this.profileSvc.uploadPhoto(file).pipe(take(1)).subscribe({
      next: (res) => {
        this.uploadingPhoto.set(false);
        this.photoUrl.set(res.photo_url);
        this.auth.fetchUser().pipe(take(1)).subscribe();
      },
      error: (err) => {
        this.uploadingPhoto.set(false);
        this.profileError.set(err?.error?.message ?? 'Erreur upload photo.');
      },
    });
    (event.target as HTMLInputElement).value = '';
  }

  deletePhoto(): void {
    this.uploadingPhoto.set(true);
    this.profileSvc.deletePhoto().pipe(take(1)).subscribe({
      next: () => { this.uploadingPhoto.set(false); this.photoUrl.set(null); this.auth.fetchUser().pipe(take(1)).subscribe(); },
      error: () => this.uploadingPhoto.set(false),
    });
  }

  onCinPhoto(event: Event, side: 'recto' | 'verso'): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    if (file.size > 4 * 1024 * 1024) { this.cinError.set('Image CIN trop grande (max 4 Mo).'); return; }
    if (side === 'recto') this.uploadingCinRecto.set(true);
    else this.uploadingCinVerso.set(true);
    this.cinError.set('');
    this.profileSvc.uploadCinPhoto(side, file).pipe(take(1)).subscribe({
      next: (res) => {
        if (side === 'recto') { this.uploadingCinRecto.set(false); this.cinRectoUrl.set(res['cin_photo_recto_url'] ?? null); }
        else { this.uploadingCinVerso.set(false); this.cinVersoUrl.set(res['cin_photo_verso_url'] ?? null); }
        this.cinSuccess.set('Photo CIN mise à jour.');
        this.auth.fetchUser().pipe(take(1)).subscribe();
      },
      error: (err) => {
        if (side === 'recto') this.uploadingCinRecto.set(false);
        else this.uploadingCinVerso.set(false);
        this.cinError.set(err?.error?.message ?? 'Erreur upload CIN.');
      },
    });
    (event.target as HTMLInputElement).value = '';
  }
}
