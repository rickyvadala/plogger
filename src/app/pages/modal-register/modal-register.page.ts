import { Component, OnInit } from '@angular/core';
import { ModalController, AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { UsuarioPloggerModel } from '../../models/usuario-plogger.model';
import { NgForm } from '@angular/forms';
import { UsuarioPloggerService } from 'src/app/services/usuario-plogger.service';
import { TerminosCondicionesPage } from '../terminos-condiciones/terminos-condiciones.page';
import { FCM } from '@ionic-native/fcm/ngx';
import { ComboUbicacionService } from '../../services/combo-ubicacion.service';

@Component({
  selector: 'app-modal-register',
  templateUrl: './modal-register.page.html',
  styleUrls: ['./modal-register.page.scss'],
})
export class ModalRegisterPage implements OnInit {

  usuario: UsuarioPloggerModel;

  contValidas = false;
  tipoUsuario;
  esPersona= true;;
  requiredTipoUsu = false;
  requiredCheckBox = false;
  token:string;
  constructor(private modalCtrl: ModalController,
              private router: Router,
              private authPlogger: UsuarioPloggerService,
              public alertCtrl: AlertController,
              public FCM: FCM,
              public comboUbicacionService: ComboUbicacionService ) { }



  async registroCorrecto() {
      const alert = await this.alertCtrl.create({
        header: 'Usuario registrado',
        subHeader: 'Bienvenido a plogger!',
        message: 'Entre todos podemos salvar el planeta!',
        buttons: [
          {
            text: 'Ok',
            handler: (blah) => {
              this.comboUbicacionService.provinciaSeleccionada = null;

            }
          }
        ]
      });
      await alert.present();
    }

    async registroIncorrecto(error) {
      if (error===400) {
        const alert = await this.alertCtrl.create({
          header: 'Error',
          subHeader: 'Email ya registrado',
          message: 'Si ya tiene cuenta inicie sesion o intente con otro mail',
          buttons: [
            {
              text: 'Ok',
              handler: (blah) => {
  
              }
            }
          ]
        });
        await alert.present();
      } else {
        const alert = await this.alertCtrl.create({
          header: 'Error',
          subHeader: 'No tiene conexion a internet',
          message: 'Verifique su conexion e intente nuevamente',
          buttons: [
            {
              text: 'Ok',
              handler: (blah) => {
              }
            }
          ]
        });
        await alert.present();

      }

    }


  ngOnInit() {
    this.usuario = new UsuarioPloggerModel();
  }

  volver() {
    this.modalCtrl.dismiss();
  }

  onSubmitTemplate(form: NgForm) {

    if ( form.invalid ) { return; }
    this.FCM.getToken().then(token => {
      this.token = token
    })

    this.usuario.ubicacion = this.comboUbicacionService.provinciaSeleccionada;

    this.authPlogger.nuevoUsuarioPlogger(this.usuario)
    .subscribe( (resp: any) => {
      let mail = this.usuario.email;
      const usr = {
        uid: resp.localId,
        nombre: mail.slice(0, mail.indexOf('@')),
        apellido: '',
        fechaNac: '',
        ubicacion: this.usuario.ubicacion,
        sexo: 'p',
        foto: '../../../assets/img/default-user.png',
        tipoInicio: 'p',
        tipoUsuario: this.tipoUsuario,
        mail: mail,
        admin: false,
        token: this.token
      };
      this.authPlogger.crearPerfil(usr)
      .subscribe();



      this.registroCorrecto();
      this.modalCtrl.dismiss();
      this.router.navigate(['/tabs']);
    }, (err) => {
      this.registroIncorrecto(err.status);
    });
  }

  validarContrasena(pass1, pass2) {
    if ( pass1 === pass2 ) {
      this.contValidas = true;
    } else {
      this.contValidas = false;
    }
  }

  crearNombreFromEmail (mail){

  }

  optionSelect(event){
    this.tipoUsuario = event.target.value;
    if (this.tipoUsuario !== "") {
      this.requiredTipoUsu = true;
    }
  }

  isSelect(event){
    this.requiredCheckBox = event.detail.checked;
  }

  goToTerminosCond(){
    this.presentModal();
  }

  async presentModal() {
    const modal = await this.modalCtrl.create({
      component: TerminosCondicionesPage
    });
    return await modal.present();
  }

}
