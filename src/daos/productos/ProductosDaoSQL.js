import ContenedorSQL from "../../contenedores/ContenedorSQL.js";
import config from "../../config.js";

class ProductosDaoSQLite3 {
  constructor(configCarritos, configProductos) {
    this.carritos = new ContenedorSQL(configCarritos, "carritos");
    this.productosEnCarritos = new ContenedorSQL(
      configProductos,
      "productosEnCarritos"
    );
  }
}

export default ProductosDaoSQLite3;
