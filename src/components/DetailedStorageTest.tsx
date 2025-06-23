'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function DetailedStorageTest() {
  const [results, setResults] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const runDetailedTest = async () => {
    setIsLoading(true)
    const testResults: string[] = []

    try {
      // Test 1: List all buckets
      testResults.push('🔄 Listing all storage buckets...')
      const { data: allBuckets, error: bucketsError } = await supabase.storage.listBuckets()
      
      if (bucketsError) {
        testResults.push(`❌ Error listing buckets: ${bucketsError.message}`)
      } else {
        testResults.push(`✅ Found ${allBuckets?.length || 0} buckets total:`)
        allBuckets?.forEach(bucket => {
          testResults.push(`   - Bucket: "${bucket.name}" (ID: ${bucket.id}, Public: ${bucket.public})`)
        })
      }

      // Test 2: Specifically check for music-files bucket
      testResults.push('\n🔄 Checking for music-files bucket specifically...')
      const musicBucket = allBuckets?.find(b => b.name === 'music-files')
      if (musicBucket) {
        testResults.push(`✅ music-files bucket found! Details:`)
        testResults.push(`   - Name: ${musicBucket.name}`)
        testResults.push(`   - ID: ${musicBucket.id}`)
        testResults.push(`   - Public: ${musicBucket.public}`)
        testResults.push(`   - Created: ${musicBucket.created_at}`)
      } else {
        testResults.push('❌ music-files bucket not found in bucket list')
      }

      // Test 3: Try to access music-files bucket directly
      testResults.push('\n🔄 Testing direct access to music-files bucket...')
      try {
        const { data: bucketFiles, error: filesError } = await supabase
          .storage
          .from('music-files')
          .list('', { limit: 5 })

        if (filesError) {
          testResults.push(`❌ Direct access error: ${filesError.message}`)
          testResults.push(`   Error code: ${filesError.name}`)
          if (filesError.message.includes('not found')) {
            testResults.push('💡 Bucket may not exist or name mismatch')
          }
        } else {
          testResults.push(`✅ Direct access successful! Found ${bucketFiles?.length || 0} files`)
          bucketFiles?.slice(0, 3).forEach(file => {
            testResults.push(`   - File: ${file.name}`)
          })
        }
      } catch (directError) {
        testResults.push(`❌ Direct access failed: ${directError}`)
      }

      // Test 4: Check for similar bucket names
      testResults.push('\n🔄 Checking for similar bucket names...')
      const similarBuckets = allBuckets?.filter(b => 
        b.name.toLowerCase().includes('music') || 
        b.name.toLowerCase().includes('file') ||
        b.name.includes('music-files')
      )
      
      if (similarBuckets && similarBuckets.length > 0) {
        testResults.push('📋 Similar bucket names found:')
        similarBuckets.forEach(bucket => {
          testResults.push(`   - "${bucket.name}" (matches: ${bucket.name === 'music-files' ? 'EXACT' : 'PARTIAL'})`)
        })
      } else {
        testResults.push('ℹ️ No similar bucket names found')
      }

      // Test 5: Environment and configuration check
      testResults.push('\n🔄 Configuration check...')
      testResults.push(`Supabase URL: ${process.env.NEXT_PUBLIC_SUPABASE_URL}`)
      testResults.push(`API Key (first 10 chars): ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.substring(0, 10)}...`)

    } catch (error) {
      testResults.push(`❌ Unexpected error: ${error}`)
    }

    setResults(testResults)
    setIsLoading(false)
  }

  return (
    <div className="card mt-3">
      <div className="card-header">
        <h6 className="card-title mb-0">🔍 Detailed Storage Diagnostics</h6>
      </div>
      <div className="card-body">
        <button 
          className="btn btn-info mb-3" 
          onClick={runDetailedTest}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <span className="spinner-border spinner-border-sm me-2"></span>
              Testing...
            </>
          ) : (
            <>
              <i className="bi bi-search me-2"></i>
              Run Detailed Storage Test
            </>
          )}
        </button>

        {results.length > 0 && (
          <div className="bg-dark text-light p-3 rounded" style={{ fontFamily: 'monospace', fontSize: '0.85rem' }}>
            {results.map((result, index) => (
              <div key={index} className="mb-1" style={{ whiteSpace: 'pre-line' }}>
                {result}
              </div>
            ))}
          </div>
        )}

        {results.length > 0 && (
          <div className="mt-3">
            <h6>Possible Solutions:</h6>            <ul className="small">
              <li><strong>Bucket name mismatch:</strong> Check if bucket name is exactly &quot;music-files&quot; (no spaces, no capitals)</li>
              <li><strong>Permissions issue:</strong> Ensure bucket is public and you have the right API key</li>
              <li><strong>Project mismatch:</strong> Verify you&apos;re connecting to the correct Supabase project</li>
              <li><strong>Fresh bucket:</strong> Try deleting and recreating the bucket</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}
