const express = require('express');
const fs = require('fs');
const { SERVICIOS } = require('../config');
const { healthCheck } = require('../middleware.js');
const { actualizarUbicaciones } = require('./actualizarUbicaciones');

const LINEAS = SERVICIOS.lineas;

const lineasDb = {
    buscarPorLinea(linea, callback) {
        return new Promise(function(resolve, reject) {
            let data = JSON.parse(fs.readFileSync('lineas.db.json'));
            console.log(data[linea].colectivos);
            resolve(data[linea]);
        });
    }
};

const app = new express();

app.use(healthCheck);

app.get('/lineas/:linea', (req, res) => {
    const linea = req.params.linea;
    lineasDb.buscarPorLinea(linea)
    .then( function (data) {
        console.log(data);
        if (data === undefined) {
            res.sendStatus(404);
        } else {
            if (data.funciona) {
                res.json(data);
            } else {
                res.sendStatus(404);
            }
        }
    })
    .catch(function (error) {
        res.sendStatus(404);
    });
});

app.listen(LINEAS.puerto, () => {
    console.log(`[${LINEAS.nombre}] escuchando en el puerto ${LINEAS.puerto}`);
    actualizarUbicaciones();
});
