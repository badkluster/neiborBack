const express = require("express");
const UserController = require("../controllers/usuarios");
const multipart = require("connect-multiparty");
// const md_auth = require("../middlewares/authenticated");
const md_upload_foto = multipart({ uploadDir: "./uploads/foto" });

const api = express.Router();
api
  .route("/usuarios")
  .get(UserController.getUsuarios)
  .post(UserController.registrarUsuario);

api.route("/usuarios/vecinos").get(UserController.getUsuariosPorRadio);
api.route("/usuarios/activo").get(UserController.getUsuariosActivos);

api.route("/usuarios/login").post(UserController.login);

api
  .route("/usuarios/:id")
  .get(UserController.getUsuario)
  .put(UserController.actualizarUsuario)
  .delete(UserController.eliminarUsuario);

api.put("/update-avatar/:id", [md_upload_foto], UserController.updateFoto);
api.get("/get-avatar/:avatarName", UserController.getFoto);

api
  .route("/actualizarfavorito/:id")
  .put(UserController.actualizarUsuarioFavorito);

api.route("/eliminarfavorito/:id").put(UserController.EliminarUsuarioFavorito);

module.exports = api;
