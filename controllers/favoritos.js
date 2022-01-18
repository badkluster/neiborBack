const Favorito = require("../models/favoritos");
const Usuario = require("../models/usuarios");

function getFavoritos(req, res) {
  Favorito.find()
    .sort({ creado: -1 })
    .populate("Usuario")
    .populate({ path: "iduser" })

    .then((favoritos) => {
      if (!favoritos) {
        res.status(404).send({ message: "No se han encontrado Favoritos." });
      } else {
        res.status(200).send({ favoritos });
      }
    });
}

function getFavorito(req, res) {
  const params = req.params;

  Favorito.findById({ _id: params.id })
    .populate("Usuario")
    .populate({ path: "iduser" })

    .then((favoritos) => {
      if (!favoritos) {
        res
          .status(404)
          .send({ message: "No se ha encontrado ninguna accion." });
      } else {
        res.status(200).send({ favoritos });
      }
    });
}

function getFavoritoPorUsuario(req, res) {
  const query = req.query;

  Favorito.find({ idfavorito: query.idfavorito })
    .sort({ creado: -1 })
    .populate("Usuario")
    .populate({ path: "iduser" })

    .then((favoritos) => {
      if (!favoritos) {
        res
          .status(404)
          .send({ message: "No se ha encontrado ningun favorito." });
      } else {
        res.status(200).send({ favoritos });
      }
    });
}
function getFavoritoId(req, res) {
  const { idfavorito } = req.params;

  Favorito.find({ idfavorito }, (err, favouriteStored) => {
    if (err) {
      res.status(500).send({ code: 500, message: "Error del servidor." });
    } else {
      if (!favouriteStored) {
        res
          .status(404)
          .send({ code: 404, message: "No se ha encontrado ningun favorito." });
      } else {
        res.status(200).send({ code: 200, favorito: favouriteStored });
      }
    }
  }).popoulate("Usuario");
}

async function actualizarFavorito(req, res) {
  let favoritoData = req.body;

  const params = req.params;

  Favorito.findByIdAndUpdate(
    { _id: params.id },
    favoritoData,
    (err, favouriteUpdate) => {
      if (err) {
        res.status(500).send({ message: "Error del servidor." });
      } else {
        if (!favouriteUpdate) {
          res
            .status(404)
            .send({ message: "No se ha encontrado ningun favorito cargado." });
        } else {
          res.status(200).send({
            message: "Favorito actualizado correctamente.",
            favoritos: favouriteUpdate,
          });
        }
      }
    }
  );
}

async function eliminarFavorito(req, res) {
  const { id } = req.params;

  await Favorito.findByIdAndRemove(id, (err, favouriteDeleted) => {
    if (err) {
      res.status(500).send({ message: "Error del servidor." });
    } else {
      if (!favouriteDeleted) {
        res.status(404).send({ message: "Vecino Favorito no encontrado." });
      } else {
        Usuario.findByIdAndUpdate(
          { _id: favouriteDeleted.idfavorito },
          { $pull: { favoritos: { identidadFavorito: id } } },
          { new: true }
        ).then((respuesta) => {
          if (!respuesta) {
            res
              .status(404)
              .send({ message: "No se ha encontrado ningun favorito." });
          } else {
            res.status(200).send({
              message: "El Vecino Favorito ha sido eliminado correctamente.",
              user: respuesta,
            });
          }
        });
      }
    }
  });
}

function getFavoritoPorUsuarios(req, res) {
  const query = req.query;

  Favorito.find({ iduser: query.iduser, idfavorito: query.idfavorito })
    .populate("Usuario")
    .populate({ path: "iduser" })
    .then((favoritos) => {
      if (!favoritos) {
        res
          .status(404)
          .send({ message: "No se ha encontrado ningun Favorito." });
      } else {
        res.status(200).send({ favoritos });
      }
    });
}

async function crearFavorito(req, res) {
  const favorito = new Favorito({ ...req.body });
  const { descripcion } = req.body;

  favorito.descripcion = descripcion;

  await favorito.save((err, favouriteStored) => {
    if (err) {
      console.log("favorito error", err);
      res.status(500).send({ message: "El Vecino Favorito ya existe." });
    } else {
      if (!favouriteStored) {
        res
          .status(500)
          .send({ message: "Error al crear la nuevo vecino favorito." });
      } else {
        const dataFavorito = {
          idUsuarioFavorito: favouriteStored.iduser,
          idUserFavorito: favouriteStored.iduser,
          identidadFavorito: favouriteStored._id,
        };
        Usuario.findByIdAndUpdate(
          { _id: favouriteStored.idfavorito },

          { $push: { favoritos: dataFavorito } }
        ).then((respuesta) => {
          res.status(200).send({
            message: "Vecino  Favorito creado correctamente.",
            favoritos: favorito,
            user: respuesta,
          });
        });
      }
    }
  });
}

module.exports = {
  getFavoritos,
  getFavorito,
  getFavoritoPorUsuario,
  getFavoritoId,
  actualizarFavorito,
  eliminarFavorito,
  crearFavorito,
  getFavoritoPorUsuarios,
};
