import { Component } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import { TranslateService } from '@ngx-translate/core';

import { LanguageService } from '../services/language.service';
import { ThemeService } from '../services/theme.service';
import { UserNameService } from '../services/username.service';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  standalone: false,
})
export class Tab3Page {

  langs: string[] = [];
  username: string = '';
  darkMode: boolean = false;

  constructor(private languageService: LanguageService, 
    private themeService: ThemeService,
    private userNameService: UserNameService
  ) {
      // Inicializamos los idiomas disponibles
      this.langs = ['es', 'en']; // Asegúrate de que los idiomas estén correctamente configurados
      // Cargar el tema al iniciar la página
      this.darkMode = this.themeService.getTheme();

      //Cargamos el valor actual del usuario
      this.userNameService.username$.subscribe((name: string) => {
        this.username = name;
      });
    }

  // Cambiar idioma usando el servicio de lenguaje
  async changeLang(event: CustomEvent) {
    const selectedLang = event.detail.value;
    this.languageService.changeLanguage(selectedLang); // Cambiar el idioma usando el servicio
    console.log(`Idioma cambiado a: ${selectedLang}`);
  }
  
  async saveUsername() {
    await this.userNameService.setUsername(this.username);
  }

  // Cambiar el tema cuando el usuario haga clic en el toggle
  async toggleDarkMode() {
    this.darkMode = !this.darkMode;
    await this.themeService.saveTheme(this.darkMode); // Guardar el nuevo estado del tema
  }

}
