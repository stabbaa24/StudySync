export class Subject {
    _id?: string;
    id!: number;
    matiere!: string;
    image_matiere!: string;
    professeur!: string;
    professeurDetails?: {
        nom: string;
        prenom: string;
        image: string;
      };
}
