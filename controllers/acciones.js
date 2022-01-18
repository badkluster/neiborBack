const Accion = require("../models/acciones");
const Usuario = require("../models/usuarios");
const Notificacion = require("../models/notificaciones");
const fs = require("fs");
const path = require("path");

function getAcciones(req, res) {
  Accion.find({})
    .populate("Usuario")

    .populate({ path: "iduser" })
    .populate("respuestas.iduser")

    // .populate({
    //   path: "Accion",
    //   populate: { path: "respuestas", populate: { path: "iduser" } },
    // })
    .then((acciones) => {
      if (!acciones) {
        res
          .status(404)
          .send({ message: "No se ha encontrado ninguna accion." });
      } else {
        res.status(200).send({ acciones });
      }
    });
}

function getAccion(req, res) {
  const params = req.params;
  Accion.findById({ _id: params.id })
    .populate("Usuario")
    .populate({ path: "iduser" })
    .populate("respuestas.iduser")

    .then((acciones) => {
      if (!acciones) {
        res
          .status(404)
          .send({ message: "No se ha encontrado ninguna accion." });
      } else {
        res.status(200).send({ acciones });
      }
    });
}

function getAccionPorUsuario(req, res) {
  const query = req.query;

  Accion.find({ creadopor: query.creadopor, activado: query.activado })
    .sort({ creado: -1 })
    .populate("Usuario")

    .populate({ path: "iduser" })
    .populate("respuestas.iduser")

    .then((acciones) => {
      if (!acciones) {
        res
          .status(404)
          .send({ message: "No se ha encontrado ninguna accion." });
      } else {
        res.status(200).send({ acciones });
      }
    });
}

function getAccionesActivas(req, res) {
  const params = req.params;

  Accion.find({ iduser: params.iduser })
    .populate("Usuario")

    .populate({ path: "iduser" })
    .populate("respuestas.iduser")
    .then((acciones) => {
      if (!acciones) {
        res
          .status(404)
          .send({ message: "No se ha encontrado ninguna acción." });
      } else {
        res.status(200).send({ acciones });
      }
    });
}

function getAccionesPorFecha(req, res) {
  const { start, end } = req.params;

  Accion.find({ created: { $gte: start, $lte: end } })
    .populate("Usuario")

    .populate({ path: "iduser" })
    .populate("respuestas.iduser")

    .then((acciones) => {
      if (!acciones) {
        res.status(404).send({ message: "No se han encontrado Acciones." });
      } else {
        res.status(200).send({ acciones });
      }
    });
}

function getAccionesTipo(req, res) {
  const query = req.query;

  Accion.find({ tipo: query.tipo })
    .populate("Usuario")

    .populate({ path: "iduser" })
    .populate("respuestas.iduser")

    .then((acciones) => {
      if (!acciones) {
        res
          .status(404)
          .send({ message: "No se ha encontrado ninguna acción." });
      } else {
        res.status(200).send({ acciones });
      }
    });
}

function getAccionesCategoria(req, res) {
  const query = req.query;

  Acciones.find({ categoria: query.categoria })
    .populate("Usuario")

    .populate({ path: "iduser" })
    .populate("respuestas.iduser")

    .then((acciones) => {
      if (!acciones) {
        res
          .status(404)
          .send({ message: "No se ha encontrado ninguna acción." });
      } else {
        res.status(200).send({ acciones });
      }
    });
}

function getAccionesporNombreyUsuario(req, res) {
  const query = req.query;

  Accion.find({ nombre: query.nombre, creadopor: query.creadopor })
    .sort({ creado: -1 })
    .populate("Usuario")
    .populate({ path: "iduser" })
    .populate("respuestas.iduser")
    .then((acciones) => {
      if (!acciones) {
        res
          .status(404)
          .send({ message: "No se ha encontrado ninguna acción." });
      } else {
        res.status(200).send({ acciones });
      }
    });
}

async function actualizarAccion(req, res) {
  let dataAccion = req.body;
  dataAccion.modificado = new Date();

  const params = req.params;
  console.log(dataAccion.accion);
  Accion.findByIdAndUpdate(
    { _id: params.id },

    { $push: { respuestas: dataAccion } },

    (err, actualizarAccion) => {
      if (err) {
        res.status(500).send({ message: "Error del servidor." });
      } else {
        if (!actualizarAccion) {
          res
            .status(404)
            .send({ message: "No se ha encontrado ninguna acción cargada." });
        } else {
          const notificacion = new Notificacion();
          notificacion.idaccion = dataAccion.accion._id;
          notificacion.accion = dataAccion.accion._id;
          notificacion.tipo = "respondido";
          notificacion.usuario = dataAccion.iduser;
          notificacion.idusuario = dataAccion.iduser;
          notificacion.mensaje = dataAccion.accion.categoria;
          notificacion.leido = false;
          notificacion.idfavorito = dataAccion.accion.iduser._id
            ? dataAccion.accion.iduser._id
            : dataAccion.accion.iduser;
          notificacion.favorito = dataAccion.accion.iduser._id
            ? dataAccion.accion.iduser._id
            : dataAccion.accion.iduser;

          notificacion.save((err, notificacionStored) => {
            if (err) {
              res.status(500).send({
                message: "Error al crear la nueva notificacion.",
              });
            } else {
              if (!notificacionStored) {
                res.status(500).send({
                  message: "Error al crear la nueva notificación.",
                });
              } else {
              }
            }
          });

          res.status(200).send({
            message: "Acción actualizada correctamente.",
            actualizarAccion,
          });
        }
      }
    }
  );
}

async function actualizarRespuesta(req, res) {
  let dataAccion = req.body;
  let idrespuesta = dataAccion.idrespuesta;
  let iduser = dataAccion.iduser._id;
  let accion = dataAccion.accion;
  const params = req.params;

  await Accion.updateOne(
    { _id: params.id },
    { $set: { "respuestas.$[resp]": dataAccion } },
    { arrayFilters: [{ "resp._id": idrespuesta }] }
  ).then((respuesta) => {
    if (!respuesta) {
      res
        .status(404)
        .send({ message: "No se ha encontrado ninguna respuesta." });
    } else {
      const notificacion = new Notificacion();
      notificacion.idaccion = accion._id;
      notificacion.accion = accion._id;
      notificacion.tipo = "aceptada";
      notificacion.usuario = accion.iduser._id;
      notificacion.idusuario = accion.iduser._id;
      notificacion.mensaje = accion.categoria;
      notificacion.leido = false;
      notificacion.idfavorito = iduser;
      notificacion.favorito = iduser;

      notificacion.save((err, notificacionStored) => {
        if (err) {
          res.status(500).send({
            message: "Error al crear la nueva notificacion.",
          });
        } else {
          if (!notificacionStored) {
            res.status(500).send({
              message: "Error al crear la nueva notificación.",
            });
          } else {
          }
        }
      });

      res.status(200).send({ respuesta });
    }
  });
}

async function eliminarRespuesta(req, res) {
  let dataAccion = req.body;
  let idrespuesta = dataAccion.idrespuesta;
  let iduser = dataAccion.iduser._id;
  let accion = dataAccion.accion;
  const params = req.params;

  await Accion.findByIdAndUpdate(
    { _id: params.id },
    { $pull: { respuestas: { _id: idrespuesta } } },
    { new: true }
  ).then((respuesta) => {
    if (!respuesta) {
      res
        .status(404)
        .send({ message: "No se ha encontrado ninguna respuesta." });
    } else {
      const notificacion = new Notificacion();

      notificacion.idaccion = accion._id;
      notificacion.accion = accion._id;
      notificacion.tipo = "rechazada";
      notificacion.mensaje = accion.categoria;
      notificacion.usuario = accion.iduser._id;
      notificacion.idusuario = accion.iduser._id;
      notificacion.leido = false;
      notificacion.idfavorito = iduser;
      notificacion.favorito = iduser;

      notificacion.save((err, notificacionStored) => {
        if (err) {
          res.status(500).send({
            message: "Error al crear la nueva notificacion.",
          });
        } else {
          if (!notificacionStored) {
            res.status(500).send({
              message: "Error al crear la nueva notificación.",
            });
          } else {
          }
        }
      });

      res.status(200).send({ message: "RESPUESTA ELIMINADA" });
    }
  });
}

function eliminarAccion(req, res) {
  const { id } = req.params;
  const params = req.params;

  Accion.findById({ _id: params.id })
    .populate("Usuario")
    .populate({ path: "iduser" })
    .populate("respuestas.iduser")

    .then((acciones) => {
      if (!acciones) {
        res
          .status(404)
          .send({ message: "No se ha encontrado ninguna accion." });
      } else {
        acciones.respuestas.forEach((respuesta) => {
          const notificacion = new Notificacion();
          notificacion.idaccion = acciones._id;
          notificacion.accion = acciones._id;
          notificacion.tipo = "cancelada";
          notificacion.usuario = acciones.iduser._id;
          notificacion.idusuario = acciones.iduser._id;
          notificacion.mensaje = acciones.categoria;
          notificacion.leido = false;
          notificacion.idfavorito = respuesta.iduser._id;
          notificacion.favorito = respuesta.iduser._id;

          notificacion.save((err, notificacionStored) => {
            if (err) {
              res.status(500).send({
                message: "Error al crear la nueva notificacion.",
              });
            } else {
              if (!notificacionStored) {
                res.status(500).send({
                  message: "Error al crear la nueva notificación.",
                });
              } else {
              }
            }
          });
        });
      }
    });

  Accion.findByIdAndRemove(id, (err, eliminaraccion) => {
    if (err) {
      res.status(500).send({ message: "Error del servidor." });
    } else {
      if (!eliminaraccion) {
        res.status(404).send({ message: "Acción no encontrada." });
      } else {
        res.status(200).send({
          message: "La Accion ha sido eliminada correctamente.",
        });
      }
    }
  });
}

function updateFoto(req, res) {
  const params = req.params;

  Accion.findById({ _id: params.id }, (err, accionData) => {
    if (err) {
      res.status(500).send({ message: "Error del servidor." });
    } else {
      if (!accionData) {
        res.status(404).send({ message: "Nose ha encontrado ningun usuario." });
      } else {
        let accion = accionData;

        if (req) {
          let filePath = req.files.foto.path;

          let fileName = filePath.replace(/^.*[\\\/]/, "");
          //  let fileSplit = filePath.split("/");
          // let fileName = fileSplit[2];
          let extSplit = fileName.split(".");
          let fileExt = extSplit[1];

          if (fileExt !== "png" && fileExt !== "jpg" && fileExt !== "jpeg") {
            res.status(400).send({
              message:
                "La extension de la imagen no es valida. (Extensiones permitidas: .png y .jpg)",
            });
          } else {
            accion.foto = fileName;
            Accion.findByIdAndUpdate(
              { _id: params.id },
              accion,
              (err, userResult) => {
                if (err) {
                  res.status(500).send({ message: "Error del servidor." });
                } else {
                  if (!userResult) {
                    res
                      .status(404)
                      .send({ message: "No se ha encontrado ningun usuario." });
                  } else {
                    res.status(200).send({ fotoNombre: fileName });
                  }
                }
              }
            );
          }
        }
      }
    }
  });
}

function getFoto(req, res) {
  const fotoNombre = req.params.foto;
  const filePath = "./uploads/foto/" + fotoNombre;

  fs.exists(filePath, (exists) => {
    if (!exists) {
      res.status(404).send({ message: "La foto que buscas no existe." });
    } else {
      res.sendFile(path.resolve(filePath));
    }
  });
}

function crearAccion(req, res) {
  const accion = new Accion();

  const {
    nombre,
    nombreMascota,
    descripcion,
    respuestas,
    tipo,
    montototal,
    categoria,
    iduser,
    telefono,
  } = req.body;
  accion.nombre = nombre;
  accion.iduser = iduser;
  accion.descripcion = descripcion;
  accion.tipo = tipo;
  accion.respuestas = respuestas;
  accion.creado = new Date();
  accion.activado = true;
  accion.creadopor = iduser;
  accion.montototal = montototal;
  accion.categoria = categoria;
  accion.nombreMascota = nombreMascota;
  accion.telefono = telefono;

  accion.save((err, actionStored) => {
    if (err) {
      console.log("Accion error", err);
      res.status(500).send({ message: "La Accion ya existe." });
    } else {
      if (!actionStored) {
        res.status(500).send({ message: "Error al crear la nueva acción." });
      } else {
        const params = actionStored;
        Usuario.findByIdAndUpdate(
          { _id: params.iduser },

          {
            $set: {
              ultimaAccion: actionStored._id,
            },
          },
          function (error, info) {
            if (error) {
              res.status(500).send({
                msg: "No se pudo actualizar el Usuario",
              });
            } else {
              //buscar usuarios que me tengan como favoritos
              Usuario.find({ "favoritos.idUsuarioFavorito": info._id }).then(
                (usuarios) => {
                  usuarios.forEach((usuario) => {
                    const notificacion = new Notificacion();

                    notificacion.idaccion = actionStored._id;
                    notificacion.accion = actionStored._id;
                    notificacion.tipo = actionStored.nombre;
                    notificacion.usuario = actionStored.iduser;
                    notificacion.idusuario = actionStored.iduser;
                    notificacion.leido = false;
                    notificacion.idfavorito = usuario._id;
                    notificacion.favorito = usuario._id;
                    notificacion.mensaje = actionStored.categoria;
                    notificacion.save((err, notificacionStored) => {
                      if (err) {
                        res.status(500).send({
                          message: "Error al crear la nueva notificacion.",
                        });
                      } else {
                        if (!notificacionStored) {
                          res.status(500).send({
                            message: "Error al crear la nueva notificación.",
                          });
                        } else {
                        }
                      }
                    });
                  });
                }
              );
            }
          }
        );
        res.status(200).send({ accion: actionStored });
      }
    }
  });
}

function crearAccionMood(req, res) {
  const accion = new Accion();

  const {
    nombre,
    nombreMascota,
    descripcion,
    respuestas,
    tipo,
    montototal,
    categoria,
    iduser,
    telefono,
  } = req.body;
  accion.nombre = nombre;
  accion.iduser = iduser;
  accion.descripcion = descripcion;
  accion.tipo = tipo;
  accion.respuestas = respuestas;
  accion.creado = new Date();
  accion.activado = true;
  accion.creadopor = iduser;
  accion.montototal = montototal;
  accion.categoria = categoria;
  accion.nombreMascota = nombreMascota;
  accion.telefono = telefono;

  accion.save((err, actionStored) => {
    if (err) {
      console.log("Accion error", err);
      res.status(500).send({ message: "La Accion ya existe." });
    } else {
      if (!actionStored) {
        res.status(500).send({ message: "Error al crear la nueva acción." });
      } else {
        const params = actionStored;
        Usuario.findByIdAndUpdate(
          { _id: params.iduser },

          {
            $set: {
              ultimaAccion: actionStored._id,
            },
          },
          function (error, info) {
            if (error) {
              res.status(500).send({
                msg: "No se pudo actualizar el Usuario",
              });
            } else {
              //buscar usuarios que me tengan como favoritos
              Usuario.find({ "favoritos.iduser": info._id }).then(
                (usuarios) => {
                  usuarios.forEach((usuario) => {
                    const notificacion = new Notificacion();

                    notificacion.idaccion = actionStored._id;
                    notificacion.accion = actionStored._id;
                    notificacion.tipo = actionStored.nombre;
                    notificacion.usuario = actionStored.iduser;
                    notificacion.idusuario = actionStored.iduser;
                    notificacion.leido = false;
                    notificacion.idfavorito = usuario._id;
                    notificacion.favorito = usuario._id;
                    notificacion.mensaje = actionStored.categoria;
                    notificacion.save((err, notificacionStored) => {
                      if (err) {
                        res.status(500).send({
                          message: "Error al crear la nueva notificacion.",
                        });
                      } else {
                        if (!notificacionStored) {
                          res.status(500).send({
                            message: "Error al crear la nueva notificación.",
                          });
                        } else {
                        }
                      }
                    });
                  });
                }
              );
            }
          }
        ).then((user) =>
          res.status(200).send({ accion: actionStored, usuario: user })
        );
      }
    }
  });
}

module.exports = {
  getAcciones,
  getAccion,
  getAccionesActivas,
  getAccionesPorFecha,
  getAccionesTipo,
  getAccionesCategoria,
  actualizarAccion,
  eliminarAccion,
  crearAccion,
  getAccionPorUsuario,
  updateFoto,
  getFoto,
  actualizarRespuesta,
  eliminarRespuesta,
  crearAccionMood,
  getAccionesporNombreyUsuario,
};
