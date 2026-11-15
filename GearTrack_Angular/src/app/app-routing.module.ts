import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Home } from './home/home.component';
import { GearList } from './gear-list/gear-list.component';
import { GearDetail } from './gear-detail/gear-detail.component';
import { GearForm } from './gear-form/gear-form.component';
import { GearDelete } from './gear-delete/gear-delete.component';
const routes: Routes = [
  { path: '', component: Home },
  { path: 'gear', component: GearList },
  { path: 'gear/new', component: GearForm },
  { path: 'gear/:id/edit', component: GearForm },
  { path: 'gear/:id/delete', component: GearDelete },
  { path: 'gear/:id', component: GearDetail },
  { path: '**', redirectTo: '' }
];
@NgModule({ imports: [RouterModule.forRoot(routes)], exports: [RouterModule] })
export class AppRoutingModule {}
