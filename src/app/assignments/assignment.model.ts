export class Assignment {
    _id?: string;
    id!: number;
    nom!: string
    dateDeRendu!: Date;
    rendu!: boolean;
    note!: number;
    remarques!: string;
    auteur!: string; //car ref object id dans mongoDB
    matiere!: string; //same
    groupe!: string;
    promo!: string;
}