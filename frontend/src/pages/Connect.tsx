import { Sidebar } from "@/components/Sidebar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Brain, Bookmark, Globe, CheckCircle2 } from "lucide-react"
import { useState, useEffect } from "react"

export function Connect() {
    const bookmarkletRef = useState<HTMLAnchorElement | null>(null);
    const bookmarkletCode = `javascript:(function(){window.open('${window.location.origin}/dashboard?addLink='+encodeURIComponent(window.location.href)+'&addTitle='+encodeURIComponent(document.title)+'&addType=link', '_blank');})()`

    useEffect(() => {
        if (bookmarkletRef[0]) {
            bookmarkletRef[0].setAttribute('href', bookmarkletCode);
        }
    }, [bookmarkletRef[0], bookmarkletCode]);

    return (
        <div className="flex h-screen bg-background text-foreground">
            <Sidebar />
            <div className="flex-1 ml-64 overflow-y-auto p-8">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-3xl font-bold mb-8 flex items-center gap-3">
                        <Globe className="w-8 h-8 text-cyan-500" />
                        Connect & Extensions
                        <span className="text-lg font-normal text-muted-foreground ml-2">Save from anywhere</span>
                    </h1>

                    <div className="grid gap-8">
                        {/* Bookmarklet Section */}
                        <Card className="border-cyan-500/20 bg-cyan-500/5">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Bookmark className="w-5 h-5 text-cyan-500" />
                                    Quick Save Bookmarklet
                                </CardTitle>
                                <CardDescription>
                                    The easiest way to save content without installing an extension. Works on all browsers.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="bg-background/80 p-6 rounded-xl border border-border flex flex-col items-center justify-center text-center gap-4">
                                    <p className="font-medium">
                                        Drag this button to your bookmarks bar:
                                    </p>
                                    <a
                                        ref={(el) => bookmarkletRef[1](el)}
                                        className="flex items-center gap-2 px-6 py-3 bg-cyan-500 hover:bg-cyan-600 text-white font-bold rounded-full shadow-lg hover:shadow-cyan-500/25 transition-all cursor-move"
                                        onClick={(e) => e.preventDefault()}
                                        title="Drag me to bookmarks bar"
                                    >
                                        <Brain className="w-4 h-4" />
                                        Save to Brainly
                                    </a>
                                    <p className="text-xs text-muted-foreground">
                                        Don't click it! Drag it to your browser's favorites/bookmarks bar.
                                    </p>
                                </div>

                                <div className="space-y-4">
                                    <h3 className="font-semibold flex items-center gap-2">
                                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                                        How to use
                                    </h3>
                                    <ol className="list-decimal list-inside space-y-2 text-muted-foreground text-sm ml-2">
                                        <li>Navigate to any website you want to save (e.g. YouTube, Twitter/X, TechCrunch)</li>
                                        <li>Click the <strong>Save to Brainly</strong> bookmark in your toolbar</li>
                                        <li>The Brainly dashboard will open with the link and title pre-filled</li>
                                        <li>Add tags and click Save!</li>
                                    </ol>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Future Chrome Extension Teaser */}
                        <Card className="opacity-75 relative overflow-hidden">
                            <div className="absolute top-3 right-3 bg-yellow-500/20 text-yellow-600 dark:text-yellow-400 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                                Most Popular
                            </div>
                            <CardHeader>
                                <div className="flex justify-between items-start">
                                    <div>
                                        <CardTitle className="flex items-center gap-2">
                                            <img src="https://upload.wikimedia.org/wikipedia/commons/e/e1/Google_Chrome_icon_%28February_2022%29.svg" className="w-5 h-5" alt="Chrome" />
                                            Chrome Extension
                                        </CardTitle>
                                        <CardDescription>
                                            Native browser integration with context menu and sidebar support.
                                        </CardDescription>
                                    </div>
                                    <Button disabled variant="outline">Coming Soon</Button>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-3 gap-4 text-center">
                                    <div className="p-4 bg-muted/50 rounded-lg">
                                        <div className="text-2xl font-bold mb-1">Right-click</div>
                                        <div className="text-xs text-muted-foreground">Context Menu Save</div>
                                    </div>
                                    <div className="p-4 bg-muted/50 rounded-lg">
                                        <div className="text-2xl font-bold mb-1">Auto-Import</div>
                                        <div className="text-xs text-muted-foreground">Sync Bookmarks</div>
                                    </div>
                                    <div className="p-4 bg-muted/50 rounded-lg">
                                        <div className="text-2xl font-bold mb-1">Side Panel</div>
                                        <div className="text-xs text-muted-foreground">View Notes while Browsing</div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
}
