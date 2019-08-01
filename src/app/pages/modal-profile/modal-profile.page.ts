import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { PerfilUsuarioModel } from 'src/app/models/perfil-usuario.model';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-modal-profile',
  templateUrl: './modal-profile.page.html',
  styleUrls: ['./modal-profile.page.scss'],
})
export class ModalProfilePage implements OnInit {

  usuario: PerfilUsuarioModel = {
    id: '',
    nombre: '',
    apellido: '',
    fechaNac: '',
    sexo: '',
    foto: '',
    tipoInicio: ''
  };


  constructor(private modalCtrl: ModalController) { }

  ngOnInit() {
  }

  volver() {
    this.modalCtrl.dismiss();
  }

    cambioFecha(event) {
    console.log('ionChange', event);
    console.log('Date', new Date(event.detail.value));
  }

  onSubmitTemplate(form: NgForm) {


  }



}
