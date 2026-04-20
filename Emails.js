class CRM_Email {

  /**
   * Busca todos los correos electrónicos de un remitente específico.
   * * @param {string} emailParam - La dirección de correo electrónico a buscar.
   * @return {Array} Lista de objetos con los detalles de los correos encontrados.
   */
  obtenerCorreosPorRemitente(emailParam) {
    // Construimos la consulta de búsqueda (ejemplo: "from:ejemplo@dominio.com")
    const query = "from:" + emailParam;
    
    // Buscamos los hilos de conversación que coincidan
    const hilos = GmailApp.search(query);
    const listaCorreos = [];
    
    hilos.forEach(hilo => {
      const mensajes = hilo.getMessages();
      
      mensajes.forEach(mensaje => {
        // Verificamos que el remitente coincida exactamente (opcional, para mayor precisión)
        if (mensaje.getFrom().includes(emailParam)) {
          listaCorreos.push({
            fecha: mensaje.getDate(),
            asunto: mensaje.getSubject(),
            id: mensaje.getId(),
            enlace: "https://mail.google.com/mail/u/0/#inbox/" + mensaje.getId(),
            contenido: mensaje.getPlainBody(),
          });
        }
      });
    });
    
    // Log para verificar resultados en el editor
    console.log("Se encontraron " + listaCorreos.length + " correos de: " + emailParam);
    return listaCorreos;
  }
}

/**
 * Función de prueba para ejecutar en el editor.
 */
function ejecutarBusqueda() {
  const emailABuscar = "catherine.embry@gmail.com"; // Cambia esto por el correo real
  const resultados = new CRM_EMAIL().obtenerCorreosPorRemitente(emailABuscar);
  
  // Ejemplo de cómo visualizar los resultados
  resultados.forEach(res => {
    console.log("[" + res.fecha + "] " + res.asunto);
  });
}