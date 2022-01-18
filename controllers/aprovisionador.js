const Localidad = require("../models/localidades");
const Pais = require("../models/paises");
const Provincia = require("../models/provincias");
const Uruario = require("../models/usuarios");
const arrProvincias = require("../data/provincias.json");
const arrLocalidades = require("../data/localidades.json"); 
const fs = require('fs'),
_ = require('lodash'),
async = require('async')


let idPais = "";

function aprovisionarTodo(req, res) {
  limpiarYAprovisionarTablasGeográficas(res);

}

function limpiarYAprovisionarTablasGeográficas(res){
  return Localidad.deleteMany({}, err => {
    Provincia.deleteMany({}, err => {
      Pais.deleteMany({}, err => {
        aprovisionarTablasGeograficas(res);
      })
    })
  })
}

// APROVISIONAMIENTO DE TABLAS GEOGRÁFICAS
function aprovisionarTablasGeograficas(res) {
  let retData = {}
  let pais = new Pais();
  pais.nombre = "Argentina";
  pais.codigo = "AR";
  pais.save((err, nuevoPais) => {
    if (err) {
      console.log("Dispositivo error", err);
      res.status(500).send({ message: "El País ya existe." });
    } else {
      if (!nuevoPais) {
        res
          .status(500)
          .send({ message: "Error al crear el nuevo País." });
      } else {
        retData["paises"] = [nuevoPais];
        idPais = nuevoPais._id;
        let provinciasWaterfall = [];
        let indiceProvincias = [];
        let provinciasCreadas = [];
        arrProvincias.provincias.forEach(provincia => {
          provinciasWaterfall.push(async.apply(crearProvincia, provincia, indiceProvincias, provinciasCreadas))
        });
        async.waterfall(provinciasWaterfall, function (err) {
          if (err) {
              return res.status(400).send({
                  status: 400,
                  message: errorHandler.getErrorMessage(err)
                });
          } else {
            retData["provincias"] = provinciasCreadas;
            let localidadesWaterfall = [];
            let localidadesCreadas = [];
            arrLocalidades.localidades.forEach(localidad => {
              localidadesWaterfall.push(async.apply(crearLocalidad, localidad, indiceProvincias, localidadesCreadas))
            });
            async.waterfall(localidadesWaterfall, function (err) {
              if (err) {
                  return res.status(400).send({
                      status: 400,
                      message: errorHandler.getErrorMessage(err)
                    });
              } else {
                retData["localidades"] = localidadesCreadas;
                res
                  .status(200)
                  .send({
                    message: "Sistema aprovisionado correctamente",
                    data: retData,
                  });
              }
            })            
          }
        })

      }
    }
  });
}

function crearProvincia(provincia, indiceProvincias, provinciasCreadas, callback){ 
  const nuevaProvincia = new Provincia(provincia);
  nuevaProvincia.pais = idPais;
  nuevaProvincia.save((err, provinciaCreada) => {
    if(err){
      console.log("Error creando provincia: ", err);
      callback(err);
  }
  console.log(`Provincia creada: ${provinciaCreada.nombre}`);
  indiceProvincias.push({ idJson: provincia.id, id: provinciaCreada._id});
  provinciasCreadas.push(provinciaCreada);
  callback(null)
  })
}

function crearLocalidad(localidad, provinciasCreadas, localidadesCreadas, callback){ 
  const nuevaLocalidad = new Localidad(localidad);
  nuevaLocalidad.nombre = capitalizar(localidad.nombre);
  const idProvincia = provinciasCreadas.find( p => p.idJson === localidad.provincia.id);
  nuevaLocalidad.provincia = idProvincia.id;
  nuevaLocalidad.save((err, localidadCreada) => {
    if(err){
      console.log("Error creando localidad: ", err);
      callback(err);
    }
    console.log(`Localidad creada: ${localidadCreada.nombre}`);
    localidadesCreadas.push(localidadCreada);
    callback(null)
  })
}


function capitalizar(texto){
  texto = texto.toString().toLowerCase();
  let retorno = "";
  const palabrasExcluidas = ['de', 'a', 'y', 'o', 'del'];
  const arrTexto =  texto.split(" ");
  arrTexto.forEach(palabra => {
    if(!palabrasExcluidas.includes(palabra)){
      retorno+= palabra.charAt(0).toUpperCase() + palabra.substr(1).toLowerCase() + " ";
    }else{
      retorno+= palabra + " ";
    }
  });

  return retorno.substr(0, retorno.length - 1);
}

module.exports = {
  aprovisionarTodo
};
