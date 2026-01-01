import { SidebarContent } from "./SidebarContent"

export function Sidebar() {
    return (
        <div className="h-screen w-64 bg-card border-r border-border hidden md:flex flex-col fixed left-0 top-0 z-50 transition-all duration-300">
            <SidebarContent />
        </div>
    )
}