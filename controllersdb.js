const mongoose = require("mongoose");

let baseDeDatosConectada = false;

function conectarDB(url, callback) {
  mongoose.connect(
    url,
    { useNewUrlParser: true, useUnifiedTopology: true },
    (error) => {
      if (!error) {
        baseDeDatosConectada = true;
      }
      if (callback != null) {
        callback(error);
      }
    }
  );
}

module.exports = {
  conectarDB,
};
