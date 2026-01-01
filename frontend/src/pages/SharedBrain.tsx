import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import axios from "axios"
import { BACKEND_URL } from "@/config"
import { ContentCard } from "@/components/ContentCard"
import { Brain, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ModeToggle } from "@/components/mode-toggle"

export function SharedBrain() {
    const { hash } = useParams()
    const [contents, setContents] = useState<any[]>([])
    // @ts-ignore
    const [username, setUsername] = useState("")
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)
    const [search, setSearch] = useState("")

    useEffect(() => {
        const fetchContent = async () => {
            try {
                const response = await axios.get(`${BACKEND_URL}/api/v1/brain/${hash}`)
                setContents(response.data.content || [])
                setUsername(response.data.user || "User")
                setLoading(false)
            } catch (e) {
                setError(true)
                setLoading(false)
            }
        }

        if (hash) fetchContent()
    }, [hash])

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-background">
                <Loader2 className="w-10 h-10 animate-spin text-primary" />
                <span className="ml-3 text-lg font-medium">Loading Brain...</span>
            </div>
        )
    }

    if (error) {
        return (
            <div className="flex flex-col h-screen items-center justify-center bg-background gap-4">
                <Brain className="w-20 h-20 text-muted-foreground" />
                <h1 className="text-2xl font-bold">Brain Not Found</h1>
                <p className="text-muted-foreground">This link may be invalid or the user has stopped sharing.</p>
            </div>
        )
    }

    const filteredContents = contents.filter((content: any) =>
        content.title.toLowerCase().includes(search.toLowerCase()) ||
        content.tags?.some((tag: string) => tag.toLowerCase().includes(search.toLowerCase()))
    );

    return (
        <div className="min-h-screen bg-background text-foreground font-sans flex flex-col">
            {/* Header */}
            <header className="h-16 border-b border-border flex items-center justify-between px-6 bg-background/50 backdrop-blur-md sticky top-0 z-10 w-full">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/20 rounded-lg">
                        <Brain className="w-6 h-6 text-primary" />
                    </div>
                    <h1 className="text-xl font-bold tracking-tight">{username}'s Second Brain</h1>
                </div>

                <div className="flex-1 max-w-xl mx-8 hidden md:block">
                    <Input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search this brain..."
                        className="bg-secondary/50 border-input focus:border-primary"
                    />
                </div>

                <div className="flex items-center gap-4">
                    <ModeToggle />
                    <Button variant="outline" onClick={() => window.location.href = '/signup'}>
                        Build Your Own Brain
                    </Button>
                </div>
            </header>

            {/* Content */}
            <main className="flex-1 p-8 bg-secondary/5">
                <div className="w-full max-w-7xl mx-auto">
                    {filteredContents.length === 0 ? (
                        <div className="text-center py-20 text-muted-foreground">
                            No content found matching your search.
                        </div>
                    ) : (
                        <div className="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
                            {filteredContents.map((content: any, i: number) => (
                                <div key={content._id || i} className="break-inside-avoid mb-6">
                                    <ContentCard
                                        id={content._id}
                                        title={content.title}
                                        link={content.link}
                                        type={content.type}
                                        tags={content.tags || []}
                                        date={new Date(content.createdAt || Date.now()).toLocaleDateString()}
                                        description={content.description}
                                        content={content.content}
                                    // Read-only: no handlers
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </div>
    )
}
