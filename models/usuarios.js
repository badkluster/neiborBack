const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UsuarioSchame = Schema({
  nombre: String,
  mood: String,
  avatar: String,
  descripcion: String,
  foto: String,
  telefono: String,
  calle: String,
  numero: Number,
  pisoDepartamento: String,
  calle: String,
  codigopostal: Number,
  localidad: String,
  // {
  //   type: Schema.ObjectId,
  //   ref: "Localidad",
  // },
  provincia: {
    type: Schema.ObjectId,
    ref: "Provincia",
  },
  geoposicion: {
    longitud: { type: Number },
    latitud: { type: Number },
    radio: { type: Number },
  },
  pais: {
    type: Schema.ObjectId,
    ref: "Pais",
  },
  facebook: String,
  instagram: String,
  tiktok: String,
  twitter: String,
  email: {
    type: String,
    unique: true,
  },
  token: String,
  tokenexpiration: String,
  loginid: String,
  perfilcompleto: Boolean,
  ultimaAccion: {
    type: Schema.ObjectId,
    ref: "Accion",
  },
  favoritos: [
    {
      creado: {
        type: Date,
        default: Date.now,
      },
      idUsuarioFavorito: {
        type: Schema.ObjectId,
        ref: "Usuario",
      },
      identidadFavorito: String,
      idUserFavorito: String,
    },
  ],
  seguridad: Boolean,
  creado: {
    type: Date,
    default: Date.now,
  },
  creadopor: {
    type: Schema.ObjectId,
    ref: "Usuario",
  },
  modificado: Date,
  modificadopor: {
    type: Schema.ObjectId,
    ref: "Usuario",
  },
  dispositivo: {
    type: Schema.ObjectId,
    ref: "Dispositivo",
  },
});

UsuarioSchame.index({
  geoposicion: "2dsphere",
});

module.exports = mongoose.model("Usuario", UsuarioSchame);
