export class Subject {
    _id?: string;
    //id!: number;
    matiere!: string;
    image_matiere!: string;
    professeur!: string; //car ref object id dans mongoDB
}