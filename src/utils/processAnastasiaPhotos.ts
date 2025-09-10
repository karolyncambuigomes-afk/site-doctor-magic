import { supabase } from '@/integrations/supabase/client';

export const processAnastasiaPhotos = async () => {
  try {
    console.log('🔄 Starting Anastasia photo processing...');
    
    const { data, error } = await supabase.functions.invoke('process-anastasia-gallery', {
      body: {}
    });

    if (error) {
      console.error('❌ Function error:', error);
      throw error;
    }

    console.log('✅ Processing completed:', data);
    return data;
  } catch (error) {
    console.error('❌ Error processing Anastasia photos:', error);
    throw error;
  }
};