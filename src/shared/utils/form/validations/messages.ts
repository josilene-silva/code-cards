export const formMessages = {
  required: "* Campo obrigatório",
  email: "Formato de e-mail inválido",
  minSize: (size: number): string => `Informe ao menos ${size} caracteres`,
  maxSize: (size: number): string =>
    `O campo recebe o máximo de ${size} caracteres`,
  passwordRule: "Senha não atende às regras",
  passwordMatch: "As senhas não coincidem",
};