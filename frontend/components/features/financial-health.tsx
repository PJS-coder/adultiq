'use client'

import { Card } from '@/components/ui/card'
import { TrendingUp, DollarSign, PieChart, Target } from 'lucide-react'

const FINANCIAL_STATS = [
  {
    label: 'Monthly Income',
    value: '$3,500',
    change: '+5%',
    icon: DollarSign,
    color: 'text-green-500',
  },
  {
    label: 'Total Savings',
    value: '$8,250',
    change: '+12%',
    icon: TrendingUp,
    color: 'text-blue-500',
  },
  {
    label: 'Credit Score',
    value: '720',
    change: '+45',
    icon: PieChart,
    color: 'text-purple-500',
  },
  {
    label: 'Financial Goal',
    value: '65%',
    change: 'Complete',
    icon: Target,
    color: 'text-orange-500',
  },
]

const EXPENSE_BREAKDOWN = [
  { category: 'Housing', amount: 1200, percentage: 34 },
  { category: 'Food', amount: 400, percentage: 12 },
  { category: 'Transport', amount: 200, percentage: 6 },
  { category: 'Entertainment', amount: 300, percentage: 8 },
  { category: 'Savings', amount: 800, percentage: 23 },
  { category: 'Other', amount: 600, percentage: 17 },
]

export default function FinancialHealth() {
  return (
    <div className="p-6 md:p-8">
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/20 border border-secondary/40 mb-4">
          <TrendingUp className="w-4 h-4 text-primary" />
          <span className="text-sm text-foreground">Track Your Finances</span>
        </div>
        <h1 className="text-3xl font-bold mb-2">Financial Health</h1>
        <p className="text-muted-foreground">
          Monitor your income, spending, and savings goals all in one place.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {FINANCIAL_STATS.map((stat, index) => {
          const Icon = stat.icon
          return (
            <Card key={index} className="border-border p-6">
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center`}>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <span className="text-xs text-green-500 font-medium">
                  {stat.change}
                </span>
              </div>
              <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
              <p className="text-2xl font-bold">{stat.value}</p>
            </Card>
          )
        })}
      </div>

      {/* Spending Breakdown */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="border-border p-6">
          <h2 className="text-xl font-bold mb-6">Monthly Spending Breakdown</h2>
          <div className="space-y-4">
            {EXPENSE_BREAKDOWN.map((expense, index) => (
              <div key={index}>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">{expense.category}</span>
                  <span className="text-sm text-muted-foreground">
                    ${expense.amount} ({expense.percentage}%)
                  </span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full"
                    style={{ width: `${expense.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="border-border p-6">
          <h2 className="text-xl font-bold mb-6">Financial Tips</h2>
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-muted">
              <p className="font-medium mb-1">Emergency Fund Goal</p>
              <p className="text-sm text-muted-foreground">
                Aim to save 3-6 months of expenses for emergencies.
              </p>
            </div>
            <div className="p-4 rounded-lg bg-muted">
              <p className="font-medium mb-1">Debt Strategy</p>
              <p className="text-sm text-muted-foreground">
                Pay off high-interest debt first while maintaining minimum payments.
              </p>
            </div>
            <div className="p-4 rounded-lg bg-muted">
              <p className="font-medium mb-1">Retirement Savings</p>
              <p className="text-sm text-muted-foreground">
                Start early with 401(k)s and IRAs to maximize compound growth.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
