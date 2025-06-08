import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { OnInit } from '@angular/core';
import { ViewChild, ElementRef } from '@angular/core';
import { AnimationController } from '@ionic/angular';

@Component({
  selector: 'app-agendar-cita',
  standalone: false,
  templateUrl: 'agendar-cita.page.html',
  styleUrls: ['agendar-cita.page.scss'],
})
export class AgendarCitaPage implements OnInit {
  citaForm: FormGroup;
    @ViewChild('mensaje', { static: false }) mensaje!: ElementRef;
  mostrarMensaje = false;


  constructor(private fb: FormBuilder,private animationCtrl: AnimationController) {
    this.citaForm = this.fb.group({
      nombre: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]],
      fecha: ['', Validators.required],
      hora: ['', Validators.required],
      servicio: ['', Validators.required],
    });
  }

  ngOnInit() {}

  confirmarCita() {
    if (this.citaForm.valid) {
      const datos = this.citaForm.value;
      console.log('Cita confirmada con:', datos);

      this.mostrarMensaje = true;
      this.animarMensaje();

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
