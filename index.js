const express = require('express');
const fs = require('fs/promises');

const app = express();
const port = 3000;

let cachedData = null;

app.get('/',(req,res)=>{
    res.send('API de Codigos Postales By C3S4R')
})

app.get('/api/:codigo', async (req, res) => {
    try {
        const codigoBuscado = req.params.codigo;
        const data = await loadData();

        const tablaEncontrada = findTableByCode(data, codigoBuscado);

        if (tablaEncontrada) {
            const respuesta = {
                county: tablaEncontrada.d_ciudad || tablaEncontrada.d_asenta,
                municipality: tablaEncontrada.D_mnpio,
                state: tablaEncontrada.d_estado,
                country: 'MEX',
                zip: codigoBuscado
            };

            res.json(respuesta);
        } else {
            res.status(404).send('Código no encontrado');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Error interno del servidor');
    }
});

async function loadData() {
    if (!cachedData) {
        const jsonData = await fs.readFile('./Database/CPdescarga.json', 'utf-8');
        cachedData = JSON.parse(jsonData);
    }
    return cachedData;
}

function findTableByCode(data, codigo) {
    return data.NewDataSet.table.find((tabla) => tabla.d_codigo === parseInt(codigo));
}

app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});
