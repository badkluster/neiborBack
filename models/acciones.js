const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AccionSchame = Schema({
  nombre: String,
  nombreMascota: String,
  descripcion: String,
  categoria: String,
  tipo: String,
  foto: String,
  telefono: String,
  montototal: String,
  iduser: {
    type: Schema.ObjectId,
    ref: "Usuario",
  },
  respuestas: [
    {
      creado: {
        type: Date,
        default: Date.now,
      },
      mensaje: String,
      iduser: {
        type: Schema.ObjectId,
        ref: "Usuario",
      },
      estado: Boolean,
    },
  ],
  creado: {
    type: Date,
    default: Date.now,
  },
  creadopor: String,
  modificado: Date,
  modificadopor: {
    type: Date,
    default: Date.now,
  },
  activado: Boolean,
});

module.exports = mongoose.model("Accion", AccionSchame);
