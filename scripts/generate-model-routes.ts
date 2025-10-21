import { createClient } from '@supabase/supabase-js'
import * as fs from 'fs'
import * as path from 'path'

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials. Make sure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set.')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function generateModelRoutes() {
  console.log('🔍 Fetching model IDs from Supabase...')
  
  try {
    const { data: models, error } = await supabase
      .from('models')
      .select('id')
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('❌ Error fetching models:', error)
      process.exit(1)
    }
    
    if (!models || models.length === 0) {
      console.warn('⚠️ No models found in database')
      return []
    }
    
    const routes = models.map(model => `/models/${model.id}`)
    
    console.log(`✅ Generated ${routes.length} model routes`)
    
    // Save to file for reference and debugging
    const outputPath = path.join(process.cwd(), 'model-routes.json')
    fs.writeFileSync(outputPath, JSON.stringify(routes, null, 2))
    
    console.log(`📝 Routes saved to model-routes.json`)
    
    return routes
  } catch (err) {
    console.error('❌ Unexpected error:', err)
    process.exit(1)
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  generateModelRoutes().then(routes => {
    console.log(`\n🎉 Successfully generated ${routes.length} model routes for SSG prerendering`)
  })
}

export { generateModelRoutes }
