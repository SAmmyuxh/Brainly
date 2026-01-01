import { Sidebar } from "@/components/Sidebar"
import { MobileSidebar } from "@/components/MobileSidebar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BACKEND_URL } from "@/config"
import axios from "axios"
import { Hash, Loader2 } from "lucide-react"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"

export function TagsPage() {
    const [tags, setTags] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTags = async () => {
            try {
                const response = await axios.get(`${BACKEND_URL}/api/v1/tags`, {
                    headers: {
                        "Authorization": localStorage.getItem("token")
                    }
                });
                setTags(response.data.tags);
            } catch (error) {
                toast.error("Failed to fetch tags");
            } finally {
                setIsLoading(false);
            }
        };
        fetchTags();
    }, []);

    return (
        <div className="flex h-screen bg-background text-foreground font-sans overflow-hidden">
            <Sidebar />
            <div className="flex-1 flex flex-col md:ml-64 ml-0 transition-all duration-300">
                <header className="h-16 border-b border-border flex items-center px-4 md:px-6 bg-background/50 backdrop-blur-md sticky top-0 z-10 gap-2">
                    <MobileSidebar />
                    <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                        <Hash className="w-6 h-6 text-violet-500" />
                        Tags
                    </h2>
                </header>

                <main className="flex-1 overflow-y-auto p-8 bg-secondary/5">
                    <div className="max-w-7xl mx-auto">
                        <Card className="bg-card/50 backdrop-blur-sm border-border">
                            <CardHeader>
                                <CardTitle>Explore your Tags</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {isLoading ? (
                                    <div className="flex justify-center p-8">
                                        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
                                    </div>
                                ) : tags.length === 0 ? (
                                    <div className="text-center text-muted-foreground p-8">
                                        No tags found. Add tags to your content to see them here!
                                    </div>
                                ) : (
                                    <div className="flex flex-wrap gap-3">
                                        {tags.map((tag) => (
                                            <Badge
                                                key={tag}
                                                variant="secondary"
                                                className="text-lg px-4 py-2 cursor-pointer hover:bg-primary/20 hover:text-primary transition-colors bg-secondary/50 border border-border"
                                                onClick={() => navigate(`/dashboard?search=${tag}`)}
                                            >
                                                #{tag}
                                            </Badge>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </main>
            </div>
        </div>
    )
}
