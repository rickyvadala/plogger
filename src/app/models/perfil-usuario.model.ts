export class PerfilUsuarioModel {
    key?:string;
    uid?: string;
    nombre?: string;
    apellido?: string;
    fechaNac?: string;
    sexo?: string;
    foto?: string;
    tipoInicio?: string;
    mail?:string;
    seguidores?: any[];
    seguidos?: any[];
    eventosMeInteresa?: any[];
    tipoUsuario?: string;
    descripcion?: string;
    reportados?: any[];
    admin?: boolean;
    token?: string;
    ubicacion?: string;
}

