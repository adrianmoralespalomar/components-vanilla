import { ComponentApi } from '../../../models/component-api.interface';

export const SIDEBAR_GROUP_API: ComponentApi = {
  inputs: [{ name: 'label', type: 'string', defaultValue: "''", description: 'Título del grupo. Plegado a iconos se oculta y deja su hueco como separación.' }]
};
