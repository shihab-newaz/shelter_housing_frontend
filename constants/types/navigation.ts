// constants/types/navigation.ts
import { LucideIcon } from "lucide-react";
export interface ProjectNavItem {
    title: string;
    href: string;
  }
  
export interface ToolbarItem {
  id: string;
  icon: LucideIcon;
  href: string;
  label: string;
  isExternal: boolean;
  color: string;
}
