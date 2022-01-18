const express = require("express");

const app = express();
const { API_VERSION } = require("./config");

// Load routings
const authRoutes = require("./routers/auth");
const userRoutes = require("./routers/usuarios");
const accionRoutes = require("./routers/acciones");
const dispositivosRoutes = require("./routers/dispositivos");
const favoritosRoutes = require("./routers/favoritos");
const aprovisionadorRoutes = require("./routers/aprovisionador");
const notificacionesRoutes = require("./routers/notificaciones");

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Configure Header HTTP
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
  res.header("Allow", "GET, POST, OPTIONS, PUT, DELETE");
  next();
});

// Router Basic
app.use(`/api/${API_VERSION}`, authRoutes);
app.use(`/api/${API_VERSION}`, userRoutes);
app.use(`/api/${API_VERSION}`, accionRoutes);
app.use(`/api/${API_VERSION}`, dispositivosRoutes);
app.use(`/api/${API_VERSION}`, favoritosRoutes);
app.use(`/api/${API_VERSION}`, aprovisionadorRoutes);
app.use(`/api/${API_VERSION}`, notificacionesRoutes);

module.exports = app;
