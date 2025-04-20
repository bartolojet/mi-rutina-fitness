import { Component } from '@angular/core';

import { ExerciseService } from '../services/exercise.services'; // Servicio que gestiona los hábitos
import { Exercise } from '../models/exercise.model'; // Modelo de datos para los hábitos
import { LoadingController } from '@ionic/angular'; // Controlador para mostrar indicadores de carga (loading)
import { LanguageService } from '../services/language.service';
import { ThemeService } from '../services/theme.service';
import { UserNameService } from '../services/username.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: false,
})
export class Tab1Page {

  exercises: Exercise[] = []; // Propiedad que almacenará la lista de ejercicios
  darkMode: boolean = false;
  username: string = "Usuario";

  constructor(
    private exerciseService: ExerciseService, // Servicio personalizado para gestionar los ejercicios
    private loadingCtrl: LoadingController, // Servicio de Ionic para mostrar indicadores de carga

    private languageService: LanguageService,
    private themeService: ThemeService,
    private userService: UserNameService
  ) {
    // Cargar el tema al iniciar la página
    this.darkMode = this.themeService.getTheme();
    //Cargamos el usuario al iniciar la página
    this.userService.username$.subscribe((name: string) => {
      this.username = name;
    });
  }

/**
   * Hook del ciclo de vida de Ionic que se ejecuta cada vez que la vista está por entrar en pantalla.
   * Ideal para actualizar datos cada vez que se accede a la página.
   */
async ionViewWillEnter() {
  console.log('Refrescando Tab 1...'); // Mensaje en consola para seguimiento

  // Crea un indicador de carga (loading)
  const loading = await this.loadingCtrl.create({
    message: 'Cargando ejercicios...', // Mensaje que se muestra durante la carga
    spinner: 'crescent', // Estilo del spinner (círculo giratorio)
  });

  await loading.present(); // Muestra el loading en pantalla

  this.exercises = await this.exerciseService.getExercises(); 
  // Obtiene los hábitos del servicio y actualiza la lista

  console.log('Ejercicios actualizados:', this.exercises); // Muestra los datos obtenidos en consola

  await loading.dismiss(); // Oculta el indicador de carga una vez que los datos se han cargado
}

/**
 * Hook del ciclo de vida de Angular que se ejecuta una sola vez cuando se inicializa el componente.
 * Ideal para cargar datos la primera vez que se muestra la página.
 */
async ngOnInit() {
  const loading = await this.loadingCtrl.create({
    message: 'Cargando ejercicios...', // Mensaje del indicador de carga
    spinner: 'crescent', // Estilo del spinner
    duration: 2000, // Duración máxima del indicador de carga (en milisegundos)
  });

  await loading.present(); // Muestra el indicador de carga

  this.exercises = await this.exerciseService.getExercises(); 
  // Obtiene los hábitos al iniciar el componente

  await loading.dismiss(); // Oculta el indicador de carga

  // Suscribirse a las actualizaciones del idioma
  this.languageService.currentLang$.subscribe((lang) => {
  console.log(`El idioma actual es: ${lang}`);
  // Aquí puedes ejecutar código para actualizar el contenido según el idioma
});

}

/**
 * Elimina un ejercicio según su ID y actualiza la lista de ejercicios.
 * @param id - Identificador del hábito a eliminar
 */
async deleteExercise(id: string) {
  await this.exerciseService.deleteExercise(id); // Llama al servicio para eliminar el ejercicio
  this.exercises = await this.exerciseService.getExercises(); 
  // Actualiza la lista después de eliminar el ejercicio
}

/**
 * Marca o desmarca un hábito como completado y actualiza su estado en el almacenamiento.
 * @param id - Identificador del hábito a actualizar
 */
async marcarCompletado(id: string) {
  await this.exerciseService.marcarCompletado(id); 
  // Cambia el estado de completado del hábito
}

/**
 * Eliminar TODOS los ejercicios y actualiza la lista de ejercicios.
 */
async deleteAllExercises() {
  await this.exerciseService.deleteAllExercises(); // Llama al servicio para eliminar el ejercicio
  this.exercises = await this.exerciseService.getExercises(); 
  // Actualiza la lista después de eliminar el ejercicio
}

}
