import { Sidebar } from "@/components/Sidebar"
import { useAnalytics } from "@/hooks/useAnalytics"
import { BarChart3, Heart, FolderOpen, Tag, Clock, TrendingUp, FileText, Twitter, Youtube, Link as LinkIcon, StickyNote } from "lucide-react"

export function Analytics() {
    const { data: analytics, isLoading } = useAnalytics()

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'x': return <Twitter className="w-4 h-4 text-sky-500" />
            case 'youtube': return <Youtube className="w-4 h-4 text-red-500" />
            case 'document': return <FileText className="w-4 h-4 text-orange-500" />
            case 'note': return <StickyNote className="w-4 h-4 text-yellow-500" />
            default: return <LinkIcon className="w-4 h-4 text-gray-500" />
        }
    }

    const getTypeLabel = (type: string) => {
        switch (type) {
            case 'x': return 'Tweets'
            case 'youtube': return 'Videos'
            case 'document': return 'Documents'
            case 'note': return 'Notes'
            case 'link': return 'Links'
            default: return type
        }
    }

    if (isLoading) {
        return (
            <div className="flex h-screen bg-background">
                <Sidebar />
                <div className="flex-1 ml-64 flex items-center justify-center">
                    <div className="animate-pulse text-muted-foreground">Loading analytics...</div>
                </div>
            </div>
        )
    }

    return (
        <div className="flex h-screen bg-background text-foreground">
            <Sidebar />
            <div className="flex-1 ml-64 overflow-y-auto p-8">
                <div className="max-w-6xl mx-auto">
                    <h1 className="text-3xl font-bold mb-8 flex items-center gap-3">
                        <BarChart3 className="w-8 h-8 text-primary" />
                        Brain Analytics
                    </h1>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <StatCard
                            icon={<FileText className="w-6 h-6" />}
                            label="Total Content"
                            value={analytics?.totalContent || 0}
                            color="bg-blue-500/10 text-blue-500"
                        />
                        <StatCard
                            icon={<Heart className="w-6 h-6" />}
                            label="Favorites"
                            value={analytics?.favoritesCount || 0}
                            color="bg-red-500/10 text-red-500"
                        />
                        <StatCard
                            icon={<FolderOpen className="w-6 h-6" />}
                            label="Folders"
                            value={analytics?.foldersCount || 0}
                            color="bg-purple-500/10 text-purple-500"
                        />
                        <StatCard
                            icon={<Tag className="w-6 h-6" />}
                            label="Tagged Items"
                            value={analytics?.taggedContent || 0}
                            color="bg-green-500/10 text-green-500"
                        />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Content by Type */}
                        <div className="bg-card rounded-xl border border-border p-6">
                            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                <TrendingUp className="w-5 h-5 text-primary" />
                                Content by Type
                            </h2>
                            <div className="space-y-3">
                                {analytics?.contentByType.map((item) => (
                                    <div key={item.type} className="flex items-center gap-3">
                                        {getTypeIcon(item.type)}
                                        <span className="flex-1 text-sm">{getTypeLabel(item.type)}</span>
                                        <span className="text-sm font-medium">{item.count}</span>
                                        <div className="w-24 h-2 bg-secondary rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-primary rounded-full transition-all"
                                                style={{
                                                    width: `${(item.count / (analytics?.totalContent || 1)) * 100}%`
                                                }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Top Tags */}
                        <div className="bg-card rounded-xl border border-border p-6">
                            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                <Tag className="w-5 h-5 text-primary" />
                                Top Tags
                            </h2>
                            <div className="flex flex-wrap gap-2">
                                {analytics?.topTags.map((item, i) => (
                                    <span
                                        key={item.tag}
                                        className="px-3 py-1.5 rounded-full text-sm font-medium transition-colors"
                                        style={{
                                            backgroundColor: `hsl(${260 - i * 20}, 70%, ${95 - i * 3}%)`,
                                            color: `hsl(${260 - i * 20}, 70%, 30%)`
                                        }}
                                    >
                                        #{item.tag} <span className="text-xs opacity-70">({item.count})</span>
                                    </span>
                                ))}
                                {(!analytics?.topTags || analytics.topTags.length === 0) && (
                                    <span className="text-muted-foreground text-sm">No tags yet</span>
                                )}
                            </div>
                        </div>

                        {/* Recent Activity */}
                        <div className="bg-card rounded-xl border border-border p-6 lg:col-span-2">
                            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                <Clock className="w-5 h-5 text-primary" />
                                Recent Activity
                            </h2>
                            <div className="space-y-3">
                                {analytics?.recentActivity.map((item, i) => (
                                    <div key={i} className="flex items-center gap-3 p-3 bg-secondary/20 rounded-lg">
                                        {getTypeIcon(item.type)}
                                        <span className="flex-1 text-sm truncate">{item.title}</span>
                                        <span className="text-xs text-muted-foreground">
                                            {new Date(item.date).toLocaleDateString()}
                                        </span>
                                    </div>
                                ))}
                                {(!analytics?.recentActivity || analytics.recentActivity.length === 0) && (
                                    <span className="text-muted-foreground text-sm">No recent activity</span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

function StatCard({ icon, label, value, color }: {
    icon: React.ReactNode;
    label: string;
    value: number;
    color: string
}) {
    return (
        <div className="bg-card rounded-xl border border-border p-6">
            <div className={`w-12 h-12 rounded-lg ${color} flex items-center justify-center mb-4`}>
                {icon}
            </div>
            <div className="text-3xl font-bold mb-1">{value}</div>
            <div className="text-sm text-muted-foreground">{label}</div>
        </div>
    )
}
