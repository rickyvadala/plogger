import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Router } from '@angular/router';
import { timeout } from 'q';


@Component({
  selector: 'app-modal-login',
  templateUrl: './modal-login.page.html',
  styleUrls: ['./modal-login.page.scss'],
})
export class ModalLoginPage implements OnInit {

  usuario = {
    email: '',
    password: ''
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
}
