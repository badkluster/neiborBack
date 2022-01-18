const express = require("express");
const AccionController = require("../controllers/acciones");
const multipart = require("connect-multiparty");
const md_upload_foto = multipart({ uploadDir: "./uploads/foto" });

const api = express.Router();

api
  .route("/acciones")
  .get(AccionController.getAcciones)
  .post(AccionController.crearAccion);

api.route("/accionMood").post(AccionController.crearAccionMood);

api.route("/acciones/activo").get(AccionController.getAccionesActivas);

api.route("/acciones/fecha").get(AccionController.getAccionesPorFecha);

api.route("/acciones/tipo").get(AccionController.getAccionesTipo);

api.route("/acciones/categoria").get(AccionController.getAccionesCategoria);

api.route("/acciones/mood").get(AccionController.getAccionesporNombreyUsuario);

api
  .route("/acciones/:id")
  .get(AccionController.getAccion)

  .put(AccionController.actualizarAccion)
  .delete(AccionController.eliminarAccion);

api.route("/creadopor").get(AccionController.getAccionPorUsuario);

api.put("/foto-accion/:id", [md_upload_foto], AccionController.updateFoto);

api.get("/get-foto/:foto", AccionController.getFoto);
api.route("/respuesta-accion/:id").put(AccionController.actualizarRespuesta);
api.route("/eliminar-respuesta/:id").put(AccionController.eliminarRespuesta);

module.exports = api;
