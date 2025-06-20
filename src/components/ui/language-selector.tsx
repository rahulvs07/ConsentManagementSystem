import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Languages } from "lucide-react";
import { useLanguage, supportedLanguages } from "@/hooks/useLanguage";

export function LanguageSelector() {
  const { language, setLanguage, t } = useLanguage();
  
  const currentLang = supportedLanguages.find(lang => lang.code === language) || supportedLanguages[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="flex items-center space-x-2 text-slate-700 hover:text-slate-900 hover:bg-slate-100"
          aria-label={`${t.language} / Select Language`}
        >
          <Languages className="h-4 w-4" />
          <span className="text-sm font-medium">{currentLang.nativeName}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        {supportedLanguages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => setLanguage(lang.code)}
            className={`flex justify-between items-center py-2 px-3 ${
              language === lang.code ? 'bg-blue-50 text-blue-900 font-medium' : ''
            }`}
            aria-selected={language === lang.code}
          >
            <span className="text-sm">{lang.nativeName}</span>
            <span className="text-xs text-slate-500 ml-2">{lang.name}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
} 