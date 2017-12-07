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
        ('NY', 'Broklin', 4),
        ('TO','Tocantins',2);
        
    
    
    INSERT INTO aeroporto
    VALUES('CWB','Aeroporto Afonso Pena','Curitiba',true,'PR'),
        ('CGH','Aeroporto de Congonhas','Sao Paulo',true,'SP'),
        ('GIG','Aeroporto do Galeão','Rio de Janeiro',false, 'RJ'),
        ('SDU','Aeroporto Santos Dumont','Rio de Janeiro',true,'RJ'),
        ('CNF','Aeroporto de Confins','Belo Horizonte',true,'MG'),
        ('NYC','Newark Airport', 'New York',true,'NY');
    
    
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
    
    INSERT INTO aeroporto_companhia
    VALUES	
    	(1,'SDU'),
        (1,'CGH'),
        (1,'GIG'),
        (1,'CNF'),
        (1,'NYC'),
        (2,'CGH'),
        (2,'GIG'),
        (2,'SDU'),
        (2,'CNF'),
        (2,'NYC'),
        (3,'GIG'),
        (3,'SDU'),
        (3,'CNF'),
        (3,'NYC'),
        (4,'CGH'),
        (4,'GIG'),
        (4,'SDU'),
        (4,'CNF'),
        (4,'NYC'),
        (5,'CGH'),
        (5,'GIG'),
        (5,'SDU'),
        (5,'CNF'),
        (5,'NYC'),
        (6,'CGH'),
        (6,'GIG'),
        (6,'SDU'),
        (6,'CNF'),
        (6,'NYC'),
        (7,'CGH'),
        (7,'GIG'),
        (7,'SDU'),
        (7,'CNF'),
        (7,'NYC'),
        (8,'CGH'),
        (8,'GIG'),
        (8,'SDU'),
        (8,'CNF'),
        (8,'NYC'),
        (9,'CGH'),
        (9,'GIG'),
        (9,'SDU'),
        (9,'CNF'),
        (9,'NYC'),
        (10,'CGH'),
        (10,'GIG'),
        (10,'SDU'),
        (10,'CNF'),
        (10,'NYC');
        
    
    
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
        (318,8,7),
        (987,1,1),
        (876,2,2),
        (765,3,3),
        (654,4,4),
        (543,5,5),
        (432,6,6),
        (321,7,7),
        (219,8,8);
    
        
    INSERT INTO voo
    VALUES 	
        (001,'Sao Paulo/Curitiba','15:10','2017/12/15','00:40',123),
        (002,'Porto Alegre/Rio de Janeiro','18:35','2017/12/20','02:30',234),
        (004,'Sao Paulo/Madri','06:30','2017/12/01','07:00',318),
        (005,'Sao Paulo/Nova Yorke','12:30','2018/01/10','10:00',318),
        (006,'Curitiba/Nova Yorke','12:05','2017/12/31','12:00',123),
        (007,'Nova York/Lisboa',	'13:25','2017/11/05','13:10',234),
        (008,'Brasilia/Salvador',	'12:00','2018/03/21','14:15',201),
        (009,'Rio/Janeiro',			'12:00','2018/01/11','16:05',318),
        (010,'Sao Paulo/Curitiba',	'05:00','2018/02/03','19:30',987),
        (011,'Porto Alegre/Florianopolis',	'05:00','2018/02/03','18:25',876),
        (012,'Salvador/Fortaleza',			'05:00','2017/12/28','06:45',765),
        (013,'Rio de Janeiro/Paris',		'02:00','2017/12/25','07:00',654),
        (014,'Sao paulo/Sidney',			'01:00','2017/12/24','08:10',543),
        (015,'Sao Paulo/Rio de Janeiro',	'05:00','2017/12/29','10:20',432),
        (016,'Belo Horizonte/Manaus',		'06:00','2017/12/27','00:00',321),
        (666,'Berlin/Madri',				'05:00','2666/06/06','03:00',219);
    
    INSERT INTO bagagem
    VALUES 	(01,18.000,TRUE),
        (02,15.000,FALSE),
        (03,17.300,TRUE),
        (04,11.000,TRUE),
        (05,12.000,TRUE),
        (06,13.000,TRUE),
        (07,14.000,TRUE),
        (08,15.000,TRUE),
        (09,16.000,FALSE);	
    
    
    INSERT INTO passageiros
    VALUES ('19337264749','ALESSANDRA AZEVEDO DA COSTA',true,'economica',NULL,984575412,	001,01),
        ('42159270130','ANTONIO FURTADO NUNES',false,'executiva',NULL,99932010178,			002,02),
        ('41234653826','DANIEL PEREIRA COSTA',true,'economica',NULL,9715484765,				001,03),
        ('73896802453','KARINA DE CASSIA MAIA',true,'vip',NULL,99645786598,001,null),
        ('27749159886','JEFFERSON MACHADO PEREIRA',false,'economica',NULL,98845781203,002,null),
        ('64610764920','SAMARA BRITO DO NASCIMENTO ',true,'especial','cadeirante',956457812,001,null),
        ('74658379287','NATALIA CIBELLE DA SILVA BARBOSA ',true,'executiva',NULL,99954612320,002,null),
        ('30727280899','ALEXANDRA FERREIRA DA SILVA',		false,'economica',NULL,99339200017,005,NULL),
        ('36397581888','ALINE FELIX DA SILVA SANTOS',		TRUE,'vip',NULL,99441670416,				005,04),
        ('33197258827','ALINE FERREIRA DOS SANTOS',			TRUE,'especial',	'cadeirante',99435891431,	005,05),
        ('38344633885','CIDILAINE DA SILVA',				TRUE,'executiva',	NULL,99493686952,	005,06),
        ('29513624803','ELIVELTON DOS SANTOS PIRES',		TRUE,'economica', 	NULL, 99493646852,005,07),
        ('38613219802','KIMAYR RODRIGUES DOS SANTOS',		TRUE,'vip',			NULL,99447338328,		005,08),
        ('39697049874','EDJANETE ANNE FRANCYS NAJA SILVA',	TRUE,'economica',	NULL,9942200418,	005,09);
    
    
    INSERT INTO tripulacao
    VALUES	('41514050200','JACKSON FERREIRA PEREIRA','1980/05/04','2005/01/20','Rua 1200',470,'Barra da Tijuca','Rio de Janeiro','RJ','99687451232',001,'piloto',8000),
        ('34181954234','JEAN PHABLO SANTOS DE SOUZA','1985/07/28','2010/06/13','Rua 90',100,'Vilha Velha','Osasco','SP','987653214',001,'copiloto',4500),
        ('57372110297' , 'MARCIA ANDREIA COLARES PINHEIRO','1987/10/15','2012/03/17','Rua 920',550,'Centro','Florianopolis','SC','99145786230,',001,'comissária',2200);
           
    
    INSERT INTO habilitacao
    VALUES  (2500,'41514050200',4);

    `
];
execQuery(data.join(''))
    .then(finishConnection);
