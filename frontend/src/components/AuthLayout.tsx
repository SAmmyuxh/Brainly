import { useState, useEffect } from "react"
import { Brain, Twitter, Video, FileText, Bookmark, BookmarkPlus } from "lucide-react"

export function AuthLayout({ children }: { children: React.ReactNode }) {
    const [floatingItems, setFloatingItems] = useState<{ icon: any; color: string; delay: number; x: number; y: number; duration: number }[]>([]);

    useEffect(() => {
        const items = [
            { icon: Bookmark, color: 'text-blue-400', delay: 0, x: 10, y: 20, duration: 20 },
            { icon: Twitter, color: 'text-sky-400', delay: 2, x: 80, y: 30, duration: 18 },
            { icon: Video, color: 'text-red-400', delay: 4, x: 20, y: 70, duration: 22 },
            { icon: FileText, color: 'text-green-400', delay: 1, x: 90, y: 60, duration: 19 },
            { icon: Brain, color: 'text-purple-400', delay: 3, x: 50, y: 50, duration: 25 },
            { icon: BookmarkPlus, color: 'text-indigo-400', delay: 5, x: 70, y: 80, duration: 21 },
        ];
        setFloatingItems(items);
    }, []);

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-b from-white via-indigo-50/30 to-white overflow-hidden">
            {/* Animated floating icons background */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                {floatingItems.map((item, i) => (
                    <div
                        key={i}
                        className={`absolute ${item.color} opacity-20`}
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
            <div className="fixed inset-0 opacity-40 pointer-events-none" style={{
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

            {children}
        </div>
    );
}
