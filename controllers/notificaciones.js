const Accion = require("../models/acciones");
const Usuario = require("../models/usuarios");
const Notificacion = require("../models/notificaciones");

function getNotificaciones(req, res) {
  Notificacion.find({})
    .sort({ fecha: -1 })
    .populate("Usuario")
    .populate({ path: "usuario" })
    .populate("Accion")
    .populate({ path: "idaccion" })
    .populate("Favorito")
    .populate({ path: "iduser" })

    .then((notificaciones) => {
      if (!notificaciones) {
        res
          .status(404)
          .send({ message: "No se ha encontrado ninguna notificación." });
      } else {
        res.status(200).send({ notificaciones });
      }
    });
}

function getNotificacion(req, res) {
  const params = req.params;
  Notificacion.findById({ _id: params.id })
    .sort({ fecha: -1 })
    .populate("Usuario")
    .populate({ path: "usuario" })
    .then((notificacion) => {
      if (!notificacion) {
        res
          .status(404)
          .send({ message: "No se ha encontrado ninguna notificación." });
      } else {
        res.status(200).send({ notificacion });
      }
    });
}

// get notificaciones por usuario leido = false

function getNotificacionPorUsuarioNoLeidas(req, res) {
  const query = req.query;

  Notificacion.find({ idfavorito: query.idfavorito, leido: false })
    .sort({ fecha: -1 })
    .limit(9)
    .populate("Usuario")
    .populate("Accion")
    .populate({ path: "usuario" })
    .populate({ path: "favorito" })
    .populate({ path: "accion" })

    .then((notificaciones) => {
      if (!notificaciones) {
        res
          .status(404)
          .send({ message: "No se ha encontrado ninguna notificación." });
      } else {
        res.status(200).send({ notificaciones });
      }
    });
}

function getNotificacionPorUsuario(req, res) {
  const query = req.query;

  Notificacion.find({ idfavorito: query.idfavorito })
    .sort({ fecha: -1 })
    .limit(9)
    .populate("Usuario")
    .populate("Accion")
    .populate({ path: "usuario" })
    .populate({ path: "favorito" })
    .populate({ path: "accion" })

    .then((notificaciones) => {
      if (!notificaciones) {
        res
          .status(404)
          .send({ message: "No se ha encontrado ninguna notificación." });
      } else {
        res.status(200).send({ notificaciones });
      }
    });
}

// actualizar notificacion campo leido
function actualizarNotificacion(req, res) {
  const params = req.params;
  Notificacion.findByIdAndUpdate(
    { _id: params.id },
    { $set: { leido: true } },
    (err, notificacion) => {
      if (err) {
        res
          .status(500)
          .send({ message: "Error al actualizar notificación." + err });
      } else {
        if (!notificacion) {
          res
            .status(404)
            .send({ message: "No se ha encontrado ninguna notificación." });
        } else {
          res.status(200).send({ notificacion: notificacion });
        }
      }
    }
  );
}

function eliminarNotificacion(req, res) {
  const { id } = req.params;

  Notificacion.findByIdAndRemove(id, (err, eliminarNotificacion) => {
    if (err) {
      res.status(500).send({ message: "Error del servidor." });
    } else {
      if (!eliminarNotificacion) {
        res.status(404).send({ message: "Notificación no encontrada." });
      } else {
        res.status(200).send({
          message: "La Notificación ha sido eliminada correctamente.",
        });
      }
    }
  });
}

//eliminar todas las notificaciones por usuario

function eliminarNotificaciones(req, res) {
  const params = req.params;

  Notificacion.deleteMany(
    { idfavorito: params.id },
    (err, eliminarNotificacion) => {
      if (err) {
        res.status(500).send({ message: "Error del servidor." });
      } else {
        if (!eliminarNotificacion) {
          res.status(404).send({ message: "Notificación no encontrada." });
        } else {
          res
            .status(200)
            .send({ message: "Todas las notificaciones fueron eliminadas" });
        }
      }
    }
  );
}

//eliminar todas las notificaciones
// function eliminarNotificaciones(req, res) {
//   Notificacion.deleteMany((err, eliminarNotificacion) => {
//     if (err) {
//       res.status(500).send({ message: "Error del servidor." });
//     } else {
//       if (!eliminarNotificacion) {
//         res.status(404).send({ message: "Notificación no encontrada." });
//       } else {
//         res
//           .status(200)
//           .send({ message: "Todas las notificaciones fueron eliminadas" });
//       }
//     }
//   });
// }

function crearNotificacion(req, res) {
  const notificacion = new Notificacion();
  console.log(req.body);

  const {
    usuario,
    idusuario,
    tipo,
    mensaje,
    leido,
    accion,
    idaccion,
    idfavorito,
    favorito,
  } = req.body;
  notificacion.usuario = usuario;
  notificacion.idusuario = idusuario;
  notificacion.tipo = tipo;
  notificacion.mensaje = mensaje;
  notificacion.leido = leido;
  notificacion.accion = accion;
  notificacion.idaccion = idaccion;
  notificacion.idfavorito = idfavorito;
  notificacion.favorito = favorito;

  notificacion.save((err, notificacionStorage) => {
    if (err) {
      console.log("Notificación error", err);
      res.status(500).send({ message: "La Notificacion ya existe." });
    } else {
      if (!notificacionStorage) {
        res
          .status(500)
          .send({ message: "Error al crear la nueva notificación." });
      } else {
        res.status(200).send({ notificacion: notificacionStorage });
      }
    }
  });
}

module.exports = {
  getNotificaciones,
  getNotificacion,
  getNotificacionPorUsuario,
  actualizarNotificacion,
  eliminarNotificacion,
  crearNotificacion,
  eliminarNotificaciones,
  getNotificacionPorUsuarioNoLeidas,
};
