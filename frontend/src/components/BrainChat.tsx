import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { BrainCircuit, Send, Loader2, Bot, User } from "lucide-react"
import axios from "axios"
import { BACKEND_URL } from "@/config"

interface Message {
    role: "user" | "ai"
    content: string
}

export function BrainChat() {
    const [messages, setMessages] = useState<Message[]>([
        { role: "ai", content: "Hi! I'm your Second Brain AI. Ask me anything about your saved content." }
    ])
    const [input, setInput] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const scrollRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight
        }
    }, [messages])

    const handleSend = async () => {
        if (!input.trim()) return

        const userMessage: Message = { role: "user", content: input }
        setMessages(prev => [...prev, userMessage])
        setInput("")
        setIsLoading(true)

        try {
            const response = await axios.post(BACKEND_URL + "/api/v1/brain/chat", {
                query: input
            }, {
                headers: {
                    "Authorization": localStorage.getItem("token")
                }
            })

            const aiMessage: Message = { role: "ai", content: response.data.answer }
            setMessages(prev => [...prev, aiMessage])
        } catch (e) {
            setMessages(prev => [...prev, { role: "ai", content: "Sorry, I encountered an error accessing your brain." }])
        } finally {
            setIsLoading(false)
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            handleSend()
        }
    }

    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="outline" className="gap-2 border-purple-500/20 text-purple-600 hover:bg-purple-100 dark:text-purple-400 dark:hover:bg-purple-900/20">
                    <BrainCircuit className="w-4 h-4" />
                    Ask AI
                </Button>
            </SheetTrigger>
            <SheetContent className="w-[400px] sm:w-[540px] flex flex-col p-0">
                <SheetHeader className="p-6 border-b">
                    <SheetTitle className="flex items-center gap-2">
                        <BrainCircuit className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                        Talk to your Brain
                    </SheetTitle>
                    <SheetDescription>
                        Ask questions about your notes, documents, and links.
                    </SheetDescription>
                </SheetHeader>

                <div className="flex-1 overflow-y-auto p-4 space-y-4" ref={scrollRef}>
                    {messages.map((m, i) => (
                        <div key={i} className={`flex gap-3 ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                            {m.role === "ai" && (
                                <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center shrink-0">
                                    <Bot className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                                </div>
                            )}
                            <div className={`p-3 rounded-lg max-w-[80%] text-sm ${m.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
                                {m.content}
                            </div>
                            {m.role === "user" && (
                                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shrink-0">
                                    <User className="w-4 h-4 text-primary-foreground" />
                                </div>
                            )}
                        </div>
                    ))}
                    {isLoading && (
                        <div className="flex gap-3 justify-start">
                            <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center shrink-0">
                                <Bot className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                            </div>
                            <div className="p-3 bg-muted rounded-lg flex items-center">
                                <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                            </div>
                        </div>
                    )}
                </div>

                <div className="p-4 border-t bg-background">
                    <div className="flex gap-2">
                        <Input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Ask a question..."
                            className="bg-secondary/50"
                            disabled={isLoading}
                        />
                        <Button onClick={handleSend} disabled={isLoading || !input.trim()}>
                            <Send className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    )
}
