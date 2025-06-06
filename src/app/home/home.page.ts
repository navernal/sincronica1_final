import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage {

  constructor(private router: Router) {}

    agendarCita() {
    // Aquí puedes agregar validaciones en el futuro si quieres
    this.router.navigate(['/agendar-cita']);
  }

      perfil() {
    // Aquí puedes agregar validaciones en el futuro si quieres
    this.router.navigate(['/perfil']);
  }

}
