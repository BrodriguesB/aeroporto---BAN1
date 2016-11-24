(function() {
    'strict mode';
    const pg = require('pg');

    const userName = "postgres";
    const password = "adm";
    const host = "localhost";
    const dbName = "aeroporto";
    const connectionDBStr = 'postgres://' + userName + ':' + password + '@' + host + ':5432/' + dbName;
    const client = new pg.Client(connectionDBStr);

    const tables = [
        `
        create table modelo_aviao(
            id_modelo_aviao numeric(11),
            cod_modelo_aviao character varying(50),
            num_capacidade_passageiros numeric(5),
            qtd_peso numeric(6,2),
            num_maximo_aeroporto numeric(3),
            primary key (id_modelo_aviao)
        )`,
        `create table aviao(
            id_aviao numeric(11),
            id_modelo_aviao numeric(11),
            primary key (id_aviao),
            foreign key (id_modelo_aviao) references modelo_aviao(id_modelo_aviao)
        )`,
        `create table sindicato(
            id_sindicato numeric(11),
            den_sindicato character varying(50),
            primary key (id_sindicato)
        )`,
        `create table cargo(
            id_cargo numeric(11),
            den_cargo character varying(50),
            primary key(id_cargo)
        )`,
        `create table funcionario(
            num_matricula numeric(11),
            nom_funcionario character varying(50),
            den_endereco character varying(50),
            num_telefone numeric(15),
            val_salario numeric(8,2),
            id_cargo numeric(11),
            num_membro_sindicato numeric(11),
            id_sindicato numeric(11),
            primary key (num_matricula),
            foreign key(id_cargo) references cargo(id_cargo),
            foreign key(id_sindicato) references sindicato(id_sindicato)
        )`,
        `create table habilidades(
            id_funcionario numeric(11),
            id_modelo numeric(11),
            primary key (id_funcionario, id_modelo),
            foreign key (id_funcionario) references funcionario(num_matricula),
            foreign key (id_modelo) references modelo_aviao(id_modelo_aviao)
        )`,
        `create table exame_medico(
            id_exame_medico numeric(15),
            id_funcionario numeric(11),
            dat_exame date,
            primary key (id_exame_medico),
            foreign key (id_funcionario) references funcionario(num_matricula)
        )`,
        `create table teste_principal(
            id_teste_principal numeric(11),
            cod_teste_anac character varying(50),
            den_teste character varying(50),
            val_pontuacao_maxima numeric(4),
            primary key (id_teste_principal)
        )`,
        `create table teste_aviao(
            id_teste_aviao numeric(20),
            id_teste_principal numeric(11),
            id_aviao numeric(11),
            dat_teste date,
            id_funcionario numeric(11),
            val_pontuacao_aviao numeric(4),
            primary key (id_teste_aviao),
            foreign key (id_teste_principal) references teste_principal(id_teste_principal),
            foreign key (id_aviao) references aviao(id_aviao),
            foreign key (id_funcionario) references funcionario(num_matricula)
        )`
    ];
    client.connect();
    const query = client.query(tables.join('; ')); //TODO: exec one by one?
    query.on('end', function () {
        client.end();
    });
})();