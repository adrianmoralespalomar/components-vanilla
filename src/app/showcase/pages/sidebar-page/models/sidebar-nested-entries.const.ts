import { AESY_ICON_FOLDER, AESY_ICON_STAR, SidebarEntry } from 'aesy-components';

/** Árbol de carpetas con varios niveles. La demo marca activo «Informe T1» y sus carpetas se abren solas. */
export const SIDEBAR_NESTED_ENTRIES: SidebarEntry[] = [
  {
    label: 'Archivos',
    items: [
      {
        label: 'Documentos',
        iconSvg: AESY_ICON_FOLDER,
        children: [
          {
            label: 'Trabajo',
            children: [
              {
                label: 'Proyectos',
                children: [
                  { id: 'informe-t1', label: 'Informe T1' },
                  { id: 'informe-t2', label: 'Informe T2' },
                  { id: 'hoja-de-ruta', label: 'Hoja de ruta' }
                ]
              },
              { id: 'facturas', label: 'Facturas' },
              { id: 'contratos', label: 'Contratos' }
            ]
          },
          {
            label: 'Personal',
            children: [
              { id: 'recetas', label: 'Recetas' },
              { id: 'viajes', label: 'Viajes' }
            ]
          }
        ]
      },
      {
        label: 'Multimedia',
        iconSvg: AESY_ICON_STAR,
        children: [
          { label: 'Fotos', children: [{ id: 'fotos-2025', label: '2025' }, { id: 'fotos-2026', label: '2026' }] },
          { id: 'videos', label: 'Vídeos' }
        ]
      }
    ]
  }
];
