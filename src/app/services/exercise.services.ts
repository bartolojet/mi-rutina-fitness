// Importaciones necesarias
import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import { Exercise } from '../models/exercise.model';

// Decorador @Injectable para indicar que esta clase se puede inyectar como dependencia
@Injectable({
  providedIn: 'root' // El servicio estará disponible de forma global en toda la aplicación
})
export class ExerciseService {
  // Lista privada que almacena los ejercicios en memoria
  private exercises: Exercise[] = [];

  // Constructor que carga los ejercicios desde el almacenamiento al inicializar el servicio
  constructor() {
    this.loadExercises();
  }

  /**
   * Agrega un nuevo hábito a la lista y lo guarda en el almacenamiento
   * @param exercise - El hábito a agregar
   */
  async addExercise(exercise: Exercise) {
    this.exercises.push(exercise); // Añade el hábito a la lista
    await this.saveExercises(); // Guarda los hábitos actualizados en el almacenamiento
  }

  /**
   * Marca un ejercicio como completado o no completado y lo guarda
   * @param id - Identificador del ejercicio
   */
  async marcarCompletado(id: string) {
    const exercise = this.exercises.find(h => h.id === id); // Busca el ejercicio por su ID
    if (exercise) {
      exercise.completado = !exercise.completado; // Cambia el estado de completado
      await this.saveExercises(); // Guarda los cambios
    }
  }

  /**
   * Obtiene la lista de hábitos, cargándolos del almacenamiento si es necesario
   * @returns Lista de hábitos
   */
  async getExercises(): Promise<Exercise[]> {
    if (this.exercises.length === 0) {
      await this.loadExercises(); // Carga los ejercicios si la lista está vacía
    }
    return this.exercises;
  }

  /**
   * Elimina un ejercicio por su ID y actualiza el almacenamiento
   * @param id - Identificador del hábito a eliminar
   */
  async deleteExercise(id: string) {
    this.exercises = this.exercises.filter(h => h.id !== id); // Filtra el ejercicio para eliminarlo
    await this.saveExercises(); // Guarda la lista actualizada
  }

  /**
   * Guarda la lista actual de hábitos en el almacenamiento
   */
  private async saveExercises() {
    try {
      await Preferences.set({
        key: 'exercises',
        value: JSON.stringify(this.exercises) // Convierte la lista a JSON para su almacenamiento
      });
      console.log('Ejercicios guardados:', this.exercises);
    } catch (error) {
      console.error('Error guardando ejercicios:', error); // Captura y muestra errores en caso de fallos
    }
  }

  /**
   * Carga los hábitos almacenados en el dispositivo
   */
  async loadExercises() {
    const { value } = await Preferences.get({ key: 'exercises' }); // Obtiene los datos almacenados

    console.log('Datos crudos de Preferences:', value); // Muestra los datos crudos para depuración

    if (value) {
      const parsedData = JSON.parse(value); // Parsea los datos JSON almacenados

      // Reconstruye los objetos de tipo Exercise
      this.exercises = parsedData.map((h: any) => new Exercise(
        h.id,
        h.titulo,
        h.repeticiones,
        h.completado,
        h.imagen
      ));

      console.log('Ejercicios convertidos:', this.exercises);
    }
  }

  /**
   * Elimina todos los hábitos almacenados y limpia la lista en memoria
   */
  async deleteAllExercises() {
    try {
      this.exercises = []; // Vacía la lista en memoria
      await Preferences.remove({ key: 'exercises' }); // Elimina los datos almacenados
      console.log('Todos los ejercicios han sido eliminados correctamente.');
    } catch (error) {
      console.error('Error al eliminar todos los ejercicios:', error); // Captura errores en caso de fallos
    }
  }

  /**
   * Agrega una lista predeterminada de 10 ejercicios y los guarda
   */
  async add10Exercises() {
    this.exercises.push(
      new Exercise(Date.now().toString() + 1, 'Press Banca', '4 Series y 10 repeticiones.', false),
      new Exercise(Date.now().toString() + 2, 'Curl de biceps', '3 Series y 12 repeticiones.', false),
      new Exercise(Date.now().toString() + 3, 'Sentadillas', '4 Series y 15 repeticiones.', false),
      new Exercise(Date.now().toString() + 4, 'Peso muerto', '4 Series y 8 repeticiones.', false),
      new Exercise(Date.now().toString() + 5, 'Fondos de tríceps', '3 Series y 12 repeticiones.', false),
      new Exercise(Date.now().toString() + 6, 'Remo con mancuerna', '3 Series y 10 repeticiones.', false),
      new Exercise(Date.now().toString() + 7, 'Zancadas', '3 Series de 10 repeticiones por pierna.', false),
      new Exercise(Date.now().toString() + 8, 'Elevaciones laterales', '3 Series y 15 repeticiones.', false),
      new Exercise(Date.now().toString() + 9, 'Plancha abdominal', '3 Series de 1 minuto.', false),
      new Exercise(Date.now().toString() + 10, 'Abdominales bicicleta', '3 Series de 20 repeticiones.', false)
    );
    await this.saveExercises(); // Guarda los ejercicios en el almacenamiento
  }

}