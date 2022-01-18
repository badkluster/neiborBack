const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const NotificacionSchame = Schema({
  usuario: { type: Schema.Types.ObjectId, ref: "Usuario" },
  accion: { type: Schema.Types.ObjectId, ref: "Accion" },
  idaccion: { type: String },
  idusuario: { type: String },
  idfavorito: { type: String },
  favorito: { type: Schema.Types.ObjectId, ref: "Usuario" },
  tipo: { type: String },
  mensaje: { type: String },
  leido: { type: Boolean, default: false },
  fecha: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Notificacion", NotificacionSchame);
