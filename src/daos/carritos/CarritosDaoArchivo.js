import ContenedorArchivo from "../../contenedores/ContenedorArchivo.js";

class CarritosDaoArchivo extends ContenedorArchivo {
  constructor() {
    super("DB/carritos.json");
  }

  async desconectar() {}
}

export default CarritosDaoArchivo;
