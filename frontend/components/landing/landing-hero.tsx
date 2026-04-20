'use client'

import { Button } from '@/components/ui/button'
import { useEffect, useState } from 'react'

interface LandingHeroProps {
  onSignup: () => void
  onLogin: () => void
}

export default function LandingHero({ onSignup, onLogin }: LandingHeroProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <section className="min-h-screen w-full bg-gradient-to-br from-[#FFFFFF] via-[#EAF6FF] to-[#C1E5FF]">
      {/* Fixed Navigation */}
      <nav className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-b border-[#C1E5FF] z-50 mb-4 sm:mb-6 lg:mb-8 animate-in fade-in slide-in-from-top duration-700 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-18 lg:h-20 flex items-center justify-between">
          <div className="flex items-center">
            <img 
              src="/logo.png" 
              alt="AdultIQ Logo" 
              className="h-10 sm:h-12 lg:h-14 w-auto object-contain dark:brightness-0 dark:invert"
            />
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <Button 
              variant="ghost" 
              onClick={onLogin}
              className="text-teal-500 hover:text-teal-600 text-xs lg:text-sm hidden sm:inline-flex px-3 py-2"
            >
              Login
            </Button>
            <Button 
              onClick={onSignup}
              className="bg-teal-500 hover:bg-teal-600 text-white rounded-full px-4 sm:px-6 py-2 text-xs lg:text-sm shadow-lg hover:shadow-xl transition-all"
            >
              Register
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Content - Takes remaining space */}
      <div className="pt-20 sm:pt-24 lg:pt-32 flex items-center py-8 sm:py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 items-center">
            
            {/* Left Content */}
            <div className="space-y-4 sm:space-y-5 lg:space-y-6">
              <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight">
                  Master.
                  <br />
                  Learn.
                  <br />
                  Grow.
                </h1>
              </div>

              <div className={`space-y-2 sm:space-y-3 transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                <p className="text-base sm:text-lg lg:text-xl text-gray-700 font-medium">
                  Just turned 18 and starting your adult life?
                </p>
                <p className="text-sm sm:text-base lg:text-lg text-gray-600">
                  We're here to help you navigate everything from finances to career planning, housing, and beyond.
                </p>
              </div>

              <div className={`flex items-center gap-3 max-w-md transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                <input
                  type="text"
                  placeholder="Find your life skill"
                  className="flex-1 px-4 sm:px-5 py-2 sm:py-2.5 text-sm rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white transition-all duration-300 focus:scale-105"
                />
                <Button 
                  onClick={onSignup}
                  className="bg-teal-500 hover:bg-teal-600 text-white px-5 sm:px-7 py-2 sm:py-2.5 rounded-lg font-semibold text-sm flex-shrink-0 transition-all duration-300 hover:scale-105 hover:shadow-lg"
                >
                  Go
                </Button>
              </div>
            </div>

            {/* Right Content - Course Cards */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              {/* Main Large Card */}
              <div className={`col-span-2 relative rounded-2xl sm:rounded-3xl overflow-hidden group cursor-pointer h-48 sm:h-56 lg:h-64 transition-all duration-1000 delay-400 hover:scale-105 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
                <div className="absolute inset-0">
                  <img 
                    src="https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&h=600&fit=crop" 
                    alt="Financial Planning"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                </div>
                <div className="absolute inset-0 flex flex-col justify-end p-3 sm:p-5 lg:p-6">
                  <div className="text-white transform transition-transform duration-300 group-hover:translate-y-[-4px]">
                    <p className="text-sm sm:text-base lg:text-lg font-semibold mb-0.5 sm:mb-1 drop-shadow-lg">Financial Planning</p>
                    <p className="text-xs opacity-90 drop-shadow-lg">Course</p>
                  </div>
                  <div className="absolute top-3 right-3 sm:top-5 sm:right-5">
                    <div className="bg-white/20 backdrop-blur-sm rounded-full px-2.5 sm:px-3 py-1 animate-pulse">
                      <span className="text-white font-bold text-xs sm:text-sm drop-shadow-lg">50+</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Small Card 1 - Career */}
              <div className={`relative rounded-2xl sm:rounded-3xl overflow-hidden group cursor-pointer h-32 sm:h-36 lg:h-40 transition-all duration-1000 delay-500 hover:scale-105 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
                <div className="absolute inset-0">
                  <img 
                    src="https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=400&h=600&fit=crop" 
                    alt="Career Skills"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                </div>
                <div className="absolute inset-0 flex items-end p-3 sm:p-4">
                  <p className="text-white font-semibold text-xs sm:text-sm lg:text-base transform transition-transform duration-300 group-hover:translate-y-[-4px] drop-shadow-lg">
                    Career
                  </p>
                </div>
              </div>

              {/* Small Card 2 - Life Skills */}
              <div className={`relative rounded-2xl sm:rounded-3xl overflow-hidden group cursor-pointer h-32 sm:h-36 lg:h-40 transition-all duration-1000 delay-600 hover:scale-105 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
                <div className="absolute inset-0">
                  <img 
                    src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=600&fit=crop" 
                    alt="Life Skills"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                </div>
                <div className="absolute inset-0 flex items-end p-3 sm:p-4">
                  <p className="text-white font-semibold text-xs sm:text-sm lg:text-base transform transition-transform duration-300 group-hover:translate-y-[-4px] drop-shadow-lg">
                    Life Skills
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white py-12 sm:py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 sm:mb-14">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Everything you need to <span className="text-teal-500">thrive</span>
            </h2>
            <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
              Master essential life skills with our comprehensive platform designed for young adults
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {[
              {
                icon: '🎯',
                title: 'AI Life Coach',
                description: 'Get personalized guidance on career, finances, relationships, and more. Your 24/7 mentor for life decisions.',
                color: 'from-blue-400 to-cyan-400',
                bgColor: 'bg-blue-50',
              },
              {
                icon: '⚡',
                title: 'Real Simulations',
                description: 'Practice real-world scenarios in a safe environment. Make mistakes and learn without consequences.',
                color: 'from-amber-400 to-orange-400',
                bgColor: 'bg-amber-50',
              },
              {
                icon: '📚',
                title: 'Micro Courses',
                description: 'Learn essential skills through bite-sized lessons. From taxes to job interviews, we cover it all.',
                color: 'from-purple-400 to-pink-400',
                bgColor: 'bg-purple-50',
              },
              {
                icon: '�',
                title: 'Track Progress',
                description: 'Build your AdultIQ score over time. Earn badges, unlock achievements, and see your growth.',
                color: 'from-emerald-400 to-teal-400',
                bgColor: 'bg-emerald-50',
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="group relative bg-white rounded-3xl p-6 sm:p-8 hover:shadow-2xl transition-all duration-300 cursor-pointer border border-gray-100 hover:border-transparent"
              >
                <div className={`w-16 h-16 sm:w-20 sm:h-20 ${feature.bgColor} rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}>
                  <span className="text-4xl sm:text-5xl">{feature.icon}</span>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed">{feature.description}</p>
                
                {/* Hover gradient effect */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 rounded-3xl transition-opacity duration-300`}></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gray-50 py-12 sm:py-16 lg:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
            Ready to master adulting?
          </h2>
          <p className="text-sm sm:text-base lg:text-lg text-gray-600 mb-6 sm:mb-8">
            Join 10,000+ young adults building essential life skills
          </p>
          <Button
            onClick={onSignup}
            className="bg-teal-500 hover:bg-teal-600 text-white px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base rounded-full shadow-lg hover:shadow-xl transition-all"
          >
            Start Free Trial →
          </Button>
        </div>
      </div>
    </section>
  )
}
