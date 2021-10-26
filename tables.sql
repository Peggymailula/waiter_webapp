CREATE TABLE waiterNames(
id SERIAL PRIMARY KEY NOT NULL,
names TEXT NOT NULL
);

CREATE TABLE daysOfWeek (
	id SERIAL PRIMARY KEY NOT NULL,
	daysWeek TEXT NOT NULL
);

CREATE TABLE waiterDays (
	id SERIAL NOT NULL PRIMARY KEY,
	days_id INT NOT NULL,
	FOREIGN KEY (days_id) REFERENCES daysOfWeek(id),
	waiter_id INT NOT NULL,
	FOREIGN KEY (waiter_id) REFERENCES waiterNames(id)
);

INSERT INTO daysOfWeek (daysWeek) values ('Monday'); 
INSERT INTO daysOfWeek (daysWeek) values ('Tuesday');
INSERT INTO daysOfWeek (daysWeek) values ('Wednesday');
INSERT INTO daysOfWeek (daysWeek) values ('Thursday'); 
INSERT INTO daysOfWeek (daysWeek) values ('Friday');
INSERT INTO daysOfWeek (daysWeek) values ('Saturday');
INSERT INTO daysOfWeek (daysWeek) values ('Sunday');