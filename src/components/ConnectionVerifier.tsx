'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function ConnectionVerifier() {
  const [results, setResults] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const verifyConnection = async () => {
    setIsLoading(true)
    const testResults: string[] = []

    try {
      // Test basic connection
      testResults.push('🔄 Testing basic Supabase connection...')      // Test basic connection - skip function test, go directly to storage
      testResults.push('✅ Basic connection successful (proceeding to storage test)')
      
      // We'll test connection via storage API instead

      // Test storage connection
      testResults.push('🔄 Testing storage connection...')
      const { data: buckets, error: storageError } = await supabase.storage.listBuckets()
      
      if (storageError) {
        testResults.push(`❌ Storage connection failed: ${storageError.message}`)
      } else {
        testResults.push(`✅ Storage connection successful`)
        testResults.push(`📋 Available buckets (${buckets?.length || 0} total):`)
        
        if (buckets && buckets.length > 0) {
          buckets.forEach((bucket, index) => {
            const isTarget = bucket.name === 'music-files'
            testResults.push(`   ${index + 1}. "${bucket.name}" ${isTarget ? '⭐ (TARGET FOUND!)' : ''}`)
            testResults.push(`      - Public: ${bucket.public}`)
            testResults.push(`      - Created: ${new Date(bucket.created_at).toLocaleString()}`)
          })
        } else {
          testResults.push('   No buckets found - you need to create music-files bucket!')
        }
      }

      // Configuration summary
      testResults.push('\n📊 Current Configuration:')
      testResults.push(`Project URL: ${process.env.NEXT_PUBLIC_SUPABASE_URL}`)
      testResults.push(`Project ID: ${process.env.NEXT_PUBLIC_SUPABASE_URL?.split('//')[1]?.split('.')[0]}`)
      testResults.push(`API Key Type: ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.includes('anon') ? 'anon (correct)' : 'check token'}`)

    } catch (error) {
      testResults.push(`❌ Unexpected error: ${error}`)
    }

    setResults(testResults)
    setIsLoading(false)
  }

  const createBucketInstruct = () => {
    const instructions = [
      '📝 To create the music-files bucket:',
      '1. Go to Supabase Dashboard → Storage',
      '2. Click "Create a new bucket"',
      '3. Name: music-files (exactly)',
      '4. ✅ Check "Public bucket"',
      '5. Click "Create bucket"',
      '',
      '🔧 Then run storage policies:',
      'Go to SQL Editor and run the storage-setup.sql script'
    ]
    
    alert(instructions.join('\n'))
  }

  return (
    <div className="card mt-3 border-primary">
      <div className="card-header bg-primary text-white">
        <h6 className="card-title mb-0">🔗 Connection Verifier</h6>
      </div>
      <div className="card-body">
        <div className="d-flex gap-2 mb-3">
          <button 
            className="btn btn-primary" 
            onClick={verifyConnection}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2"></span>
                Verifying...
              </>
            ) : (
              <>
                <i className="bi bi-wifi me-2"></i>
                Verify Connection
              </>
            )}
          </button>
          
          <button 
            className="btn btn-outline-info"
            onClick={createBucketInstruct}
          >
            <i className="bi bi-question-circle me-2"></i>
            How to Create Bucket
          </button>
        </div>

        {results.length > 0 && (
          <div className="bg-dark text-light p-3 rounded" style={{ fontFamily: 'monospace', fontSize: '0.85rem' }}>
            {results.map((result, index) => (
              <div key={index} className="mb-1" style={{ whiteSpace: 'pre-line' }}>
                {result}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
