import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController } from '@ionic/angular';
import { IonicModule } from '@ionic/angular';
import { ReactiveFormsModule } from '@angular/forms'
import { DatabaseService } from '../../services/database.service';
import { Storage } from '@ionic/storage-angular';


;
import { Router } from '@angular/router';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
    imports: [
    IonicModule,
    ReactiveFormsModule
],
})
export class RegistroPage {
  registerForm: FormGroup;

constructor(
  private fb: FormBuilder,
  private alertCtrl: AlertController,
  private router: Router,
  private dbService: DatabaseService,
  private storage: Storage
) {
  this.registerForm = this.fb.group({
    nombre: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.pattern(/^(?=.*[A-Z])(?=.*\d).{1,12}$/)]],
    rut: ['', [Validators.required, this.validarRut]],
  });

  this.initStorage(); 
}

async initStorage() {
  await this.storage.create();
}

async registrar() {
  if (this.registerForm.valid) {
    const { nombre, email, password, rut } = this.registerForm.value;

    try {
      const usuarioId = await this.dbService.agregarUsuario(nombre, email, password, rut);
      
      if (usuarioId !== null) {
        await this.storage.set('usuarioId', usuarioId);
        console.log('ID guardado en storage:', usuarioId);

        this.mostrarAlerta('Registro exitoso', 'Tu cuenta ha sido creada correctamente.');
        this.registerForm.reset();
        this.router.navigate(['/home']);
      } else {
        this.mostrarAlerta('Error', 'No se pudo obtener el ID del usuario.');
      }
    } catch (error) {
      console.error('Error al registrar:', error);
      this.mostrarAlerta('Error', 'No se pudo registrar el usuario.');
    }
  } else {
    this.mostrarAlerta('Formulario inválido', 'Por favor completa todos los campos correctamente.');
  }
}


  login() {
    this.router.navigate(['/login']);
  }

  async mostrarAlerta(header: string, message: string) {
    const alert = await this.alertCtrl.create({
      header,
      message,
      buttons: ['OK'],
    });
    await alert.present();
  }

  // Validador de RUT chileno
  validarRut(control: any) {
    const rut = control.value;
    if (!rut || !/^(\d{7,8})\-([\dkK])$/.test(rut)) return { rutInvalido: true };

    const [num, dv] = rut.split('-');
    let suma = 0, multiplo = 2;

    for (let i = num.length - 1; i >= 0; i--) {
      suma += parseInt(num[i]) * multiplo;
      multiplo = multiplo < 7 ? multiplo + 1 : 2;
    }

    const dvEsperado = 11 - (suma % 11);
    const dvCalc = dvEsperado === 11 ? '0' : dvEsperado === 10 ? 'K' : dvEsperado.toString();

    return dvCalc.toLowerCase() === dv.toLowerCase() ? null : { rutInvalido: true };
  }
}
