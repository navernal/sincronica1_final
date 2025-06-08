import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AgendarCitaPage } from './agendar-cita.page';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
const routes: Routes = [
  {
    path: '',
    component: AgendarCitaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes), ReactiveFormsModule,
    FormsModule,],
  exports: [RouterModule],
})
export class AgendarCitaPageRoutingModule {}
