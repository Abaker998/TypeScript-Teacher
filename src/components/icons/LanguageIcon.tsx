import { Language } from '@/types/lesson';
import TypeScriptIcon from './TypeScriptIcon';
import CSharpIcon from './CSharpIcon';
import SQLIcon from './SQLIcon';

interface LanguageIconProps {
  language: Language;
  className?: string;
  size?: number;
}

/**
 * Renders the official logo icon for a programming language.
 */
export default function LanguageIcon({ language, className = '', size = 24 }: LanguageIconProps) {
  switch (language) {
    case 'typescript':
      return <TypeScriptIcon className={className} size={size} />;
    case 'csharp':
      return <CSharpIcon className={className} size={size} />;
    case 'sql':
      return <SQLIcon className={className} size={size} />;
    default:
      return null;
  }
}
