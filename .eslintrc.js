module.exports = {
  root: true,
  extends: [
    '@react-native-community',
    'prettier', // Adiciona a configuração do Prettier
  ],
  plugins: ['prettier'], // Adiciona o plugin do Prettier
  rules: {
    'prettier/prettier': [
      'error',
      {
        // Aqui você pode adicionar opções personalizadas do Prettier
        // Por exemplo, para usar aspas simples:
        singleQuote: true,
        // Para adicionar ponto e vírgula no final das linhas:
        semi: true,
        // Largura máxima da linha:
        printWidth: 100,
        // Usar vírgula no final de objetos e arrays quando múltiplos itens:
        trailingComma: 'all',
        // Usar espaços para indentação e 2 espaços por nível:
        tabWidth: 2,
        useTabs: false,
        // Quebrar linhas apenas quando necessário (útil para JSX):
        jsxSingleQuote: false,
        // Quebrar linhas longas no HTML, JSX, MDX
        proseWrap: 'always',
      },
    ],
    // Você pode adicionar ou sobrescrever outras regras ESLint aqui
    // Exemplo: desabilitar a regra de require padrão para facilitar importações ES6
    'no-unused-vars': 'warn', // Avisar sobre variáveis não utilizadas
    'react/jsx-filename-extension': [1, { extensions: ['.js', '.jsx', '.ts', '.tsx'] }],
    'react-native/no-inline-styles': 'warn', // Avisar sobre estilos inline (pode ser 'error' se preferir)
    'import/no-named-as-default': 'off',
  },
};
