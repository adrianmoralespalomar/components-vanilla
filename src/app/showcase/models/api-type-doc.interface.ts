import { ApiProperty } from './api-property.interface';

export interface ApiTypeDoc {
  name: string;
  properties: ApiProperty[];
}
