import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UsuarioPloggerService } from '../../services/usuario-plogger.service';
import { PerfilUsuarioModel } from '../../models/perfil-usuario.model';
import { EventService } from 'src/app/services/event.service';
import { AlertController } from '@ionic/angular';
import { DataShareService } from 'src/app/services/data-share.service';
import { FollowService } from 'src/app/services/follow.service';

@Component({
  selector: 'app-invitar-amigos',
  templateUrl: './invitar-amigos.page.html',
  styleUrls: ['./invitar-amigos.page.scss'],
})
export class InvitarAmigosPage implements OnInit {

  eid: string;
  usuarios: any[] = [];

  usuariosNoInvitados: PerfilUsuarioModel[] = [];

  listaInvitados: string[] = [];
  nuevaSeleccionInvitados: string[] = [];

  masterSelected:boolean;
  checklist:any;
  checkedList:any =[];
  usuario:PerfilUsuarioModel={};
  mostrarSelect =false;
  usuariosInvitados:any [] = [];
 


  constructor( private route: ActivatedRoute, private usuarioPlogger: UsuarioPloggerService, 
              private eventoService: EventService, private alertCtrl: AlertController, private router: Router,
              private dataShare: DataShareService,private followService: FollowService) { }

  ngOnInit() {
    this.dataShare.currentUser.subscribe( usuario => this.usuario = usuario);

   this.eid = this.route.snapshot.params['id'];
  }

  

  invitarSeguidores(){
    this.followService.getUserOfData(this.usuario.seguidores).subscribe( resp => {
      this.usuarios = resp;
      this.mostrarSelect = true;
      this.usuariosInvitados = resp;
     });

  }

  invitarSeguidos(){
    this.followService.getUserOfData(this.usuario.seguidos).subscribe( resp => {
      this.usuarios = resp;      
      this.mostrarSelect = true;
      this.usuariosInvitados = resp;

     });
  }

  invitarTodos(){
    this.obtenerInvitados();
  }
  
  obtenerInvitados() {
    this.eventoService.obtenerInvitados(this.eid).subscribe((resp: any[]) => {
      this.listaInvitados = resp;
      this.mostrarSelect = true;
      if(this.listaInvitados) {
         this.obtenerUsuarios(true);
      } else {
        this.obtenerUsuarios(false);
      }
    });
  }

  obtenerUsuarios(hayInvitados: boolean) {
    if (hayInvitados) {
      this.usuarioPlogger.obtenerPerfiles().subscribe(resp => {
        
        let usuariostemp = resp;
        usuariostemp.forEach((us, index) => {
          this.listaInvitados.forEach(i => {
            if(us.key === i) {
              usuariostemp.splice(index, 1);
              return;
            }
    
          });
    
        });
        this.usuarios = usuariostemp;
        this.usuariosInvitados = this.listaInvitados;
        });

    } else {
      this.usuarioPlogger.obtenerPerfiles().subscribe(resp => {
  
       this.usuarios = resp;
       this.usuariosInvitados = resp;
        });
    
    }
    
    }

    onChange(event, us) {
      let check = event.detail.checked;
      if(check) {
        this.nuevaSeleccionInvitados.push(us.key);
      } else {
        this.nuevaSeleccionInvitados.forEach((invitado, index) => {
            if(invitado == us.key) {
              this.nuevaSeleccionInvitados.splice(index, 1);
            }
        });
      }

    }

    checkUncheckAll() {
      for (var i = 0; i < this.usuarios.length; i++) {
        this.usuarios[i].isSelect = this.masterSelected;
      }
      this.getCheckedItemList();
    }
    isAllSelected() {
      this.masterSelected = this.usuarios.every(function(item:any) {
          return item.isSelect == true;
        })
      this.getCheckedItemList();
    }
  
    getCheckedItemList(){
      
      for (var i = 0; i < this.usuarios.length; i++) {
        if(this.usuarios[i].isSelect)
        this.checkedList.push(this.usuarios[i].key);
      }
    }
   

    invitarAmigos() {
      if (this.checkedList.length > 0)  {
        this.eventoService.agregarInvitados(this.eid, this.checkedList).subscribe(resp => {
          this.amigosInvitados();
        });
      }else {
        this.eventoService.agregarInvitados(this.eid, this.nuevaSeleccionInvitados).subscribe(resp => {
          this.amigosInvitados();
          console.log(this.usuarios);
        });
      }
      
    }

    async amigosInvitados() {
      const alert = await this.alertCtrl.create({
        header: 'Usted ha invitado exitosamente a sus amigos!',
        buttons: [
          {
            text: 'Ok',
            handler: (blah) => {
              this.router.navigate([`/event/${this.eid}`]);
  
            }
          }
        ]
      });
      await alert.present();
    }
}
