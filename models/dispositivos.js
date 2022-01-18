const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const dispositivoSchame = Schema({
  appBuild: String,
  appVersion: String,
  batteryLevel: Number,
  isCharging: Boolean,
  isVirtual: Boolean,
  manufacturer: String,
  model: String,
  operatingSystem: String,
  osVersion: String,
  platform: String,
  uniqueid: {
    type: String,
  },
  userid: {
    type: Schema.ObjectId,
    ref: "Usuario",
  },
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
});

module.exports = mongoose.model("Dispositivo", dispositivoSchame);
