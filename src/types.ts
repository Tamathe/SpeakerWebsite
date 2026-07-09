export interface LinkAction {
  label: string;
  href: string;
}

export interface HeroContent {
  title: string;
  summary: string;
  primaryAction: LinkAction;
  secondaryAction: LinkAction;
  proofPoints: string[];
}

export interface FeaturedMedia {
  label: string;
  title: string;
  summary: string;
  status: string;
  href?: string;
  actionLabel?: string;
  imageSrc: string;
  imageAlt: string;
}

export interface ProfileContent {
  title: string;
  summary: string;
  details: string[];
}

export interface WorkItem {
  title: string;
  summary: string;
}

export interface TalkItem {
  title: string;
  audience: string;
  summary: string;
  href?: string;
  note?: string;
}

export interface ThinkingItem {
  type: string;
  title: string;
  summary: string;
}

export interface CredentialItem {
  label: string;
  detail: string;
}

export interface InviteContent {
  title: string;
  summary: string;
  email: string;
  materials: string[];
}

export interface SiteContent {
  hero: HeroContent;
  featuredMedia: FeaturedMedia;
  profile: ProfileContent;
  currentWork: WorkItem[];
  talks: TalkItem[];
  recentThinking: ThinkingItem[];
  credentials: CredentialItem[];
  invite: InviteContent;
}
