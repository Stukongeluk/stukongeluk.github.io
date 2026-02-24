import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { CapyDriveDetailComponent } from './projects/capy-drive-detail/capy-drive-detail.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'projects/capydrive', component: CapyDriveDetailComponent },
    { path: '**', redirectTo: '' }
];
