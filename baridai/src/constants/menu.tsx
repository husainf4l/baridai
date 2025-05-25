import { v4 as uuid } from "uuid";
import {
  HomeIcon,
  Cog6ToothIcon as SettingsIcon,
} from "@heroicons/react/24/outline";
import { Share2 } from "lucide-react";

type FieldProps = {
  label: string;
  id: string;
};

type SideBarProps = {
  icon: React.ReactNode;
} & FieldProps;

export const SIDEBAR_MENU: SideBarProps[] = [
  {
    id: uuid(),
    label: "home",
    icon: <HomeIcon />,
  },
  {
    id: uuid(),
    label: "automations",
    icon: <SettingsIcon />,
  },
  {
    id: uuid(),
    label: "integrations",
    icon: <Share2 />,
  },
  {
    id: uuid(),
    label: "settings",
    icon: <SettingsIcon />,
  },
];
