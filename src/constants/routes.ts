import { SettingsIcon, UsersIcon } from 'lucide-react';
import { GoCheckCircle, GoCheckCircleFill, GoHome, GoHomeFill } from 'react-icons/go';

export const ROUTES = [
  {
    label: "home",
    href: "",
    icon: GoHome,
    activeIcon: GoHomeFill,
  },
  {
    label: "my_tasks",
    href: "/tasks",
    icon: GoCheckCircle,
    activeIcon: GoCheckCircleFill,
  },
  {
    label: "settings",
    href: "/settings",
    icon: SettingsIcon,
    activeIcon: SettingsIcon,
  },
  {
    label: "members",
    href: "/members",
    icon: UsersIcon,
    activeIcon: UsersIcon,
  },
] as const;