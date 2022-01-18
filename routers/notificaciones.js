const express = require("express");
const notificacionController = require("../controllers/notificaciones");

const api = express.Router();

api
  .route("/notificaciones")
  .get(notificacionController.getNotificaciones)
  .post(notificacionController.crearNotificacion);
// .delete(notificacionController.eliminarNotificaciones);

api
  .route("/notificaciones/:id")
  .get(notificacionController.getNotificacion)
  .put(notificacionController.actualizarNotificacion)
  .delete(notificacionController.eliminarNotificacion);

api
  .route("/eliminar-notificaciones/:id")
  .delete(notificacionController.eliminarNotificaciones);

api
  .route("/notificacionporusuario/")
  .get(notificacionController.getNotificacionPorUsuario);
api
  .route("/notificacionesNoLeidas/")
  .get(notificacionController.getNotificacionPorUsuarioNoLeidas);

module.exports = api;
