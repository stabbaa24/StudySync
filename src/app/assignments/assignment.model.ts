export class Assignment {
    _id?: string;
    id!: number;
    nom!: string;
    dateDeRendu!: Date;
    rendu!: boolean;
    note!: number | null;
    remarques!: string | null;
    auteur!: string | null; //car ref object id dans mongoDB
    matiere!: string; //same
    groupe!: 'TD 1' | 'T2' | 'TD3';
    promo!: 'L3' | 'M1' | 'M2';
}