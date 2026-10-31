export interface PortfolioSection {
  readonly id: string;
  readonly icon: string;
  readonly label: string;
}

/** Canonical order used by navigation, the mini-map, and scroll XP. */
export const PORTFOLIO_SECTIONS: readonly PortfolioSection[] = [
  { id: 'about', icon: '🗡', label: 'About' },
  { id: 'experience', icon: '🗺️', label: 'Experience' },
  { id: 'metrics', icon: '📊', label: 'Impact' },
  { id: 'publications', icon: '🏰', label: 'Projects' },
  { id: 'skill', icon: '⚔', label: 'Skills' },
  { id: 'blogs', icon: '📜', label: 'Writing' },
  { id: 'avatar-3d', icon: '🤖', label: 'AI Twin' },
  { id: 'education', icon: '🏫', label: 'Education' },
  { id: 'operating-style', icon: '🎮', label: 'Approach' },
  { id: 'ai-quiz-game', icon: '🕹', label: 'Game' },
];

export const PORTFOLIO_SECTION_IDS = PORTFOLIO_SECTIONS.map(section => section.id);
