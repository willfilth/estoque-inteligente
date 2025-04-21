import { useState, useEffect } from "react";

// Hook para detectar se o dispositivo é mobile
export function useMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Verificar inicialmente
    checkIsMobile();

    // Adicionar listener para redimensionamento
    window.addEventListener("resize", checkIsMobile);

    // Cleanup
    return () => {
      window.removeEventListener("resize", checkIsMobile);
    };
  }, []);

  return isMobile;
}

// Hook para formatar valores monetários
export function useMoneyFormatter() {
  const format = (value: number | undefined) => {
    if (value === undefined) return "R$ 0,00";
    
    return value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  return { format };
}

// Hook para lidar com uploads de arquivos (expandir conforme necessário)
export function useFileUpload() {
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const addFiles = (newFiles: FileList) => {
    const filesArray = Array.from(newFiles);
    setFiles(prev => [...prev, ...filesArray]);
    
    // Gerar previews
    const newPreviews = filesArray.map(file => URL.createObjectURL(file));
    setPreviews(prev => [...prev, ...newPreviews]);
  };

  const removeFile = (index: number) => {
    // Remover arquivo
    const newFiles = [...files];
    newFiles.splice(index, 1);
    setFiles(newFiles);
    
    // Revogar URL e remover preview
    URL.revokeObjectURL(previews[index]);
    const newPreviews = [...previews];
    newPreviews.splice(index, 1);
    setPreviews(newPreviews);
  };

  const clearFiles = () => {
    // Revogar todas as URLs
    previews.forEach(url => URL.revokeObjectURL(url));
    setFiles([]);
    setPreviews([]);
  };

  // Cleanup quando o componente é desmontado
  useEffect(() => {
    return () => {
      previews.forEach(url => URL.revokeObjectURL(url));
    };
  }, [previews]);

  return {
    files,
    previews,
    isUploading,
    addFiles,
    removeFile,
    clearFiles,
    setIsUploading,
  };
}
