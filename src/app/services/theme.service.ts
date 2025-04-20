import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  private darkMode: boolean = false;

  constructor() {
    this.loadTheme();
  }

  // Cargar el tema desde las preferencias guardadas
  async loadTheme() {
    const { value } = await Preferences.get({ key: 'dark-mode' });
    this.darkMode = value === 'true';
    this.applyDarkMode(this.darkMode);
  }

  // Guardar el estado del tema en las preferencias
  async saveTheme(enable: boolean) {
    this.darkMode = enable;
    await Preferences.set({ key: 'dark-mode', value: String(this.darkMode) });
    this.applyDarkMode(this.darkMode);
  }

  // Aplicar el tema oscuro/claro al body
  applyDarkMode(enable: boolean) {
    document.body.classList.toggle('dark', enable);
  }

  // Obtener el estado del tema (oscuro o claro)
  getTheme(): boolean {
    return this.darkMode;
  }
}