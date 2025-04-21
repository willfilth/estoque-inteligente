import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { Phone } from 'lucide-react';
import { Phone as PhoneType } from '@shared/schema';

interface CompanyInfoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CompanyInfoModal: React.FC<CompanyInfoModalProps> = ({ 
  open, 
  onOpenChange 
}) => {
  const { data: company } = useQuery({
    queryKey: ['/api/company'],
    staleTime: 60000
  });

  if (!company) {
    return null;
  }

  // Formatar o endereço completo
  const fullAddress = `${company.street}, ${company.number}${company.complement ? `, ${company.complement}` : ''} - ${company.city}/${company.state}, CEP: ${company.zipCode}`;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-foreground">
            {company.name}
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex flex-col md:flex-row mt-4">
          <div className="md:w-1/3 flex justify-center items-start p-4">
            {company.logo ? (
              <img 
                src={company.logo} 
                alt="Logo da empresa" 
                className="w-32 h-32 object-contain"
              />
            ) : (
              <div className="w-32 h-32 bg-muted rounded flex items-center justify-center">
                <span className="text-muted-foreground">Sem logo</span>
              </div>
            )}
          </div>
          
          <div className="md:w-2/3 space-y-3">
            <div>
              <p className="text-muted-foreground text-sm">CNPJ:</p>
              <p className="text-foreground">{company.cnpj}</p>
            </div>
            
            {company.legalName && (
              <div>
                <p className="text-muted-foreground text-sm">Razão Social:</p>
                <p className="text-foreground">{company.legalName}</p>
              </div>
            )}
            
            <div>
              <p className="text-muted-foreground text-sm">Endereço:</p>
              <p className="text-foreground">{fullAddress}</p>
            </div>
            
            {company.email && (
              <div>
                <p className="text-muted-foreground text-sm">E-mail:</p>
                <p className="text-foreground">{company.email}</p>
              </div>
            )}
          </div>
        </div>
        
        {/* Telefones */}
        {company.phones && company.phones.length > 0 && (
          <div className="mt-4">
            <h4 className="font-medium text-foreground mb-2">Telefones</h4>
            <div className="space-y-1">
              {company.phones.map((phone: PhoneType, index: number) => (
                <div key={index} className="flex items-center space-x-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-foreground">{phone.number}</span>
                  {phone.isWhatsapp && (
                    <span className="text-green-500 text-sm">(WhatsApp)</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CompanyInfoModal;
