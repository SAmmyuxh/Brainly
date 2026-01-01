import type { ReactElement } from "react";

export function SidebarItem({icon,text}:{
    icon:ReactElement,
    text:String
}){
   return <div className="flex text-gray-700 py-4 cursor-pointer hover:bg-gray-200 rounded max-w-72 pl-8 transition-all duration-150 gap-2">
    <div className="pr-3 pt-1 flex justify-center items-center">
    {icon}
    </div>
    <div className="flex justify-center items-center font-serif">
    {text} 
    </div>
   </div>
}