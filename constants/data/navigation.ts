// constants/data/navigation.ts
import { Facebook, Linkedin } from 'lucide-react';
import { ProjectNavItem, ToolbarItem } from '../types/navigation';

/**
 * Navigation items for project categories
 */
export const projectItems: ProjectNavItem[] = [
  {
    title: "Upcoming",
    href: "/projects/upcoming",
  },
  {
    title: "Ongoing",
    href: "/projects/ongoing",
  },
  {
    title: "Completed",
    href: "/projects/completed",
  },
];

/**
 * Social media and contact toolbar configuration
 */
export const toolbarItems: ToolbarItem[] = [
  {
    id: 'facebook',
    icon: Facebook,
    href: 'https://www.facebook.com/@shelterhousinglimited',
    label: 'Visit our Facebook page',
    isExternal: true,
    color: '#1877F2'
  },
  {
    id: 'linkedin',
    icon: Linkedin,
    href: 'https://www.linkedin.com/company/shelterhousingltd/',
    label: 'Connect with us on LinkedIn',
    isExternal: true,
    color: '#0A66C2'
  },
];