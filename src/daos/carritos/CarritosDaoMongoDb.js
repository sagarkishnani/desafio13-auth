import ContenedorMongoDb from "../../contenedores/ContenedorMongoDb.js";

class CarritosDaoMongoDb extends ContenedorMongoDb {
  async guardar(carrito = { productos: [] }) {
    return super.guardar(carrito);
  }
}

export default CarritosDaoMongoDb;
