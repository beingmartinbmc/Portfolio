export interface PortfolioSection {
  readonly id: string;
  readonly icon: string;
  readonly label: string;
}

/** Canonical order used by navigation, the mini-map, and scroll XP. */
export const PORTFOLIO_SECTIONS: readonly PortfolioSection[] = [
  { id: 'about', icon: '🗡', label: 'About' },
  { id: 'avatar-3d', icon: '🤖', label: 'AI Twin' },
  { id: 'skill', icon: '⚔', label: 'Skills' },
  { id: 'experience', icon: '🗺️', label: 'Experience' },
  { id: 'metrics', icon: '📊', label: 'Metrics' },
  { id: 'publications', icon: '🏰', label: 'Projects' },
  { id: 'blogs', icon: '📜', label: 'Writing' },
  { id: 'ai-quiz-game', icon: '🕹', label: 'Game' },
  { id: 'education', icon: '🏫', label: 'Education' },
  { id: 'operating-style', icon: '🎮', label: 'Profile' },
];

export const PORTFOLIO_SECTION_IDS = PORTFOLIO_SECTIONS.map(section => section.id);
