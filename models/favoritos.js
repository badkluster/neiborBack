const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const FavoritoSchame = Schema({
  descripcion: String,
  iduser: {
    type: Schema.ObjectId,
    ref: "Usuario",
  },
  idfavorito: String,
  creado: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Favorito", FavoritoSchame);
