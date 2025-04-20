export class Exercise{
    constructor(
        public id:string,
        public titulo: string,
        public repeticiones: string,
        public completado: boolean,
        public imagen?: string
    ){}
}