
--Creating table 'products'

DROP TABLE IF EXISTS products;

CREATE TABLE products (
	id serial4 NOT NULL,
	"name" varchar NOT NULL,
	instruction_manual varchar NULL,
	description varchar NULL,
	last_modified timestamp NOT NULL,
	last_modified_category timestamp NOT NULL,
	CONSTRAINT products_pk PRIMARY KEY (id)
);

INSERT INTO products ("name", instruction_manual, description, last_modified, last_modified_category) VALUES('T-shirt', 'Take a t-shirt. Put your arms through the sleeves, and your head through the neck part. Congratulations! You are wearing a t-shirt', 'This is an object that people wear. It is used for covering some of your body parts like your arms, stomach, and chest.', NOW(), NOW());
INSERT INTO products ("name", instruction_manual, description, last_modified, last_modified_category) VALUES('Table tennis net', 'Take this net and put both of the ends on two poles. Congratulations, you now have table tennis net that is ready to be used.', 'Table tennis net implements one of the most important rules in tennis. Without this object tennis matches would not be possible to play.', NOW(), NOW());
INSERT INTO products ("name", instruction_manual, description, last_modified, last_modified_category) VALUES('Chicken nuggets', 'Take a chiken nugget. Eat it. Congratulations, you are not hungry anymore!', 'This is the food that is going to fulfill all of your wildest tasty fantasies. All you need to do is love chicken nuggets, in order for you to like this food.', NOW(), NOW());


-- Creating table 'categories'

DROP TABLE IF EXISTS categories;

CREATE TABLE categories (
	id serial4 NOT NULL,
	"name" varchar NOT NULL,
	description varchar NULL,
	CONSTRAINT name_uq UNIQUE ("name"),
	CONSTRAINT categories_pk PRIMARY KEY (id)
);

INSERT INTO categories ("name", description) VALUES('clothes', 'This is the category for all kinds of clothes');
INSERT INTO categories ("name", description) VALUES('food', 'This is the category for all kinds of foods');
INSERT INTO categories ("name", description) VALUES('meat', 'These are the foods that are only meats.');
INSERT INTO categories ("name", description) VALUES('sports', 'This is the category for sport requisites');
INSERT INTO categories ("name", description) VALUES('tennis', 'This is the category for tennis requisites.');


-- many-to-many products_categories

DROP TABLE IF EXISTS products_categories;

CREATE TABLE products_categories (
	category_id int4 NOT NULL,
	product_id int4 NOT NULL,
	CONSTRAINT products_categories_pk PRIMARY KEY (category_id, product_id)
);

ALTER TABLE products_categories ADD CONSTRAINT products_categories_fk FOREIGN KEY (product_id) REFERENCES products(id);
ALTER TABLE products_categories ADD CONSTRAINT products_categories_fk_1 FOREIGN KEY (category_id) REFERENCES categories(id);

INSERT INTO products_categories (category_id, product_id) VALUES(1, 1);
INSERT INTO products_categories (category_id, product_id) VALUES(2, 3);
INSERT INTO products_categories (category_id, product_id) VALUES(3, 3);
INSERT INTO products_categories (category_id, product_id) VALUES(4, 2);
INSERT INTO products_categories (category_id, product_id) VALUES(5, 2);

--SKUs table

DROP TABLE IF EXISTS skus;

CREATE TABLE skus (
	id serial4 NOT NULL,
	product_id int4 NOT NULL,
	sku_code varchar NOT NULL,
	color varchar NULL,
	weight float4 NULL,
	country_of_origin varchar NULL,
	price float4 NOT NULL,
	quantity_in_stock int4 NOT NULL,
	"size" varchar NULL,
	details varchar NULL,
	last_modified timestamp NOT NULL,
	CONSTRAINT skus_pk PRIMARY KEY (id),
	CONSTRAINT skus_un UNIQUE (sku_code)
);

ALTER TABLE skus ADD CONSTRAINT skus_fk FOREIGN KEY (product_id) REFERENCES products(id);


INSERT INTO skus (product_id, sku_code, color, weight, country_of_origin, price, quantity_in_stock, "size", details, last_modified) VALUES(1, 'code1', 'red', 0.2, 'Bosnia and Herzegovina', 10.0, 15, 'medium', 'details1', NOW());
INSERT INTO skus (product_id, sku_code, color, weight, country_of_origin, price, quantity_in_stock, "size", details, last_modified) VALUES(1, 'code2', 'blue', 0.2, 'Macedonia', 10.0, 20, 'large', 'details2', NOW());
INSERT INTO skus (product_id, sku_code, color, weight, country_of_origin, price, quantity_in_stock, "size", details, last_modified) VALUES(2, 'code3', 'white', 1.0, 'Spain', 100.0, 23, 'small', 'details3', NOW());
INSERT INTO skus (product_id, sku_code, color, weight, country_of_origin, price, quantity_in_stock, "size", details, last_modified) VALUES(2, 'code4', 'blue', 1.0, 'Croatia', 110.0, 32, 'medium', 'details4', NOW());
INSERT INTO skus (product_id, sku_code, color, weight, country_of_origin, price, quantity_in_stock, "size", details, last_modified) VALUES(3, 'code5', 'orange', 0.5, 'Nigeria', 5.0, 10, 'large', 'details5', NOW());

--users

DROP TABLE IF EXISTS users;

CREATE TABLE users (
	id serial4 NOT NULL,
	first_name varchar NOT NULL,
	last_name varchar NOT NULL,
	email varchar NOT NULL,
	username varchar NOT NULL,
	"password" varchar NOT NULL,
	user_type varchar NULL,
	access_token varchar NULL,
	refresh_token varchar NULL,
	last_modified timestamp NOT NULL,
	CONSTRAINT username_un UNIQUE (username),
	CONSTRAINT users_pk PRIMARY KEY (id),
	CONSTRAINT users_un UNIQUE (email)
);

-- no data - needs to be generated through services.

-- product_changes_log

DROP TABLE IF EXISTS product_changes_log;

CREATE TABLE product_changes_log (
	id serial4 NOT NULL,
	product_id int4 NOT NULL,
	changed_by_user_id int4 NOT NULL,
	change_type varchar NOT NULL,
	change_date_time timestamp NOT NULL,
	CONSTRAINT product_changes_log_pk PRIMARY KEY (id)
);


-- product_changes_log foreign keys

ALTER TABLE product_changes_log ADD CONSTRAINT product_changes_log_fk FOREIGN KEY (product_id) REFERENCES products(id);
ALTER TABLE product_changes_log ADD CONSTRAINT product_changes_log_fk_1 FOREIGN KEY (changed_by_user_id) REFERENCES users(id);


-- sku_changes_log

DROP TABLE IF EXISTS sku_changes_log;

CREATE TABLE sku_changes_log (
	id serial4 NOT NULL,
	sku_id int4 NOT NULL,
	changed_by_user_id int4 NOT NULL,
	change_type varchar NOT NULL,
	change_date_time timestamp NOT NULL,
	CONSTRAINT sku_changes_log_pk PRIMARY KEY (id)
);


-- sku_changes_log foreign keys

ALTER TABLE sku_changes_log ADD CONSTRAINT sku_changes_log_fk FOREIGN KEY (sku_id) REFERENCES skus(id);
ALTER TABLE sku_changes_log ADD CONSTRAINT sku_changes_log_fk_1 FOREIGN KEY (changed_by_user_id) REFERENCES users(id);

-- inventory_log

-- DROP TABLE IF EXISTS inventory_log;

CREATE TABLE inventory_log (
	id serial4 NOT NULL,
	sku_id int4 NOT NULL,
	changed_by_user_id int4 NOT NULL,
	change_type varchar NOT NULL,
	change_date_time timestamp NOT NULL,
	quantity_change int4 NOT NULL,
	CONSTRAINT inventory_log_pk PRIMARY KEY (id)
);


-- inventory_log foreign keys

ALTER TABLE inventory_log ADD CONSTRAINT inventory_log_fk FOREIGN KEY (changed_by_user_id) REFERENCES users(id);
ALTER TABLE inventory_log ADD CONSTRAINT inventory_log_fk_1 FOREIGN KEY (sku_id) REFERENCES skus(id);

-- maybe problems with dialects?
