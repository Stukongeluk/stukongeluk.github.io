import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';

export const routes: Routes = [
    {
        path: '',
        component: HomeComponent
    },
    {
        path: 'projects/capydrive',
        loadComponent: () => import('./projects/capy-drive-detail/capy-drive-detail.component')
            .then(m => m.CapyDriveDetailComponent)
    },
    {
        path: 'projects/hermes-synology',
        loadComponent: () => import('./projects/hermes-synology-detail/hermes-synology-detail.component')
            .then(m => m.HermesSynologyDetailComponent)
    },
    {
        path: 'projects/the-human-c-suite',
        loadComponent: () => import('./projects/the-human-c-suite-detail/the-human-c-suite-detail.component')
            .then(m => m.TheHumanCSuiteDetailComponent)
    },
    {
        path: '**',
        redirectTo: ''
    }
];
