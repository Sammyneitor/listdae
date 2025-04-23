function enviarCorreo() {
    const destinatario = "vscs20112000@gmail.com"; // Cambia esto por la dirección de correo del destinatario
    const asunto = "Aquí tienes el archivo adjunto";
    const cuerpo = "Hola,\n\nAdjunto un archivo que quería compartir contigo.\n\nSaludos.";
    
    // Usa mailto para abrir el cliente de correo
    window.location.href = `mailto:${destinatario}?subject=${encodeURIComponent(asunto)}&body=${encodeURIComponent(cuerpo)}`;
}