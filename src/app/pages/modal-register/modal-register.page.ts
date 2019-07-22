import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-modal-register',
  templateUrl: './modal-register.page.html',
  styleUrls: ['./modal-register.page.scss'],
})
export class ModalRegisterPage implements OnInit {

  usuario = {
    email: '',
    password: '',
    nombre: '',
    apellido: '',
    fechaNac: new Date()
  };

  constructor(private modalCtrl: ModalController,
              private router: Router) { }

  ngOnInit() {
  }

  volver() {
    this.modalCtrl.dismiss();
  }

  onSubmitTemplate() {
    this.router.navigate(['/tabs']);
    setTimeout(() => {
      this.volver();
    }, 250);
    console.log('Form Submit');
    console.log(this.usuario);
  }

  cambioFecha(event) {
    console.log('ionChange', event);
    console.log('Date', new Date(event.detail.value));

  }

}
