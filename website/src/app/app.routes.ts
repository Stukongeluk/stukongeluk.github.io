import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { CapyDriveDetailComponent } from './projects/capy-drive-detail/capy-drive-detail.component';
import { HermesSynologyDetailComponent } from './projects/hermes-synology-detail/hermes-synology-detail.component';
import { ConventionComponent } from './convention/convention.component';

export const routes: Routes = [
    {
        path: '',
        component: HomeComponent
    },
    {
        path: 'projects/capydrive',
        component: CapyDriveDetailComponent
    },
    {
        path: 'projects/hermes-synology',
        component: HermesSynologyDetailComponent
    },
    {
        path: 'convention',
        component: ConventionComponent
    },
    {
        path: '**',
        redirectTo: ''
    }
];
