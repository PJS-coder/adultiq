'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Home, AlertTriangle, CheckCircle, FileText, Shield } from 'lucide-react'

const RENTING_TOPICS = [
  {
    title: 'Identify Rental Scams',
    description: 'Learn red flags and how to protect yourself from fraudulent listings',
    icon: AlertTriangle,
    color: 'text-red-500',
    bgColor: 'bg-red-500/10',
  },
  {
    title: 'Lease Agreement Guide',
    description: 'Understand every clause before signing your rental contract',
    icon: FileText,
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10',
  },
  {
    title: 'Know Your Tenant Rights',
    description: 'Essential rights every renter should know by state',
    icon: Shield,
    color: 'text-green-500',
    bgColor: 'bg-green-500/10',
  },
  {
    title: 'Move-In Inspection',
    description: 'Complete checklist to document property condition',
    icon: CheckCircle,
    color: 'text-purple-500',
    bgColor: 'bg-purple-500/10',
  },
]

const COMMON_ISSUES = [
  {
    issue: 'Landlord won\'t return security deposit',
    solution: 'Document everything, send certified letter, file small claims if needed',
  },
  {
    issue: 'Maintenance requests ignored',
    solution: 'Submit in writing, follow up, escalate to local housing authority',
  },
  {
    issue: 'Unexpected rent increase',
    solution: 'Check lease terms, verify local rent control laws, negotiate',
  },
]

export default function RentingHub() {
  return (
    <div className="p-6 md:p-8">
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/20 border border-secondary/40 mb-4">
          <Home className="w-4 h-4 text-primary" />
          <span className="text-sm text-foreground">Master Renting</span>
        </div>
        <h1 className="text-3xl font-bold mb-2">Renting 101 Hub</h1>
        <p className="text-muted-foreground">
          Everything you need to know about finding, renting, and maintaining your place.
        </p>
      </div>

      {/* Main Topics */}
      <div className="grid md:grid-cols-2 gap-6 mb-12">
        {RENTING_TOPICS.map((topic, index) => {
          const Icon = topic.icon
          return (
            <Card
              key={index}
              className="border-border hover:border-primary/50 transition-all p-6 cursor-pointer group"
            >
              <div className={`w-12 h-12 rounded-lg ${topic.bgColor} flex items-center justify-center mb-4`}>
                <Icon className={`w-6 h-6 ${topic.color}`} />
              </div>
              <h3 className="text-lg font-semibold mb-2">{topic.title}</h3>
              <p className="text-muted-foreground text-sm mb-4">
                {topic.description}
              </p>
              <Button variant="ghost" className="text-primary group-hover:translate-x-1 transition-transform">
                Learn More →
              </Button>
            </Card>
          )
        })}
      </div>

      {/* Common Issues */}
      <Card className="border-border p-6">
        <h2 className="text-xl font-bold mb-6">Common Renting Issues & Solutions</h2>
        <div className="space-y-4">
          {COMMON_ISSUES.map((item, index) => (
            <div key={index} className="p-4 rounded-lg bg-muted">
              <p className="font-medium mb-2 text-red-500">⚠️ {item.issue}</p>
              <p className="text-sm text-muted-foreground">
                <span className="text-green-500 font-medium">Solution:</span> {item.solution}
              </p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
