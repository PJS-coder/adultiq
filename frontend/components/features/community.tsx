'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Users, MessageCircle, ThumbsUp, Calendar } from 'lucide-react'

const DISCUSSIONS = [
  {
    title: 'How do I negotiate my first salary?',
    author: 'Sarah M.',
    replies: 12,
    likes: 24,
    category: 'Career',
  },
  {
    title: 'Landlord refusing to fix broken AC',
    author: 'Anonymous',
    replies: 8,
    likes: 15,
    category: 'Housing',
  },
  {
    title: 'Best budgeting apps for beginners?',
    author: 'Mike R.',
    replies: 23,
    likes: 45,
    category: 'Finance',
  },
]

const UPCOMING_AMAS = [
  {
    title: 'Ask a Financial Advisor',
    date: 'March 15, 2024',
    expert: 'Jane Smith, CFP',
  },
  {
    title: 'Tenant Rights Q&A',
    date: 'March 22, 2024',
    expert: 'Legal Aid Society',
  },
]

export default function Community() {
  return (
    <div className="p-6 md:p-8">
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/20 border border-secondary/40 mb-4">
          <Users className="w-4 h-4 text-primary" />
          <span className="text-sm text-foreground">Connect & Learn</span>
        </div>
        <h1 className="text-3xl font-bold mb-2">Community Support</h1>
        <p className="text-muted-foreground">
          Ask questions, share experiences, and learn from others.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Discussions */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-border p-6">
            <h2 className="text-xl font-bold mb-4">Recent Discussions</h2>
            <div className="space-y-4">
              {DISCUSSIONS.map((discussion, index) => (
                <div
                  key={index}
                  className="p-4 rounded-lg bg-muted hover:bg-muted/80 cursor-pointer transition-colors"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold">{discussion.title}</h3>
                    <span className="text-xs px-2 py-1 rounded bg-primary/20 text-primary">
                      {discussion.category}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    by {discussion.author}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <MessageCircle className="w-4 h-4" />
                      {discussion.replies}
                    </span>
                    <span className="flex items-center gap-1">
                      <ThumbsUp className="w-4 h-4" />
                      {discussion.likes}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <Button className="w-full mt-4">Ask a Question</Button>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card className="border-border p-6">
            <h3 className="font-bold mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" />
              Upcoming AMAs
            </h3>
            <div className="space-y-4">
              {UPCOMING_AMAS.map((ama, index) => (
                <div key={index} className="p-3 rounded-lg bg-muted">
                  <p className="font-medium text-sm mb-1">{ama.title}</p>
                  <p className="text-xs text-muted-foreground mb-1">{ama.expert}</p>
                  <p className="text-xs text-primary">{ama.date}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
