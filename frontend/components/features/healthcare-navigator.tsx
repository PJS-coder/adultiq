'use client'

import { Card } from '@/components/ui/card'
import { Heart, DollarSign, FileText, Phone } from 'lucide-react'

const INSURANCE_TERMS = [
  {
    term: 'Premium',
    definition: 'The amount you pay monthly for your insurance coverage',
    example: '$200/month',
  },
  {
    term: 'Deductible',
    definition: 'Amount you pay before insurance starts covering costs',
    example: '$1,500/year',
  },
  {
    term: 'Copay',
    definition: 'Fixed amount you pay for each doctor visit or prescription',
    example: '$25 per visit',
  },
  {
    term: 'Out-of-Pocket Max',
    definition: 'Maximum you\'ll pay in a year before insurance covers 100%',
    example: '$6,000/year',
  },
]

const WHEN_TO_GO = [
  {
    situation: 'Emergency Room',
    when: 'Life-threatening: chest pain, severe bleeding, major injuries',
    cost: '$$$$ (Most expensive)',
  },
  {
    situation: 'Urgent Care',
    when: 'Non-life-threatening but needs quick attention: sprains, minor cuts, flu',
    cost: '$$ (Moderate)',
  },
  {
    situation: 'Primary Care',
    when: 'Routine checkups, preventive care, chronic condition management',
    cost: '$ (Least expensive)',
  },
]

export default function HealthcareNavigator() {
  return (
    <div className="p-6 md:p-8">
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/20 border border-secondary/40 mb-4">
          <Heart className="w-4 h-4 text-primary" />
          <span className="text-sm text-foreground">Understand Healthcare</span>
        </div>
        <h1 className="text-3xl font-bold mb-2">Healthcare Navigator</h1>
        <p className="text-muted-foreground">
          Demystify health insurance and learn when to seek care.
        </p>
      </div>

      {/* Insurance Terms */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Insurance Terms Explained</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {INSURANCE_TERMS.map((item, index) => (
            <Card key={index} className="border-border p-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <DollarSign className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">{item.term}</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    {item.definition}
                  </p>
                  <p className="text-xs text-primary font-medium">
                    Example: {item.example}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* When to Go Where */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6">When to Go Where</h2>
        <div className="space-y-4">
          {WHEN_TO_GO.map((item, index) => (
            <Card key={index} className="border-border p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-2">{item.situation}</h3>
                  <p className="text-muted-foreground mb-2">{item.when}</p>
                  <span className="text-sm font-medium text-primary">{item.cost}</span>
                </div>
                <Phone className="w-6 h-6 text-muted-foreground" />
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Medical Bill Rights */}
      <Card className="border-border p-6 bg-primary/5">
        <h2 className="text-xl font-bold mb-4">Your Medical Bill Rights</h2>
        <ul className="space-y-2 text-sm">
          <li className="flex items-start gap-2">
            <span className="text-green-500">✓</span>
            <span>You can negotiate medical bills - most hospitals offer payment plans</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-500">✓</span>
            <span>Request an itemized bill to check for errors</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-500">✓</span>
            <span>Medical debt cannot be reported to credit bureaus for 1 year</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-500">✓</span>
            <span>You may qualify for financial assistance or charity care</span>
          </li>
        </ul>
      </Card>
    </div>
  )
}
