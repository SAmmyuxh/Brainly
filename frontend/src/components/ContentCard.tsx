import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Trash2, ExternalLink, Twitter, Youtube, FileText, Link as LinkIcon, Pencil, StickyNote, Star, FolderOpen, X, Brain, Activity } from "lucide-react"
import { useState } from "react"
import { Tweet } from "react-tweet"

interface Folder {
    _id: string
    name: string
    color: string
}

interface ContentCardProps {
    id: string
    title: string
    link?: string
    thumbnail?: string
    type: "x" | "youtube" | "document" | "link" | "note"
    tags: string[]
    date: string
    description?: string
    content?: string
    isFavorite?: boolean
    folderId?: string
    folders?: Folder[]
    onDelete?: () => void
    onEdit?: () => void
    onToggleFavorite?: () => void
    onMoveToFolder?: (folderId: string | null) => void
    onAddToVault?: () => void
    onCheckLink?: () => void
}

export function ContentCard({
    title,
    link,
    thumbnail,
    type,
    tags,
    date,
    description,
    content,
    isFavorite,
    folderId,
    folders = [],
    onDelete,
    onEdit,
    onToggleFavorite,
    onMoveToFolder,
    onAddToVault,
    onCheckLink
}: ContentCardProps) {
    const [showFolderMenu, setShowFolderMenu] = useState(false);

    const getIcon = () => {
        switch (type) {
            case "x": return <Twitter className="w-4 h-4 sm:w-5 sm:h-5 text-sky-500" />
            case "youtube": return <Youtube className="w-4 h-4 sm:w-5 sm:h-5 text-red-500" />
            case "document": return <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500" />
            case "note": return <StickyNote className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500" />
            default: return <LinkIcon className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
        }
    }

    const getYoutubeId = (url: string) => {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    }

    const getTweetId = (url: string) => {
        const match = url.match(/\/status\/(\d+)/);
        return match ? match[1] : null;
    }

    return (
        <Card className="group hover:scale-[1.01] sm:hover:scale-[1.02] transition-all duration-300 bg-card/50 backdrop-blur-sm border-border hover:border-primary/50 shadow-lg hover:shadow-primary/10 flex flex-col">
            <CardHeader className="flex flex-row items-start justify-between p-3 sm:p-4 pb-2 space-y-0 relative z-20">
                <div className="flex gap-2 sm:gap-3 items-center flex-1 min-w-0 pr-2">
                    <div className="p-1.5 sm:p-2 bg-secondary rounded-md group-hover:bg-secondary/80 transition-colors shrink-0">
                        {getIcon()}
                    </div>
                    <span className="font-semibold text-base sm:text-lg truncate text-card-foreground group-hover:text-primary transition-colors cursor-pointer w-full" title={title}>
                        {title}
                    </span>
                </div>
                <div className="flex gap-0.5 sm:gap-1 opacity-0 group-hover:opacity-100 transition-opacity absolute right-2 sm:right-3 md:right-4 top-2 sm:top-3 md:top-4 bg-background/90 backdrop-blur-sm rounded-md p-0.5 sm:p-1 shadow-lg">
                    {onToggleFavorite && (
                        <Button 
                            variant="ghost" 
                            size="icon" 
                            className={`h-7 w-7 sm:h-8 sm:w-8 ${isFavorite ? 'text-yellow-500' : 'text-muted-foreground hover:text-yellow-500'}`} 
                            onClick={onToggleFavorite}
                        >
                            <Star className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isFavorite ? 'fill-current' : ''}`} />
                        </Button>
                    )}
                    {onAddToVault && (
                        <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-7 w-7 sm:h-8 sm:w-8 text-muted-foreground hover:text-cyan-500" 
                            onClick={onAddToVault} 
                            title="Add to Memory Vault"
                        >
                            <Brain className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        </Button>
                    )}
                    {onMoveToFolder && folders.length > 0 && (
                        <div className="relative">
                            <Button
                                variant="ghost"
                                size="icon"
                                className={`h-7 w-7 sm:h-8 sm:w-8 ${folderId ? 'text-purple-500' : 'text-muted-foreground hover:text-purple-500'}`}
                                onClick={() => setShowFolderMenu(!showFolderMenu)}
                            >
                                <FolderOpen className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                            </Button>
                            {showFolderMenu && (
                                <div className="absolute right-0 top-9 sm:top-10 bg-card border border-border rounded-lg shadow-xl z-50 min-w-[160px] sm:min-w-[180px] py-1 max-h-[300px] overflow-y-auto">
                                    <div className="px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs text-muted-foreground border-b border-border flex justify-between items-center sticky top-0 bg-card">
                                        <span className="text-xs sm:text-sm">Move to folder</span>
                                        <button onClick={() => setShowFolderMenu(false)} className="hover:text-foreground">
                                            <X className="w-3 h-3" />
                                        </button>
                                    </div>
                                    {folders.map((folder) => (
                                        <button
                                            key={folder._id}
                                            onClick={() => {
                                                onMoveToFolder(folder._id);
                                                setShowFolderMenu(false);
                                            }}
                                            className={`w-full px-2.5 sm:px-3 py-2 text-xs sm:text-sm text-left flex items-center gap-2 hover:bg-secondary/50 ${folderId === folder._id ? 'bg-secondary/30' : ''}`}
                                        >
                                            <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full flex-shrink-0" style={{ backgroundColor: folder.color }} />
                                            <span className="truncate flex-1">{folder.name}</span>
                                            {folderId === folder._id && <span className="ml-auto text-xs text-muted-foreground">✓</span>}
                                        </button>
                                    ))}
                                    {folderId && (
                                        <button
                                            onClick={() => {
                                                onMoveToFolder(null);
                                                setShowFolderMenu(false);
                                            }}
                                            className="w-full px-2.5 sm:px-3 py-2 text-xs sm:text-sm text-left text-destructive hover:bg-destructive/10 border-t border-border"
                                        >
                                            Remove from folder
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                    {onCheckLink && (link || type === 'link' || type === 'youtube' || type === 'x') && (
                        <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-7 w-7 sm:h-8 sm:w-8 text-muted-foreground hover:text-orange-500" 
                            onClick={onCheckLink} 
                            title="Check Link Health"
                        >
                            <Activity className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        </Button>
                    )}
                    {link && (
                        <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-7 w-7 sm:h-8 sm:w-8 text-muted-foreground hover:text-white" 
                            onClick={() => window.open(link, '_blank')}
                        >
                            <ExternalLink className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        </Button>
                    )}
                    {onEdit && (
                        <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-7 w-7 sm:h-8 sm:w-8 text-muted-foreground hover:text-primary" 
                            onClick={onEdit}
                        >
                            <Pencil className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        </Button>
                    )}
                    {onDelete && (
                        <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-7 w-7 sm:h-8 sm:w-8 text-muted-foreground hover:text-destructive" 
                            onClick={onDelete}
                        >
                            <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        </Button>
                    )}
                </div>
            </CardHeader>
            <CardContent className="p-3 sm:p-4 pt-2 space-y-3 sm:space-y-4 flex flex-col">
                <div className="w-full relative z-10">
                    {type === 'youtube' && link && getYoutubeId(link) && (
                        <div className="aspect-video w-full rounded-md overflow-hidden ring-1 ring-white/10">
                            <iframe
                                width="100%"
                                height="100%"
                                src={`https://www.youtube.com/embed/${getYoutubeId(link)}`}
                                title="YouTube video player"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                referrerPolicy="strict-origin-when-cross-origin"
                                allowFullScreen
                            ></iframe>
                        </div>
                    )}

                    {type === 'x' && link && getTweetId(link) && (
                        <div className="w-full flex justify-center transform scale-[0.85] sm:scale-90 origin-top -mt-3 sm:-mt-4">
                            <Tweet id={getTweetId(link) as string} />
                        </div>
                    )}

                    {type === 'document' && link && (
                        <div className="w-full h-40 sm:h-48 bg-secondary/20 rounded-md overflow-hidden border border-white/5 relative group/doc">
                            {thumbnail ? (
                                <div className="h-full w-full relative">
                                    <img src={thumbnail} alt={title} className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover/doc:opacity-100 transition-opacity">
                                        <ExternalLink className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                                    </div>
                                    <a href={link} target="_blank" rel="noopener noreferrer" className="absolute inset-0 z-10"></a>
                                </div>
                            ) : link.startsWith('data:application/pdf') ? (
                                <embed src={link} type="application/pdf" width="100%" height="100%" />
                            ) : (
                                <iframe
                                    src={`https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(link)}`}
                                    width="100%"
                                    height="100%"
                                    frameBorder="0"
                                    key={link}
                                ></iframe>
                            )}
                            <a href={link} download="document" target="_blank" rel="noopener noreferrer" className="absolute top-2 right-2 p-1.5 sm:p-2 bg-background/80 rounded-full opacity-0 group-hover/doc:opacity-100 transition-opacity z-20">
                                <ExternalLink className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                            </a>
                        </div>
                    )}

                    {type === 'note' && content && (
                        <div className="p-3 sm:p-4 bg-yellow-500/5 rounded-md border border-yellow-500/20 prose prose-sm dark:prose-invert max-w-none">
                            <p className="text-sm sm:text-base text-foreground/90 whitespace-pre-wrap leading-relaxed">{content}</p>
                        </div>
                    )}

                    {type === 'link' && link && (
                        <div className="rounded-md border border-white/5 overflow-hidden">
                            {thumbnail && (
                                <div className="h-40 sm:h-48 w-full relative">
                                    <img src={thumbnail} alt={title} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                                </div>
                            )}
                            <div className="p-3 sm:p-4 bg-secondary/20">
                                <a href={link} target="_blank" rel="noopener noreferrer" className="text-xs sm:text-sm text-primary hover:underline break-all block">
                                    {link}
                                </a>
                            </div>
                        </div>
                    )}

                    {description && (
                        <div className="p-2.5 sm:p-3 bg-secondary/10 rounded-md border border-white/5 text-xs sm:text-sm text-foreground/80 mt-2 whitespace-pre-wrap font-medium">
                            {description}
                        </div>
                    )}
                </div>

                <div className="flex flex-wrap gap-1.5 sm:gap-2 pt-2 border-t border-white/5 mt-3 sm:mt-4">
                    {tags && tags.length > 0 ? tags.map(tag => (
                        <Badge key={tag} variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20 transition-colors text-xs">
                            #{tag}
                        </Badge>
                    )) : (
                        <span className="text-xs text-muted-foreground">#NoTags</span>
                    )}
                </div>
                <div className="text-xs text-muted-foreground text-right mt-1">
                    Added on {date}
                </div>
            </CardContent>
        </Card>
    )
}