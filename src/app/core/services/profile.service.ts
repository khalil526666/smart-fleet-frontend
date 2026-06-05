import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { User } from './auth.service';

export interface UpdateProfileRequest {
  name?: string;
  phone?: string | null;
  cin_number?: string | null;
  date_naissance?: string | null;
  adresse?: string | null;
}

export interface ChangePasswordRequest {
  current_password: string;
  password: string;
  password_confirmation: string;
}

@Injectable({ providedIn: 'root' })
export class ProfileService {
  constructor(private api: ApiService) {}

  updateProfile(data: UpdateProfileRequest) {
    return this.api.put<{ message: string; user: User }>('/user/profile', data);
  }

  uploadPhoto(file: File) {
    const form = new FormData();
    form.append('photo', file);
    return this.api.postForm<{ message: string; photo_url: string }>('/user/photo', form);
  }

  deletePhoto() {
    return this.api.delete<{ message: string }>('/user/photo');
  }

  uploadCinPhoto(side: 'recto' | 'verso', file: File) {
    const form = new FormData();
    form.append('photo', file);
    form.append('side', side);
    return this.api.postForm<Record<string, string>>('/user/cin-photo', form);
  }

  changePassword(data: ChangePasswordRequest) {
    return this.api.put<{ message: string }>('/user/password', data);
  }
}
