import { Injectable, signal } from '@angular/core';
import { DocSection } from '../models/doc-section.interface';
import { RegisteredDocSection } from '../models/registered-doc-section.interface';

/**
 * Índice de la página de documentación actual. Cada `app-doc-section` se registra al crearse,
 * así la barra lateral muestra sus apartados sin mantener una lista a mano.
 */
@Injectable({ providedIn: 'root' })
export class DocTocService {
  readonly activeSectionId = signal<string | null>(null);
  readonly sections = signal<DocSection[]>([]);

  private readonly registeredSections: RegisteredDocSection[] = [];
  private readonly visibleSectionIds = new Set<string>();
  private readonly sectionsObserver: IntersectionObserver = new IntersectionObserver(entries => this.onSectionsIntersectionChanged(entries), { rootMargin: '-10% 0px -60% 0px' });

  register(section: DocSection, element: HTMLElement): void {
    this.registeredSections.push({ element, section });
    this.registeredSections.sort((sectionA, sectionB) => (sectionA.element.compareDocumentPosition(sectionB.element) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1));
    this.sectionsObserver.observe(element);
    this.publishSections();
  }

  unregister(element: HTMLElement): void {
    const registeredIndex = this.registeredSections.findIndex(registered => registered.element === element);
    if (registeredIndex === -1) return;

    const [{ section }] = this.registeredSections.splice(registeredIndex, 1);
    this.sectionsObserver.unobserve(element);
    this.visibleSectionIds.delete(section.id);
    if (this.activeSectionId() === section.id) this.activeSectionId.set(null);
    this.publishSections();
  }

  private onSectionsIntersectionChanged(entries: IntersectionObserverEntry[]): void {
    entries.forEach(entry => (entry.isIntersecting ? this.visibleSectionIds.add(entry.target.id) : this.visibleSectionIds.delete(entry.target.id)));
    const firstVisibleSection = this.registeredSections.find(registered => this.visibleSectionIds.has(registered.section.id));
    if (firstVisibleSection) this.activeSectionId.set(firstVisibleSection.section.id);
  }

  private publishSections(): void {
    this.sections.set(this.registeredSections.map(registered => registered.section));
  }
}
