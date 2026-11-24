import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: '',
    renderMode: RenderMode.Prerender
  },
  {
    path: 'projects/the-human-c-suite',
    renderMode: RenderMode.Prerender
  },
  {
    path: 'projects/capydrive',
    renderMode: RenderMode.Prerender
  },
  {
    path: 'projects/hermes-synology',
    renderMode: RenderMode.Prerender
  },
  {
    path: '**',
    renderMode: RenderMode.Client
  }
];
