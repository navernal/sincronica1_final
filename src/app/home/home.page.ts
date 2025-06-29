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
    this.router.navigate(['/agendar-cita']);
  }

      perfil() {
    this.router.navigate(['/perfil']);
  }

  perfilUsuario() {
    this.router.navigate(['/perfilusuario']);
  }

}
