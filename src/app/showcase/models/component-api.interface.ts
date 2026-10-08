import { ApiProperty } from './api-property.interface';
import { ApiTypeDoc } from './api-type-doc.interface';

export interface ComponentApi {
  inputs?: ApiProperty[];
  models?: ApiProperty[];
  outputs?: ApiProperty[];
  types?: ApiTypeDoc[];
}
