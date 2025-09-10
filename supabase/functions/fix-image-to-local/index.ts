import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface FixImageRequest {
  imageUrl: string;
  category: string;
  itemId: string;
  tableName: string;
  fieldName: string;
  itemName?: string;
  altText?: string;
}

async function convertToWebP(imageBuffer: ArrayBuffer, maxWidth = 1200): Promise<Uint8Array> {
  try {
    // Create an OffscreenCanvas for image processing
    const canvas = new OffscreenCanvas(maxWidth, maxWidth);
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Failed to get canvas context');

    // Create ImageBitmap from buffer
    const blob = new Blob([imageBuffer]);
    const imageBitmap = await createImageBitmap(blob);
    
    // Calculate dimensions maintaining aspect ratio
    let { width, height } = imageBitmap;
    if (width > maxWidth || height > maxWidth) {
      const ratio = Math.min(maxWidth / width, maxWidth / height);
      width = Math.floor(width * ratio);
      height = Math.floor(height * ratio);
    }
    
    // Resize canvas and draw image
    canvas.width = width;
    canvas.height = height;
    ctx.drawImage(imageBitmap, 0, 0, width, height);
    
    // Convert to WebP
    const webpBlob = await canvas.convertToBlob({ type: 'image/webp', quality: 0.85 });
    const webpBuffer = await webpBlob.arrayBuffer();
    
    console.log(`✅ [CONVERT] Converted ${imageBuffer.byteLength} bytes to ${webpBuffer.byteLength} bytes WebP (${width}x${height})`);
    
    return new Uint8Array(webpBuffer);
  } catch (error) {
    console.error('❌ [CONVERT] WebP conversion failed, using original:', error);
    return new Uint8Array(imageBuffer);
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { imageUrl, category, itemId, tableName, fieldName, itemName, altText }: FixImageRequest = await req.json()

    console.log(`🔧 [FIX-IMAGE] Starting fix for ${category}: ${itemName}`)
    console.log(`📍 [FIX-IMAGE] URL: ${imageUrl}`)
    console.log(`🏷️ [FIX-IMAGE] Table: ${tableName}, Field: ${fieldName}, ID: ${itemId}`)

    // Download the image
    const imageResponse = await fetch(imageUrl)
    if (!imageResponse.ok) {
      throw new Error(`Failed to download image: ${imageResponse.statusText}`)
    }

    const imageBlob = await imageResponse.blob()
    const imageArrayBuffer = await imageBlob.arrayBuffer()
    
    console.log(`📥 [FIX-IMAGE] Downloaded image: ${imageArrayBuffer.byteLength} bytes, type: ${imageBlob.type}`)

    // Convert to optimized WebP
    const optimizedImageData = await convertToWebP(imageArrayBuffer)

    // Generate standardized filename
    const sanitizedName = (itemName || itemId).toLowerCase()
      .replace(/[^a-z0-9-]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')

    let filename: string
    switch (category.toLowerCase()) {
      case 'hero/banners':
        filename = `hero-banner-${sanitizedName}-1600.webp`
        break
      case 'homepage carousel':
        filename = `carousel-${sanitizedName}-1200.webp`
        break
      case 'models':
        filename = `model-${sanitizedName}-main-1200.webp`
        break
      case 'blog posts':
        filename = `blog-${sanitizedName}-1200.webp`
        break
      case 'site content':
        filename = `static-${sanitizedName}-1200.webp`
        break
      default:
        filename = `${sanitizedName}-1200.webp`
    }

    console.log(`📂 [FIX-IMAGE] Generated filename: ${filename}`)

    // Upload to Supabase Storage (model-images bucket)
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('model-images')
      .upload(`local-cache/${filename}`, optimizedImageData, {
        contentType: 'image/webp',
        upsert: true
      })

    if (uploadError) {
      throw new Error(`Failed to upload image: ${uploadError.message}`)
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('model-images')
      .getPublicUrl(`local-cache/${filename}`)

    const localUrl = `/images/${filename}`
    
    console.log(`✅ [FIX-IMAGE] Uploaded to: ${localUrl}`)

    // Background task for database update and cache management
    const backgroundTask = async () => {
      try {
        console.log(`🔄 [UPDATE] Starting database update for ${tableName}`)
        
        // Update database based on table and category
        let updateData: any = {}
        let updateQuery: any = null
        
        if (tableName === 'hero_slides') {
          updateData = {
            image_url_local_desktop: localUrl,
            image_url_local_mobile: localUrl,
            image_url_local_fallback: localUrl
          }
          updateQuery = supabase.from(tableName).update(updateData).eq('id', itemId)
          console.log(`📝 [UPDATE] Hero slides update data:`, updateData)
        } else if (tableName === 'homepage_carousel') {
          updateData = { image_url_local: localUrl }
          updateQuery = supabase.from(tableName).update(updateData).eq('id', itemId)
          console.log(`📝 [UPDATE] Homepage carousel update data:`, updateData)
        } else if (tableName === 'models') {
          updateData = { [fieldName]: localUrl }
          updateQuery = supabase.from(tableName).update(updateData).eq('id', itemId)
          console.log(`📝 [UPDATE] Models update data:`, updateData)
        } else if (tableName === 'blog_posts') {
          updateData = { image_local: localUrl }
          updateQuery = supabase.from(tableName).update(updateData).eq('id', itemId)
          console.log(`📝 [UPDATE] Blog posts update data:`, updateData)
        } else if (tableName === 'site_content') {
          // For site_content banners, update multiple image fields
          if (category.toLowerCase().includes('hero') || category.toLowerCase().includes('banner')) {
            updateData = {
              image_url_local_desktop: localUrl,
              image_url_local_mobile: localUrl,
              image_url_local_fallback: localUrl
            }
          } else {
            updateData = { [fieldName]: localUrl }
          }
          // For site_content, use section field instead of id
          updateQuery = supabase.from(tableName).update(updateData).eq('section', itemId)
          console.log(`📝 [UPDATE] Site content update data for section '${itemId}':`, updateData)
        } else {
          updateData = { [fieldName]: localUrl }
          updateQuery = supabase.from(tableName).update(updateData).eq('id', itemId)
          console.log(`📝 [UPDATE] Generic update data:`, updateData)
        }

        // Auto-generate alt text if missing
        if (!altText && itemName) {
          let generatedAlt = ""
          switch (category.toLowerCase()) {
            case 'models':
              generatedAlt = `${itemName} — elite companion in London`
              break
            case 'blog posts':
              generatedAlt = `${itemName} — featured article image`
              break
            case 'hero/banners':
              generatedAlt = `${itemName} — luxury escort services banner`
              break
            case 'homepage carousel':
              generatedAlt = `${itemName} — featured companion`
              break
            default:
              generatedAlt = itemName
          }
          
          // Add alt text to update if there's a field for it
          if (tableName === 'hero_slides') {
            updateData.title = updateData.title || generatedAlt
          }
        }

        // Update the database
        console.log(`🚀 [UPDATE] Executing update query...`)
        const { data: updateResult, error: updateError } = await updateQuery

        if (updateError) {
          console.error(`❌ [UPDATE] Database update failed:`, updateError)
          console.error(`❌ [UPDATE] Error details:`, JSON.stringify(updateError, null, 2))
        } else {
          console.log(`✅ [UPDATE] Database updated successfully for ${itemName}`)
          console.log(`✅ [UPDATE] Update result:`, updateResult)
          
          // Verify the update by reading back the data
          let verifyQuery: any = null
          if (tableName === 'site_content') {
            verifyQuery = supabase.from(tableName).select('*').eq('section', itemId).single()
          } else {
            verifyQuery = supabase.from(tableName).select('*').eq('id', itemId).single()
          }
          
          const { data: verifyData, error: verifyError } = await verifyQuery
          if (!verifyError) {
            console.log(`🔍 [VERIFY] Updated record:`, verifyData)
          }
        }

        // Cache management would be handled client-side
        console.log(`🗑️ [CACHE] Cache purge and SW refresh recommended`)

      } catch (error) {
        console.error(`❌ [BACKGROUND] Background task failed:`, error)
        console.error(`❌ [BACKGROUND] Error stack:`, error.stack)
      }
    }

    // Start background task
    EdgeRuntime.waitUntil(backgroundTask())

    return new Response(JSON.stringify({
      success: true,
      localUrl,
      filename,
      originalUrl: imageUrl,
      category,
      itemName
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })

  } catch (error) {
    console.error('❌ [FIX-IMAGE] Error:', error)
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})