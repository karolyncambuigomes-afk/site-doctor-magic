// Declarar o tipo do dataLayer
declare global {
  interface Window {
    dataLayer: any[];
  }
}

/**
 * Envia evento para o Google Tag Manager dataLayer
 * @param eventName - Nome do evento (ex: 'button_click', 'cta_click')
 * @param eventCategory - Categoria do evento (ex: 'navigation', 'contact', 'booking')
 * @param eventLabel - Label descritivo (ex: 'View Models', 'WhatsApp Contact')
 * @param eventValue - Valor numérico opcional
 * @param additionalData - Dados adicionais customizados
 */
export const trackEvent = (
  eventName: string,
  eventCategory: string,
  eventLabel: string,
  eventValue?: number,
  additionalData?: Record<string, any>
) => {
  if (typeof window !== 'undefined' && window.dataLayer) {
    window.dataLayer.push({
      event: eventName,
      eventCategory,
      eventLabel,
      eventValue,
      ...additionalData,
    });
    
    // Console log apenas em desenvolvimento
    if (import.meta.env.DEV) {
      console.log('📊 GTM Event:', {
        event: eventName,
        eventCategory,
        eventLabel,
        eventValue,
        ...additionalData,
      });
    }
  }
};

/**
 * Hook React para tracking de botões
 */
export const useButtonTracking = () => {
  return (
    buttonLabel: string,
    buttonCategory: string = 'button',
    additionalData?: Record<string, any>
  ) => {
    trackEvent('button_click', buttonCategory, buttonLabel, undefined, additionalData);
  };
};
