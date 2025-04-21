import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Importação do CSS para fontes do Google no escopo do React
import { useEffect } from "react";

function FontsLoader() {
  useEffect(() => {
    // Adicionar fontes do Google para corresponder ao design
    const fontLink = document.createElement('link');
    fontLink.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Roboto:wght@300;400;500;700&display=swap';
    fontLink.rel = 'stylesheet';
    document.head.appendChild(fontLink);

    // Adicionar Font Awesome para ícones
    const fontAwesomeLink = document.createElement('link');
    fontAwesomeLink.href = 'https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.0.0/css/all.min.css';
    fontAwesomeLink.rel = 'stylesheet';
    document.head.appendChild(fontAwesomeLink);
    
    return () => {
      document.head.removeChild(fontLink);
      document.head.removeChild(fontAwesomeLink);
    };
  }, []);

  return null;
}

// Definir o título da página
document.title = "Estoque Inteligente - Sistema de Gerenciamento de Estoque";

createRoot(document.getElementById("root")!).render(
  <>
    <FontsLoader />
    <App />
  </>
);
