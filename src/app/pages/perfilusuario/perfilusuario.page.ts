import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { DatabaseService } from '../../services/database.service';
import { Storage } from '@ionic/storage-angular';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-perfilusuario',
  imports: [IonicModule, CommonModule],
  templateUrl: './perfilusuario.page.html',
  styleUrls: ['./perfilusuario.page.scss'],
})

export class PerfilusuarioPage implements OnInit {
  usuario: any = null;
  citas: any[] = [];

  constructor(
    private router: Router,
    private dbService: DatabaseService,
    private storage: Storage
  ) {}

  async ngOnInit() {
    await this.storage.create();
    const usuarioId = await this.storage.get('usuarioId');

    if (usuarioId) {
      this.usuario = await this.dbService.obtenerUsuarioPorId(usuarioId);
      this.citas = await this.dbService.obtenerCitasPorUsuario(usuarioId);
    } else {
      console.log('No hay usuarioId en storage');
    }
  }
}
