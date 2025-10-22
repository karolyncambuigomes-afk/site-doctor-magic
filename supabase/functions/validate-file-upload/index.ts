import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Magic number signatures for file validation
const FILE_SIGNATURES = {
  jpeg: [0xFF, 0xD8, 0xFF],
  png: [0x89, 0x50, 0x4E, 0x47],
  webp: [0x52, 0x49, 0x46, 0x46],
  mp4: [0x00, 0x00, 0x00, 0x18, 0x66, 0x74, 0x79, 0x70], // ftyp box
}

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
const MAX_IMAGE_DIMENSION = 8000 // 8000x8000 max

function validateMagicNumbers(bytes: Uint8Array, fileType: string): boolean {
  if (fileType === 'image/jpeg' || fileType === 'image/jpg') {
    return bytes[0] === FILE_SIGNATURES.jpeg[0] && 
           bytes[1] === FILE_SIGNATURES.jpeg[1] && 
           bytes[2] === FILE_SIGNATURES.jpeg[2]
  }
  
  if (fileType === 'image/png') {
    return bytes[0] === FILE_SIGNATURES.png[0] && 
           bytes[1] === FILE_SIGNATURES.png[1] && 
           bytes[2] === FILE_SIGNATURES.png[2] &&
           bytes[3] === FILE_SIGNATURES.png[3]
  }
  
  if (fileType === 'image/webp') {
    return bytes[0] === FILE_SIGNATURES.webp[0] && 
           bytes[1] === FILE_SIGNATURES.webp[1] && 
           bytes[2] === FILE_SIGNATURES.webp[2] &&
           bytes[3] === FILE_SIGNATURES.webp[3]
  }
  
  if (fileType === 'video/mp4') {
    // Check for ftyp box at position 4-7
    return bytes[4] === 0x66 && bytes[5] === 0x74 && 
           bytes[6] === 0x79 && bytes[7] === 0x70
  }
  
  return false
}

function sanitizeFilename(filename: string): string {
  // Remove path traversal attempts
  let clean = filename.replace(/\.\./g, '').replace(/\//g, '')
  
  // Remove special characters except dots, dashes, underscores
  clean = clean.replace(/[^a-zA-Z0-9._-]/g, '_')
  
  // Limit length
  if (clean.length > 100) {
    const ext = clean.split('.').pop()
    clean = clean.substring(0, 90) + '.' + ext
  }
  
  return clean
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const formData = await req.formData()
    const file = formData.get('file') as File
    const fileType = formData.get('type') as string // 'photo' or 'video'
    
    if (!file) {
      return new Response(
        JSON.stringify({ error: 'No file provided' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log(`Validating ${fileType}: ${file.name}, size: ${file.size}, type: ${file.type}`)

    // 1. Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return new Response(
        JSON.stringify({ 
          error: 'File too large', 
          details: `Maximum size is 10MB. Your file is ${(file.size / 1024 / 1024).toFixed(2)}MB` 
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // 2. Validate MIME type
    const allowedImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    const allowedVideoTypes = ['video/mp4']
    
    if (fileType === 'photo' && !allowedImageTypes.includes(file.type)) {
      return new Response(
        JSON.stringify({ 
          error: 'Invalid image type', 
          details: 'Only JPG, PNG, and WebP images are allowed' 
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }
    
    if (fileType === 'video' && !allowedVideoTypes.includes(file.type)) {
      return new Response(
        JSON.stringify({ 
          error: 'Invalid video type', 
          details: 'Only MP4 videos are allowed' 
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // 3. Validate magic numbers (file signature)
    const arrayBuffer = await file.arrayBuffer()
    const bytes = new Uint8Array(arrayBuffer)
    
    if (!validateMagicNumbers(bytes, file.type)) {
      return new Response(
        JSON.stringify({ 
          error: 'File validation failed', 
          details: 'File content does not match its declared type' 
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // 4. Sanitize filename and generate safe storage path
    const sanitizedName = sanitizeFilename(file.name)
    const fileExt = sanitizedName.split('.').pop()
    const timestamp = Date.now()
    const randomId = crypto.randomUUID().split('-')[0]
    const safePath = `${fileType}s/${timestamp}-${randomId}.${fileExt}`

    // 5. Upload to Supabase Storage with validated file
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('model-applications')
      .upload(safePath, bytes, {
        contentType: file.type,
        cacheControl: '3600',
        upsert: false
      })

    if (uploadError) {
      console.error('Upload error:', uploadError)
      return new Response(
        JSON.stringify({ error: 'Upload failed', details: uploadError.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // 6. Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('model-applications')
      .getPublicUrl(uploadData.path)

    console.log(`✅ File validated and uploaded: ${publicUrl}`)

    return new Response(
      JSON.stringify({ 
        success: true, 
        url: publicUrl,
        path: uploadData.path,
        size: file.size,
        type: file.type
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('File validation error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
