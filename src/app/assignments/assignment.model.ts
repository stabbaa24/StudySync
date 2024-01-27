export class Assignment {
    _id?: string;
    id!: number;
    nom!: string;
    dateDeRendu!: Date;
    rendu!: number;
    auteur!: string | null; //car ref object id dans mongoDB
    matiere!: string; //same
    groupe!: 'TD 1' | 'T2' | 'TD3';
    promo!: 'L3' | 'M1' | 'M2';

    matiereDetails?: {
        _id?: string;
        matiere?: string;
        image_matiere?: string;
        professeur?: string;
        professeurDetails?: {
            nom: string;
            prenom: string;
            image: string;
        };
    };
}