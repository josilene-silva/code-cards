import Logo from '@/assets/images/icon/logo.svg';
import JavaScript from '@/assets/images/languages/javascript.svg';
import Python from '@/assets/images/languages/python.svg';
import Java from '@/assets/images/languages/java.svg';
import TypeScript from '@/assets/images/languages/typescript.svg';
import C from '@/assets/images/languages/c.svg';
import CPlusPlus from '@/assets/images/languages/cplusplus.svg';
import CSharp from '@/assets/images/languages/csharp.svg';
import Kotlin from '@/assets/images/languages/kotlin.svg';
import Swift from '@/assets/images/languages/swift.svg';
import PHP from '@/assets/images/languages/php.svg';
import Portugol from '@/assets/images/languages/portugol.svg';

export const getLanguageImage = (language: string) => {
  const images: Record<string, any> = {
    c: C,
    'c++': CPlusPlus,
    'c#': CSharp,
    java: Java,
    javascript: JavaScript,
    kotlin: Kotlin,
    portugol: Portugol,
    php: PHP,
    python: Python,
    swift: Swift,
    typescript: TypeScript,
  };

  return images[language.toLocaleLowerCase()] ?? Logo;
};
