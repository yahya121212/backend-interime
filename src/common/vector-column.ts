import { Column as TypeOrmColumn } from 'typeorm';

// Fonction wrapper pour créer une colonne vector
export function VectorColumn(options: { nullable: boolean; length: number }) {
  return TypeOrmColumn({
    type: 'jsonb', // Nous utilisons 'jsonb' pour la compatibilité TypeORM
    nullable: options.nullable ?? true, // nullable par défaut
    comment: `Vector column with dimension ${options.length}`, // Commentaire utile
  });
}
