const express = require('express');
const router = express.Router();
const { tablesToInsertQuery } = require('../builders/insertBuilder');
const { tableToUpdateQuery } = require('../builders/updateBuilder');
const { execQuery, finishConnection } = require('../connection');

//Read
router.get('/fligths/', async function(req, res, next) {
    const table = 'voo';
    const selectQ = `
        SELECT rota, horario, duracao, nome FROM voo
            JOIN aeronave ON (aeronave.id_aeronave = voo.id_aeronave)
            JOIN companhia ON (companhia.id_companhia = aeronave.id_companhia)    
    `;

    try {
        const queryResult = await execQuery(selectQ);
        console.log(queryResult.rows);
        res.status(200).json(queryResult.rows);
    } catch (e){
        console.error(e);
        res.status(500).json({success:false});
    } finally {
        finishConnection();
    }
});

//Read
router.get('/company/airports/', async function(req, res, next) {
    const selectQ = `
        SELECT companhia.nome, aeroporto.sigla, aeroporto.nome, sigla_estado, status FROM companhia
            JOIN aeroporto_companhia ON (aeroporto_companhia.id_companhia = companhia.id_companhia)
            JOIN aeroporto ON (aeroporto.sigla = aeroporto_companhia.sigla )
    `;

    try {
        const queryResult = await execQuery(selectQ);
        console.log(queryResult.rows);
        res.status(200).json(queryResult.rows);
    } catch (e){
        console.error(e);
        res.status(500).json({success:false});
    } finally {
        finishConnection();
    }
});

//Read
router.get('/passengers/fligths/', async function(req, res, next) {
    const selectQ = `
        SELECT cpf, nome, classe, necessidade, rota, data, horario, despacho FROM passageiros
            LEFT JOIN bagagem ON ( bagagem.id_bagagem = passageiros.id_bagagem)
            JOIN voo ON  (passageiros.id_voo = voo.id_voo) 
            WHERE passageiros.ckeckin = true
    `;

    try {
        const queryResult = await execQuery(selectQ);
        console.log(queryResult.rows);
        res.status(200).json(queryResult.rows);
    } catch (e){
        console.error(e);
        res.status(500).json({success:false});
    } finally {
        finishConnection();
    }
});


/*
{
	"tables" : {
		"pais": [{
			"id_pais": 9,
			"nome":"Banania",
			"capital":"PQP",
			"continente":"HUENIA"
		},
		{
			"id_pais": 9,
			"nome":"Banania",
			"capital":"PQP",
			"continente":"HUENIA"
		}]
	}
}


* */

module.exports = router;