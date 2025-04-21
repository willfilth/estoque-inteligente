import { useState, useEffect, useCallback } from 'react';

interface CepResult {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
  ibge: string;
  gia: string;
  ddd: string;
  siafi: string;
}

interface UseCepResult {
  addressData: Partial<CepResult> | null;
  loading: boolean;
  error: string | null;
  fetchAddress: (cep: string) => Promise<void>;
}

export function useCep(): UseCepResult {
  const [addressData, setAddressData] = useState<Partial<CepResult> | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAddress = useCallback(async (cep: string) => {
    // Remove caracteres não numéricos
    const cleanCep = cep.replace(/\D/g, '');
    
    // Verifica se tem 8 dígitos
    if (cleanCep.length !== 8) {
      setError('CEP deve conter 8 dígitos');
      setAddressData(null);
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
      const data = await response.json();
      
      if (data.erro) {
        setError('CEP não encontrado');
        setAddressData(null);
        return;
      }
      
      setAddressData(data);
    } catch (err) {
      setError('Erro ao buscar o CEP');
      setAddressData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  return { addressData, loading, error, fetchAddress };
}
