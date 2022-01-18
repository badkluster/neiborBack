const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const LocalidadSchema = Schema({
  nombre: String,
  codigo: String,
  id: String,
  codigopostal: String,
  centroide: {
    lat: Number,
    lon: Number
  },
  provincia: {
    type: Schema.ObjectId,
    ref: "Provincia",
  },
});

module.exports = mongoose.model("Localidad", LocalidadSchema, "localidades");
