'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Scale, Search, Home, Briefcase, ShoppingCart, Heart } from 'lucide-react'

const RIGHTS_CATEGORIES = [
  {
    category: 'Tenant Rights',
    icon: Home,
    rights: [
      'Right to habitable living conditions',
      'Right to privacy (24-hour notice for entry)',
      'Right to security deposit return within 30 days',
      'Protection from discrimination',
    ],
  },
  {
    category: 'Employee Rights',
    icon: Briefcase,
    rights: [
      'Right to minimum wage and overtime pay',
      'Right to safe working conditions',
      'Protection from workplace discrimination',
      'Right to take unpaid leave (FMLA)',
    ],
  },
  {
    category: 'Consumer Rights',
    icon: ShoppingCart,
    rights: [
      'Right to accurate product information',
      'Right to dispute credit report errors',
      'Protection from predatory lending',
      'Right to cancel contracts within cooling-off period',
    ],
  },
  {
    category: 'Healthcare Rights',
    icon: Heart,
    rights: [
      'Right to access medical records',
      'Right to emergency care regardless of ability to pay',
      'Protection of health information (HIPAA)',
      'Right to appeal insurance denials',
    ],
  },
]

export default function RightsGuide() {
  const [searchQuery, setSearchQuery] = useState('')

  const filtered = RIGHTS_CATEGORIES.filter(
    (cat) =>
      cat.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cat.rights.some((right) =>
        right.toLowerCase().includes(searchQuery.toLowerCase())
      )
  )

  return (
    <div className="p-6 md:p-8">
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/20 border border-secondary/40 mb-4">
          <Scale className="w-4 h-4 text-primary" />
          <span className="text-sm text-foreground">Know Your Rights</span>
        </div>
        <h1 className="text-3xl font-bold mb-2">Legal Rights Guide</h1>
        <p className="text-muted-foreground">
          Understand your legal rights as a tenant, employee, consumer, and patient.
        </p>
      </div>

      {/* Search */}
      <div className="mb-8">
        <div className="relative">
          <Search className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
          <Input
            placeholder="Search rights..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-muted border-border"
          />
        </div>
      </div>

      {/* Rights Categories */}
      <div className="space-y-6">
        {filtered.map((category, index) => {
          const Icon = category.icon
          return (
            <Card key={index} className="border-border p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <h2 className="text-xl font-bold">{category.category}</h2>
              </div>
              <ul className="space-y-3">
                {category.rights.map((right, idx) => (
                  <li key={idx} className="flex items-start gap-3 p-3 rounded-lg bg-muted">
                    <span className="text-green-500 mt-0.5">✓</span>
                    <span className="text-sm">{right}</span>
                  </li>
                ))}
              </ul>
            </Card>
          )
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No rights found matching your search.</p>
        </div>
      )}
    </div>
  )
}
