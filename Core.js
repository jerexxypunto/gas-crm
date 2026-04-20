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

class CRM_Core{

    constructor( spId ){
        this.ss = SpreadsheetApp.openById( spId );
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

  contact.company = 'Gorilla Grass';
  crm.updateContact( contact );
 
}
