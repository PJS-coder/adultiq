'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { BookOpen, FileText, ChevronRight, Upload, Sparkles, Eye, Download, X } from 'lucide-react'
import { api } from '@/lib/api'

const DOCUMENTS = [
  {
    id: 1,
    name: 'Tax Return (1040)',
    category: 'Finance',
    difficulty: 'Advanced',
    pdfPath: '/tax_return.pdf',
    explanation:
      'A tax return reports your annual income and calculates taxes owed or refunds due. Understanding your tax return helps you plan finances and catch errors.',
  },
  {
    id: 2,
    name: 'Lease Agreement',
    category: 'Housing',
    difficulty: 'Intermediate',
    pdfPath: '/Lease_Agreement.pdf',
    explanation: 'A legal contract outlining the terms and conditions of renting a property. Know your rights and responsibilities as a tenant.',
  },
  {
    id: 3,
    name: 'Job Contract',
    category: 'Career',
    difficulty: 'Intermediate',
    pdfPath: '/job_contract.pdf',
    explanation:
      'An employment agreement that defines your job responsibilities, salary, benefits, and working conditions. Review carefully before signing.',
  },
  {
    id: 4,
    name: 'Insurance Policy',
    category: 'Finance',
    difficulty: 'Advanced',
    pdfPath: '/insurance_policy.pdf',
    explanation:
      'A contract that provides financial protection against specific risks like accidents, illness, or property damage. Understand your coverage limits.',
  },
  {
    id: 5,
    name: 'Credit Report',
    category: 'Finance',
    difficulty: 'Beginner',
    pdfPath: '/credit_report (1).pdf',
    explanation:
      'A detailed record of your credit history and creditworthiness. Monitor regularly to catch errors and track your financial health.',
  },
]

export default function DocumentDecoder() {
  const [showUpload, setShowUpload] = useState(false)
  const [documentText, setDocumentText] = useState('')
  const [documentType, setDocumentType] = useState('lease')
  const [analyzing, setAnalyzing] = useState(false)
  const [analysis, setAnalysis] = useState('')
  const [selectedDocument, setSelectedDocument] = useState<any>(null)
  const [showPdfViewer, setShowPdfViewer] = useState(false)

  const handleAnalyze = async () => {
    if (!documentText.trim()) return
    
    setAnalyzing(true)
    setAnalysis('')
    
    try {
      console.log('Sending document analysis request...', { documentType, textLength: documentText.length })
      const response = await api.decodeDocument(documentText, documentType)
      console.log('Document analysis response:', response)
      
      if (response.success) {
        setAnalysis(response.explanation)
        
        // Show XP earned notification
        if (response.xpEarned) {
          setTimeout(() => {
            alert(`Great! You earned +${response.xpEarned} XP for using the document decoder!`)
          }, 500)
        }
      } else {
        console.error('Document decode failed:', response)
        setAnalysis(`Analysis failed: ${response.error || 'Unknown error occurred'}`)
      }
    } catch (error) {
      console.error('Document decode error:', error)
      
      // More detailed error handling
      if (error instanceof Error) {
        if (error.message.includes('401') || error.message.includes('Unauthorized')) {
          setAnalysis('Authentication error: Please log in again to use the document decoder.')
        } else if (error.message.includes('500')) {
          setAnalysis('Server error: The AI service is temporarily unavailable. Please try again later.')
        } else if (error.message.includes('Network')) {
          setAnalysis('Network error: Please check your internet connection and try again.')
        } else {
          setAnalysis(`Error: ${error.message}. Please try again or contact support if the issue persists.`)
        }
      } else {
        setAnalysis('Sorry, there was an unexpected error analyzing your document. Please try again.')
      }
    } finally {
      setAnalyzing(false)
    }
  }

  const handleDocumentClick = (doc: any) => {
    setSelectedDocument(doc)
    setShowPdfViewer(true)
  }

  return (
    <div className="p-6 md:p-8">
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#EAF6FF]/50 dark:bg-blue-500/20 border border-[#C1E5FF] dark:border-blue-500/40 mb-4">
          <BookOpen className="w-4 h-4 text-[#6AB0E3] dark:text-blue-400" />
          <span className="text-sm text-[#2D3748] dark:text-white">Understand Real Documents</span>
        </div>
        <h1 className="text-3xl font-bold mb-2 text-[#2D3748] dark:text-white">Document Decoder</h1>
        <p className="text-[#6AB0E3] dark:text-blue-400">
          Confused by official documents? We'll explain what they mean and why they matter.
        </p>
      </div>

      <div className="mb-8">
        <Button 
          onClick={() => setShowUpload(!showUpload)}
          className="mt-4 w-full md:w-auto bg-gradient-to-r from-[#6AB0E3] to-[#9CD5FF] hover:from-[#2D3748] hover:to-[#1A202C] text-white shadow-md hover:shadow-lg"
        >
          <Upload className="w-4 h-4 mr-2" />
          Upload Your Document
        </Button>
      </div>

      {/* PDF Viewer Modal */}
      {showPdfViewer && selectedDocument && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-4xl h-[80vh] flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-[#C1E5FF] dark:border-gray-600">
              <h3 className="text-lg font-semibold text-[#2D3748] dark:text-white">{selectedDocument.name}</h3>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => window.open(selectedDocument.pdfPath, '_blank')}
                  className="border-[#C1E5FF] dark:border-gray-600 text-[#6AB0E3] dark:text-blue-400"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => setShowPdfViewer(false)}
                  className="text-[#6AB0E3] dark:text-blue-400"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <div className="flex-1 p-4">
              <iframe
                src={selectedDocument.pdfPath}
                className="w-full h-full rounded-lg border border-[#C1E5FF] dark:border-gray-600"
                title={selectedDocument.name}
              />
            </div>
          </div>
        </div>
      )}

      {/* Upload Section */}
      {showUpload && (
        <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border border-[#C1E5FF] dark:border-gray-600 p-6 mb-8 shadow-lg">
          <h3 className="font-semibold mb-4 text-[#2D3748] dark:text-white">Paste Your Document Text</h3>
          <Textarea
            placeholder="Paste your lease agreement, medical bill, or any document text here for AI analysis..."
            value={documentText}
            onChange={(e) => setDocumentText(e.target.value)}
            className="min-h-[200px] mb-4 bg-white dark:bg-gray-700 border-[#C1E5FF] dark:border-gray-600 text-[#2D3748] dark:text-white"
          />
          <div className="flex gap-4 flex-wrap">
            <select
              value={documentType}
              onChange={(e) => setDocumentType(e.target.value)}
              className="px-4 py-2 rounded-lg border border-[#C1E5FF] dark:border-gray-600 bg-white dark:bg-gray-700 text-[#2D3748] dark:text-white"
            >
              <option value="lease">Lease Agreement</option>
              <option value="medical">Medical Bill</option>
              <option value="insurance">Insurance Policy</option>
              <option value="contract">Job Contract</option>
              <option value="tax">Tax Document</option>
              <option value="credit">Credit Report</option>
            </select>
            <Button 
              onClick={handleAnalyze}
              disabled={!documentText.trim() || analyzing}
              className="flex-1 bg-gradient-to-r from-[#6AB0E3] to-[#9CD5FF] hover:from-[#2D3748] hover:to-[#1A202C] text-white shadow-md hover:shadow-lg"
            >
              {analyzing ? (
                <>
                  <Sparkles className="w-4 h-4 mr-2 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Decode Document
                </>
              )}
            </Button>
          </div>

          {analysis && (
            <div className="mt-6 p-4 rounded-lg bg-gradient-to-br from-[#EAF6FF] to-white dark:from-gray-700 dark:to-gray-800 border border-[#C1E5FF] dark:border-gray-600 whitespace-pre-wrap text-[#2D3748] dark:text-white">
              {analysis}
            </div>
          )}
        </Card>
      )}

      <div className="space-y-4">
        {DOCUMENTS.map((doc) => (
          <Card
            key={doc.id}
            className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border border-[#C1E5FF] dark:border-gray-600 hover:border-[#9CD5FF] dark:hover:border-blue-400 hover:shadow-lg hover:shadow-[#6AB0E3]/10 transition-all duration-300 p-6 cursor-pointer group"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#6AB0E3] to-[#9CD5FF] flex items-center justify-center flex-shrink-0">
                <FileText className="w-6 h-6 text-white" />
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold mb-2 text-[#2D3748] dark:text-white">{doc.name}</h3>
                <p className="text-[#6AB0E3] dark:text-blue-400 text-sm mb-3 line-clamp-2">
                  {doc.explanation}
                </p>

                <div className="flex items-center gap-4 text-xs mb-4">
                  <span className="px-2 py-1 rounded bg-[#EAF6FF] dark:bg-gray-700 text-[#6AB0E3] dark:text-blue-400">
                    {doc.category}
                  </span>
                  <span className="px-2 py-1 rounded bg-gradient-to-r from-[#6AB0E3] to-[#9CD5FF] text-white">
                    {doc.difficulty}
                  </span>
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={() => handleDocumentClick(doc)}
                    className="bg-gradient-to-r from-[#6AB0E3] to-[#9CD5FF] hover:from-[#2D3748] hover:to-[#1A202C] text-white text-sm"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    View PDF
                  </Button>
                </div>
              </div>

              <ChevronRight className="w-5 h-5 text-[#6AB0E3] dark:text-blue-400 group-hover:text-[#2D3748] dark:group-hover:text-white transition-colors flex-shrink-0" />
            </div>
          </Card>
        ))}
      </div>

      {DOCUMENTS.length === 0 && (
        <div className="text-center py-12">
          <p className="text-[#6AB0E3] dark:text-blue-400">No documents available.</p>
        </div>
      )}
    </div>
  )
}
