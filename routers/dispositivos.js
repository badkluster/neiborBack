const express = require("express");
const DispositivoController = require("../controllers/dispositivos");

const api = express.Router();

api
  .route("/dispositivos")
  .get(DispositivoController.getDispositivos)
  .post(DispositivoController.crearDispositivo);

api
  .route("/dispositivos/:id")
  .get(DispositivoController.getDispositivo)
  .put(DispositivoController.actualizarDispositivo)
  .delete(DispositivoController.eliminarDispositivo);

api
  .route("/dispositivos/:iduser")
  .get(DispositivoController.getDispositivoPorUsuario);

module.exports = api;
