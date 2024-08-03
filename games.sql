-- drop statements
drop table Game cascade constraints;
drop table GameReview cascade constraints;
drop table Genre cascade constraints;
drop table GamePerson cascade constraints;
drop table Company cascade constraints;
drop table ESportsOrganization cascade constraints;
drop table Platform cascade constraints;
drop table Console cascade constraints;
drop table PC cascade constraints;
drop table inGenre cascade constraints;
drop table CompetesIn cascade constraints;
drop table worksAt cascade constraints;
drop table workedOn cascade constraints;
drop table runsOn cascade constraints;
drop table Developed cascade constraints;
drop table Published cascade constraints; 

-- relations
CREATE TABLE Game(
	game_id INT,
	game_name VARCHAR2(255),
	year_released INT,
	budget INT,
	PRIMARY KEY (game_id)
);

CREATE TABLE GameReview (
	game_id INT NOT NULL,
	author VARCHAR2(255),
	rev_desc VARCHAR2(255),
	score INT,
	PRIMARY KEY (game_id, author),
	FOREIGN KEY (game_id) 
		REFERENCES Game(game_id)
		ON DELETE CASCADE
);

CREATE TABLE Genre (
	genre_name VARCHAR2(255),
	 PRIMARY KEY (genre_name)
);

CREATE TABLE GamePerson (
	gameperson_id INT,
	DOB DATE,
	gpname VARCHAR2(255),
	role VARCHAR2(255),
	PRIMARY KEY (gameperson_id)
);

CREATE TABLE Company(
	company_id INT,
	company_name VARCHAR2(255),
	country VARCHAR2(255),
	PRIMARY KEY (company_id)
);

CREATE TABLE ESportsOrganization(
	es_id INT,
	num_trophies INT,
	es_name VARCHAR2(255),
	PRIMARY KEY (es_id)
);

CREATE TABLE Platform (
	platform_name VARCHAR2(255),
	manufacturer VARCHAR2(255),
	PRIMARY KEY (platform_name)
);

CREATE TABLE PC (
	platform_name VARCHAR2(255),
	company VARCHAR2(255),
	os_name VARCHAR2(255),
	os_year INT,
	PRIMARY KEY (os_name),
	FOREIGN KEY (platform_name)
		REFERENCES Platform(platform_name)
		ON DELETE CASCADE
);

CREATE TABLE Console (
	platform_name VARCHAR2(255),
	console_year INT,
	mobility VARCHAR2(255),
	PRIMARY KEY (platform_name),
	FOREIGN KEY (platform_name) 
		REFERENCES Platform(platform_name)
		ON DELETE CASCADE
);

-- Relationships

CREATE TABLE inGenre(
	game_id INT,
	genre_name VARCHAR2(255),
	PRIMARY KEY (game_id, genre_name),
	FOREIGN KEY (game_id)
		REFERENCES Game(game_id) 
		ON DELETE CASCADE,
	FOREIGN KEY (genre_name) 
		REFERENCES Genre(genre_name) 
		ON DELETE CASCADE
);

CREATE TABLE CompetesIn (
	es_id INT,
	game_id INT,
	PRIMARY KEY (es_id, game_id),
	FOREIGN KEY (es_id) 
		REFERENCES ESportsOrganization(es_id) 
		ON DELETE CASCADE,
	FOREIGN KEY (game_id) 
		REFERENCES Game(game_id) 
		ON DELETE CASCADE 
);

CREATE TABLE worksAt (
	gameperson_id INT,
	years_at_company INT,
	company_id INT NOT NULL,
	PRIMARY KEY (gameperson_id), 
	FOREIGN KEY (gameperson_id)
		REFERENCES GamePerson(gameperson_id) 
		ON DELETE CASCADE,
	FOREIGN KEY (company_id) 
		REFERENCES Company(company_id)
		ON DELETE CASCADE
);

CREATE TABLE workedOn (
	gameperson_id INT,
	game_id INT,
	PRIMARY KEY (gameperson_id , game_id),
	FOREIGN KEY (gameperson_id ) 
		REFERENCES GamePerson(gameperson_id) 
		ON DELETE CASCADE,
	FOREIGN KEY (game_id) 
		REFERENCES Game(game_id) 
		ON DELETE CASCADE 
);

CREATE TABLE runsOn (
	platform_name VARCHAR2(255),
	game_id INT,
	PRIMARY KEY (platform_name, game_id),
	FOREIGN KEY (platform_name)
		REFERENCES Platform(platform_name)
		ON DELETE CASCADE,
	FOREIGN KEY (game_id)
		REFERENCES Game(game_id)
		ON DELETE CASCADE
);

CREATE TABLE Developed (
	company_id INT,
	game_id INT,
	year_dev INT,
	PRIMARY KEY (company_id, game_id),
	FOREIGN KEY (company_id)
		REFERENCES Company(company_id)
		ON DELETE CASCADE,
	FOREIGN KEY (game_id)
		REFERENCES Game(game_id)
		ON DELETE CASCADE
);

CREATE TABLE Published (
	company_id INT,
	game_id INT,
	year_pub INT,
	PRIMARY KEY (company_id, game_id),
	FOREIGN KEY (company_id)
		REFERENCES Company(company_id)
		ON DELETE CASCADE,
	FOREIGN KEY (game_id)
		REFERENCES Game(game_id)
		ON DELETE CASCADE
);


-- -- insert data

-- Game 
-- Entity
-- INSERT INTO Game VALUES (game_id, game_name, year_released, budget)
INSERT INTO Game VALUES (1, 'The Legend of Zelda: Breath of the Wild', 2017, 12000000);
INSERT INTO Game VALUES (2, 'The Witcher 3: Wild Hunt', 2015, 81000000);
INSERT INTO Game VALUES (3, 'Red Dead Redemption 2', 2018, 54000000);
INSERT INTO Game VALUES (4, 'Rainbow Six Siege', 2015, NULL);
INSERT INTO Game VALUES (5, 'Cyberpunk 2077', 2020, 174000000);
INSERT INTO Game VALUES (6, 'Grand Theft Auto V', 2013, 265000000);
INSERT INTO Game VALUES (7, 'Fortnite', 2017, 20000000);
INSERT INTO Game VALUES (8, 'Among Us', 2018, 300000);
INSERT INTO Game VALUES (9, 'Hades', 2020, 5000000);
INSERT INTO Game VALUES (10, 'Dark Souls III', 2016, 30000000);
INSERT INTO Game VALUES (11, 'League Of Legends', 2009, 100000000);
INSERT INTO Game VALUES (12, 'Valorant', 2020, 20000000);
INSERT INTO Game VALUES (13, 'Maplestory', 2003, 30000);
INSERT INTO Game VALUES (14, 'Fifa Online 4', 2018, 50000);
INSERT INTO Game VALUES (15, 'Minecraft', 2011, 0);
INSERT INTO Game VALUES (16, 'Starcraft', 1998, 100000000);
INSERT INTO Game VALUES (17, 'Gran Turismo', 2009, 100000);
INSERT INTO Game VALUES (18, 'Call of Duty: Mobile', 2019, 35000);
INSERT INTO Game VALUES (19, 'The Last of Us', 2013, 100000000);
INSERT INTO Game VALUES (20, 'The Last of Us Part II', 2020, 120000000);
INSERT INTO Game VALUES (21, 'BioShock', 2007, 25000000);
INSERT INTO Game VALUES (22, 'Half-Life', 1998, 8500000);
INSERT INTO Game VALUES (23, 'Journey', 2012, 5000000);
INSERT INTO Game VALUES (24, 'God of War', 2018, 50000000);
INSERT INTO Game VALUES (25, 'Gears of War', 2006, 10000000);
INSERT INTO Game VALUES (26, 'Psychonauts', 2005, 11000000);
INSERT INTO Game VALUES (27, 'Portal', 2007, 3000000);

-- Company
-- Entity
-- INSERT INTO Company VALUES (company_id, company_name, country)
INSERT INTO Company VALUES (100, 'Riot Games', 'United States');
INSERT INTO Company VALUES (101, 'Mojang Studios', 'Sweden');
INSERT INTO Company VALUES (102, 'Electronic Arts', 'United States');
INSERT INTO Company VALUES (103, 'Nexon', 'Korea, Republic of');
INSERT INTO Company VALUES (104, 'Activision Blizzard', 'United States');
INSERT INTO Company VALUES (105, 'Rockstar Games', 'United States');
INSERT INTO Company VALUES (106, 'Xbox Game Studios', 'United States');
INSERT INTO Company VALUES (107, 'Sony Interactive Entertainment', 'Japan');
INSERT INTO Company VALUES (108, 'CD Projekt Red', 'Poland'); 
INSERT INTO Company VALUES (109, 'Ubisoft', 'France'); 
INSERT INTO Company VALUES (110, 'Epic Games', 'United States'); 
INSERT INTO Company VALUES (111, 'Innersloth', 'United States');
INSERT INTO Company VALUES (112, 'Supergiant Games', 'United States'); 
INSERT INTO Company VALUES (113, 'FromSoftware', 'Japan'); 
INSERT INTO Company VALUES (114, 'Nintendo', 'Japan'); 
INSERT INTO Company VALUES (115, 'Polyphony Digital', 'Japan'); 
INSERT INTO Company VALUES (116, 'Naughty Dog', 'United States');
INSERT INTO Company VALUES (117, 'Valve Corporation', 'United States');
INSERT INTO Company VALUES (118, 'Bungie', 'United States');
INSERT INTO Company VALUES (119, 'Double Fine Productions', 'United States');
INSERT INTO Company VALUES (120, 'Thatgamecompany', 'United States');
INSERT INTO Company VALUES (121, 'Bandai Namco Entertainment', 'Japan');
INSERT INTO Company VALUES (122, '2K Games', 'United States');
INSERT INTO Company VALUES (123, 'Sony Santa Monica', 'United States');
INSERT INTO Company VALUES (124, 'Ubisoft Montreal', 'Canada');
INSERT INTO Company VALUES (125, 'Warner Bros. Interactive Entertainment', 'United States');
INSERT INTO Company VALUES (126, 'THQ', 'United States');

-- GamePerson
-- Entity
-- INSERT INTO GamePerson VALUES (game_person_id, DOB, gpname, role)
INSERT INTO GamePerson VALUES (1001, DATE '1982-04-10', 'Brandon Beck', 'Co-Founder');
INSERT INTO GamePerson VALUES (1002, DATE '1980-08-17', 'Marc Merrill', 'Co-Founder');
INSERT INTO GamePerson VALUES (1003, DATE '1968-02-22', 'Jung-ju Kim', 'Founder');
INSERT INTO GamePerson VALUES (1004, DATE '1967-11-03', 'Michael Morhaime', 'Co-Founder'); 
INSERT INTO GamePerson VALUES (1005, DATE '1979-06-01', 'Markus Persson', 'Founder');
INSERT INTO GamePerson VALUES (1006, DATE '1971-11-03', 'Sam Houser', 'Co-Founder');
INSERT INTO GamePerson VALUES (1007, NULL, 'Hideaki Nishino', 'CEO');
INSERT INTO GamePerson VALUES (1008, DATE '1971-03-01', 'Hermen Hulst', 'CEO');
INSERT INTO GamePerson VALUES (1009, DATE '1972-06-21', 'Shigeru Miyamoto', 'Game Designer');
INSERT INTO GamePerson VALUES (1010, DATE '1978-01-31', 'Todd Howard', 'Game Director');
INSERT INTO GamePerson VALUES (1011, DATE '1972-05-23', 'Ken Levine', 'Creative Director');
INSERT INTO GamePerson VALUES (1012, DATE '1982-07-09', 'Neil Druckmann', 'Writer');
INSERT INTO GamePerson VALUES (1013, DATE '1974-08-15', 'Hideo Kojima', 'Game Designer');
INSERT INTO GamePerson VALUES (1014, DATE '1975-02-10', 'Cory Barlog', 'Creative Director');
INSERT INTO GamePerson VALUES (1015, DATE '1983-09-28', 'Gabe Newell', 'Co-Founder');
INSERT INTO GamePerson VALUES (1016, DATE '1980-04-12', 'Amy Hennig', 'Writer');
INSERT INTO GamePerson VALUES (1017, DATE '1985-11-30', 'Cliff Bleszinski', 'Game Designer');
INSERT INTO GamePerson VALUES (1018, DATE '1981-09-12', 'Chris Avellone', 'Writer');
INSERT INTO GamePerson VALUES (1019, DATE '1977-10-11', 'Jonathan Blow', 'Game Designer');
INSERT INTO GamePerson VALUES (1020, DATE '1980-03-14', 'Randy Pitchford', 'CEO');
INSERT INTO GamePerson VALUES (1021, DATE '1973-12-22', 'Tim Schafer', 'Game Designer');
INSERT INTO GamePerson VALUES (1022, DATE '1985-05-06', 'Jenova Chen', 'Game Designer');

-- Platform
-- Entity
-- INSERT INTO Platform VALUES (platform_name, manufacturer)
INSERT INTO Platform VALUES ('Windows', 'Microsoft'); 
INSERT INTO Platform VALUES ('MacOS', 'Apple'); 
INSERT INTO Platform VALUES ('Xbox 360', 'Microsoft');
INSERT INTO Platform VALUES ('Xbox One', 'Microsoft');
INSERT INTO Platform VALUES ('Xbox Series X/S', 'Microsoft');
INSERT INTO Platform VALUES ('PlayStation 3', 'Sony'); 
INSERT INTO Platform VALUES ('PlayStation 4', 'Sony'); 
INSERT INTO Platform VALUES ('PlayStation 5', 'Sony');
INSERT INTO Platform VALUES ('Switch', 'Nintendo'); 
INSERT INTO Platform VALUES ('PSP', 'Sony'); 
INSERT INTO Platform VALUES ('iOS', 'Apple'); 
INSERT INTO Platform VALUES ('Android', 'Google'); 

-- Console
-- Entity
-- INSERT INTO Console VALUES (Platform(platform_name), console_year, mobility)
INSERT INTO Console VALUES ('Xbox 360', 2005, 'Stationary');  
INSERT INTO Console VALUES ('Xbox One', 2013, 'Stationary');
INSERT INTO Console VALUES ('PlayStation 3', 2006, 'Stationary');  
INSERT INTO Console VALUES ('PlayStation 4', 2013, 'Stationary');  
INSERT INTO Console VALUES ('Switch', 2017, 'Mobile');
INSERT INTO Console VALUES ('PSP', 2005, 'Mobile');
INSERT INTO Console VALUES ('Xbox Series X/S', 2020, 'Stationary');
INSERT INTO Console VALUES ('PlayStation 5', 2020, 'Stationary');

-- PC
-- Entity
-- INSERT INTO PC VALUES (Platform(platform_name), company, os_name, os_year)
INSERT INTO PC VALUES ('Windows', 'Microsoft', 'Windows 1.0', 1985); 
INSERT INTO PC VALUES ('Windows', 'Microsoft', 'Windows XP', 2001); 
INSERT INTO PC VALUES ('Windows', 'Microsoft', 'Windows 7', 2009); 
INSERT INTO PC VALUES ('Windows', 'Microsoft', 'Windows 10', 2015); 
INSERT INTO PC VALUES ('MacOS', 'Apple', 'Mac OS X 10.5 Leopard', 2007); 
INSERT INTO PC VALUES ('MacOS', 'Apple', 'macOS Catalina', 2019); 
INSERT INTO PC VALUES ('MacOS', 'Apple', 'macOS Big Sur', 2020); 
INSERT INTO PC VALUES ('MacOS', 'Apple', 'macOS Sequoia', 2024); 


-- Developed
-- Relation
-- INSERT INTO Developed VALUES (Company(company_id), Game(game_id), year_dev)
INSERT INTO Developed VALUES (114, 1, 2017); 
INSERT INTO Developed VALUES (108, 2, 2015); 
INSERT INTO Developed VALUES (105, 3, 2018); 
INSERT INTO Developed VALUES (109, 4, 2015); 
INSERT INTO Developed VALUES (108, 5, 2020); 
INSERT INTO Developed VALUES (105, 6, 2013); 
INSERT INTO Developed VALUES (110, 7, 2017); 
INSERT INTO Developed VALUES (111, 8, 2018); 
INSERT INTO Developed VALUES (112, 9, 2020); 
INSERT INTO Developed VALUES (113, 10, 2016); 
INSERT INTO Developed VALUES (100, 11, 2009); 
INSERT INTO Developed VALUES (100, 12, 2020); 
INSERT INTO Developed VALUES (103, 13, 2003); 
INSERT INTO Developed VALUES (103, 14, 2018); 
INSERT INTO Developed VALUES (101, 15, 2011); 
INSERT INTO Developed VALUES (104, 16, 1998); 
INSERT INTO Developed VALUES (115, 17, 2009); 
INSERT INTO Developed VALUES (104, 18, 2019); 
INSERT INTO Developed VALUES (116, 19, 2013); 
INSERT INTO Developed VALUES (116, 20, 2020); 
INSERT INTO Developed VALUES (125, 21, 2007); 
INSERT INTO Developed VALUES (117, 22, 1998); 
INSERT INTO Developed VALUES (120, 23, 2012); 
INSERT INTO Developed VALUES (123, 24, 2018); 
INSERT INTO Developed VALUES (110, 25, 2006); 
INSERT INTO Developed VALUES (119, 26, 2005); 
INSERT INTO Developed VALUES (117, 27, 2007); 

-- Published
-- Relation
-- INSERT INTO Published VALUES (Company(company_id), Game(game_id), year_pub)
INSERT INTO Published VALUES (114, 1, 2017); 
INSERT INTO Published VALUES (108, 2, 2015); 
INSERT INTO Published VALUES (105, 3, 2018); 
INSERT INTO Published VALUES (109, 4, 2015); 
INSERT INTO Published VALUES (108, 5, 2020); 
INSERT INTO Published VALUES (105, 6, 2013); 
INSERT INTO Published VALUES (110, 7, 2017); 
INSERT INTO Published VALUES (111, 8, 2018); 
INSERT INTO Published VALUES (112, 9, 2020); 
INSERT INTO Published VALUES (121, 10, 2016); 
INSERT INTO Published VALUES (100, 11, 2009); 
INSERT INTO Published VALUES (100, 12, 2020); 
INSERT INTO Published VALUES (103, 13, 2003);
INSERT INTO Published VALUES (103, 14, 2018);
INSERT INTO Published VALUES (101, 15, 2011);
INSERT INTO Published VALUES (106, 15, 2011); 
INSERT INTO Published VALUES (107, 15, 2011); 
INSERT INTO Published VALUES (104, 16, 1998); 
INSERT INTO Published VALUES (107, 17, 2009);
INSERT INTO Published VALUES (104, 18, 2019); 
INSERT INTO Published VALUES (107, 19, 2013); 
INSERT INTO Published VALUES (107, 20, 2020); 
INSERT INTO Published VALUES (125, 21, 2007);
INSERT INTO Published VALUES (117, 22, 1998); 
INSERT INTO Published VALUES (123, 23, 2012); 
INSERT INTO Published VALUES (107, 24, 2018); 
INSERT INTO Published VALUES (110, 25, 2006); 
INSERT INTO Published VALUES (125, 26, 2005); 
INSERT INTO Published VALUES (117, 27, 2007);


-- worksAt
-- Relation
-- INSERT INTO worksAt VALUES (GamePerson(gameperson_id), years_at_company, Company(company_id))
INSERT INTO worksAt VALUES (1001, 18, 100); 
INSERT INTO worksAt VALUES (1002, 18, 100); 
INSERT INTO worksAt VALUES (1003, 25, 103);
INSERT INTO worksAt VALUES (1004, 20, 104);
INSERT INTO worksAt VALUES (1005, 13, 101); 
INSERT INTO worksAt VALUES (1006, 26, 105);
INSERT INTO worksAt VALUES (1007, 18, 107); 
INSERT INTO worksAt VALUES (1008, 18, 107);
INSERT INTO worksAt VALUES (1009, 41, 114);
INSERT INTO worksAt VALUES (1010, 27, 116); 
INSERT INTO worksAt VALUES (1012, 18, 116); 
INSERT INTO worksAt VALUES (1014, 10, 123); 
INSERT INTO worksAt VALUES (1015, 25, 117);
INSERT INTO worksAt VALUES (1016, 15, 116);
INSERT INTO worksAt VALUES (1017, 20, 110);
INSERT INTO worksAt VALUES (1019, 10, 120); 
INSERT INTO worksAt VALUES (1021, 25, 119);
INSERT INTO worksAt VALUES (1022, 18, 120); 

-- workedOn
-- Relation
-- INSERT INTO workedOn VALUES (GamePerson(gameperson_id), Game(game_id)) 
INSERT INTO workedOn VALUES (1001, 11); 
INSERT INTO workedOn VALUES (1002, 11); 
INSERT INTO workedOn VALUES (1001, 12); 
INSERT INTO workedOn VALUES (1002, 12); 
INSERT INTO workedOn VALUES (1003, 13); 
INSERT INTO workedOn VALUES (1003, 14); 
INSERT INTO workedOn VALUES (1004, 16); 
INSERT INTO workedOn VALUES (1005, 15); 
INSERT INTO workedOn VALUES (1006, 6); 
INSERT INTO workedOn VALUES (1007, 24); 
INSERT INTO workedOn VALUES (1008, 24); 
INSERT INTO workedOn VALUES (1009, 1);
INSERT INTO workedOn VALUES (1010, 3); 
INSERT INTO workedOn VALUES (1011, 21); 
INSERT INTO workedOn VALUES (1012, 19); 
INSERT INTO workedOn VALUES (1012, 20); 
INSERT INTO workedOn VALUES (1014, 24); 
INSERT INTO workedOn VALUES (1015, 27); 
INSERT INTO workedOn VALUES (1016, 19); 
INSERT INTO workedOn VALUES (1017, 25); 
INSERT INTO workedOn VALUES (1019, 23); 
INSERT INTO workedOn VALUES (1022, 23); 
INSERT INTO workedOn VALUES (1021, 26); 

-- Genre
-- Entity
-- INSERT INTO Genre VALUES(genre_name)
INSERT INTO Genre VALUES ('Adventure');
INSERT INTO Genre VALUES ('Action');
INSERT INTO Genre VALUES ('Hero Shooter');
INSERT INTO Genre VALUES ('MMORPG');
INSERT INTO Genre VALUES ('MOBA');
INSERT INTO Genre VALUES ('RPG');
INSERT INTO Genre VALUES ('Sandbox');
INSERT INTO Genre VALUES ('Simulation');
INSERT INTO Genre VALUES ('Sports');
INSERT INTO Genre VALUES ('Strategy');
INSERT INTO Genre VALUES ('Survival');
INSERT INTO Genre VALUES ('Tactical Shooter');
INSERT INTO Genre VALUES ('Shooter');
INSERT INTO Genre VALUES ('First Person Shooter'); 
INSERT INTO Genre VALUES ('Third Person Shooter'); 
INSERT INTO Genre VALUES ('Puzzle');
INSERT INTO Genre VALUES ('Stealth');
INSERT INTO Genre VALUES ('Horror'); 
INSERT INTO Genre VALUES ('Platformer'); 
INSERT INTO Genre VALUES ('Fighting');
INSERT INTO Genre VALUES ('Racing');
INSERT INTO Genre VALUES ('Music'); 
INSERT INTO Genre VALUES ('Party');
INSERT INTO Genre VALUES ('Rhythm'); 
INSERT INTO Genre VALUES ('Battle Royale'); 
INSERT INTO Genre VALUES ('RTS'); 
INSERT INTO Genre VALUES ('Single Player'); 
INSERT INTO Genre VALUES ('Coop'); 
INSERT INTO Genre VALUES ('Multiplayer'); 
INSERT INTO Genre VALUES ('Roguelike'); 
INSERT INTO Genre VALUES ('Story-Rich'); 
INSERT INTO Genre VALUES ('Building'); 
INSERT INTO Genre VALUES ('Indie');
INSERT INTO Genre VALUES ('Social Deduction');
INSERT INTO Genre VALUES ('Casual');
INSERT INTO Genre VALUES ('Competitive');

-- inGenre
-- Relation
-- INSERT INTO inGenre VALUES (Game(game)id), Genre(genre_name))
INSERT INTO inGenre VALUES (1, 'Adventure');
INSERT INTO inGenre VALUES (1, 'Action');
INSERT INTO inGenre VALUES (1, 'Single Player');
INSERT INTO inGenre VALUES (1, 'RPG');
INSERT INTO inGenre VALUES (2, 'RPG');
INSERT INTO inGenre VALUES (2, 'Adventure');
INSERT INTO inGenre VALUES (2, 'Action');
INSERT INTO inGenre VALUES (2, 'Story-Rich');
INSERT INTO inGenre VALUES (2, 'Single Player');
INSERT INTO inGenre VALUES (3, 'Action');
INSERT INTO inGenre VALUES (3, 'Adventure');
INSERT INTO inGenre VALUES (3, 'RPG');
INSERT INTO inGenre VALUES (3, 'Story-Rich');
INSERT INTO inGenre VALUES (3, 'Shooter');
INSERT INTO inGenre VALUES (3, 'Third Person Shooter');
INSERT INTO inGenre VALUES (3, 'Single Player');
INSERT INTO inGenre VALUES (4, 'Tactical Shooter');
INSERT INTO inGenre VALUES (4, 'First Person Shooter');
INSERT INTO inGenre VALUES (4, 'Competitive');
INSERT INTO inGenre VALUES (4, 'Multiplayer');
INSERT INTO inGenre VALUES (5, 'RPG');
INSERT INTO inGenre VALUES (5, 'Action');
INSERT INTO inGenre VALUES (5, 'Adventure');
INSERT INTO inGenre VALUES (5, 'Single Player');
INSERT INTO inGenre VALUES (5, 'Story-Rich');
INSERT INTO inGenre VALUES (6, 'Action');
INSERT INTO inGenre VALUES (6, 'Adventure');
INSERT INTO inGenre VALUES (6, 'RPG');
INSERT INTO inGenre VALUES (6, 'Single Player');
INSERT INTO inGenre VALUES (6, 'Multiplayer');
INSERT INTO inGenre VALUES (6, 'Racing');
INSERT INTO inGenre VALUES (6, 'Shooter');
INSERT INTO inGenre VALUES (6, 'First Person Shooter');
INSERT INTO inGenre VALUES (6, 'Third Person Shooter');
INSERT INTO inGenre VALUES (7, 'Battle Royale');
INSERT INTO inGenre VALUES (7, 'Survival');
INSERT INTO inGenre VALUES (7, 'Shooter');
INSERT INTO inGenre VALUES (7, 'Multiplayer');
INSERT INTO inGenre VALUES (7, 'Third Person Shooter');
INSERT INTO inGenre VALUES (7, 'Building');
INSERT INTO inGenre VALUES (8, 'Party');
INSERT INTO inGenre VALUES (8, 'Social Deduction');
INSERT INTO inGenre VALUES (8, 'Coop');
INSERT INTO inGenre VALUES (8, 'Multiplayer');
INSERT INTO inGenre VALUES (9, 'RPG');
INSERT INTO inGenre VALUES (9, 'Roguelike');
INSERT INTO inGenre VALUES (9, 'Action');
INSERT INTO inGenre VALUES (10, 'RPG');
INSERT INTO inGenre VALUES (10, 'Action');
INSERT INTO inGenre VALUES (10, 'Adventure');
INSERT INTO inGenre VALUES (10, 'Single Player');
INSERT INTO inGenre VALUES (10, 'Coop');
INSERT INTO inGenre VALUES (10, 'Multiplayer');
INSERT INTO inGenre VALUES (11, 'MOBA');
INSERT INTO inGenre VALUES (11, 'Strategy');
INSERT INTO inGenre VALUES (11, 'Multiplayer');
INSERT INTO inGenre VALUES (11, 'Competitive');
INSERT INTO inGenre VALUES (12, 'Hero Shooter');
INSERT INTO inGenre VALUES (12, 'Tactical Shooter');
INSERT INTO inGenre VALUES (12, 'First Person Shooter');
INSERT INTO inGenre VALUES (12, 'Multiplayer');
INSERT INTO inGenre VALUES (12, 'Competitive');
INSERT INTO inGenre VALUES (13, 'MMORPG');
INSERT INTO inGenre VALUES (13, 'Adventure');
INSERT INTO inGenre VALUES (13, 'Platformer');
INSERT INTO inGenre VALUES (13, 'Multiplayer');
INSERT INTO inGenre VALUES (14, 'Sports');
INSERT INTO inGenre VALUES (14, 'Single Player');
INSERT INTO inGenre VALUES (14, 'Multiplayer');
INSERT INTO inGenre VALUES (15, 'Sandbox');
INSERT INTO inGenre VALUES (15, 'Survival');
INSERT INTO inGenre VALUES (15, 'Building');
INSERT INTO inGenre VALUES (15, 'Single Player');
INSERT INTO inGenre VALUES (15, 'Multiplayer');
INSERT INTO inGenre VALUES (15, 'Casual');
INSERT INTO inGenre VALUES (15, 'Coop');
INSERT INTO inGenre VALUES (16, 'RTS');
INSERT INTO inGenre VALUES (16, 'Strategy');
INSERT INTO inGenre VALUES (16, 'Single Player');
INSERT INTO inGenre VALUES (16, 'Multiplayer');
INSERT INTO inGenre VALUES (16, 'Competitive');
INSERT INTO inGenre VALUES (17, 'Racing');
INSERT INTO inGenre VALUES (17, 'Sports');
INSERT INTO inGenre VALUES (17, 'Simulation');
INSERT INTO inGenre VALUES (17, 'Single Player');
INSERT INTO inGenre VALUES (18, 'First Person Shooter');
INSERT INTO inGenre VALUES (18, 'Shooter');
INSERT INTO inGenre VALUES (18, 'Multiplayer');
INSERT INTO inGenre VALUES (18, 'Casual');
INSERT INTO inGenre VALUES (19, 'Action');
INSERT INTO inGenre VALUES (19, 'Adventure');
INSERT INTO inGenre VALUES (19, 'Survival');
INSERT INTO inGenre VALUES (19, 'Horror');
INSERT INTO inGenre VALUES (19, 'Single Player');
INSERT INTO inGenre VALUES (19, 'Story-Rich');
INSERT INTO inGenre VALUES (20, 'Action');
INSERT INTO inGenre VALUES (20, 'Adventure');
INSERT INTO inGenre VALUES (20, 'Survival');
INSERT INTO inGenre VALUES (20, 'Horror');
INSERT INTO inGenre VALUES (20, 'Single Player');
INSERT INTO inGenre VALUES (20, 'Story-Rich');
INSERT INTO inGenre VALUES (21, 'First Person Shooter');
INSERT INTO inGenre VALUES (21, 'Horror');
INSERT INTO inGenre VALUES (21, 'RPG');
INSERT INTO inGenre VALUES (22, 'First Person Shooter');
INSERT INTO inGenre VALUES (22, 'Action');
INSERT INTO inGenre VALUES (22, 'Adventure');
INSERT INTO inGenre VALUES (23, 'Adventure');
INSERT INTO inGenre VALUES (23, 'Indie');
INSERT INTO inGenre VALUES (23, 'Single Player');
INSERT INTO inGenre VALUES (24, 'Action');
INSERT INTO inGenre VALUES (24, 'Adventure');
INSERT INTO inGenre VALUES (24, 'RPG');
INSERT INTO inGenre VALUES (25, 'Third Person Shooter');
INSERT INTO inGenre VALUES (25, 'Action');
INSERT INTO inGenre VALUES (25, 'Adventure');
INSERT INTO inGenre VALUES (26, 'Platformer');
INSERT INTO inGenre VALUES (26, 'Adventure');
INSERT INTO inGenre VALUES (26, 'Action');
INSERT INTO inGenre VALUES (27, 'Puzzle');
INSERT INTO inGenre VALUES (27, 'First Person Shooter');

-- GameReview
-- Entity
-- INSERT INTO GameReview VALUES (Game(game_id), author, description, score)
INSERT INTO GameReview VALUES (1, 'RogueFan', 'An incredible journey from start to finish. The open-world design is unmatched.', 5);
INSERT INTO GameReview VALUES (1, 'GamerGirl', 'A breathtaking adventure that redefines the genre.', 4);
INSERT INTO GameReview VALUES (1, 'GamerGuy', 'The best Zelda game yet! A true masterpiece.', 5);
INSERT INTO GameReview VALUES (1, 'CasualPlayer', 'A bit overwhelming at first, but once you get the hang of it, it''s amazing.', 4);
INSERT INTO GameReview VALUES (1, 'OldSchoolGamer', 'Brings back the nostalgia with a modern twist. Absolutely loved it!', 4);
INSERT INTO GameReview VALUES (2, 'GamerGirl', 'Geralt''s adventures are as thrilling as ever. A true RPG gem.', 5);
INSERT INTO GameReview VALUES (2, 'RPGenthusiast', 'One of the best RPGs ever made. The story, the characters, the world - all top-notch.', 5);
INSERT INTO GameReview VALUES (2, 'CasualPlayer', 'A bit too complex for my taste, but undeniably a great game.', 4);
INSERT INTO GameReview VALUES (2, 'FantasyLover', 'A dark, gripping story that kept me hooked from start to finish.', 5);
INSERT INTO GameReview VALUES (2, 'GamerDad', 'An epic tale with so much to do. I can''t recommend it enough.', 4);
INSERT INTO GameReview VALUES (5, 'GamerDad', 'Despite the bugs, the story and world are immersive and engaging.', 4);
INSERT INTO GameReview VALUES (5, 'TechJunkie', 'A futuristic masterpiece. The city feels alive and the missions are exciting.', 4);
INSERT INTO GameReview VALUES (5, 'CasualPlayer', 'The game had a rocky start, but after updates, it''s quite enjoyable.', 3);
INSERT INTO GameReview VALUES (5, 'GamerGirl', 'A brilliant sci-fi RPG that delivers on its promises.', 4);
INSERT INTO GameReview VALUES (5, 'RPGenthusiast', 'Complex characters and a deep story make this a must-play.', 4);
INSERT INTO GameReview VALUES (6, 'RPGenthusiast', 'An open-world experience like no other. Endless fun and chaos.', 5);
INSERT INTO GameReview VALUES (6, 'ActionLover', 'The missions are thrilling and the world is incredibly detailed.', 5);
INSERT INTO GameReview VALUES (6, 'GamerDad', 'A bit overhyped, but still a solid game with lots to do.', 4);
INSERT INTO GameReview VALUES (6, 'CasualPlayer', 'Great game, but the online mode can be frustrating at times.', 4);
INSERT INTO GameReview VALUES (6, 'ThrillSeeker', 'The story mode is fantastic and the characters are memorable.', 5);
INSERT INTO GameReview VALUES (7, 'ThrillSeeker', 'The best battle royale game out there. Constant updates keep it fresh.', 4);
INSERT INTO GameReview VALUES (7, 'CasualPlayer', 'Fun to play with friends, but can get repetitive after a while.', 3);
INSERT INTO GameReview VALUES (7, 'BuildingMaster', 'The building mechanics add a unique twist to the gameplay.', 4);
INSERT INTO GameReview VALUES (7, 'GamerGirl', 'Great game with a vibrant community and creative modes.', 4);
INSERT INTO GameReview VALUES (7, 'RPGenthusiast', 'Super fun and addictive. I love the skins and emotes.', 4);
INSERT INTO GameReview VALUES (8, 'GamerDad', 'A simple yet highly addictive game. Perfect for parties.', 4);
INSERT INTO GameReview VALUES (8, 'OldSchoolGamer', 'The social deduction aspect is thrilling and keeps you on your toes.', 5);
INSERT INTO GameReview VALUES (8, 'GamerGirl', 'Fun to play with friends, but can get a bit stale after many rounds.', 4);
INSERT INTO GameReview VALUES (8, 'CasualGamer', 'A great game for quick sessions. Easy to learn, hard to master.', 4);
INSERT INTO GameReview VALUES (9, 'GamerGirl', 'A perfect blend of roguelike mechanics and a compelling story.', 5);
INSERT INTO GameReview VALUES (9, 'CasualPlayer', 'The combat is smooth and the progression is rewarding.', 5);
INSERT INTO GameReview VALUES (9, 'GreekMythFan', 'An amazing game with rich lore and great characters.', 5);
INSERT INTO GameReview VALUES (9, 'RogueFan', 'Each run feels unique and the game keeps you coming back for more.', 4);
INSERT INTO GameReview VALUES (9, 'GamerGuy', 'One of the best indie games I''ve ever played. Highly recommended.', 5);
INSERT INTO GameReview VALUES (10, 'SoulsborneFan', 'A challenging and rewarding experience. Not for the faint-hearted.', 4);
INSERT INTO GameReview VALUES (10, 'HardcoreGamer', 'The difficulty is brutal but fair. An absolute masterpiece.', 5);
INSERT INTO GameReview VALUES (10, 'CasualPlayer', 'Too difficult for me, but I can see why others love it.', 3);
INSERT INTO GameReview VALUES (10, 'FantasyFan', 'The dark, atmospheric world is captivating and the lore is deep.', 4);
INSERT INTO GameReview VALUES (11, 'GamerDad', 'Overall, Its a nice MOBA Game, the learning curve may be steep but as you progress and learn its rewarding, most especially learning the different champions in the game,', 3);
INSERT INTO GameReview VALUES (11, 'LeaguePlayer2', 'Best game ever!', 4);
INSERT INTO GameReview VALUES (12, 'GamerGuy', 'Valorant has taken the gaming world by storm since its release in 2020, quickly becoming one of the most popular games in the competitive gaming scene.', 4);
INSERT INTO GameReview VALUES (12, 'LeaguePlayer2', 'Valorant is the worst game ever. League of Legends is way better.', 2);
INSERT INTO GameReview VALUES (13, 'MaplestoryPlayer1', 'I have played this game since It''s beta release in America. I have been apart of every update this game has gone through since then and I must say it was like watching a best friend grow up with me. ', 3);
INSERT INTO GameReview VALUES (14, 'ActionLover', 'I have been a Fifa player since fifa 97 and had my fair share of disappointments with it. Fifa 23 is a huge improvement on 22. You actually have to play sensible. ', 3);
INSERT INTO GameReview VALUES (15, 'MinecraftPlayer1', 'this game is actually amazing', 4);
INSERT INTO GameReview VALUES (16, 'StarcraftPlayer1', 'spend more than half of my life playing this game. everything was just too good. ', 5);
INSERT INTO GameReview VALUES (23, 'GamerGuy', 'A beautiful and emotional experience. A true piece of art.', 5);
INSERT INTO GameReview VALUES (23, 'CasualPlayer', 'Short but impactful. The visuals and music are stunning.', 4);
INSERT INTO GameReview VALUES (23, 'RPGenthusiast', 'A masterpiece in storytelling without words. Simply amazing.', 5);
INSERT INTO GameReview VALUES (23, 'GamerGirl', 'An unforgettable journey. The multiplayer aspect is unique and touching.', 4);
INSERT INTO GameReview VALUES (23, 'LeaguePlayer2', 'A serene and peaceful game that everyone should experience.', 4);
INSERT INTO GameReview VALUES (27, 'ILovePortal', 'A brilliant puzzle game with a dark sense of humor. Loved it.', 5);
INSERT INTO GameReview VALUES (27, 'RogueFan', 'The concept and execution are perfect. GLaDOS is a fantastic character.', 5);
INSERT INTO GameReview VALUES (27, 'CasualGamer', 'Short but sweet. The puzzles are challenging and fun.', 4);
INSERT INTO GameReview VALUES (27, 'GamerGuy', 'An innovative game that changed the genre. Highly recommended.', 5);
INSERT INTO GameReview VALUES (27, 'MaplestoryPlayer1', 'The perfect blend of storytelling and puzzle-solving.', 4);

INSERT INTO GameReview VALUES (8, 'IGN', 'Among Us is a simple yet highly addictive game that thrives on social interaction. It''s a perfect game for parties and online play.', 4);
INSERT INTO GameReview VALUES (8, 'GameSpot', 'The charm of Among Us lies in its simplicity and the thrill of deception. It''s a must-play for fans of social deduction games.', 4);
INSERT INTO GameReview VALUES (21, 'IGN', 'BioShock is a groundbreaking game that combines a compelling narrative with immersive gameplay. It''s a masterpiece in the gaming world.', 5);
INSERT INTO GameReview VALUES (21, 'GameSpot', 'With its unique setting and thought-provoking story, BioShock stands out as one of the best games of its generation.', 5);
INSERT INTO GameReview VALUES (9, 'IGN', 'Hades is a stunning blend of roguelike mechanics and deep storytelling. Its replayability and rich characters make it a standout title.', 4);
INSERT INTO GameReview VALUES (9, 'GameSpot', 'From its fluid combat to its engaging narrative, Hades sets a new standard for roguelike games. It''s an absolute must-play.', 5);
INSERT INTO GameReview VALUES (19, 'IGN', 'The Last of Us is a gripping tale of survival and companionship. Its emotional depth and immersive gameplay make it a modern classic.', 5);
INSERT INTO GameReview VALUES (19, 'GameSpot', 'A masterclass in storytelling and character development, The Last of Us is a powerful and unforgettable gaming experience.', 5);
INSERT INTO GameReview VALUES (20, 'IGN', 'The Last of Us Part II pushes the boundaries of narrative and emotional storytelling in games. It''s a bold and unforgettable sequel.', 4);
INSERT INTO GameReview VALUES (20, 'GameSpot', 'A stunning and controversial follow-up, The Last of Us Part II delivers an intense and emotionally charged experience.', 4);

-- ESportsOrganization
-- Entity
-- INSERT INTO ESportsOrganization VALUES (es_id, num_trophies, es_name)
INSERT INTO ESportsOrganization VALUES (10000, 7, 'SK Telecom T1');
INSERT INTO ESportsOrganization VALUES (10001, 3, 'SK Telecom T1');
INSERT INTO ESportsOrganization VALUES (10002, 2, 'Cloud9');
INSERT INTO ESportsOrganization VALUES (10003, 1, 'Team Liquid');
INSERT INTO ESportsOrganization VALUES (10004, 4, 'G2 Esports');
INSERT INTO ESportsOrganization VALUES (10005, 2, '100 Thieves');
INSERT INTO ESportsOrganization VALUES (10006, 2, 'Fnatic');

-- CompetesIn
-- Relation
-- INSERT INTO CompetesIn VALUES (ESportsOrganization(es_id), Game(game_id))
INSERT INTO CompetesIn VALUES (10000, 11); 
INSERT INTO CompetesIn VALUES (10001, 12); 
INSERT INTO CompetesIn VALUES (10002, 11); 
INSERT INTO CompetesIn VALUES (10003, 11); 
INSERT INTO CompetesIn VALUES (10004, 11); 
INSERT INTO CompetesIn VALUES (10005, 11); 
INSERT INTO CompetesIn VALUES (10006, 11); 

-- runsOn
-- Relation
-- INSERT INTO runsOn VALUES (Platform(platform_id), Game(game_id))
INSERT INTO runsOn VALUES ('Switch', 1);
INSERT INTO runsOn VALUES ('Windows', 2);
INSERT INTO runsOn VALUES ('PlayStation 4', 2); 
INSERT INTO runsOn VALUES ('Xbox One', 2); 
INSERT INTO runsOn VALUES ('Xbox Series X/S', 2); 
INSERT INTO runsOn VALUES ('Windows', 3); 
INSERT INTO runsOn VALUES ('PlayStation 4', 3); 
INSERT INTO runsOn VALUES ('Xbox One', 3); 
INSERT INTO runsOn VALUES ('Windows', 4); 
INSERT INTO runsOn VALUES ('PlayStation 4', 4); 
INSERT INTO runsOn VALUES ('PlayStation 5', 4); 
INSERT INTO runsOn VALUES ('Xbox One', 4); 
INSERT INTO runsOn VALUES ('Xbox Series X/S', 4); 
INSERT INTO runsOn VALUES ('Windows', 5); 
INSERT INTO runsOn VALUES ('PlayStation 4', 5); 
INSERT INTO runsOn VALUES ('Xbox One', 5); 
INSERT INTO runsOn VALUES ('Windows', 6); 
INSERT INTO runsOn VALUES ('PlayStation 4', 6); 
INSERT INTO runsOn VALUES ('Xbox One', 6); 
INSERT INTO runsOn VALUES ('Windows', 7); 
INSERT INTO runsOn VALUES ('iOS', 7); 
INSERT INTO runsOn VALUES ('Android', 7);
INSERT INTO runsOn VALUES ('Windows', 8); 
INSERT INTO runsOn VALUES ('iOS', 8); 
INSERT INTO runsOn VALUES ('Android', 8); 
INSERT INTO runsOn VALUES ('Windows', 9);
INSERT INTO runsOn VALUES ('Switch', 9); 
INSERT INTO runsOn VALUES ('PlayStation 4', 9);
INSERT INTO runsOn VALUES ('Xbox One', 9); 
INSERT INTO runsOn VALUES ('Windows', 10); 
INSERT INTO runsOn VALUES ('PlayStation 4', 10); 
INSERT INTO runsOn VALUES ('Xbox One', 10); 
INSERT INTO runsOn VALUES ('Windows', 11); 
INSERT INTO runsOn VALUES ('Windows', 12);
INSERT INTO runsOn VALUES ('Windows', 13); 
INSERT INTO runsOn VALUES ('Windows', 14); 
INSERT INTO runsOn VALUES ('Windows', 15); 
INSERT INTO runsOn VALUES ('iOS', 15); 
INSERT INTO runsOn VALUES ('Android', 15); 
INSERT INTO runsOn VALUES ('Windows', 16); 
INSERT INTO runsOn VALUES ('Windows', 17); 
INSERT INTO runsOn VALUES ('PlayStation 4', 17); 
INSERT INTO runsOn VALUES ('Windows', 18); 
INSERT INTO runsOn VALUES ('iOS', 18); 
INSERT INTO runsOn VALUES ('Android', 18); 
INSERT INTO runsOn VALUES ('PlayStation 3', 19);
INSERT INTO runsOn VALUES ('PlayStation 4', 19);
INSERT INTO runsOn VALUES ('PlayStation 4', 20); 
INSERT INTO runsOn VALUES ('PlayStation 5', 20); 
INSERT INTO runsOn VALUES ('MacOS', 21); 
INSERT INTO runsOn VALUES ('Windows', 21); 
INSERT INTO runsOn VALUES ('Xbox 360', 21); 
INSERT INTO runsOn VALUES ('PlayStation 3', 21); 
INSERT INTO runsOn VALUES ('Windows', 22); 
INSERT INTO runsOn VALUES ('PlayStation 3', 23); 
INSERT INTO runsOn VALUES ('PlayStation 4', 23); 
INSERT INTO runsOn VALUES ('PlayStation 4', 24); 
INSERT INTO runsOn VALUES ('Xbox 360', 25); 
INSERT INTO runsOn VALUES ('Windows', 25); 
INSERT INTO runsOn VALUES ('Windows', 26); 
INSERT INTO runsOn VALUES ('MacOS', 26); 
INSERT INTO runsOn VALUES ('PlayStation 3', 26); 
INSERT INTO runsOn VALUES ('PlayStation 4', 26);
INSERT INTO runsOn VALUES ('Xbox 360', 26);
INSERT INTO runsOn VALUES ('Xbox One', 26);
INSERT INTO runsOn VALUES ('Windows', 27); 
INSERT INTO runsOn VALUES ('Xbox 360', 27); 
INSERT INTO runsOn VALUES ('PlayStation 3', 27); 



