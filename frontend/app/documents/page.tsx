'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import DashboardLayout from '@/components/dashboard/dashboard-layout'
import DocumentDecoder from '@/components/features/document-decoder'

interface User {
  id: string
  name: string
  email: string
  adultIqScore: number
}

export default function DocumentsPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const currentUser = localStorage.getItem('currentUser')
    if (!currentUser) {
      router.push('/')
      return
    }

    const parsed = JSON.parse(currentUser)
    const userData = JSON.parse(localStorage.getItem(`user_${parsed.id}`) || '{}')

    setUser({
      ...parsed,
      adultIqScore: userData.adultIqScore || 0,
    })
    setLoading(false)
  }, [router])

  if (loading || !user) return null

  return (
    <DashboardLayout user={user}>
      <DocumentDecoder />
    </DashboardLayout>
  )
}
