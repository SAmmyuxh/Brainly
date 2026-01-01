import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState, useEffect } from "react"
import { FolderPlus, Pencil } from "lucide-react"
import { useFolders } from "@/hooks/useFolders"

interface CreateFolderModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    initialData?: {
        id: string
        name: string
        description?: string
        color: string
    } | null
}

const FOLDER_COLORS = [
    "#8B5CF6", // Purple
    "#3B82F6", // Blue
    "#10B981", // Green
    "#F59E0B", // Amber
    "#EF4444", // Red
    "#EC4899", // Pink
    "#6366F1", // Indigo
    "#14B8A6", // Teal
];

export function CreateFolderModal({ open, onOpenChange, initialData }: CreateFolderModalProps) {
    const [name, setName] = useState("")
    const [description, setDescription] = useState("")
    const [color, setColor] = useState(FOLDER_COLORS[0])
    const { createFolder, updateFolder } = useFolders()

    useEffect(() => {
        if (initialData) {
            setName(initialData.name);
            setDescription(initialData.description || "");
            setColor(initialData.color);
        } else {
            setName("");
            setDescription("");
            setColor(FOLDER_COLORS[0]);
        }
    }, [initialData, open]);

    const handleSubmit = async () => {
        if (!name.trim()) return;

        if (initialData) {
            await updateFolder.mutateAsync({ folderId: initialData.id, name, description, color });
        } else {
            await createFolder.mutateAsync({ name, description, color });
        }

        onOpenChange(false);
        if (!initialData) {
            setName("");
            setDescription("");
            setColor(FOLDER_COLORS[0]);
        }
    }

    const isPending = createFolder.isPending || updateFolder.isPending;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[400px] bg-card border-border text-foreground">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        {initialData ? <Pencil className="w-5 h-5 text-primary" /> : <FolderPlus className="w-5 h-5 text-primary" />}
                        {initialData ? "Edit Folder" : "Create Folder"}
                    </DialogTitle>
                    <DialogDescription>
                        {initialData ? "Update your folder details." : "Organize your content into folders for easier access."}
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="folder-name" className="text-right">
                            Name
                        </Label>
                        <Input
                            id="folder-name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="My Folder"
                            className="col-span-3 bg-secondary/50"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="folder-desc" className="text-right">
                            Description
                        </Label>
                        <Input
                            id="folder-desc"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Optional description"
                            className="col-span-3 bg-secondary/50"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label className="text-right">Color</Label>
                        <div className="col-span-3 flex gap-2 flex-wrap">
                            {FOLDER_COLORS.map((c) => (
                                <button
                                    key={c}
                                    onClick={() => setColor(c)}
                                    className={`w-8 h-8 rounded-full transition-transform ${color === c ? 'ring-2 ring-offset-2 ring-offset-background ring-white scale-110' : 'hover:scale-105'}`}
                                    style={{ backgroundColor: c }}
                                />
                            ))}
                        </div>
                    </div>
                </div>
                <DialogFooter>
                    <Button
                        onClick={handleSubmit}
                        className="w-full"
                        disabled={!name.trim() || isPending}
                    >
                        {initialData ? (
                            <>
                                <Pencil className="w-4 h-4 mr-2" />
                                Update Folder
                            </>
                        ) : (
                            <>
                                <FolderPlus className="w-4 h-4 mr-2" />
                                Create Folder
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
