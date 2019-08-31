import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UsuarioPloggerService } from '../../services/usuario-plogger.service';

@Component({
  selector: 'app-profile-other',
  templateUrl: './profile-other.page.html',
  styleUrls: ['./profile-other.page.scss'],
})
export class ProfileOtherPage implements OnInit {

  nombre = 'Profile other';
  foto = '../../assets/img/default-user.png';
  cantPosts = 2;
  profileOtherUid: string;  

  constructor( public route: ActivatedRoute,
              private usuarioService: UsuarioPloggerService,
              public router: Router ) {
    this.profileOtherUid = this.route.snapshot.params['id'];
  }

  ngOnInit() {
    this.getProfileOther();
  }

  getProfileOther() {
    this.usuarioService.obtenerPerfiles().subscribe(profiles => {
      let profileOther = profiles.filter(prof => prof.uid == this.profileOtherUid);
      let nombre = profileOther[0].nombre;
      let apellido = profileOther[0].apellido;
      this.nombre = nombre.concat(' ').concat(apellido);
      this.foto = profileOther[0].foto;
    })

  }

}
