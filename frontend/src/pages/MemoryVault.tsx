import { Sidebar } from "@/components/Sidebar"
import { MobileSidebar } from "@/components/MobileSidebar"
import { useReviews } from "@/hooks/useReviews"
import { Brain, BookOpen, Check, X, RotateCcw, Trophy, Clock, Target, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"

export function MemoryVault() {
    const { dueReviews, stats, isLoading, submitReview } = useReviews()
    const [currentIndex, setCurrentIndex] = useState(0)
    const [showAnswer, setShowAnswer] = useState(false)

    const currentCard = dueReviews[currentIndex]

    const handleReview = (quality: number) => {
        if (!currentCard) return;

        submitReview.mutate(
            { reviewId: currentCard._id, quality },
            {
                onSuccess: () => {
                    setShowAnswer(false);
                    if (currentIndex < dueReviews.length - 1) {
                        setCurrentIndex(prev => prev + 1);
                    } else {
                        setCurrentIndex(0);
                    }
                }
            }
        );
    };

    if (isLoading) {
        return (
            <div className="flex h-screen bg-background">
                <Sidebar />
                <div className="flex-1 md:ml-64 ml-0 flex items-center justify-center">
                    <div className="animate-pulse text-muted-foreground">Loading Memory Vault...</div>
                </div>
            </div>
        )
    }

    return (
        <div className="flex h-screen bg-background text-foreground overflow-hidden">
            <Sidebar />
            <div className="flex-1 flex flex-col md:ml-64 ml-0 transition-all duration-300">
                <header className="border-b border-border flex items-center px-4 md:px-6 py-4 bg-background/50 backdrop-blur-md sticky top-0 z-10 gap-2">
                    <MobileSidebar />
                    <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2 md:gap-3 flex-wrap">
                        <Brain className="w-6 h-6 md:w-8 md:h-8 text-purple-500" />
                        Memory Vault
                        <span className="text-base md:text-lg font-normal text-muted-foreground">Spaced Repetition</span>
                    </h1>
                </header>
                <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-secondary/5">
                    <div className="max-w-4xl mx-auto">

                        {/* Stats Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                            <StatCard
                                icon={<Clock className="w-5 h-5" />}
                                label="Due Today"
                                value={stats?.dueToday || 0}
                                color="bg-blue-500/10 text-blue-500"
                            />
                            <StatCard
                                icon={<BookOpen className="w-5 h-5" />}
                                label="Total Reviews"
                                value={stats?.totalReviews || 0}
                                color="bg-purple-500/10 text-purple-500"
                            />
                            <StatCard
                                icon={<Target className="w-5 h-5" />}
                                label="Accuracy"
                                value={`${stats?.accuracy || 0}%`}
                                color="bg-green-500/10 text-green-500"
                            />
                            <StatCard
                                icon={<Trophy className="w-5 h-5" />}
                                label="Mastered"
                                value={stats?.byStatus?.mastered || 0}
                                color="bg-yellow-500/10 text-yellow-500"
                            />
                        </div>

                        {/* Status Summary */}
                        <div className="flex gap-4 mb-8 text-sm">
                            <span className="px-3 py-1 bg-blue-500/10 text-blue-500 rounded-full">
                                🆕 New: {stats?.byStatus?.new || 0}
                            </span>
                            <span className="px-3 py-1 bg-orange-500/10 text-orange-500 rounded-full">
                                📚 Learning: {stats?.byStatus?.learning || 0}
                            </span>
                            <span className="px-3 py-1 bg-purple-500/10 text-purple-500 rounded-full">
                                🔄 Reviewing: {stats?.byStatus?.reviewing || 0}
                            </span>
                            <span className="px-3 py-1 bg-green-500/10 text-green-500 rounded-full">
                                ✅ Mastered: {stats?.byStatus?.mastered || 0}
                            </span>
                        </div>

                        {/* Review Card */}
                        {dueReviews.length > 0 && currentCard ? (
                            <div className="bg-card rounded-2xl border border-border p-8 shadow-xl">
                                <div className="flex justify-between items-center mb-4">
                                    <span className="text-sm text-muted-foreground">
                                        Card {currentIndex + 1} of {dueReviews.length}
                                    </span>
                                    <span className={`px-2 py-1 rounded text-xs ${currentCard.status === 'mastered' ? 'bg-green-500/20 text-green-500' :
                                        currentCard.status === 'reviewing' ? 'bg-purple-500/20 text-purple-500' :
                                            currentCard.status === 'learning' ? 'bg-orange-500/20 text-orange-500' :
                                                'bg-blue-500/20 text-blue-500'
                                        }`}>
                                        {currentCard.status}
                                    </span>
                                </div>

                                {/* Question Side */}
                                <div className="min-h-[200px] flex flex-col justify-center items-center text-center">
                                    <h2 className="text-2xl font-bold mb-4">{currentCard.contentId.title}</h2>
                                    {currentCard.contentId.tags && currentCard.contentId.tags.length > 0 && (
                                        <div className="flex gap-2 flex-wrap justify-center">
                                            {currentCard.contentId.tags.map((tag, i) => (
                                                <span key={i} className="px-2 py-1 bg-secondary text-xs rounded">#{tag}</span>
                                            ))}
                                        </div>
                                    )}

                                    {!showAnswer && (
                                        <Button
                                            onClick={() => setShowAnswer(true)}
                                            className="mt-6"
                                            variant="outline"
                                        >
                                            <Zap className="w-4 h-4 mr-2" />
                                            Show Answer
                                        </Button>
                                    )}
                                </div>

                                {/* Answer Side */}
                                {showAnswer && (
                                    <div className="border-t border-border pt-6 mt-6">
                                        <p className="text-muted-foreground mb-4">
                                            {currentCard.contentId.description || currentCard.contentId.content || "No description available"}
                                        </p>
                                        {currentCard.contentId.link && (
                                            <a
                                                href={currentCard.contentId.link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-primary hover:underline text-sm"
                                            >
                                                Open Link →
                                            </a>
                                        )}

                                        {/* Rating Buttons */}
                                        <div className="flex flex-col sm:flex-row gap-3 mt-8 justify-center">
                                            <Button
                                                variant="outline"
                                                className="flex-1 border-red-500/50 text-red-500 hover:bg-red-500/10 min-w-[120px]"
                                                onClick={() => handleReview(1)}
                                                disabled={submitReview.isPending}
                                            >
                                                <X className="w-4 h-4 mr-2" />
                                                Again
                                            </Button>
                                            <Button
                                                variant="outline"
                                                className="flex-1 border-orange-500/50 text-orange-500 hover:bg-orange-500/10 min-w-[120px]"
                                                onClick={() => handleReview(3)}
                                                disabled={submitReview.isPending}
                                            >
                                                <RotateCcw className="w-4 h-4 mr-2" />
                                                Hard
                                            </Button>
                                            <Button
                                                variant="outline"
                                                className="flex-1 border-blue-500/50 text-blue-500 hover:bg-blue-500/10 min-w-[120px]"
                                                onClick={() => handleReview(4)}
                                                disabled={submitReview.isPending}
                                            >
                                                <Check className="w-4 h-4 mr-2" />
                                                Good
                                            </Button>
                                            <Button
                                                variant="outline"
                                                className="flex-1 border-green-500/50 text-green-500 hover:bg-green-500/10 min-w-[120px]"
                                                onClick={() => handleReview(5)}
                                                disabled={submitReview.isPending}
                                            >
                                                <Trophy className="w-4 h-4 mr-2" />
                                                Easy
                                            </Button>
                                        </div>
                                        <p className="text-xs text-muted-foreground text-center mt-4">
                                            Rate how well you remembered this item
                                        </p>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="text-center py-20 bg-card rounded-2xl border border-border">
                                <Trophy className="w-16 h-16 text-green-500 mx-auto mb-4" />
                                <h3 className="text-xl font-semibold mb-2">All caught up!</h3>
                                <p className="text-muted-foreground">
                                    No cards due for review. Add content to your Memory Vault to start learning!
                                </p>
                                <p className="text-sm text-muted-foreground mt-2">
                                    Hover over any content card and click the 🧠 brain icon to add it.
                                </p>
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    )
}

function StatCard({ icon, label, value, color }: {
    icon: React.ReactNode;
    label: string;
    value: number | string;
    color: string
}) {
    return (
        <div className="bg-card rounded-xl border border-border p-4">
            <div className={`w-10 h-10 rounded-lg ${color} flex items-center justify-center mb-3`}>
                {icon}
            </div>
            <div className="text-2xl font-bold">{value}</div>
            <div className="text-xs text-muted-foreground">{label}</div>
        </div>
    )
}
