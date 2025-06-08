import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import {  ViewChild, ElementRef } from '@angular/core';
import { AnimationController } from '@ionic/angular';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RouterModule],
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {

  @ViewChild('mensajeBienvenida', { static: true }) mensajeBienvenida!: ElementRef;
    constructor(private router: Router,private animationCtrl: AnimationController) {}

registro (){
  this.router.navigate(['/registro']);
}

login() {
  this.animarBienvenida().then(() => {
    this.router.navigate(['/home']);
  });
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
      resolve(); // Termina la promesa
    });
  });
}
}
