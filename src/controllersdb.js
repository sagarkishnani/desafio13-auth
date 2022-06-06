import mongoose from "mongoose";

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

export default { conectarDB };
