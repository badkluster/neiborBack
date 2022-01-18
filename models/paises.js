const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PaisSchema = Schema({
  nombre: String,
  codigo: String,
});

module.exports = mongoose.model("Pais", PaisSchema, "paises");
