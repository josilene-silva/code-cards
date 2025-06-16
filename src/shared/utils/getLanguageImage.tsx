import Logo from '@/assets/images/icon/logo.svg';
import JavaScript from '@/assets/images/languages/javascript.svg';
import Python from '@/assets/images/languages/python.svg';

export const getLanguageImage = (language: string) => {
  const images: Record<string, any> = {
    javascript: JavaScript,
    python: Python,
  };

  return images[language.toLocaleLowerCase()] ?? Logo;
};
