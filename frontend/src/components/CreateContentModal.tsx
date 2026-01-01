import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState, useEffect } from "react"
import { Plus, Save, Wand2, Loader2 } from "lucide-react"
import axios from "axios"
import { BACKEND_URL } from "@/config"
import { useQueryClient } from "@tanstack/react-query"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"

type ContentType = "x" | "youtube" | "document" | "link" | "note"

interface CreateContentModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  initialData?: any
  initialTitle?: string
  initialLink?: string
  initialType?: ContentType
}

export function CreateContentModal({ open, onOpenChange, initialData, initialTitle = "", initialLink = "", initialType = "link" }: CreateContentModalProps) {
  const [type, setType] = useState<ContentType>(initialType)
  const [title, setTitle] = useState(initialTitle)
  const [link, setLink] = useState(initialLink)
  const [tags, setTags] = useState("")  // Keep as string for input
  const [description, setDescription] = useState("")
  const [content, setContent] = useState("") // For rich text notes

  const queryClient = useQueryClient();

  // Reset state when modal opens or initial props change
  useEffect(() => {
    if (open && !initialData) {
      setTitle(initialTitle)
      setLink(initialLink)
      if (initialType) setType(initialType)
    }
  }, [open, initialTitle, initialLink, initialType, initialData])

  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    if (initialData && open) {
      setTitle(initialData.title || "");
      setLink(initialData.link || "");
      setType(initialData.type || "x");
      setDescription(initialData.description || "");
      setContent(initialData.content || "");
      setTags(initialData.tags ? initialData.tags.join(', ') : "");
    } else if (!open) {
      setTitle("");
      setLink("");
      setType("x");
      setDescription("");
      setContent("");
      setTags("");
    }
  }, [initialData, open]);

  const handleGenerateMetadata = async () => {
    if (!link && !title) {
      toast.warning("Please enter a Link or Title first!");
      return;
    }
    setIsGenerating(true);
    try {
      const response = await axios.post(BACKEND_URL + "/api/v1/brain/metadata", {
        link,
        title
      }, {
        headers: {
          "Authorization": localStorage.getItem("token")
        }
      });

      const { tags: newTags, description: newDesc, type: newType } = response.data;

      if (newTags && newTags.length > 0) setTags(newTags.join(', '));
      if (newDesc) setDescription(newDesc);
      if (newType && ['x', 'youtube', 'document', 'link'].includes(newType)) setType(newType);
      toast.success("Metadata generated successfully!");
    } catch (e) {
      console.error(e);
      toast.error("Failed to generate metadata. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  }

  const handleSubmit = async () => {
    try {
      const payload = {
        link: type === 'note' ? undefined : link,
        type,
        title,
        description,
        content: type === 'note' ? content : undefined,
        tags: tags.split(',').map((tag: string) => tag.trim()).filter((tag: string) => tag.length > 0)
      };

      if (initialData) {
        await axios.put(BACKEND_URL + "/api/v1/content", {
          contentid: initialData._id,
          ...payload
        }, {
          headers: {
            "Authorization": localStorage.getItem("token")
          }
        });
      } else {
        await axios.post(BACKEND_URL + "/api/v1/content", payload, {
          headers: {
            "Authorization": localStorage.getItem("token")
          }
        });
      }

      await queryClient.invalidateQueries({ queryKey: ["content"] });
      onOpenChange(false);
    } catch (e) {
      toast.error("Error saving content");
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-card border-border text-foreground max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{initialData ? "Edit Content" : "Add Content"}</DialogTitle>
          <div className="flex items-center justify-between">
            <DialogDescription>
              Import content from Twitter, Youtube, or other sources.
            </DialogDescription>
            <Button
              variant="outline"
              size="sm"
              onClick={handleGenerateMetadata}
              disabled={isGenerating}
              className="text-purple-600 border-purple-200 hover:bg-purple-50 dark:text-purple-400 dark:border-purple-900 dark:hover:bg-purple-900/20"
            >
              {isGenerating ? <Loader2 className="w-3 h-3 animate-spin mr-2" /> : <Wand2 className="w-3 h-3 mr-2" />}
              Auto-Fill
            </Button>
          </div>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-right">
              Title
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="My Awesome Tweet"
              className="col-span-3 bg-secondary/50 border-input focus:border-primary"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="link" className="text-right">
              {type === 'document' ? 'File' : 'Link'}
            </Label>
            {type === 'document' ? (
              <Input
                key="file-input"
                id="link"
                type="file"
                accept=".pdf,.doc,.docx,.txt"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    if (file.size > 5 * 1024 * 1024) {
                      toast.error("File is too large (max 5MB)");
                      return;
                    }
                    const reader = new FileReader();
                    reader.onloadend = () => {
                      setLink(reader.result as string);
                    };
                    reader.readAsDataURL(file);
                  }
                }}
                className="col-span-3 bg-secondary/50 border-input focus:border-primary"
              />
            ) : (
              <Input
                key="text-input"
                id="link"
                value={link}
                onChange={(e) => setLink(e.target.value)}
                placeholder="https://..."
                className="col-span-3 bg-secondary/50 border-input focus:border-primary"
              />
            )}
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="type" className="text-right">
              Type
            </Label>
            <select
              id="type"
              value={type}
              onChange={(e) => setType(e.target.value as ContentType)}
              className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-secondary/50 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 col-span-3"
            >
              <option value="x">Twitter / X</option>
              <option value="youtube">Youtube</option>
              <option value="document">Document</option>
              <option value="link">Link</option>
              <option value="note">📝 Note</option>
            </select>
          </div>

          {/* Note Content - Only shown for note type */}
          {type === 'note' && (
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="content" className="text-right pt-2">
                Note
              </Label>
              <Textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your thoughts, ideas, or notes here..."
                className="col-span-3 bg-secondary/50 border-input focus:border-primary min-h-[150px]"
              />
            </div>
          )}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              Description
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add some notes about this content..."
              className="col-span-3 bg-secondary/50 border-input focus:border-primary"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="tags" className="text-right">
              Tags
            </Label>
            <Input
              id="tags"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="ideas, productivity (comma separated)"
              className="col-span-3 bg-secondary/50 border-input focus:border-primary"
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleSubmit} className="w-full">
            {initialData ? <Save className="mr-2 h-4 w-4" /> : <Plus className="mr-2 h-4 w-4" />}
            {initialData ? "Save Changes" : "Add Content"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
