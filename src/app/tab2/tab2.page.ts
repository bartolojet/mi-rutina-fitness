import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms'; // Para la gestión de formularios reactivos y validaciones
import { ExerciseService } from '../services/exercise.services'; // Servicio personalizado para gestionar hábitos
import { Exercise } from '../models/exercise.model'; // Modelo de datos para los hábitos
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera'; // API de cámara de Capacitor
import { Capacitor } from '@capacitor/core'; // Para obtener la plataforma en la que se ejecuta la app (web o móvil)
import { Router } from '@angular/router';

import { LanguageService } from '../services/language.service';
import { ThemeService } from '../services/theme.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone: false,
})
export class Tab2Page {

  exerciseForm: FormGroup; // Formulario reactivo para gestionar el hábito
  imagen: string | null = null; // Variable para almacenar la imagen seleccionada en formato base64
  darkMode: boolean = false;

  // Constructor con inyección de dependencias
  constructor(
    private fb: FormBuilder, // Servicio para crear formularios reactivos
    private exerciseService: ExerciseService, // Servicio para gestionar los hábitos
    private languageService: LanguageService,
    private themeService: ThemeService,
    private router: Router
  ) {
    // Inicialización del formulario reactivo con validadores
    this.exerciseForm = this.fb.group({
      titulo: ['', Validators.required], // Campo 'titulo' requerido
      repeticiones: ['', Validators.required] // Campo 'repeticiones' requerido
    });

        // Cargar el tema al iniciar la página
        this.darkMode = this.themeService.getTheme();
  }

  /**
 * Hook del ciclo de vida de Angular que se ejecuta una sola vez cuando se inicializa el componente.
 * Ideal para cargar datos la primera vez que se muestra la página.
 */
  async ngOnInit() {

      // Suscribirse a las actualizaciones del idioma
    this.languageService.currentLang$.subscribe((lang) => {
    console.log(`El idioma actual es: ${lang}`);
    // Aquí puedes ejecutar código para actualizar el contenido según el idioma
  });
  }

  /**
   * Método para seleccionar una imagen, diferenciando entre plataformas web y móvil.
   */
  async seleccionarImagen() {
    try {
      let image: any;

      // Comprobación de la plataforma
      if (Capacitor.getPlatform() === 'web') {
        // En plataforma web, se utiliza un input de tipo file
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*'; // Solo acepta archivos de imagen
        input.click(); // Simula un clic para abrir el selector de archivos

        input.onchange = () => {
          const file = input.files?.[0]; // Obtiene el primer archivo seleccionado
          if (file) {
            const reader = new FileReader();
            reader.onload = () => {
              this.imagen = reader.result as string; // Convierte la imagen a base64
              console.log('Imagen seleccionada desde la galería en web:', this.imagen);
            };
            reader.readAsDataURL(file); // Lee el archivo y lo convierte a base64
          }
        };
      } else {
        // En dispositivos móviles, se usa la API de cámara de Capacitor
        image = await Camera.getPhoto({
          quality: 90, // Calidad de la imagen
          allowEditing: false, // No permite edición de la imagen
          resultType: CameraResultType.DataUrl, // El resultado se obtiene en formato base64
          source: CameraSource.Prompt // Muestra una opción para elegir entre cámara o galería
        });

        this.imagen = image.dataUrl || null; // Guarda la imagen en base64 o null si falla
        console.log('Imagen seleccionada en móvil:', this.imagen);
      }
    } catch (error) {
      // Muestra el error en consola si la selección de la imagen falla
      console.error('Error al seleccionar imagen:', error);
    }
  }

  /**
   * Método para agregar un nuevo hábito utilizando los datos del formulario.
   */
  addExercise() {
    if (this.exerciseForm.valid) {
      // Crea un nuevo objeto de tipo Exercise
      const newExercise: Exercise = new Exercise(
        Date.now().toString(), // Utiliza la marca de tiempo actual como ID único
        this.exerciseForm.value.titulo, // Obtiene el valor del campo 'titulo'
        this.exerciseForm.value.repeticiones, // Obtiene el valor del campo 'repeticiones'
        false, // Inicializa el hábito como no completado
        this.imagen ?? undefined // Asigna la imagen si existe, sino undefined
      );

      // Llama al servicio para agregar el nuevo hábito
      this.exerciseService.addExercise(newExercise);
      console.log('Hábito agregado:', newExercise);

      // Reinicia el formulario y borra la imagen seleccionada
      this.exerciseForm.reset();
      this.imagen = null;
    }
  }


  add10Exercises(){
    this.exerciseService.add10Exercises(); // Llama al servicio para añadir los ejercicios
    this.router.navigate(['/tabs/tab1']);
  } 

}
