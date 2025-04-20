import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Preferences } from '@capacitor/preferences';

@Injectable({
  providedIn: 'root'
})
export class UserNameService {
  private usernameSubject = new BehaviorSubject<string>('Usuario'); // Valor inicial vacío
  username$ = this.usernameSubject.asObservable();

  constructor() {
    this.loadUsername(); // Cargar el nombre al iniciar
  }

  async loadUsername() {
    const { value } = await Preferences.get({ key: 'username' });
    if (value) {
      this.usernameSubject.next(value);
    }
  }

  async setUsername(name: string) {
    await Preferences.set({ key: 'username', value: name });
    this.usernameSubject.next(name);
  }

  getUsernameValue(): string {
    return this.usernameSubject.value;
  }
}