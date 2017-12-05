const {execQuery, finishConnection} = require('../connection');

const data = [
    `
    INSERT INTO pais
    VALUES(1,'Alemanha','Berlin','Europa'),
        (2,'Brasil','Brasilia','America'),
        (3,'Canada','Ottawa','America'),
        (4,'Estados Unidos','Whashington','America'),
        (5,'Egito','Cairo','Africa'),
        (6,'Japao','Toquio','Asia'),
        (7,'Australia','Camberra','Oceania'),
        (8,'Holanda','Amsterda','Europa');

    INSERT INTO estado
    VALUES	('AC','Acre',2),
        ('AL','Alagoas',2),
        ('AP','Amapá',2),
        ('AM','Amazonas',2),
        ('BH','Bahia',2),
        ('CE','Ceará',2),
        ('DF','Distrito Federal',2),
        ('ES','Espírito Santo',2),
        ('GO','Goiás',2),
        ('MA','Maranhão',2),
        ('MT','Mato Grosso',2),
        ('MS','Mato Grosso do Sul',2),
        ('MG','Minas Gerais',2),	
        ('PA','Pará',2),
        ('PB','Paraíba',2),
        ('PR','Paraná',2),
        ('PE','Pernambuco',2),
        ('PI','Piauí',2),
        ('RJ','Rio de Janeiro',2),
        ('RN','Rio Grande do Norte',2),
        ('RS','Rio Grande do Sul',2),
        ('RO','Rondônia',2),
        ('RR','Roraima',2),
        ('SC','Santa Catarina',2),
        ('SP','São Paulo',2),
        ('SE','Sergipe',2),
        ('TO','Tocantins',2);

    INSERT INTO aeroporto
    VALUES('CWB','Aeroporto Afonso Pena','Curitiba',true,'PR'),
        ('CGH','Aeroporto de Congonhas','Sao Paulo',true,'SP'),
        ('GIG','Aeroporto do Galeão','Rio de Janeiro',false, 'RJ'),
        ('SDU','Aeroporto Santos Dumont','Rio de Janeiro',true,'RJ'),
        ('CNF','Aeroporto de Confins','Belo Horizonte',true,'MG');
        
    INSERT INTO companhia
    VALUES (1,'Latam'),
        (2,'Gol'),
        (3,'Avianca'),
        (4,'Azul'),
        (5,'Air France'),
        (6,'Emirates'),
        (7,'Delta'),
        (8,'TAP Portugal'),
        (9,'American AirLines'),
        (10,'Continental AirLines');

    INSERT INTO modelo
        VALUES 	(1,'A380','AirBus',550),
            (2,'777','Boeing',555),
            (3,'A320','AirBus',220),
            (4,'A319','AirBus',220),
            (5,'737','Boeing',215),
            (6,'747','Boeing',416),
            (7,'787','Boeing',420),
            (8,'E195-E2','Embraer',110);

    INSERT INTO aeronave
        VALUES 	(123,3,4),
            (234,1,5),
            (201,2,3),
            (318,8,7);

    INSERT INTO voo
    VALUES 	(001,'Sao Paulo/Curitiba','15:10','2017/12/15','00:40',123),
        (002,'Porto Alegre/Rio de Janeiro','18:35','2017/12/20','02:30',234),
        (004,'Sao Paulo/Madri','06:30','2017/12/01','07:00',318);    
    
    INSERT INTO aeroporto_companhia
    VALUES	(3,'CGH'),
        (4,'CWB'),
        (1,'SDU');
        
    INSERT INTO bagagem
    VALUES 	(01,18.000,TRUE),
        (02,15.000,FALSE),
        (03,17.300,TRUE);

    INSERT INTO passageiros
    VALUES ('19337264749','ALESSANDRA AZEVEDO DA COSTA',true,'economica',NULL,984575412,001,01),
        ('42159270130','ANTONIO FURTADO NUNES',false,'executiva',NULL,99932010178,002,02),
        ('41234653826','DANIEL PEREIRA COSTA',true,'economica',NULL,9715484765,001,03),
        ('73896802453','KARINA DE CASSIA MAIA',true,'vip',NULL,99645786598,001,null),
        ('27749159886','JEFFERSON MACHADO PEREIRA',false,'economica',NULL,98845781203,002,null),
        ('64610764920','SAMARA BRITO DO NASCIMENTO ',true,'especial','cadeirante',956457812,001,null),
        ('74658379287','NATALIA CIBELLE DA SILVA BARBOSA ',true,'executiva',NULL,99954612320,002,null);
    
    INSERT INTO tripulacao
    VALUES	('41514050200','JACKSON FERREIRA PEREIRA','1980/05/04','2005/01/20','Rua 1200',470,'Barra da Tijuca','Rio de Janeiro','RJ','99687451232',001,'piloto',8000),
        ('34181954234','JEAN PHABLO SANTOS DE SOUZA','1985/07/28','2010/06/13','Rua 90',100,'Vilha Velha','Osasco','SP','987653214',001,'copiloto',4500),
        ('57372110297' , 'MARCIA ANDREIA COLARES PINHEIRO','1987/10/15','2012/03/17','Rua 920',550,'Centro','Florianopolis','SC','99145786230,',001,'comissária',2200);
    
    INSERT INTO habilitacao
    VALUES  (2500,'41514050200',4)
    `
];
execQuery(data.join(''))
    .then(finishConnection)
