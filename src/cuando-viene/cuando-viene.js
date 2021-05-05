const express = require('express');
const { colectivoMasCercano } = require('../ubicacion');
const { get } = require('../request');
const { healthCheck } = require('../middleware.js');
const { SERVICIOS } = require('../config');
const http = require('../request');

const TRANSITO = SERVICIOS.cuandoViene;

const app = new express();

app.use(healthCheck);

app.get('/cuando-viene/:parada', (req, res) => {
    const parada = req.params.parada;

    let data = '';
    const url = {host: 'localhost', puerto: '3000'}
    http.get(url, '/paradas/' + parada, (error, data) => {
        if (error) {
            res.sendStatus(404);
        }
        let promises = [];
        data.lineas.forEach( linea => {
           promises.push(getColectivo(error, linea));
        });
        Promise.all(promises).then( function (data) {
            
        });
        
        res.json(colectivosMasCercanos);
    });
    // Queremos obtener, para cada linea de la parada, el próximo colectivo que va a llegar
});

app.listen(TRANSITO.puerto, () => {
    console.log(`[${TRANSITO.nombre}] escuchando en el puerto ${TRANSITO.puerto}`);
});


function getColectivo(e, linea) {
    return new Promise(function(resolve, reject) {
        http.get(url, '/lineas/' + linea), (e, dataColectivos) => {
            resolve({linea : linea, tiempo: colectivoMasCercano(dataColectivos.colectivos, data.ubicacion)});
        }
    });
}

