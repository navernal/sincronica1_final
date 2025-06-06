import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  imports: [CommonModule, IonicModule],
  styleUrls: ['./perfil.page.scss'],
})

export class PerfilPage {

  constructor(private router: Router) {}
  manicuristas = [
    {
      id: 1,
      nombre: 'Camila Pérez',
      direccion: 'Av. Las Flores 123, Santo Domingo',
      telefono: '+56 9 1234 5678',
      instagram: 'https://instagram.com/camila_nails',
    },
    {
      id: 2,
      nombre: 'Fernanda Soto',
      direccion: 'Calle del Mar 456, Santo Domingo',
      telefono: '+56 9 8765 4321',
      instagram: 'https://instagram.com/fer_soto',
    },
    // Agrega más perfiles aquí
  ];

  verCatalogo(id: number) {
    // Aquí puedes usar un router para navegar a la página de catálogo filtrando por manicurista
    this.router.navigate(['/catalogo', { id }]);
  }
}


