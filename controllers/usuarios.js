const fs = require("fs");
const path = require("path");
// const bcrypt = require("bcrypt-nodejs");
const jwt = require("../services/jwt");
const Usuario = require("../models/usuarios");
const Favorito = require("../models/favoritos");
const Notificacion = require("../models/notificaciones");

function registrarUsuario(req, res) {
  const usuario = new Usuario(req.body);
  usuario.creado = new Date();

  Usuario.findOne({ email: usuario.email }, (err, usuarioAlmacenado) => {
    if (err) {
      res.status(500).send({ message: "Error del servidor." });
    } else {
      if (!usuarioAlmacenado) {
        usuario.save((err, usuarioCreado) => {
          if (err) {
            res.status(500).send({ message: "El usuario ya existe. " + err });
          } else {
            if (!usuarioCreado) {
              res.status(404).send({ message: "Error al crear el usuario." });
            } else {
              res.status(200).send({ usuario: usuarioCreado });
            }
          }
        });
      } else {
        res.status(200).send({ usuario: usuarioAlmacenado });
      }
    }
  });
}

function login(req, res) {
  const params = req.body;
  const email = params.email.toLowerCase();

  Usuario.findOne({ email }, (err, userStored) => {
    if (err) {
      res.status(500).send({ message: "Error del servidor." });
    } else {
      if (!userStored) {
        res.status(404).send({ message: "Usuario no encontrado." });
      } else {
        if (!userStored.perfilcompleto) {
          res.status(200).send({
            code: 200,
            message: "El usuario no ah completado su perfil.",
          });
        } else {
          res.status(200).send({
            accessToken: jwt.createAccessToken(userStored),
            refreshToken: jwt.createRefreshToken(userStored),
            message: "Usuario logeado:",
          });
        }
      }
    }
  });
}

function getUsuarios(req, res) {
  Usuario.find()
    // .populate("Localidad")
    .populate("Pais")
    .populate("Provincia")
    .populate("Accion")
    .populate({ path: "ultimaAccion", populate: { path: "Accion" } })
    .populate("Favorito")
    .populate("favoritos.iduser")
    .then((usuarios) => {
      if (!usuarios) {
        res
          .status(404)
          .send({ message: "No se ha encontrado ningun usuario." });
      } else {
        res.status(200).send({ usuarios });
      }
    });
}

function getUsuario(req, res) {
  const params = req.params;

  Usuario.findById({ _id: params.id }, (err, userStored) => {
    if (err) {
      res.status(500).send({ code: 500, message: "Error del servidor." });
    } else {
      if (!userStored) {
        res
          .status(404)
          .send({ code: 404, message: "No se ha encontrado ningun Usuario." });
      } else {
        // Accion.find({ id: userStored.ultimaAccion}).then({
        //   userStored
        // })
        res.status(200).send({ code: 200, usuario: userStored });
      }
    }
  })
    .populate("Localidad")
    .populate("Pais")
    .populate("Provincia")
    .populate("Accion")
    .populate("Favorito")
    .populate("respuestas.iduser")
    .populate({ path: "ultimaAccion", populate: { path: "Accion" } });
}

function getUsuariosPorRadio(req, res) {
  const { latitud, longitud, radio, idUsuario } = req.query;
  const radioEnMetros = radio * 100000;
  let filtro = {};
  filtro.geoposicion = {
    $near: {
      $geometry: {
        type: "Point",
        coordinates: [parseFloat(longitud), parseFloat(latitud)],
      },
      $maxDistance: radioEnMetros,
    },
  };
  filtro._id = { $ne: idUsuario };

  Usuario.find(filtro)
    // .populate("localidad")
    .populate("pais")
    .populate("provincia")
    .populate("ultimaAccion")
    .populate("favoritos.iduser")
    .populate("accion")
    .populate("Dispositivo")
    .then((vecinos) => {
      if (!vecinos) {
        res.status(404).send({ message: "No se ha encontrado ningun vecino." });
      } else {
        Notificacion.find({ idfavorito: idUsuario, leido: false })
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
            }
            res
              .status(200)
              .send({ vecinos: vecinos, notificaciones: notificaciones });
          });
      }
    });
}

function getUsuariosFavoritos(req, res) {
  const { latitud, longitud, radio, idUsuario } = req.query;
  const radioEnMetros = radio * 100000;
  let filtro = {};
  filtro.geoposicion = {
    $near: {
      $geometry: {
        type: "Point",
        coordinates: [parseFloat(longitud), parseFloat(latitud)],
      },
      $maxDistance: radioEnMetros,
    },
  };
  filtro._id = { $ne: idUsuario };

  Usuario.find(filtro)
    // .populate("localidad")
    .populate("pais")
    .populate("provincia")
    .populate("ultimaAccion")
    .populate("favoritos.iduser")
    .populate("accion")
    .populate("Dispositivo")
    .then((vecinos) => {
      if (!vecinos) {
        res.status(404).send({ message: "No se ha encontrado ningun vecino." });
      } else {
        Favorito.find({ idfavorito: idUsuario })
          .populate("Usuario")
          .populate({ path: "iduser" })

          .then((favoritos) => {
            if (!favoritos) {
              res
                .status(404)
                .send({ message: "No se ha encontrado ningun Favorito." });
            } else {
              res.status(200).send({ vecinos: vecinos, favoritos: favoritos });
              vecinos.map((vecino) => {
                favoritos.map((favorito) => {
                  if (vecino._id != favorito.iduser._id) {
                    const vecinoFavoritos = vecino;

                    console.log(vecinoFavoritos);
                  }
                });
              });
            }
          });
      }
    });
}

function getUsuariosActivos(req, res) {
  const { perfilcompleto } = req.query;

  Usuario.find({ perfilcompleto })
    .populate("localidad")
    .populate("pais")
    .populate("provincia")
    .populate("ultimaAccion")
    .then((usuarios) => {
      if (!usuarios) {
        res
          .status(404)
          .send({ message: "No se ha encontrado ningun usuario." });
      } else {
        res.status(200).send({ usuarios });
      }
    });
}

function updateFoto(req, res) {
  const params = req.params;

  Usuario.findById({ _id: params.id }, (err, userData) => {
    if (err) {
      res.status(500).send({ message: "Error del servidor." });
    } else {
      if (!userData) {
        res.status(404).send({ message: "Nose ha encontrado ningun usuario." });
      } else {
        let usuario = userData;

        if (req.files) {
          let filePath = req.files.foto.path;
          let fileSplit = filePath.split("\\");
          let fileName = fileSplit[2];

          let extSplit = fileName.split(".");
          let fileExt = extSplit[1];

          if (fileExt !== "png" && fileExt !== "jpg") {
            res.status(400).send({
              message:
                "La extension de la imagen no es valida. (Extensiones permitidas: .png y .jpg)",
            });
            return;
          } else {
            usuario.avatar = fileName;
            Usuario.findByIdAndUpdate(
              { _id: params.id },
              usuario,
              (err, userResult) => {
                if (err) {
                  res.status(500).send({ message: "Error del servidor." });
                } else {
                  if (!userResult) {
                    res
                      .status(404)
                      .send({ message: "No se ha encontrado ningun usuario." });
                  } else {
                    res.status(200).send({ usuario: fileName });
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
  const fotoNombre = req.params.fotoNombre;
  const filePath = "./uploads/foto/" + fotoNombre;

  fs.exists(filePath, (exists) => {
    if (!exists) {
      res.status(404).send({ message: "La foto que buscas no existe." });
    } else {
      res.sendFile(path.resolve(filePath));
    }
  });
}

async function actualizarUsuario(req, res) {
  let userData = req.body;
  const params = req.params;
  userData.modificado = new Date();

  Usuario.findByIdAndUpdate({ _id: params.id }, userData, (err, userUpdate) => {
    if (err) {
      res.status(500).send({ message: "Error del servidor." });
    } else {
      if (!userUpdate) {
        res
          .status(404)
          .send({ message: "No se ha encontrado ningun usuario." });
      } else {
      }
    }
  }).then((usuario) => {
    res.status(200).send({
      usuario: usuario,
    });
  });
}

async function actualizarUsuarioFavorito(req, res) {
  let dataFavorito = req.body;

  const params = req.params;

  Usuario.findByIdAndUpdate(
    { _id: params.id },

    { $push: { favoritos: dataFavorito } },

    (err, actualizarFavorito) => {
      if (err) {
        res.status(500).send({ message: "Error del servidor." });
      } else {
        if (!actualizarFavorito) {
          res
            .status(404)
            .send({ message: "No se ha encontrado ninguna Usuario." });
        } else {
          res.status(200).send({
            message: "Usuario actualizada correctamente.",
            actualizarFavorito,
          });
        }
      }
    }
  );
}

async function EliminarUsuarioFavorito(req, res) {
  let dataFavorito = req.body;
  let idFavorito = dataFavorito.idFavorito;
  const params = req.params;

  await Usuario.findByIdAndUpdate(
    { _id: params.id },
    { $pull: { favoritos: { identidadFavorito: idFavorito } } },
    { new: true }
  ).then((respuesta) => {
    if (!respuesta) {
      res.status(404).send({ message: "No se ha encontrado ningun favorito." });
    } else {
      res.status(200).send({ message: "FAVORITO ELIMINADO" });
    }
  });
}

// async function eliminarFavorito(req, res) {
//   let _id = req.body;

//   const params = req.params;

//   Usuario.findByIdAndUpdate(
//     { _id: params.id },

//     { $push: { favoritos: _id } },

//     (err, actualizarFavorito) => {
//       if (err) {
//         res.status(500).send({ message: "Error del servidor." });
//       } else {
//         if (!actualizarFavorito) {
//           res
//             .status(404)
//             .send({ message: "No se ha encontrado ninguna Usuario." });
//         } else {
//           res.status(200).send({
//             message: "Usuario actualizada correctamente.",
//             actualizarFavorito,
//           });
//         }
//       }
//     }
//   );
// }

function activarUsuario(req, res) {
  const { id } = req.params;
  const { perfilcompleto } = req.body;

  Usuario.findByIdAndUpdate(id, { perfilcompleto }, (err, userStored) => {
    if (err) {
      res.status(500).send({ message: "Error del servidor." });
    } else {
      if (!userStored) {
        res.status(404).send({ message: "No se ha encontrado el usuario." });
      } else {
        if (perfilcompleto === true) {
          res.status(200).send({ message: "Usuario activado correctamente." });
        } else {
          res
            .status(200)
            .send({ message: "Usuario desactivado correctamente." });
        }
      }
    }
  });
}

function eliminarUsuario(req, res) {
  const { id } = req.params;

  Usuario.findByIdAndRemove(id, (err, userDeleted) => {
    if (err) {
      res.status(500).send({ message: "Error del servidor." });
    } else {
      if (!userDeleted) {
        res.status(404).send({ message: "Usuario no encontrado." });
      } else {
        res
          .status(200)
          .send({ message: "El usuario ha sido eliminado correctamente." });
      }
    }
  });
}

module.exports = {
  registrarUsuario,
  login,
  getUsuarios,
  getUsuario,
  getUsuariosPorRadio,
  getUsuariosActivos,
  updateFoto,
  getFoto,
  actualizarUsuario,
  activarUsuario,
  eliminarUsuario,
  actualizarUsuarioFavorito,
  EliminarUsuarioFavorito,
  getUsuariosFavoritos,
};
