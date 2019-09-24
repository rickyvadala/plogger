export class MensajeModel {
    id?: string;
    nombre: string;
    apellido: string;
    mensaje: string;
    fecha?: string;
    uidUsuarioLogueado: string;
    uidUsuarioDestinatario: string;
    foto?: string;
    ultimoMensaje?: string
}
