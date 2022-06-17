import ContenedorSQL from "../../contenedores/ContenedorSQL.js";
import config from "../../config.js";

class ProductosDaoMariaDb extends ContenedorSQL {
  constructor() {
    super(config.sqlite3, config.sqlite3);
  }
}

export default ProductosDaoMariaDb;
