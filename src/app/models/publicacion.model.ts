export class PublicacionModel {
    pid?:string;
    //uid es el uid del usuario que hizo la publicacion
    uid?: string;
    texto?: string;
    /*vamos a ver sobre la marcha si usamos texto y video como atributos separados o multimedia como un atributo,
    cosa que se pueda subir o foto o video y no las dos */
    foto?: string;
    video?: string;
    fecha?: string;
    //MG no se toca
    meGusta?: {
        uidMegusta:string;
    };
    //comentarios EN ESTE SPRINT NO SE TOCA (los megusta tampoco)
    comentarios?:{
        uidComentario:string,
        //nombre apellido y foto se guarda por comodidad, es redundante, pero sino estaria todo lleno de fors
        nombreComentario:string,
        apellidoComentario:string,
        fotoComentario:string,
        //
        comentario:string,
        fechaComentario:string,
    };
    //Le agrego nombre apellido y foto del que publico para no tener que hacer otro get por para saber esta data
    //es redundante pero mucho mas rapido (lo mismo que en el comentario)
    nombre?:string;
    apellido?:string;
    fotoPerfil?:string;
}