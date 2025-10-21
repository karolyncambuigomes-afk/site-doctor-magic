/**
 * Test script to verify model routes generation
 * Run with: npx tsx scripts/test-model-routes.ts
 */

import { generateModelRoutes } from './generate-model-routes.js'

async function test() {
  console.log('🧪 Testing model routes generation...\n')
  
  const routes = await generateModelRoutes()
  
  console.log('\n📊 Results:')
  console.log(`   Total routes: ${routes.length}`)
  console.log(`   Sample routes:`)
  routes.slice(0, 5).forEach(route => {
    console.log(`   - ${route}`)
  })
  
  if (routes.length > 5) {
    console.log(`   ... and ${routes.length - 5} more`)
  }
}

test()
