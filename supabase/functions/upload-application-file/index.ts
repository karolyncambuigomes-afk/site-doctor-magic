import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// File type magic numbers for validation
const MAGIC_NUMBERS: Record<string, Uint8Array[]> = {
  'image/jpeg': [
    new Uint8Array([0xFF, 0xD8, 0xFF]),
  ],
  'image/png': [
    new Uint8Array([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]),
  ],
  'image/webp': [
    new Uint8Array([0x52, 0x49, 0x46, 0x46]), // RIFF
  ],
  'video/mp4': [
    new Uint8Array([0x00, 0x00, 0x00]),  // ftyp box prefix
  ],
};

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const ALLOWED_VIDEO_TYPES = ['video/mp4'];
const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB
const MAX_VIDEO_SIZE = 50 * 1024 * 1024; // 50MB

interface UploadRateLimit {
  count: number;
  window_start: number;
}

const rateLimitMap = new Map<string, UploadRateLimit>();

function checkRateLimit(identifier: string): boolean {
  const now = Date.now();
  const windowSize = 60 * 60 * 1000; // 1 hour
  const maxUploads = 50; // Max 50 file uploads per hour per email

  const existing = rateLimitMap.get(identifier);
  
  if (!existing || now - existing.window_start > windowSize) {
    rateLimitMap.set(identifier, { count: 1, window_start: now });
    return true;
  }
  
  if (existing.count >= maxUploads) {
    return false;
  }
  
  existing.count++;
  return true;
}

function validateMagicNumber(bytes: Uint8Array, mimeType: string): boolean {
  const magicNumbers = MAGIC_NUMBERS[mimeType];
  if (!magicNumbers) return false;
  
  for (const magic of magicNumbers) {
    let match = true;
    for (let i = 0; i < magic.length; i++) {
      if (bytes[i] !== magic[i]) {
        match = false;
        break;
      }
    }
    if (match) return true;
  }
  
  return false;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    const formData = await req.formData();
    const file = formData.get('file') as File;
    const fileType = formData.get('type') as string; // 'photo' or 'video'
    const email = formData.get('email') as string;

    if (!file || !fileType || !email) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: file, type, and email are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Rate limiting
    if (!checkRateLimit(email)) {
      return new Response(
        JSON.stringify({ error: 'Rate limit exceeded. Maximum 50 file uploads per hour.' }),
        { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate file type
    const allowedTypes = fileType === 'photo' ? ALLOWED_IMAGE_TYPES : ALLOWED_VIDEO_TYPES;
    if (!allowedTypes.includes(file.type)) {
      return new Response(
        JSON.stringify({ 
          error: `Invalid file type. Allowed types for ${fileType}: ${allowedTypes.join(', ')}` 
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate file size
    const maxSize = fileType === 'photo' ? MAX_IMAGE_SIZE : MAX_VIDEO_SIZE;
    if (file.size > maxSize) {
      return new Response(
        JSON.stringify({ 
          error: `File too large. Maximum size for ${fileType}: ${maxSize / (1024 * 1024)}MB` 
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Read first bytes for magic number validation
    const arrayBuffer = await file.arrayBuffer();
    const bytes = new Uint8Array(arrayBuffer);
    
    if (!validateMagicNumber(bytes.slice(0, 16), file.type)) {
      return new Response(
        JSON.stringify({ 
          error: 'File content does not match declared type. Possible file tampering detected.' 
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Generate secure random filename using UUID
    const extension = file.type.split('/')[1];
    const folder = fileType === 'photo' ? 'photos' : 'videos';
    const fileName = `${folder}/${crypto.randomUUID()}.${extension}`;

    // Upload to storage (bucket is now private, requires admin access to view)
    const { data, error } = await supabase.storage
      .from('model-applications')
      .upload(fileName, bytes, {
        contentType: file.type,
        upsert: false,
      });

    if (error) {
      console.error('Upload error:', error);
      return new Response(
        JSON.stringify({ error: 'Failed to upload file' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get the path (not public URL since bucket is private)
    const filePath = data.path;

    console.log(`File uploaded successfully: ${filePath} by ${email}`);

    return new Response(
      JSON.stringify({ 
        success: true,
        path: filePath,
        message: 'File uploaded successfully'
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in upload-application-file:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
