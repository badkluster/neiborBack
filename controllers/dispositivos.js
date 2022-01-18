const Dispositivo = require("../models/dispositivos");
const Uruario = require("../models/usuarios");

function getDispositivos(req, res) {
  Dispositivo.find()
    .populate("Usuario")

    .then((dispositivos) => {
      if (!dispositivos) {
        res
          .status(404)
          .send({ message: "No se han encontrado dispositivos moviles." });
      } else {
        res.status(200).send({ dispositivos });
      }
    });
}

function getDispositivo(req, res) {
  const params = req.params;

  Accion.findById({ _id: params.id }, (err, accionStored) => {
    if (err) {
      res.status(500).send({ code: 500, message: "Error del servidor." });
    } else {
      if (!accionStored) {
        res.status(404).send({
          code: 404,
          message: "No se ha encontrado ningun dispositivo.",
        });
      } else {
        res.status(200).send({ code: 200, accion: accionStored });
      }
    }
  }).populate("Usuario");
}

function eliminarDispositivo(req, res) {
  const { id } = req.params;

  Dispositivo.findByIdAndRemove(id, (err, deviceDeleted) => {
    if (err) {
      res.status(500).send({ message: "Error del servidor." });
    } else {
      if (!deviceDeleted) {
        res.status(404).send({ message: "Dispositivo no encontrada." });
      } else {
        res.status(200).send({
          message: "El dispositivo ha sido eliminada correctamente.",
        });
      }
    }
  });
}

function crearDispositivo(req, res) {
  const dispositivo = new Dispositivo();

  const {
    aapBuild,
    appVersion,
    isCharging,
    batteryLevel,
    isVirtual,
    manufacturer,
    model,
    operatingSystem,
    osVersion,
    platform,
    uuid,
    userid,
  } = req.body;
  dispositivo.aapBuild = aapBuild;
  dispositivo.userid = userid;
  dispositivo.appVersion = appVersion;
  dispositivo.batteryLevel = batteryLevel;
  dispositivo.isCharging = isCharging;
  dispositivo.manufacturer = manufacturer;
  dispositivo.model = model;
  dispositivo.operatingSystem = operatingSystem;
  dispositivo.platform = platform;
  dispositivo.isVirtual = isVirtual;
  dispositivo.osVersion = osVersion;
  dispositivo.uniqueid = uuid;
  dispositivo.creadopor = userid;

  dispositivo.save((err, deviceStored) => {
    if (err) {
      console.log("Dispositivo error", err);
      res.status(500).send({ message: "el dispositivo ya existe." });
    } else {
      if (!deviceStored) {
        res
          .status(500)
          .send({ message: "Error al crear el nuevo dispositivo." });
      } else {
        res.status(200).send({
          message: "Dispositivo creado correctamente.",
          dispositivo: deviceStored,
        });
      }
    }
  });
}

async function actualizarDispositivo(req, res) {
  let dataDispositivo = req.body;
  dataDispositivo.modificado = new Date();

  const params = req.params;

  Dispositivo.findByIdAndUpdate(
    { _id: params.id },
    dataDispositivo,
    (err, actualizarDispositivo) => {
      if (err) {
        res.status(500).send({ message: "Error del servidor." });
      } else {
        if (!actualizarDispositivo) {
          res.status(404).send({
            message: "No se ha encontrado ningun dispositivo cargado.",
          });
        } else {
          res
            .status(200)
            .send({ message: "Dispositivo actualizado correctamente." });
        }
      }
    }
  ).populate("Usuario");
}

function getDispositivoPorUsuario(req, res) {
  const { userid } = req.params;

  Device.findById({ userid }, (err, deviceStored) => {
    if (err) {
      res.status(500).send({ code: 500, message: "Error del servidor." });
    } else {
      if (!deviceStored) {
        res.status(404).send({
          code: 404,
          message: "No se ha encontrado ningun dispositivo.",
        });
      } else {
        res.status(200).send({ code: 200, device: deviceStored });
      }
    }
  }).populate("Usuario");
}

module.exports = {
  getDispositivos,
  eliminarDispositivo,
  crearDispositivo,
  getDispositivo,
  getDispositivoPorUsuario,
  actualizarDispositivo,
};
