import { Brain, Twitter, Youtube, FileText, Link as LinkIcon, Hash, LogOut, StickyNote, Folder, Star, FolderPlus, ChevronDown, BarChart3, Globe, MoreVertical, Pencil, Trash2 } from "lucide-react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { BrainChat } from "@/components/BrainChat"
import { toast } from "sonner"
import { useFolders } from "@/hooks/useFolders"
import { CreateFolderModal } from "@/components/CreateFolderModal"
import { useState } from "react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export function SidebarContent() {
    const location = useLocation();
    const navigate = useNavigate();
    const { folders, deleteFolder } = useFolders();
    const [isFolderModalOpen, setIsFolderModalOpen] = useState(false);
    const [showFolders, setShowFolders] = useState(true);
    const [editFolder, setEditFolder] = useState<{ id: string, name: string, description?: string, color: string } | null>(null);

    const handleLogout = () => {
        localStorage.removeItem("token");
        toast.success("Signed out successfully");
        navigate("/signin");
    };

    const navItems = [
        { icon: StickyNote, label: "Notes", href: "/dashboard/notes", color: "text-yellow-500" },
        { icon: Twitter, label: "Tweets", href: "/dashboard/tweets", color: "text-sky-500" },
        { icon: Youtube, label: "Videos", href: "/dashboard/videos", color: "text-red-500" },
        { icon: FileText, label: "Documents", href: "/dashboard/documents", color: "text-orange-500" },
        { icon: LinkIcon, label: "Links", href: "/dashboard/links", color: "text-blue-500" },
        { icon: Hash, label: "Tags", href: "/dashboard/tags", color: "text-violet-500" },
    ]

    return (
        <div className="h-full flex flex-col">
            <div className="p-6 flex items-center gap-3">
                <div className="p-2 bg-primary/20 rounded-lg">
                    <Brain className="w-8 h-8 text-primary" />
                </div>
                <h1 className="text-2xl font-bold tracking-tight text-foreground">Brainly</h1>
            </div>

            <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto">
                <Link to="/dashboard">
                    <Button variant="ghost" className={cn("w-full justify-start gap-3 text-lg font-medium", location.pathname === "/dashboard" && "bg-secondary/50 text-primary")}>
                        <Brain className="w-5 h-5" />
                        All Content
                    </Button>
                </Link>

                <Link to="/dashboard/favorites">
                    <Button variant="ghost" className={cn("w-full justify-start gap-3 text-lg font-medium text-yellow-500", location.pathname === "/dashboard/favorites" && "bg-secondary/50")}>
                        <Star className="w-5 h-5" />
                        Favorites
                    </Button>
                </Link>

                <Link to="/analytics">
                    {/* Analytics Link */}
                    <Button variant="ghost" className={cn("w-full justify-start gap-3 text-lg font-medium text-purple-500", location.pathname === "/analytics" && "bg-secondary/50")}>
                        <BarChart3 className="w-5 h-5" />
                        Analytics
                    </Button>
                </Link>

                <Link to="/memory-vault">
                    <Button variant="ghost" className={cn("w-full justify-start gap-3 text-lg font-medium text-cyan-500", location.pathname === "/memory-vault" && "bg-secondary/50")}>
                        <Brain className="w-5 h-5" />
                        Memory Vault
                    </Button>
                </Link>

                <Link to="/connect">
                    <Button variant="ghost" className={cn("w-full justify-start gap-3 text-lg font-medium text-emerald-500", location.pathname === "/connect" && "bg-secondary/50")}>
                        <Globe className="w-5 h-5" />
                        Connect
                    </Button>
                </Link>

                {navItems.map((item) => (
                    <Link key={item.label} to={item.href}>
                        <Button
                            variant="ghost"
                            className={cn(
                                "w-full justify-start gap-3 text-lg font-medium text-muted-foreground hover:text-foreground hover:bg-secondary/30",
                                location.pathname === item.href && "bg-secondary/50 text-primary"
                            )}
                        >
                            <item.icon className={cn("w-5 h-5", item.color)} />
                            {item.label}
                        </Button>
                    </Link>
                ))}

                {/* Folders Section */}
                <div className="pt-4 border-t border-border mt-4">
                    <button
                        onClick={() => setShowFolders(!showFolders)}
                        className="flex items-center justify-between w-full text-sm text-muted-foreground hover:text-foreground px-3 py-2"
                    >
                        <span className="flex items-center gap-2">
                            <Folder className="w-4 h-4" />
                            Folders
                        </span>
                        <ChevronDown className={cn("w-4 h-4 transition-transform", showFolders && "rotate-180")} />
                    </button>

                    {showFolders && (
                        <div className="space-y-1 mt-1">
                            {folders.map((folder) => (
                                <div key={folder._id} className="group relative flex items-center pr-2 hover:bg-secondary/30 rounded-md">
                                    <Link to={`/dashboard/folder/${folder._id}`} className="flex-1 min-w-0">
                                        <Button
                                            variant="ghost"
                                            className={cn(
                                                "w-full justify-start gap-3 text-sm font-medium text-muted-foreground hover:text-foreground pl-8",
                                                location.pathname.includes(folder._id) && "bg-secondary/50 text-primary"
                                            )}
                                        >
                                            <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: folder.color }} />
                                            <span className="truncate flex-1 text-left">{folder.name}</span>
                                            <span className="text-xs text-muted-foreground">{folder.contentCount}</span>
                                        </Button>
                                    </Link>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <MoreVertical className="w-4 h-4 text-muted-foreground" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem onClick={() => {
                                                setEditFolder({
                                                    id: folder._id,
                                                    name: folder.name,
                                                    description: folder.description,
                                                    color: folder.color
                                                });
                                                setIsFolderModalOpen(true);
                                            }}>
                                                <Pencil className="w-4 h-4 mr-2" />
                                                Rename
                                            </DropdownMenuItem>
                                            <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => {
                                                if (confirm("Are you sure you want to delete this folder? Content will not be deleted but moved to 'All Content'.")) {
                                                    deleteFolder.mutate(folder._id);
                                                    if (location.pathname.includes(folder._id)) {
                                                        navigate("/dashboard");
                                                    }
                                                }
                                            }}>
                                                <Trash2 className="w-4 h-4 mr-2" />
                                                Delete
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            ))}
                            <Button
                                variant="ghost"
                                onClick={() => {
                                    setEditFolder(null);
                                    setIsFolderModalOpen(true);
                                }}
                                className="w-full justify-start gap-3 text-sm font-medium text-muted-foreground hover:text-primary pl-8"
                            >
                                <FolderPlus className="w-4 h-4" />
                                New Folder
                            </Button>
                        </div>
                    )}
                </div>

                <div className="pt-4 mt-auto">
                    <BrainChat />
                </div>
            </nav>

            <div className="p-4 border-t border-border">
                <Button
                    variant="outline"
                    className="w-full justify-start gap-3 border-destructive/50 text-destructive hover:bg-destructive/10 hover:text-destructive"
                    onClick={handleLogout}
                >
                    <LogOut className="w-5 h-5" />
                    Sign Out
                </Button>
            </div>

            <CreateFolderModal open={isFolderModalOpen} onOpenChange={setIsFolderModalOpen} initialData={editFolder} />
        </div>
    )
}
