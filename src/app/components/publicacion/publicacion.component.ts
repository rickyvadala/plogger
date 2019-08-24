import { Component, OnInit, OnDestroy, HostListener, AfterContentInit, AfterContentChecked, AfterViewInit, AfterViewChecked } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { PopPublicacionSettingsComponent } from '../pop-publicacion-settings/pop-publicacion-settings.component';
import { PublicacionesService } from 'src/app/services/publicaciones.service';
import { CookieService } from 'ngx-cookie-service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-publicacion',
  templateUrl: './publicacion.component.html',
  styleUrls: ['./publicacion.component.scss'],
})
export class PublicacionComponent implements OnInit, AfterViewChecked {

  private suscripcion: Subscription;

  foto = "../../../assets/img/default-user.png";
  nombre = "Nombre Harcodeado";
  imagenPublicacion = "../../../assets/shapes.svg";
  publicaciones:any[]=[];
  uid:string;

  constructor(private popoverCtrl: PopoverController,
              private publicacionService:PublicacionesService,
              private cookies: CookieService) { 

              }



  ngOnInit() {
    // Ubicacion te dice si estas en perfil o en home, porque aunque es el mismo componente app-publicacion,
    // cada uno se carga con distinto metodo, cargarPublicacionesPerfil() y otro cargarPublicacionesHome()
    console.log(this.uid);
    var x = window.location.href;
    var ubicacion = x.substring(x.lastIndexOf('/') + 1);
    if (ubicacion==='profile') {
      this.cargarPublicacionesPerfil();
      return;
    } 
    if (ubicacion==='home') {
      this.publicaciones=[];
      this.cargarPublicacionesHome();
      return;
    } else {
      return;
    }
  }

ngAfterViewChecked(): void {
  //Called after every check of the component's view. Applies to components only.
  //Add 'implements AfterViewChecked' to the class.
  this.uid=this.cookies.get('UID');
}
  

  cargarPublicacionesPerfil(){
    let UID=this.cookies.get('UID');

    this.suscripcion=this.publicacionService.obtenerPublicacionesPerfil(UID)
    .subscribe(resp => {
      console.log(resp)
      this.publicaciones = resp;
      }  
    );   
  }

  cargarPublicacionesHome(){
    this.suscripcion=this.publicacionService.obtenerPublicacionesHome()
    .subscribe(resp => {
      console.log(resp)
      this.publicaciones = resp;
      }  
    );  
  }

  async mostrarPop(evento) {
    const popover = await this.popoverCtrl.create({
      component: PopPublicacionSettingsComponent,
      event: evento,
      mode: 'ios'
    });
    await popover.present();
  }



  meGusta(){

  }

  comentar(){

  }

  confirmarComentario() {

  }

  compartir() {

  }

}
