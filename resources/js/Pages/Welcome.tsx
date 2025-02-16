import React from 'react'
import { Link, Head } from '@inertiajs/react'
import {
  Calendar,
  Clock,
  CheckCircle,
  ChevronRight,
  UserPlus,
  ArrowRight,
  Star,
  Users,
} from 'lucide-react'
import { ModeToggle } from '@/components/mode-toggle'
import { PageProps } from '@/types'
import { useIsMobile } from '@/hooks/use-mobile'

function LandingPage({ auth }: PageProps) {
  const isMobile = useIsMobile()
  return (
    <>
      <Head>
        <title>Timetable Generator - Organize Your Time Effectively</title>
        <meta
          name="description"
          content="Timetable Generator is the perfect tool to help you create and manage timetables effortlessly. Maximize your productivity and streamline your schedule today!"
        />
      </Head>

      <div className="min-h-screen bg-background">
        {/* Navbar */}
        <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-sm border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <span className="text-2xl font-bold text-primary">TimeTable</span>
              </div>
              <div className="flex items-center gap-4">
                {!isMobile && <ModeToggle variant="outline" size="default" />}
                {auth.user ? (
                  <Link
                    href={route('dashboard')}
                    className="px-3 md:px-4 py-3 md:py-2 rounded-full bg-primary text-primary-foreground hover:opacity-90 transition"
                  >
                    Dashboard
                  </Link>
                ) : (
                  <div className="flex gap-3">
                    <Link
                      href={route('login')}
                      className="px-3 md:px-4 py-3 md:py-2 text-foreground hover:text-primary transition"
                    >
                      Login
                    </Link>
                    <Link
                      href={route('register')}
                      className="px-3 md:px-4 py-3 md:py-2 rounded-full bg-primary text-primary-foreground hover:opacity-90 transition"
                    >
                      Get Started
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="pt-32 pb-16 px-4">
          <div className="max-w-6xl mx-auto text-center">
            <div className="inline-block mb-4 px-4 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
              ✨ Your Time, Optimized
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
              Transform Your Schedule with Faheem's 
              <span className="text-primary"> Smart Planning</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Create intelligent timetables that adapt to your needs. Stay organized, boost
              productivity, and make the most of every day.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href={route('register')}
                className="px-8 py-4 bg-primary text-primary-foreground rounded-full text-lg font-semibold hover:opacity-90 transition flex items-center justify-center gap-2"
              >
                Start Free <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="#features"
                className="px-8 py-4 bg-secondary text-secondary-foreground rounded-full text-lg font-semibold hover:bg-secondary/80 transition"
              >
                See Features
              </Link>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-muted/50">
          <div className="max-w-6xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-primary mb-2">10k+</div>
              <div className="text-muted-foreground">Active Users</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2">98%</div>
              <div className="text-muted-foreground">Satisfaction Rate</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2">24/7</div>
              <div className="text-muted-foreground">Support</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2">50+</div>
              <div className="text-muted-foreground">Features</div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-24 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-foreground mb-4">
                Everything You Need for Perfect Scheduling
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Powerful features designed to make time management effortless
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="p-6 rounded-2xl bg-card border border-border hover:border-primary transition-colors">
                <Calendar className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">Smart Scheduling</h3>
                <p className="text-muted-foreground">
                  AI-powered scheduling that learns from your preferences and optimizes your daily
                  routine automatically.
                </p>
              </div>
              <div className="p-6 rounded-2xl bg-card border border-border hover:border-primary transition-colors">
                <Users className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">Team Collaboration</h3>
                <p className="text-muted-foreground">
                  Share schedules, coordinate meetings, and sync with your team seamlessly.
                </p>
              </div>
              <div className="p-6 rounded-2xl bg-card border border-border hover:border-primary transition-colors">
                <Star className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">Custom Templates</h3>
                <p className="text-muted-foreground">
                  Create and save your favorite schedule templates for quick access and reuse.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 px-4 bg-muted/50">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-foreground mb-6">
              Ready to Transform Your Time Management?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Join thousands of productive professionals who have already optimized their schedules
              with our platform.
            </p>
            <Link
              href={route('register')}
              className="px-8 py-4 bg-primary text-primary-foreground rounded-full text-lg font-semibold hover:opacity-90 transition inline-flex items-center gap-2"
            >
              Get Started Free <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-8 border-t border-border">
          <div className="max-w-6xl mx-auto px-4 text-center text-muted-foreground">
            <p>© 2024 Timetable Generator. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </>
  )
}

export default LandingPage
