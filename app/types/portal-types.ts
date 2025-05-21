import { IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { ReactNode } from "react";

interface SideNavLinkDataProps {
  linkKey: string;
  textKey: string;
  active: boolean;
  icon: IconDefinition;
}

interface PortalSideNavigationProps {
  links: SideNavLinkDataProps[];
}

interface PortalLayoutProps {
  children: ReactNode;
  links: SideNavLinkDataProps[];
}

interface ChildrenProps {
  children: ReactNode;
}

interface TableControlsProps {
  title: string;
  linkKey?: string;
  textKey?: string;
  isAdding: boolean;
}

interface TableProps {
  head: ReactNode;
  body: ReactNode;
}

interface ChampionInfo {
  name: string;
  textKey: string;
  className: string;
  value: any;
  placeholder: string;
}

interface ChampionInfoDataProps {
  [x: string]: any;
  firstName?: string;
  lastName?: string;
  weightClass?: string;
  wins?: number;
  losses?: number;
  draws?: number;
  knockouts?: number;
  titles?: string[];
  ranking?: number;
  coachName?: string;
  age?: number;
  height?: number;
  reach?: number;
  stance?: string;
  photoUrl?: string;
  bio?: string;
  debutDate?: Date;
  lastFightDate?: Date;
  isActive?: boolean;
}

export type {
  SideNavLinkDataProps,
  PortalSideNavigationProps,
  PortalLayoutProps,
  ChildrenProps,
  TableControlsProps,
  TableProps,
  ChampionInfo,
  ChampionInfoDataProps,
};
