import { Component } from '@angular/core';

import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { DatabaseService } from '../../services/database.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  imports: [IonicModule,CommonModule],
  styleUrls: ['./perfil.page.scss'],
})

export class PerfilPage {

  constructor(private router: Router, private dbService: DatabaseService) {}
  manicuristas: any[] = [];

    async ngOnInit() {
        await this.dbService.initializeDatabase(); 
      const existentes = await this.dbService.obtenerManicuristas();

  if (existentes.length === 0) {
    await this.dbService.agregarManicurista('Camila Pérez', 'Av. Las Flores 123, Santo Domingo', '+56 9 1234 5678', 'https://instagram.com/camila_nails');
    await this.dbService.agregarManicurista('Fernanda Soto', 'Calle del Mar 456, Santo Domingo', '+56 9 8765 4321', 'https://instagram.com/fer_soto');
  }

  await this.cargarManicuristas();
  }

    async cargarManicuristas() {
    try {
      this.manicuristas = await this.dbService.obtenerManicuristas();
    } catch (error) {
      console.error('Error al cargar manicuristas:', error);
    }
  }

  trackById(index: number, item: any): number {
  return item.id;
}

  verCatalogo(id: number) {
    this.router.navigate(['/catalogo', { id }]);
  }
}


