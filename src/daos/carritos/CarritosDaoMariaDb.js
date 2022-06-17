import CarritosDaoSQL from "./CarritosDaoSQL.js";
import config from "../../config.js";

class CarritosDaoMariaDb extends CarritosDaoSQL {
  constructor() {
    super(config.sqlite3, config.sqlite3);
  }
}

export default CarritosDaoMariaDb;
