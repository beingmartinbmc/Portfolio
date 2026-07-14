import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicationsComponent } from './publications.component';
import { COMPANY_LINKS } from '../../config/profile-links';

describe('PublicationsComponent', () => {
  let component: PublicationsComponent;
  let fixture: ComponentFixture<PublicationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PublicationsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PublicationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('open-source catalogue', () => {
    it('initialises filters with "All" first plus every distinct category', () => {
      expect(component.availableCategories[0]).toBe('All');
      const distinct = new Set(component.openSourceProjects.map(p => p.category));
      distinct.forEach(cat => expect(component.availableCategories).toContain(cat));
      expect(component.availableCategories.length).toBe(distinct.size + 1);
    });

    it('shows every project by default', () => {
      expect(component.selectedCategory).toBe('All');
      expect(component.filteredProjects.length).toBe(component.openSourceProjects.length);
    });

    it('filters projects down to a single category', () => {
      component.filterByCategory('Maven Central');
      expect(component.selectedCategory).toBe('Maven Central');
      expect(component.filteredProjects.length).toBeGreaterThan(0);
      expect(component.filteredProjects.every(p => p.category === 'Maven Central')).toBeTrue();
    });

    it('restores the full list when filtering back to "All"', () => {
      component.filterByCategory('NPM');
      component.filterByCategory('All');
      expect(component.filteredProjects.length).toBe(component.openSourceProjects.length);
    });

    it('gives every project a non-empty link, title and category', () => {
      component.openSourceProjects.forEach(p => {
        expect(p.title.trim().length).toBeGreaterThan(0);
        expect(p.link).toMatch(/^https?:\/\//);
        expect(['NPM', 'Maven Central', 'GitHub', 'PyPI']).toContain(p.category);
      });
    });

    it('has unique project ids', () => {
      const ids = component.openSourceProjects.map(p => p.id);
      expect(new Set(ids).size).toBe(ids.length);
    });
  });

  describe('On-call AI Agent quest card', () => {
    it('renders the Salesforce quest card linked to the official site', () => {
      const card: HTMLElement = fixture.nativeElement.querySelector('.salesforce-card');
      expect(card).toBeTruthy();

      const badge = card.querySelector('a.world-salesforce') as HTMLAnchorElement;
      expect(badge).toBeTruthy();
      expect(badge.getAttribute('href')).toBe(COMPANY_LINKS.salesforce);
      expect(badge.getAttribute('target')).toBe('_blank');
      expect(badge.getAttribute('rel')).toContain('noopener');
    });

    it('shows the AI-assisted incident triage quest and public-safe abilities', () => {
      const card: HTMLElement = fixture.nativeElement.querySelector('.salesforce-card');
      expect(card.textContent).toContain('AI-assisted Incident Triage');
      ['RAG', 'Tool Calling', 'Evaluation', 'Guardrails'].forEach(ability => {
        expect(card.textContent).toContain(ability);
      });
    });

    it('exposes the company links to the template', () => {
      expect(component.companyLinks).toBe(COMPANY_LINKS);
    });
  });

});
