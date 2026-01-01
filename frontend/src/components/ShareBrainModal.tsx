import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Copy, Share2 } from "lucide-react"
import { useState } from "react"
import axios from "axios"
import { BACKEND_URL } from "@/config"
import { toast } from "sonner"

interface ShareBrainModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function ShareBrainModal({ open, onOpenChange }: ShareBrainModalProps) {
    const [shareUrl, setShareUrl] = useState("");
    const [loading, setLoading] = useState(false);

    const handleShare = async () => {
        setLoading(true);
        try {
            const response = await axios.post(BACKEND_URL + "/api/v1/brain/share", {
                share: true
            }, {
                headers: {
                    "Authorization": localStorage.getItem("token")
                }
            });
            const hash = response.data.hash;
            setShareUrl(`http://localhost:5173/share/${hash}`);
            toast.success("Share link generated!");
        } catch (e) {
            toast.error("Error generating share link");
        }
        setLoading(false);
    }

    const handleCopy = () => {
        navigator.clipboard.writeText(shareUrl)
        toast.success("Link copied to clipboard!")
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md bg-card border-border">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Share2 className="w-5 h-5 text-primary" />
                        Share Your Second Brain
                    </DialogTitle>
                    <DialogDescription>
                        Share your entire collection of notes, documents, tweets, and videos with others.
                    </DialogDescription>
                </DialogHeader>

                {!shareUrl && (
                    <div className="flex justify-center py-4">
                        <Button onClick={handleShare} disabled={loading} className="w-full">
                            {loading ? "Generating..." : "Generate Share Link"}
                        </Button>
                    </div>
                )}

                {shareUrl && (
                    <div className="flex items-center space-x-2">
                        <div className="grid flex-1 gap-2">
                            <Label htmlFor="link" className="sr-only">
                                Link
                            </Label>
                            <Input
                                id="link"
                                defaultValue={shareUrl}
                                readOnly
                                className="bg-secondary/50 border-input"
                            />
                        </div>
                        <Button type="submit" size="sm" onClick={handleCopy} className="px-3">
                            <span className="sr-only">Copy</span>
                            <Copy className="h-4 w-4" />
                            Copy
                        </Button>
                    </div>
                )}

                <DialogFooter className="sm:justify-start">
                    <div className="text-xs text-muted-foreground">
                        Anyone with the link can view your brain.
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
