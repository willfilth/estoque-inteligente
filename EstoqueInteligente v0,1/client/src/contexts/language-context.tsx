import { createContext, useContext, useState, useEffect } from "react";
import { Translation, getTranslation, ptBR, availableLanguages } from "@/lib/translations";

type LanguageContextType = {
  language: string;
  translation: Translation;
  setLanguage: (code: string) => void;
  availableLanguages: { code: string; name: string }[];
};

const defaultContext: LanguageContextType = {
  language: "pt-BR",
  translation: ptBR,
  setLanguage: () => {},
  availableLanguages: availableLanguages.map(({ code, name }) => ({ code, name }))
};

const LanguageContext = createContext<LanguageContextType>(defaultContext);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<string>(() => {
    // Tenta recuperar a preferência de idioma do localStorage
    const storedLanguage = localStorage.getItem("preferred-language");
    return storedLanguage || "pt-BR"; // Padrão: Português (Brasil)
  });

  const [translation, setTranslation] = useState<Translation>(getTranslation(language));

  // Atualiza a tradução quando o idioma muda
  useEffect(() => {
    const newTranslation = getTranslation(language);
    setTranslation(newTranslation);
    // Armazena a preferência de idioma
    localStorage.setItem("preferred-language", language);
  }, [language]);

  const setLanguage = (code: string) => {
    if (availableLanguages.some(lang => lang.code === code)) {
      setLanguageState(code);
    }
  };

  const value = {
    language,
    translation,
    setLanguage,
    availableLanguages: availableLanguages.map(({ code, name }) => ({ code, name }))
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }

  return context;
};