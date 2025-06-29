import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { IonicModule, AnimationController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Storage } from '@ionic/storage-angular';
import { Router } from '@angular/router';

import { DatabaseService } from '../../services/database.service';  
@Component({
  selector: 'app-agendar-cita',
    imports: [         
    IonicModule,
    FormsModule,
    ReactiveFormsModule,
   CommonModule  ],
  templateUrl: 'agendar-cita.page.html',
  styleUrls: ['agendar-cita.page.scss'],
})
export class AgendarCitaPage implements OnInit {
  citaForm: FormGroup;
  manicuristas: any[] = [];
  @ViewChild('mensaje', { static: false }) mensaje!: ElementRef;
  mostrarMensaje = false;

constructor(
  private fb: FormBuilder,
  private animationCtrl: AnimationController,
  private dbService: DatabaseService,
  private storage: Storage,
    private router: Router,
) {
  this.citaForm = this.fb.group({
    nombre: ['', Validators.required],
    correo: ['', [Validators.required, Validators.email]],
    fecha: ['', Validators.required],
    hora: ['', Validators.required],
    servicio: ['', Validators.required],
    manicurista: ['', Validators.required],  
  });
}


  async ngOnInit() {
    this.manicuristas = await this.dbService.obtenerManicuristas();
  }

async confirmarCita() {
  if (this.citaForm.valid) {
    const datos = this.citaForm.value;
    const idUsuario = await this.storage.get('usuarioId'); 

    if (!idUsuario) {
      console.error('No se encontró usuario logueado');
      return;
    }

    try {
      await this.dbService.agendarCita(
        datos.nombre,
        datos.correo,
        datos.fecha,
        datos.hora,
        datos.servicio,
        Number(datos.manicurista),
        idUsuario 
      );

      console.log('Cita confirmada con:', datos);
      this.mostrarMensaje = true;
      this.animarMensaje();

      this.citaForm.reset();
      this.router.navigate(['/home']);

    } catch (error) {
      console.error('Error guardando la cita:', error);
    }

  } else {
    console.log('Formulario incompleto o inválido');
  }
}


  animarMensaje() {
    const animation = this.animationCtrl.create()
      .addElement(this.mensaje.nativeElement)
      .duration(5000)
      .easing('ease-in-out')
      .keyframes([
        { offset: 0, opacity: '0', transform: 'translateY(20px)' },
        { offset: 0.2, opacity: '1', transform: 'translateY(0)' },
        { offset: 0.8, opacity: '1', transform: 'translateY(0)' },
        { offset: 1, opacity: '0', transform: 'translateY(20px)' }
      ]);

    animation.play();

    animation.onFinish(() => {
      this.mostrarMensaje = false;
    });
  }
}
