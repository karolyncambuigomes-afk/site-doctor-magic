import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface ContactSettings {
  whatsapp_number: string;
  whatsapp_message: string | null;
  telegram_link: string;
  phone_display: string;
  email: string;
}

// Default fallback values
const DEFAULT_CONTACT_SETTINGS: ContactSettings = {
  whatsapp_number: '+447436190679',
  whatsapp_message: null,
  telegram_link: 'https://t.me/FiveLondon',
  phone_display: '+44 7436 190679',
  email: 'models@exclusivefivelondon.com',
};

export const useContactSettings = () => {
  const query = useQuery({
    queryKey: ['contact_settings'],
    queryFn: async (): Promise<ContactSettings> => {
      try {
        const { data, error } = await supabase
          .from('contact_settings')
          .select('*')
          .limit(1)
          .maybeSingle();

        if (error) {
          console.error('[ContactSettings] Error fetching:', error);
          return DEFAULT_CONTACT_SETTINGS;
        }

        if (!data) {
          console.log('[ContactSettings] No data found, using defaults');
          return DEFAULT_CONTACT_SETTINGS;
        }

        return {
          whatsapp_number: data.whatsapp_number || DEFAULT_CONTACT_SETTINGS.whatsapp_number,
          whatsapp_message: data.whatsapp_message || null,
          telegram_link: data.telegram_link || DEFAULT_CONTACT_SETTINGS.telegram_link,
          phone_display: data.phone_display || DEFAULT_CONTACT_SETTINGS.phone_display,
          email: data.email || DEFAULT_CONTACT_SETTINGS.email,
        };
      } catch (err) {
        console.error('[ContactSettings] Exception:', err);
        return DEFAULT_CONTACT_SETTINGS;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes cache
    gcTime: 10 * 60 * 1000,
  });

  const settings = query.data || DEFAULT_CONTACT_SETTINGS;

  // Helper function to generate WhatsApp link
  const getWhatsAppLink = (customMessage?: string): string => {
    // Remove all non-digit characters except +
    const cleanNumber = settings.whatsapp_number.replace(/[^\d+]/g, '').replace('+', '');
    const message = customMessage || settings.whatsapp_message;
    
    if (message) {
      return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;
    }
    return `https://wa.me/${cleanNumber}`;
  };

  // Helper function to generate tel: link
  const getPhoneLink = (): string => {
    const cleanNumber = settings.whatsapp_number.replace(/[^\d+]/g, '');
    return `tel:${cleanNumber}`;
  };

  // Helper function to generate mailto: link
  const getEmailLink = (subject?: string): string => {
    if (subject) {
      return `mailto:${settings.email}?subject=${encodeURIComponent(subject)}`;
    }
    return `mailto:${settings.email}`;
  };

  // Helper function to get Telegram link
  const getTelegramLink = (): string => {
    return settings.telegram_link;
  };

  return {
    ...settings,
    loading: query.isLoading,
    error: query.error,
    getWhatsAppLink,
    getPhoneLink,
    getEmailLink,
    getTelegramLink,
  };
};

// Export defaults for use in static contexts
export { DEFAULT_CONTACT_SETTINGS };
