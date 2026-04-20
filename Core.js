class CRM_Contact {
  constructor({ name, email, phone, company, rol, relacion, ubicacion, proyectos, rowNumber }) {
    this.name = name || "Sin nombre";
    this.email = email || "Sin correo";
    this.phone = phone || "N/A";
    this.company = company || "N/A";
    this.rol = rol || "N/A";
    this.relacion = relacion || "N/A";
    this.ubicacion = ubicacion || "N/A";
    this.proyectos = proyectos || "";
    this.rowNumber = rowNumber; // Guardamos la fila (index + 1)
  }

  /**
   * Ejemplo de método de utilidad: 
   * Devuelve un resumen rápido del contacto.
   */
  getSummary() {
    return `${this.name} (${this.rol} en ${this.company})`;
  }
}

class CRM_Lead {
  constructor({ 
    oportunidad, 
    contacto, 
    correo, 
    fase, 
    valorEstimado, 
    probabilidad, 
    background, 
    propuesta, 
    rowNumber = null 
  }) {
    this.oportunidad = oportunidad || "Sin nombre de oportunidad";
    this.contacto = contacto || "N/A";
    this.correo = correo || "N/A";
    this.fase = fase || "Prospección"; // Valor por defecto
    this.valorEstimado = valorEstimado || 0;
    this.probabilidad = probabilidad || 0; // Ejemplo: 0.1 para 10%
    this.background = background || "";
    this.propuesta = propuesta || "";
    this.rowNumber = rowNumber;
  }

  /**
   * Calcula el valor ponderado (Valor estimado * Probabilidad)
   * @returns {number}
   */
  getWeightedValue() {
    return this.valorEstimado * this.probabilidad;
  }

  /**
   * Formatea la probabilidad para visualización
   * @returns {string}
   */
  getProbabiltyDisplay() {
    return `${(this.probabilidad * 100).toFixed(0)}%`;
  }
}

class CRM_Core{

    constructor( spId ){
        this.ss = SpreadsheetApp.openById( spId );
    }

    getProyectos( { email } ){
      const sheet = this.ss.getSheetByName("Proyectos");
      const data = sheet.getDataRange().getValues();
      const headers = data[0];
      

      const idx = {
        tarea: headers.indexOf("Tarea"),
        estado: headers.indexOf("Estado"),
        cliente: headers.indexOf("Cliente"),
        inicio: headers.indexOf("Fecha de Inicio"),
        entrega: headers.indexOf("Fecha de Entrega"),
        proyecto: headers.indexOf("Proyecto")
      };

      const proyectos = [];

      for (let i = 1; i < data.length; i++) {
        const row = data[i];
        if (row[idx.cliente] === email) {
          proyectos.push({
            tarea: row[idx.tarea],
            estado: row[idx.estado],
            cliente: row[idx.cliente],
            inicio: row[idx.inicio],
            entrega: row[idx.entrega],
            proyecto: row[idx.proyecto]
          });
        }
      }
      return proyectos;
    }

    getLead({ email }){
      const sheet = this.ss.getSheetByName("Leads");
      const data = sheet.getDataRange().getValues();
      const headers = data[0];


      const idx = {
        oportunidad: headers.indexOf("Oportunidad"), 
        contacto: headers.indexOf("Contacto"), 
        correo: headers.indexOf("Correo"), 
        fase: headers.indexOf("Fase"), 
        valorEstimado: headers.indexOf("Valor Estimado"), 
        probabilidad: headers.indexOf("Probabilidad"), 
        background: headers.indexOf("Background"), 
        propuesta: headers.indexOf("Propuesta"), 
      };

      for (let i = 1; i < data.length; i++) {
           const row = data[i];
            if (row[idx.correo] === email) {
               return new CRM_Lead({
                oportunidad: row[idx.oportunidad],
                contacto: row[idx.contacto],
                correo: row[idx.correo],
                fase: row[idx.fase],
                valorEstimado: row[idx.valorEstimado],
                probabilidad: row[idx.probabilidad],
                background: row[idx.background],
                propuesta: row[idx.propuesta],
                rowNumber: i + 1
              })
            }
      }
      return null;
  
    }

    updateLead( lead ){
      if (!lead.rowNumber) {
        throw new Error("No se puede actualizar: El lead no tiene un número de fila asignado.");
      }

      const sheet = this.ss.getSheetByName("Leads");
      const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];

      const updateMap = {
        "Oportunidad": lead.oportunidad,
        "Contacto": lead.contacto,
        "Correo": lead.correo,
        "Fase": lead.fase,
        "Valor Estimado": lead.valorEstimado,
        "Probabilidad": lead.probabilidad,
        "Background": lead.background,
        "Propuesta": lead.propuesta
      };

      const rowData = headers.map(header => {
        return updateMap.hasOwnProperty(header) ? updateMap[header] : "";
      });

      sheet.getRange(lead.rowNumber, 1, 1, rowData.length).setValues([rowData]);
      
      return true;
    } 

    getContact({ name, email }) {
      const sheet = this.ss.getSheetByName("Clientes");
      const data = sheet.getDataRange().getValues();
      const headers = data[0];

      // Mapeamos los índices una sola vez para mejorar el rendimiento
      const idx = {
        name: headers.indexOf("Nombre"),
        email: headers.indexOf("Correo"),
        phone: headers.indexOf("Teléfono"),
        company: headers.indexOf("Empresa"),
        rol: headers.indexOf("Rol"),
        rel: headers.indexOf("Relación"),
        loc: headers.indexOf("Ubicación"),
        proj: headers.indexOf("Proyectos")
      };

      for (let i = 1; i < data.length; i++) {
        const row = data[i];
        
        // Verificación de coincidencia
        if (row[idx.name] === name || row[idx.email] === email) {
          // Retornamos una nueva instancia de la clase Contact
          return new CRM_Contact({
            name: row[idx.name],
            email: row[idx.email],
            phone: row[idx.phone],
            company: row[idx.company],
            rol: row[idx.rol],
            relacion: row[idx.rel],
            ubicacion: row[idx.loc],
            proyectos: row[idx.proj],
            rowNumber: i + 1
          });
        }
      }
      return null;
    }

    /**
     * Actualiza los datos de un contacto existente en la hoja.
     * @param {CRM_Contact} contact Instance of CRM_Contact
     */
    updateContact(contact) {
      if (!contact.rowNumber) {
        throw new Error("No se puede actualizar: El contacto no tiene un número de fila asignado.");
      }

      const sheet = this.ss.getSheetByName("Clientes");
      const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];

      // Mapeamos los campos a sus columnas correspondientes
      const updateMap = {
        "Nombre": contact.name,
        "Correo": contact.email,
        "Teléfono": contact.phone,
        "Empresa": contact.company,
        "Rol": contact.rol,
        "Relación": contact.relacion,
        "Ubicación": contact.ubicacion,
        "Proyectos": contact.proyectos
      };

      // Creamos el array de la fila basado en los encabezados para no romper el orden
      const rowData = headers.map(header => {
        return updateMap.hasOwnProperty(header) ? updateMap[header] : "";
      });

      // Seteamos los valores en la fila específica
      // setValues recibe un array de arrays [[fila]]
      sheet.getRange(contact.rowNumber, 1, 1, rowData.length).setValues([rowData]);
      
      return true;
    }
  
}

function test(){
  const crm = new CRM_Core("15emwyfr2WGGyFCm-LmvKKBQgeEanREcHndvF0E2Q1Tw");
  const contact = crm.getContact({ name: "Lucas Figueroa" });
  const lead    = crm.getLead({ email: "lucas.trabajo.1996@gmail.com" });

  console.log( "contact", contact );
  console.log( "lead", lead );
 
}
