import { Button } from "@/components/ui/button"
import { Brain, Share2, Zap, Shield, ChevronRight, Check, BookmarkPlus, Search, Sparkles,  Clock, Tag, FileText, Video, Twitter, Bookmark } from "lucide-react"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"

export function Home() {
    const navigate = useNavigate()
    const [floatingItems, setFloatingItems] = useState<{ icon: any; color: string; delay: number; x: number; y: number; duration: number }[]>([])

    useEffect(() => {
        const items = [
            { icon: Bookmark, color: 'text-blue-400', delay: 0, x: 10, y: 20, duration: 20 },
            { icon: Twitter, color: 'text-sky-400', delay: 2, x: 80, y: 30, duration: 18 },
            { icon: Video, color: 'text-red-400', delay: 4, x: 20, y: 70, duration: 22 },
            { icon: FileText, color: 'text-green-400', delay: 1, x: 90, y: 60, duration: 19 },
            { icon: Brain, color: 'text-purple-400', delay: 3, x: 50, y: 50, duration: 25 },
            { icon: BookmarkPlus, color: 'text-indigo-400', delay: 5, x: 70, y: 80, duration: 21 },
            { icon: FileText, color: 'text-emerald-400', delay: 2.5, x: 30, y: 40, duration: 23 },
            { icon: Video, color: 'text-orange-400', delay: 4.5, x: 60, y: 15, duration: 20 },
        ]
        setFloatingItems(items)
    }, [])

    return (
        <div className="min-h-screen bg-gradient-to-b from-white via-indigo-50/30 to-white overflow-hidden">
            {/* Animated floating icons background */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                {floatingItems.map((item, i) => (
                    <div
                        key={i}
                        className={`absolute ${item.color} opacity-30`}
                        style={{
                            left: `${item.x}%`,
                            top: `${item.y}%`,
                            animation: `float ${item.duration}s ease-in-out infinite`,
                            animationDelay: `${item.delay}s`
                        }}
                    >
                        <item.icon className="w-12 h-12" />
                    </div>
                ))}
            </div>

            {/* Subtle background pattern */}
            <div className="fixed inset-0 opacity-70 pointer-events-none" style={{
                backgroundImage: `radial-gradient(circle at 2px 2px, rgb(209 213 219) 1px, transparent 0)`,
                backgroundSize: '40px 40px'
            }}></div>

            <style>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px) translateX(0px) rotate(0deg);
          }
          25% {
            transform: translateY(-20px) translateX(10px) rotate(5deg);
          }
          50% {
            transform: translateY(-40px) translateX(-10px) rotate(-5deg);
          }
          75% {
            transform: translateY(-20px) translateX(10px) rotate(3deg);
          }
        }
      `}</style>

            {/* Navigation */}
            <nav className="relative border-b border-gray-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
                <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="p-2 rounded-lg bg-indigo-600">
                            <Brain className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-xl font-semibold text-gray-900">
                            Brainly
                        </span>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button variant="ghost" className="text-gray-700 hover:text-gray-900 hover:bg-gray-100" onClick={() => navigate('/signin')}>
                            Sign In
                        </Button>
                        <Button className="bg-indigo-600 hover:bg-indigo-700 text-white" onClick={() => navigate('/signup')}>
                            Get Started
                        </Button>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <div className="relative max-w-6xl mx-auto px-6 pt-16 pb-20">
                <div className="text-center max-w-3xl mx-auto space-y-8">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 border border-indigo-200">
                        <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                        <span className="text-sm font-medium text-indigo-700">
                            V2.0 is now live
                        </span>
                    </div>

                    {/* Main Heading */}
                    <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight">
                        Your Second Brain for<br />
                        <span className="text-indigo-600">Digital Chaos</span>
                    </h1>

                    {/* Subheading */}
                    <p className="text-xl text-gray-600 leading-relaxed">
                        Aggregate tweets, videos, and articles in one intelligent space. Brainly uses AI to organize your digital life so you never lose a great idea again.
                    </p>

                    {/* CTA Buttons */}
                    <div className="flex items-center justify-center gap-4 pt-2">
                        <Button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-5 text-base shadow-lg shadow-indigo-600/20 hover:shadow-xl hover:shadow-indigo-600/30 transition-all" onClick={() => navigate('/signup')}>
                            Start for Free
                            <ChevronRight className="w-4 h-4 ml-1" />
                        </Button>
                        <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50 px-6 py-5 text-base" onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}>
                            See how it works
                        </Button>
                    </div>

                    {/* Social Proof */}
                    <div className="flex items-center justify-center gap-6 pt-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                            <Check className="w-4 h-4 text-green-600" />
                            <span>No credit card required</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <Check className="w-4 h-4 text-green-600" />
                            <span>Free forever plan</span>
                        </div>
                    </div>

                    {/* Hero Image */}
                    <div className="mt-12 rounded-2xl border border-gray-200 bg-white p-4 shadow-2xl">
                        <div className="aspect-video rounded-xl bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 border border-gray-200 flex items-center justify-center overflow-hidden relative">
                            {/* Mock UI elements */}
                            <div className="absolute inset-0 p-8">
                                <div className="h-full w-full bg-white rounded-lg shadow-sm p-6 flex flex-col gap-4">
                                    <div className="flex gap-3">
                                        <div className="flex-1 h-10 bg-gray-100 rounded-lg"></div>
                                        <div className="w-32 h-10 bg-indigo-100 rounded-lg"></div>
                                    </div>
                                    <div className="grid grid-cols-3 gap-4 flex-1">
                                        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg"></div>
                                        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg"></div>
                                        <div className="bg-gradient-to-br from-pink-50 to-pink-100 rounded-lg"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Section */}
            <div className="relative max-w-6xl mx-auto px-6 py-16">
                <div className="grid md:grid-cols-3 gap-8 text-center">
                    {[
                        { number: "50K+", label: "Active Users" },
                        { number: "2M+", label: "Items Saved" },
                        { number: "99.9%", label: "Uptime" }
                    ].map((stat, i) => (
                        <div key={i} className="space-y-1">
                            <div className="text-4xl font-bold text-indigo-600">{stat.number}</div>
                            <div className="text-sm text-gray-600">{stat.label}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Features Grid */}
            <div id="features" className="relative bg-white py-20">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 mb-3">
                            Everything you need to stay organized
                        </h2>
                        <p className="text-lg text-gray-600">
                            Powerful features that work together seamlessly
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 mb-16">
                        {[
                            {
                                icon: Zap,
                                title: "AI-Powered Organization",
                                desc: "Automatically tag and categorize content using advanced LLMs. Smart search finds what you need instantly.",
                                color: "indigo"
                            },
                            {
                                icon: Share2,
                                title: "Shareable Collections",
                                desc: "Share your entire knowledge base or specific collections with a single public link. Collaborate effortlessly.",
                                color: "blue"
                            },
                            {
                                icon: Shield,
                                title: "Private & Secure",
                                desc: "Your data is yours. End-to-end encrypted and safe in your personal vault. GDPR compliant.",
                                color: "green"
                            }
                        ].map((feature, i) => (
                            <div
                                key={i}
                                className="bg-white rounded-xl border border-gray-200 p-8 hover:shadow-lg hover:border-gray-300 transition-all duration-200"
                            >
                                <div className={`inline-flex p-3 rounded-lg mb-4 ${feature.color === 'indigo' ? 'bg-indigo-100' :
                                    feature.color === 'blue' ? 'bg-blue-100' :
                                        'bg-green-100'
                                    }`}>
                                    <feature.icon className={`w-6 h-6 ${feature.color === 'indigo' ? 'text-indigo-600' :
                                        feature.color === 'blue' ? 'text-blue-600' :
                                            'text-green-600'
                                        }`} />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                    {feature.title}
                                </h3>
                                <p className="text-gray-600 leading-relaxed">
                                    {feature.desc}
                                </p>
                            </div>
                        ))}
                    </div>

                    {/* Additional Features */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            { icon: BookmarkPlus, title: "Quick Save", desc: "Save from anywhere with browser extension" },
                            { icon: Search, title: "Smart Search", desc: "Find anything with AI-powered search" },
                            { icon: Tag, title: "Auto-Tagging", desc: "Intelligent categorization" },
                            { icon: Clock, title: "Reading List", desc: "Save for later with reminders" }
                        ].map((item, i) => (
                            <div key={i} className="flex gap-3 p-4 rounded-lg hover:bg-gray-50 transition-colors">
                                <div className="flex-shrink-0">
                                    <div className="p-2 rounded-lg bg-gray-100">
                                        <item.icon className="w-5 h-5 text-gray-700" />
                                    </div>
                                </div>
                                <div>
                                    <h4 className="font-medium text-gray-900 mb-1">{item.title}</h4>
                                    <p className="text-sm text-gray-600">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <div className="relative py-20">
                <div className="max-w-4xl mx-auto px-6 text-center">
                    <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl p-12 shadow-2xl">
                        <h2 className="text-3xl font-bold text-white mb-4">
                            Ready to organize your digital life?
                        </h2>
                        <p className="text-indigo-100 text-lg mb-8">
                            Join thousands of users who've already transformed how they save and organize content.
                        </p>
                        <div className="flex items-center justify-center gap-4">
                            <Button className="bg-white text-indigo-600 hover:bg-gray-50 px-8 py-5 text-base shadow-lg" onClick={() => navigate('/signup')}>
                                Get Started Free
                                <ChevronRight className="w-4 h-4 ml-1" />
                            </Button>
                            <Button variant="outline" className="border-white/30 text-white hover:bg-white/10 px-8 py-5 text-base" onClick={() => window.location.href = 'mailto:sales@brainly.com'}>
                                Contact Sales
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}