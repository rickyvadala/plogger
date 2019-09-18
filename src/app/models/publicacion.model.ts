export class PublicacionModel {
    pid?:string;
    //uid es el uid del usuario que hizo la publicacion
    uid?: string;
    compartidoDeUid?:string;
    compartidoNomApe?:string;
    texto?: string;
    /*vamos a ver sobre la marcha si usamos texto y video como atributos separados o multimedia como un atributo,
    cosa que se pueda subir o foto o video y no las dos */
    foto?: string;
    video?: string;
    fecha?: string;
    like?: {
    };
    comentarios?:{
    };
    //Le agrego nombre apellido y foto del que publico para no tener que hacer otro get por para saber esta data
    //es redundante pero mucho mas rapido (lo mismo que en el comentario)
    nombre?:string;
    apellido?:string;
    fotoPerfil?:string;
    evento?: {}
}