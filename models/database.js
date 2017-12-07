const pg = require('pg');
const connectionString = require('../configurations').getConnectionString;
const client = new pg.Client(connectionString());


const tables = [
    `
    CREATE TABLE pais(
        id_pais int PRIMARY KEY,
        nome varchar (20) NOT NULL,
        capital varchar (20),
        continente varchar (20)
    );	
    
    CREATE TABLE estado(
        sigla_estado varchar (5) PRIMARY KEY,
        nome varchar (20) NOT NULL,
        id_pais int REFERENCES pais (id_pais)
    );
    
    CREATE TABLE aeroporto(
        sigla varchar(5)PRIMARY KEY UNIQUE,
        nome varchar(50),
        cidade varchar(20)NOT NULL,
        status boolean,
        sigla_estado varchar(5) REFERENCES estado (sigla_estado)
    );
        
    
    CREATE TABLE companhia(
        id_companhia int PRIMARY KEY,
        nome varchar (20) UNIQUE
    );
    
    CREATE TABLE aeroporto_companhia(
        id_companhia int REFERENCES companhia (id_companhia),
        sigla varchar REFERENCES aeroporto (sigla)
    );
        
    
    CREATE TABLE modelo(
        id_modelo int PRIMARY KEY,
        nome varchar (15) UNIQUE,
        fabricante varchar(10),
        capacidade int
    );
    
    CREATE TABLE aeronave(
        id_aeronave int PRIMARY KEY,
        id_companhia int REFERENCES companhia (id_companhia),
        id_modelo int REFERENCES modelo (id_modelo)
    );
   CREATE TABLE bagagem(
        id_bagagem int PRIMARY KEY,
        peso float NOT NULL,
        despacho boolean NOT NULL
    );

    CREATE TABLE voo(
        id_voo int PRIMARY KEY,	
        rota varchar(50) NOT NULL,
        horario time NOT NULL,
        data date NOT NULL,
        duracao time NOT NULL,
        id_aeronave int REFERENCES aeronave (id_aeronave)
    );
    
    CREATE TABLE passageiros(
        cpf NUMERIC(11) PRIMARY KEY UNIQUE,
        nome varchar (50) NOT NULL,
        ckeckin boolean,
        classe varchar,
        necessidade varchar (200),
        telefone varchar(15), 
        id_voo int REFERENCES voo (id_voo),
        id_bagagem int REFERENCES bagagem (id_bagagem)
    );
    
    CREATE TABLE tripulacao(
        cpf NUMERIC (11) PRIMARY KEY UNIQUE,
        nome varchar (50) NOT NULL,
        data_nasc date,
        data_admissao date,
        rua varchar(50),
        numero int,
        bairro varchar,
        cidade varchar,
        sigla_estado varchar(5) REFERENCES estado (sigla_estado),
        telefone varchar(15), 
        id_voo int REFERENCES voo (id_voo),
        atividade varchar (20) NOT NULL,
        hora_voo int
    );
   CREATE TABLE habilitacao(
        tempo_voo int,
        cpf numeric(11) REFERENCES tripulacao (cpf),
        id_modelo int REFERENCES MODELO (id_modelo),
        PRIMARY KEY (tempo_voo,id_modelo)
    );
    `
];
execQuery(tables.join(''))

async function execQuery(query) {
    client.connect();
    await client.query(query); //TODO: exec one by one?
    client.end();
}