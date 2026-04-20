'use client'

import { Card } from '@/components/ui/card'
import { Trophy, Star, Zap, Award } from 'lucide-react'

const BADGES = [
  {
    name: 'First Steps',
    description: 'Complete your first quiz',
    icon: Star,
    earned: true,
    earnedDate: '2024-01-15',
  },
  {
    name: 'Money Master',
    description: 'Complete 5 finance simulations',
    icon: Award,
    earned: true,
    earnedDate: '2024-01-20',
  },
  {
    name: 'Career Ready',
    description: 'Ace the job interview simulation',
    icon: Trophy,
    earned: false,
  },
  {
    name: 'Negotiation Pro',
    description: 'Win 3 salary negotiation challenges',
    icon: Zap,
    earned: false,
  },
  {
    name: 'Life Master',
    description: 'Reach AdultIQ score of 90+',
    icon: Star,
    earned: false,
  },
  {
    name: 'Consistent Learner',
    description: 'Complete 30 days of learning streaks',
    icon: Trophy,
    earned: false,
  },
]

const XP_STATS = [
  { label: 'Total XP', value: '2,450', icon: Zap },
  { label: 'Level', value: '12', icon: Trophy },
  { label: 'This Month', value: '850', icon: Star },
]

export default function AchievementsHub() {
  const earnedBadges = BADGES.filter((b) => b.earned)
  const unlockedBadges = BADGES.filter((b) => !b.earned)

  return (
    <div className="p-6 md:p-8">
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/20 border border-secondary/40 mb-4">
          <Trophy className="w-4 h-4 text-primary" />
          <span className="text-sm text-foreground">Track Your Growth</span>
        </div>
        <h1 className="text-3xl font-bold mb-2">Achievements & Badges</h1>
        <p className="text-muted-foreground">
          Earn badges and level up as you master the art of adulting.
        </p>
      </div>

      {/* XP Stats */}
      <div className="grid md:grid-cols-3 gap-6 mb-12">
        {XP_STATS.map((stat, index) => {
          const Icon = stat.icon
          return (
            <Card key={index} className="border-border p-6 text-center">
              <Icon className="w-8 h-8 text-primary mx-auto mb-3" />
              <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
              <p className="text-3xl font-bold">{stat.value}</p>
            </Card>
          )
        })}
      </div>

      {/* Earned Badges */}
      {earnedBadges.length > 0 && (
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Badges Earned ({earnedBadges.length})</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {earnedBadges.map((badge, index) => {
              const Icon = badge.icon
              return (
                <Card
                  key={index}
                  className="border-primary/50 bg-primary/10 p-6 flex flex-col items-center text-center"
                >
                  <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mb-4">
                    <Icon className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="font-semibold text-sm mb-2">{badge.name}</h3>
                  <p className="text-xs text-muted-foreground mb-3">
                    {badge.description}
                  </p>
                  <p className="text-xs text-primary font-medium">
                    {new Date(badge.earnedDate!).toLocaleDateString()}
                  </p>
                </Card>
              )
            })}
          </div>
        </div>
      )}

      {/* Locked Badges */}
      <div>
        <h2 className="text-2xl font-bold mb-6">Badges to Unlock ({unlockedBadges.length})</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {unlockedBadges.map((badge, index) => {
            const Icon = badge.icon
            return (
              <Card
                key={index}
                className="border-border p-6 flex flex-col items-center text-center opacity-60"
              >
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                  <Icon className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="font-semibold text-sm mb-2">{badge.name}</h3>
                <p className="text-xs text-muted-foreground">
                  {badge.description}
                </p>
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  )
}
