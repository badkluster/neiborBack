const express = require("express");
const AprovisionadorController = require("../controllers/aprovisionador");

const api = express.Router();

api
  .route("/aprovisionador")
  .get(AprovisionadorController.aprovisionarTodo)


module.exports = api;
