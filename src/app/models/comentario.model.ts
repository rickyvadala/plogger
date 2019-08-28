export class ComentarioModel {
    //cid es la key
    cid?:string;
    uidComentario:string;
    //nombre apellido y foto se guarda por comodidad, es redundante, pero sino estaria todo lleno de fors
    nombreComentario:string;
    apellidoComentario:string;
    fotoComentario:string;
    //
    comentario:string;
    fechaComentario:string;
};