import {
  SOCIAL_LINKS,
  DOCUMENT_LINKS,
  PROJECT_LINKS,
  BLOG_LINKS,
  PACKAGE_LINKS,
  CONTACT_LINKS,
  ANALYTICS_LINKS,
  COMPANY_LINKS,
} from './profile-links';

describe('profile-links', () => {
  const collectUrls = (obj: Record<string, string>) => Object.values(obj);
  const allLinkGroups = [SOCIAL_LINKS, DOCUMENT_LINKS, PROJECT_LINKS, BLOG_LINKS, PACKAGE_LINKS, ANALYTICS_LINKS, COMPANY_LINKS];

  it('exposes only well-formed http(s) URLs across every link group', () => {
    allLinkGroups.forEach(group => {
      collectUrls(group as Record<string, string>).forEach(url => {
        expect(url).withContext(url).toMatch(/^https?:\/\/.+/);
        expect(() => new URL(url)).withContext(url).not.toThrow();
      });
    });
  });

  it('has no empty link values', () => {
    allLinkGroups.forEach(group => {
      collectUrls(group as Record<string, string>).forEach(url => {
        expect(url.trim().length).toBeGreaterThan(0);
      });
    });
  });

  it('points social links at the expected platforms', () => {
    expect(SOCIAL_LINKS.linkedin).toContain('linkedin.com');
    expect(SOCIAL_LINKS.github).toContain('github.com');
    expect(SOCIAL_LINKS.stackOverflow).toContain('stackoverflow.com');
  });

  it('uses a valid contact email', () => {
    expect(CONTACT_LINKS.email).toMatch(/^[^@\s]+@[^@\s]+\.[^@\s]+$/);
  });

  it('keeps every company link pointing at its official domain', () => {
    expect(COMPANY_LINKS.salesforce).toContain('salesforce.com');
    expect(COMPANY_LINKS.games24x7).toContain('games24x7.com');
    expect(COMPANY_LINKS.walmart).toContain('walmart.com');
    expect(COMPANY_LINKS.extramarks).toContain('extramarks.com');
  });

  it('exposes npm/maven package pages for each open-source project', () => {
    expect(PACKAGE_LINKS.nodeActuatorLite).toContain('npmjs.com/package/node-actuator-lite');
    expect(PACKAGE_LINKS.gitHistoryUi).toContain('npmjs.com/package/git-history-ui');
    expect(PACKAGE_LINKS.eli5).toContain('sonatype.com');
  });

  it('contains no duplicate URLs within a single group', () => {
    allLinkGroups.forEach(group => {
      const urls = collectUrls(group as Record<string, string>);
      expect(new Set(urls).size).withContext(JSON.stringify(group)).toBe(urls.length);
    });
  });
});
