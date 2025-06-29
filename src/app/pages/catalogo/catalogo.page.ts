import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { DatabaseService } from '../../services/database.service';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-catalogo',
      imports: [         
    IonicModule,
    FormsModule,
    ReactiveFormsModule,
   CommonModule  ],
  templateUrl: './catalogo.page.html',
  styleUrls: ['./catalogo.page.scss']
})
export class CatalogoPage implements OnInit {

  manicuristaId!: number;
  trabajos: any[] = [];
comentariosTemporales: { [key: number]: { nombreCliente: string; nuevoComentario: string } } = {};

  constructor(private route: ActivatedRoute, private dbService: DatabaseService) {}

async ngOnInit() {
  this.manicuristaId = Number(this.route.snapshot.paramMap.get('id'));

  this.trabajos = [
    {
      id: 1,
      imagenUrl: 'https://i.pinimg.com/736x/1c/8e/73/1c8e73ee461539f274a974a0ddac293b.jpg',
      fecha: '2025-06-05',
      comentarios: []
    },
    {
      id: 2,
      imagenUrl: 'https://i.pinimg.com/736x/1c/8e/73/1c8e73ee461539f274a974a0ddac293b.jpg',
      fecha: '2025-06-03',
      comentarios: []
    }
  ];

  for (let trabajo of this.trabajos) {
    trabajo.comentarios = await this.dbService.obtenerComentariosPorCatalogo(trabajo.id);
    this.comentariosTemporales[trabajo.id] = {
      nombreCliente: '',
      nuevoComentario: ''
    };
  }
}


async agregarComentario(trabajoId: number) {
  const temp = this.comentariosTemporales[trabajoId];

  if (temp?.nombreCliente.trim() && temp?.nuevoComentario.trim()) {
    const fecha = new Date().toISOString().slice(0, 10);

    await this.dbService.agregarComentario(trabajoId, temp.nombreCliente, temp.nuevoComentario, fecha);

    const trabajo = this.trabajos.find(t => t.id === trabajoId);
    if (trabajo) {
      trabajo.comentarios = await this.dbService.obtenerComentariosPorCatalogo(trabajoId);
    }

    this.comentariosTemporales[trabajoId] = {
      nombreCliente: '',
      nuevoComentario: ''
    };
  }
}


  trackByIndex(index: number, item: any): any {
    return index;
  }
}
