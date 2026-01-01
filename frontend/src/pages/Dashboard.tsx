import { Sidebar } from "@/components/Sidebar"
import { MobileSidebar } from "@/components/MobileSidebar"
import { ContentCard } from "@/components/ContentCard"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Share2, Search, Loader2 } from "lucide-react"
import { useState, useEffect } from "react"
import { CreateContentModal } from "@/components/CreateContentModal"
import { ModeToggle } from "@/components/mode-toggle"
import { useContent } from "@/hooks/useContent"
import { useFolders } from "@/hooks/useFolders"
import { useReviews } from "@/hooks/useReviews"
import axios from "axios"
import { BACKEND_URL } from "@/config"
import { useQueryClient } from "@tanstack/react-query"
import { useLocation } from "react-router-dom"
import { ShareBrainModal } from "@/components/ShareBrainModal"
import { toast } from "sonner"

// Dashboard component
export function Dashboard() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isShareModalOpen, setIsShareModalOpen] = useState(false)
  const [debouncedSearch, setDebouncedSearch] = useState("")
  const [editContent, setEditContent] = useState(null)
  const queryClient = useQueryClient();
  const location = useLocation();
  const { toggleFavorite, moveToFolder, folders } = useFolders();
  const { addToReview } = useReviews();

  // URL params for bookmarklet/extension support
  const searchParams = new URLSearchParams(location.search);
  const initialTitle = searchParams.get('addTitle') || "";
  const initialLink = searchParams.get('addLink') || "";
  const initialType = searchParams.get('addType') || "link";
  const initialSearch = searchParams.get('search') || "";

  const [search, setSearch] = useState(initialSearch)

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const searchParam = params.get('search');
    setSearch(searchParam || "");
  }, [location.search]);

  useEffect(() => {
    if (initialTitle || initialLink) {
      setIsCreateModalOpen(true);
    }
  }, [initialTitle, initialLink]);

  // Debounce search input for server-side search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  const { data: contents = [], isLoading, fetchNextPage, hasNextPage, isFetchingNextPage, pagination } = useContent(debouncedSearch)


  const handleDelete = async (id: string) => {
    try {
      await axios.delete(BACKEND_URL + "/api/v1/content", {
        data: {
          contentid: id
        },
        headers: {
          "Authorization": localStorage.getItem("token")
        }
      });
      queryClient.invalidateQueries({ queryKey: ["content"] });
    } catch (e) {
      toast.error("Error deleting content");
    }
  }

  const getFilterType = () => {
    if (location.pathname.includes("favorites")) return "favorites";
    if (location.pathname.includes("folder/")) return "folder";
    if (location.pathname.includes("notes")) return "note";
    if (location.pathname.includes("tweets")) return "x";
    if (location.pathname.includes("videos")) return "youtube";
    if (location.pathname.includes("documents")) return "document";
    if (location.pathname.includes("links")) return "link";
    return "all";
  }

  const filterType = getFilterType();
  const folderId = location.pathname.match(/folder\/([a-f0-9]+)/)?.[1];

  const filteredContents = contents.filter((content: any) => {
    // Favorites filter
    if (filterType === "favorites") return content.isFavorite;

    // Folder filter
    if (filterType === "folder" && folderId) return content.folderId === folderId;

    // Type filter
    const matchesType = filterType === "all" || filterType === "folder" || content.type === filterType;
    const matchesSearch = content.title.toLowerCase().includes(search.toLowerCase()) ||
      content.description?.toLowerCase().includes(search.toLowerCase()) ||
      content.tags?.some((tag: string) => tag.toLowerCase().includes(search.toLowerCase()));

    return matchesType && matchesSearch;
  });

  const getTitle = () => {
    switch (filterType) {
      case "favorites": return "Favorites ⭐";
      case "folder": return "Folder";
      case "note": return "Notes";
      case "x": return "Tweets";
      case "youtube": return "Videos";
      case "document": return "Documents";
      case "link": return "Links";
      default: return "All Content";
    }
  }

  if (isLoading) {
    return (
      <div className="flex h-screen bg-background text-foreground font-sans overflow-hidden">
        <Sidebar />
        <div className="flex-1 flex flex-col ml-64 transition-all duration-300">
          <header className="h-16 border-b border-border flex items-center justify-between px-6 bg-background/50 backdrop-blur-md sticky top-0 z-10">
            <div className="h-7 w-32 bg-muted animate-pulse rounded" />
            <div className="flex-1 max-w-xl mx-8 hidden md:block">
              <div className="h-10 bg-muted animate-pulse rounded-md" />
            </div>
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 bg-muted animate-pulse rounded-md" />
              <div className="h-10 w-28 bg-muted animate-pulse rounded-md" />
              <div className="h-10 w-32 bg-muted animate-pulse rounded-md" />
            </div>
          </header>
          <main className="flex-1 overflow-y-auto p-8 bg-secondary/5">
            <div className="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6 w-full max-w-7xl mx-auto">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="break-inside-avoid mb-6 rounded-lg border bg-card p-4 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-md bg-muted animate-pulse" />
                    <div className="h-5 w-3/4 bg-muted animate-pulse rounded" />
                  </div>
                  <div className="h-32 w-full rounded-md bg-muted animate-pulse" />
                  <div className="flex gap-2">
                    <div className="h-6 w-16 rounded-full bg-muted animate-pulse" />
                    <div className="h-6 w-20 rounded-full bg-muted animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          </main>
        </div>
      </div>
    )
  }


  return (
    <div className="flex h-screen bg-background text-foreground font-sans overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col md:ml-64 ml-0 transition-all duration-300">
        {/* Header */}
        <header className="h-16 border-b border-border flex items-center justify-between px-4 md:px-6 bg-background/50 backdrop-blur-md sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <MobileSidebar />
            <h2 className="text-xl md:text-2xl font-bold tracking-tight truncate max-w-[150px] md:max-w-none">{getTitle()}</h2>
          </div>

          <div className="flex-1 max-w-xl mx-4 md:mx-8 relative hidden md:block">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search your brain..."
              className="w-full pl-10 bg-secondary/50 border-input focus:border-primary"
            />
          </div>

          <div className="flex items-center gap-4">
            <ModeToggle />
            <Button variant="outline" className="gap-2 border-primary/20 text-primary hover:bg-primary/10" onClick={() => setIsShareModalOpen(true)}>
              <Share2 className="w-4 h-4" />
              Share Brain
            </Button>
            <Button className="gap-2 bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20" onClick={() => setIsCreateModalOpen(true)}>
              <Plus className="w-4 h-4" />
              Add Content
            </Button>
          </div>
        </header>

        {/* Content Grid */}
        <main className="flex-1 overflow-y-auto p-8 bg-secondary/5">
          <div className="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6 w-full max-w-7xl mx-auto">
            {filteredContents.map((content: any, i: number) => (
              <div key={content._id || i} className="break-inside-avoid mb-6">
                <ContentCard
                  id={content._id}
                  title={content.title}
                  link={content.link}
                  thumbnail={content.thumbnail}
                  type={content.type}
                  tags={content.tags || []}
                  date={new Date(content.createdAt || Date.now()).toLocaleDateString()}
                  description={content.description}
                  content={content.content}
                  isFavorite={content.isFavorite}
                  folderId={content.folderId}
                  folders={folders}
                  onToggleFavorite={() => toggleFavorite.mutate(content._id)}
                  onMoveToFolder={(folderId) => moveToFolder.mutate({ contentId: content._id, folderId })}
                  onAddToVault={() => addToReview.mutate(content._id)}
                  onCheckLink={async () => {
                    if (!content.link) return;
                    const toastId = toast.loading("Checking link health...");
                    try {
                      const res = await axios.post(`${BACKEND_URL}/api/v1/content/check-link`, { url: content.link }, {
                        headers: { "Authorization": localStorage.getItem("token") }
                      });
                      if (res.data.status === 'alive') {
                        toast.success(`Link is healthy! (Status: ${res.data.code})`, { id: toastId });
                      } else {
                        toast.error(`Link appears broken (Status: ${res.data.code || 'Unknown error'})`, { id: toastId });
                      }
                    } catch (e) {
                      toast.error("Could not verify link", { id: toastId });
                    }
                  }}
                  onEdit={() => {
                    setEditContent(content);
                    setIsCreateModalOpen(true);
                  }}
                  onDelete={() => handleDelete(content._id)}
                />
              </div>
            ))}
          </div>
          {filteredContents.length === 0 && (
            <div className="text-center text-muted-foreground py-20 w-full">
              No content found. Add some tweets or videos to get started!
            </div>
          )}

          {/* Load More Button */}
          {hasNextPage && filteredContents.length > 0 && (
            <div className="flex flex-col items-center gap-2 py-8">
              <Button
                variant="outline"
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
                className="gap-2"
              >
                {isFetchingNextPage ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Loading more...</>
                ) : (
                  <>Load More</>
                )}
              </Button>
              {pagination && (
                <span className="text-sm text-muted-foreground">
                  Showing {contents.length} of {pagination.total} items
                </span>
              )}
            </div>
          )}
        </main>
      </div>

      <CreateContentModal
        open={isCreateModalOpen}
        onOpenChange={(open) => {
          setIsCreateModalOpen(open);
          // Clear URL params on close
          if (!open) {
            window.history.replaceState({}, '', location.pathname);
            setEditContent(null);
          }
        }}
        initialData={editContent}
        initialTitle={initialTitle}
        initialLink={initialLink}
        initialType={initialType as any}
      />
      <ShareBrainModal open={isShareModalOpen} onOpenChange={setIsShareModalOpen} />
    </div>
  )
}
