import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-catalogo',
  templateUrl: './catalogo.page.html',
  imports: [CommonModule, IonicModule,FormsModule],
  styleUrls: ['./catalogo.page.scss'],
})
export class CatalogoPage implements OnInit {

  manicuristaId!: number;
  trabajos: any[] = [];
  nuevoComentario: string = '';
  nombreCliente: string = '';

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.manicuristaId = Number(this.route.snapshot.paramMap.get('id'));

    // Por ahora usamos datos de ejemplo
    this.trabajos = [
      {
        id: 1,
        imagenUrl: 'https://via.placeholder.com/300x200?text=Uñas+Rosas',
        fecha: '2025-06-05',
        comentarios: [
          { nombreCliente: 'Camila', mensaje: '¡Hermosas!', fechaComentario: '2025-06-06' }
        ]
      },
      {
        id: 2,
        imagenUrl: 'https://via.placeholder.com/300x200?text=Uñas+Brillantes',
        fecha: '2025-06-03',
        comentarios: []
      }
    ];
  }

  agregarComentario(trabajoId: number) {
    const trabajo = this.trabajos.find(t => t.id === trabajoId);
    if (trabajo && this.nuevoComentario.trim() && this.nombreCliente.trim()) {
      trabajo.comentarios.push({
        nombreCliente: this.nombreCliente,
        mensaje: this.nuevoComentario,
        fechaComentario: new Date().toISOString().slice(0, 10)
      });
      this.nuevoComentario = '';
      this.nombreCliente = '';
    }
  }
}
