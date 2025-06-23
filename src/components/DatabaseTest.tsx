'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function DatabaseTest() {
  const [testResults, setTestResults] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const runTests = async () => {
    setIsLoading(true)
    const results: string[] = []

    try {
      // Test 1: Check Supabase connection
      results.push('🔄 Testing Supabase connection...')
      
      // Test 2: Check if songs table exists and is accessible
      const { data: songs, error: songsError } = await supabase
        .from('songs')
        .select('*')
        .limit(1)

      if (songsError) {
        results.push(`❌ Songs table error: ${songsError.message}`)
        
        // Specific error diagnostics
        if (songsError.message.includes('relation "public.songs" does not exist')) {
          results.push('💡 Solution: Run the init.sql script in Supabase SQL Editor')
        } else if (songsError.message.includes('permission denied') || songsError.code === 'PGRST301') {
          results.push('💡 Solution: Check RLS policies - run quick-fix.sql')
        } else if (songsError.message.includes('Invalid API key')) {
          results.push('💡 Solution: Verify your NEXT_PUBLIC_SUPABASE_ANON_KEY')
        }
      } else {
        results.push(`✅ Songs table accessible - found ${songs?.length || 0} records`)
      }

      // Test 3: Check storage bucket access
      const { data: buckets, error: bucketsError } = await supabase
        .storage
        .listBuckets()

      if (bucketsError) {
        results.push(`❌ Storage error: ${bucketsError.message}`)
      } else {
        const musicBucket = buckets?.find(b => b.name === 'music-files')
        if (musicBucket) {
          results.push('✅ music-files storage bucket found')
        } else {
          results.push('❌ music-files storage bucket not found')
          results.push('💡 Solution: Create "music-files" bucket in Supabase Dashboard')
        }
      }      // Test 4: Test file upload (without actually uploading)
      try {
        const { error: uploadError } = await supabase
          .storage
          .from('music-files')
          .list('', { limit: 1 })

        if (uploadError) {
          results.push(`❌ Storage access error: ${uploadError.message}`)
          results.push('💡 Solution: Run storage-setup.sql for storage policies')
        } else {
          results.push('✅ Storage bucket is accessible')
        }
      } catch (err) {
        results.push(`❌ Storage test failed: ${err}`)
      }

      // Test 5: Environment variables check
      if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        results.push('✅ Environment variables are set')
        
        // Check if it's a real anon key (starts with 'eyJ')
        if (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.startsWith('eyJ')) {
          results.push('✅ ANON key format looks correct')
        } else {
          results.push('⚠️ ANON key format might be incorrect')
        }
      } else {
        results.push('❌ Environment variables missing')
      }

    } catch (error) {
      results.push(`❌ Unexpected error: ${error}`)
    }

    setTestResults(results)
    setIsLoading(false)
  }

  return (
    <div className="container mt-4">
      <div className="card">
        <div className="card-header">
          <h5 className="card-title mb-0">
            <i className="bi bi-tools me-2"></i>
            Database Connection Test
          </h5>
        </div>
        <div className="card-body">
          <button 
            className="btn btn-primary mb-3" 
            onClick={runTests}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                Testing...
              </>
            ) : (
              <>
                <i className="bi bi-play-circle me-2"></i>
                Run Connection Tests
              </>
            )}
          </button>

          {testResults.length > 0 && (
            <div className="bg-dark text-light p-3 rounded" style={{ fontFamily: 'monospace', fontSize: '0.9rem' }}>
              {testResults.map((result, index) => (
                <div key={index} className="mb-1">
                  {result}
                </div>
              ))}
            </div>
          )}

          {!isLoading && testResults.length > 0 && (
            <div className="mt-3">
              <h6>Quick Setup Steps:</h6>
              <ol className="small">
                <li>Run <code>supabase/diagnostic.sql</code> in Supabase SQL Editor to check current state</li>
                <li>Run <code>supabase/quick-fix.sql</code> if tables/policies are missing</li>
                <li>Create &quot;music-files&quot; storage bucket in Supabase Dashboard (Storage section)</li>
                <li>Run <code>supabase/storage-setup.sql</code> for storage policies</li>
                <li>Verify your .env.local has the correct ANON key (not service_role key)</li>
              </ol>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
