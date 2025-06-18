export interface ICategory {
  id?: string;
  name: string;
  withPublic?: boolean; // variável (interna) para indicar se a categoria possui coleções públicas
}
