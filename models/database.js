const pg = require('pg');
const userName = "postgres";
const password = "adm";
const host = "localhost";
const dbName = "Aeroporto";
const connectionDBStr = 'postgres://'+userName+':'+password+'@'+host+':5432/'+dbName;
const client = new pg.Client(connectionDBStr);

const planeTable = `
                    CREATE TABLE public."Avioes"
                    (
                        modelo character varying(50) COLLATE pg_catalog."default" NOT NULL,
                        registro bigint NOT NULL DEFAULT nextval('"Avioes_registro_seq"'::regclass),
                        max_passageiros integer NOT NULL,
                        max_carga integer NOT NULL,
                        data_aquisicao date NOT NULL,
                        companhia character varying(50) COLLATE pg_catalog."default" NOT NULL,
                        CONSTRAINT "Avioes_pkey" PRIMARY KEY (registro)
                    )
                    WITH (
                        OIDS = FALSE
                    )
                    TABLESPACE pg_default;
                    
                    ALTER TABLE public."Avioes"
                    OWNER to ${userName};
                  `;
const clientsTable = `
                    CREATE TABLE public."Clientes"
                    (
                        nome character varying(50)[] COLLATE pg_catalog."default" NOT NULL,
                        cpf character(11)[] COLLATE pg_catalog."default" NOT NULL,
                        data_nascimento date NOT NULL,
                        telefone character varying(15) COLLATE pg_catalog."default" NOT NULL,
                        endereco text COLLATE pg_catalog."default" NOT NULL,
                        CONSTRAINT "Clientes_pkey" PRIMARY KEY (cpf)
                    )
                    WITH (
                        OIDS = FALSE
                    )
                    TABLESPACE pg_default;
                    
                    ALTER TABLE public."Clientes"
                        OWNER to ${userName};
                    `;

const staffTable = `
                    CREATE TABLE public."Funcionarios"
                    (
                        cpf character varying(11) COLLATE pg_catalog."default" NOT NULL,
                        data_admissao date NOT NULL,
                        endereco text COLLATE pg_catalog."default" NOT NULL,
                        nome character varying(50) COLLATE pg_catalog."default" NOT NULL,
                        telefone character varying(15) COLLATE pg_catalog."default" NOT NULL,
                        cargo character varying(30) COLLATE pg_catalog."default",
                        CONSTRAINT "Funcionarios_pkey" PRIMARY KEY (cpf)
                    )
                    WITH (
                        OIDS = FALSE
                    )
                    TABLESPACE pg_default;
                    
                    ALTER TABLE public."Funcionarios"
                        OWNER to ${userName};
                    `;

const passangersTable = `
                        CREATE TABLE public."Passageiros"
                        (
                            nome character varying[],
                            cpf character[],
                            data_nascimento date,
                            telefone character varying,
                            endereco text,
                            nr_voo date NOT NULL,
                            hr_voo character(5)[] COLLATE pg_catalog."default" NOT NULL,
                            portao_embarque integer NOT NULL,
                            destino character varying(30) COLLATE pg_catalog."default" NOT NULL
                        )
                            INHERITS (public."Clientes")
                        WITH (
                            OIDS = FALSE
                        )
                        TABLESPACE pg_default;
                        
                        ALTER TABLE public."Passageiros"
                            OWNER to ${userName};
                        `;

const flightsTable = `
                    CREATE TABLE public."Voos"
                    (
                        id bigint NOT NULL DEFAULT nextval('"Voos_id_seq"'::regclass),
                        tripulacao character varying(11)[] COLLATE pg_catalog."default" NOT NULL,
                        data date NOT NULL,
                        hora character(5) COLLATE pg_catalog."default" NOT NULL,
                        nr_passageiros integer NOT NULL,
                        modelo_aviao bigint NOT NULL,
                        passageiros character varying(500)[] COLLATE pg_catalog."default" NOT NULL,
                        origem character varying(50) COLLATE pg_catalog."default" NOT NULL,
                        destino character varying(50) COLLATE pg_catalog."default" NOT NULL,
                        portao_embarque integer NOT NULL,
                        CONSTRAINT "Voos_pkey" PRIMARY KEY (id)
                    )
                    WITH (
                        OIDS = FALSE
                    )
                    TABLESPACE pg_default;
                    
                    ALTER TABLE public."Voos"
                        OWNER to ${userName};
                    `;

client.connect();
const query = client.query(planeTable+clientsTable+staffTable+passangersTable+flightsTable);
query.on('end', function() {
    client.end();
});