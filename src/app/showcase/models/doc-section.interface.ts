import { DocSectionGroup } from './doc-section-group.type';

export interface DocSection {
  group: DocSectionGroup;
  id: string;
  title: string;
}
