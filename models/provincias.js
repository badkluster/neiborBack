const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProvinciaSchema = Schema({
  nombre: String,
  codigo: String,
  id: String,
  centroide: {
    lat: Number,
    lon: Number
  },
  pais: {
    type: Schema.ObjectId,
    ref: "Pais",
  },
});

module.exports = mongoose.model("Provincia", ProvinciaSchema);
