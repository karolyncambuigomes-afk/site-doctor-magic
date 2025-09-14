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

    // Download the image
    const imageResponse = await fetch(imageUrl)
    if (!imageResponse.ok) {
      throw new Error(`Failed to download image: ${imageResponse.statusText}`)
    }

    const imageBlob = await imageResponse.blob()
    const imageArrayBuffer = await imageBlob.arrayBuffer()
    
    console.log(`📥 [FIX-IMAGE] Downloaded image: ${imageArrayBuffer.byteLength} bytes`)

    // Convert to WebP using Canvas API (simplified approach)
    // In a real implementation, you'd use a proper image processing library
    const optimizedImageData = new Uint8Array(imageArrayBuffer)

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
        } else if (tableName === 'homepage_carousel') {
          updateData = { image_url: localUrl }
          updateQuery = supabase.from(tableName).update(updateData).eq('id', itemId)
        } else if (tableName === 'models') {
          updateData = { image: localUrl }
          updateQuery = supabase.from(tableName).update(updateData).eq('id', itemId)
        } else if (tableName === 'blog_posts') {
          updateData = { image: localUrl }
          updateQuery = supabase.from(tableName).update(updateData).eq('id', itemId)
        } else if (tableName === 'site_content') {
          updateData = { [fieldName]: localUrl }
          // For site_content, use section field instead of id
          updateQuery = supabase.from(tableName).update(updateData).eq('section', itemId)
        } else {
          updateData = { [fieldName]: localUrl }
          updateQuery = supabase.from(tableName).update(updateData).eq('id', itemId)
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
        const { error: updateError } = await updateQuery

        if (updateError) {
          console.error(`❌ [FIX-IMAGE] Database update failed:`, updateError)
        } else {
          console.log(`✅ [FIX-IMAGE] Database updated for ${itemName}`)
        }

        // Cache management would be handled client-side
        console.log(`🗑️ [FIX-IMAGE] Cache purge and SW refresh needed`)

      } catch (error) {
        console.error(`❌ [FIX-IMAGE] Background task failed:`, error)
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