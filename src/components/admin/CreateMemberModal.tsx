import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface CreateMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const CreateMemberModal: React.FC<CreateMemberModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const [clientName, setClientName] = useState('');
  const [password, setPassword] = useState('');
  const [expiresAt, setExpiresAt] = useState<Date | undefined>();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!clientName.trim() || !password.trim()) {
      toast.error('Nome do cliente e senha são obrigatórios');
      return;
    }

    // Validate client name (only letters, numbers, and some special chars)
    const nameRegex = /^[a-zA-Z0-9\s\-_]+$/;
    if (!nameRegex.test(clientName)) {
      toast.error('Nome do cliente deve conter apenas letras, números, espaços, hífens ou underscores');
      return;
    }

    if (password.length < 6) {
      toast.error('Senha deve ter pelo menos 6 caracteres');
      return;
    }

    setIsLoading(true);

    try {
      console.log('Calling create-member function with:', {
        clientName: clientName.trim(),
        expiresAt: expiresAt?.toISOString()
      });

      const { data, error } = await supabase.functions.invoke('create-member', {
        body: {
          clientName: clientName.trim(),
          password,
          expiresAt: expiresAt?.toISOString()
        }
      });

      console.log('Function response:', { data, error });

      if (error) {
        console.error('Error creating member:', error);
        toast.error('Erro ao criar membro: ' + error.message);
        return;
      }

      if (data?.error) {
        toast.error(data.error);
        return;
      }

      if (data?.success) {
        toast.success(`Membro exclusivo criado com sucesso! Email: ${data.user.email}`);
        setClientName('');
        setPassword('');
        setExpiresAt(undefined);
        onSuccess();
        onClose();
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      toast.error('Erro inesperado ao criar membro');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      setClientName('');
      setPassword('');
      setExpiresAt(undefined);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Criar Novo Membro Exclusivo</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="clientName">Nome do Cliente</Label>
            <Input
              id="clientName"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              placeholder="Ex: John Smith"
              disabled={isLoading}
              required
            />
            <p className="text-xs text-muted-foreground">
              Email será: {clientName.toLowerCase().replace(/[^a-z0-9]/g, '').substring(0, 20)}@fivelondon.com
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Senha personalizada"
              disabled={isLoading}
              required
              minLength={6}
            />
          </div>

          <div className="space-y-2">
            <Label>Data de Expiração (Opcional)</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                  disabled={isLoading}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {expiresAt ? format(expiresAt, 'dd/MM/yyyy') : 'Selecionar data'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={expiresAt}
                  onSelect={setExpiresAt}
                  disabled={(date) => date < new Date()}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            {expiresAt && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setExpiresAt(undefined)}
                disabled={isLoading}
              >
                Remover data de expiração
              </Button>
            )}
          </div>

          <div className="flex gap-2 justify-end">
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleClose}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Criar Membro
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};