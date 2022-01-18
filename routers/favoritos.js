const express = require("express");
const FavoritoController = require("../controllers/favoritos");

const api = express.Router();

api
  .route("/favoritos")
  .get(FavoritoController.getFavoritos)
  .post(FavoritoController.crearFavorito);

api
  .route("/favoritos/:id")
  .get(FavoritoController.getFavorito)
  .put(FavoritoController.actualizarFavorito)
  .delete(FavoritoController.eliminarFavorito);

api.route("/idfavoritouser").get(FavoritoController.getFavoritoPorUsuario);

api.route("/favoritos/:idfavorito").get(FavoritoController.getFavoritoId);

api
  .route("/favoritoporusuarios")
  .get(FavoritoController.getFavoritoPorUsuarios);

module.exports = api;
