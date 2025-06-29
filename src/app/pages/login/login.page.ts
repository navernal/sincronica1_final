import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';

import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import {  ViewChild, ElementRef } from '@angular/core';
import { AnimationController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
import { DatabaseService } from '../../services/database.service';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [IonicModule, FormsModule, RouterModule],
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {

  @ViewChild('mensajeBienvenida', { static: true }) mensajeBienvenida!: ElementRef;
    correo: string = '';
  password: string = '';
    constructor(private router: Router,private animationCtrl: AnimationController,
      private storage: Storage,private dbService: DatabaseService) {}

registro (){
  this.router.navigate(['/registro']);
}

async login() {
  if (!this.correo || !this.password) {
    alert('Por favor ingresa correo y contraseña');
    return;
  }

  try {
    const usuario = await this.dbService.validarUsuario(this.correo, this.password);
    if (usuario) {
      await this.storage.set('usuarioId', usuario.id);

      await this.animarBienvenida();

      this.router.navigate(['/home']);
    } else {
      alert('Correo o contraseña incorrectos');
    }
  } catch (error) {
    console.error('Error validando usuario:', error);
    alert('Error en el proceso de login');
  }
}


  animarBienvenida(): Promise<void> {
  return new Promise((resolve) => {
    const animation = this.animationCtrl.create()
      .addElement(this.mensajeBienvenida.nativeElement)
      .duration(3000) 
      .easing('ease-in-out')
      .keyframes([
        { offset: 0, opacity: '0', transform: 'scale(0.8) translateY(20px)' },
        { offset: 0.2, opacity: '1', transform: 'scale(1.05) translateY(0)' },
        { offset: 0.6, opacity: '1', transform: 'scale(1) translateY(0)' },
        { offset: 1, opacity: '0', transform: 'scale(0.95) translateY(-10px)' }
      ]);

    this.mensajeBienvenida.nativeElement.classList.remove('oculto');

    animation.play();

    animation.onFinish(() => {
      this.mensajeBienvenida.nativeElement.classList.add('oculto');
      resolve(); 
    });
  });
}
}
