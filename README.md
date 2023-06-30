# Ecommerce backend API

## User manual

In order to use this API, you need to have docker engine installed.
At the root of the project (where docker-compose is), you need to provide file named
*"main.env"*, for configuration purposes. Example can be found down below:

```
PG_CONTAINER_NAME="postgres" //defines container name
POSTGRES_DB="test" //database name
POSTGRES_USER="armin" //database user
POSTGRES_PASSWORD="mojasifra" //database password
POSTGRES_PORT="5500" //localhost port to bind to postgres container

API_URL="http://localhost" //if ran on local computer, this is preffered value
API_PORT="8080" //port on which you can connect to test API (with postman etc.)
NODE_ENV="PRODUCTION" //any other value will start api and consumer services in development mode

SALT_ROUNDS="10" //used for password hashing in database

//localhost ports for kafka containers binding. Useful when debugging
//also, localhost port for schema registry binding

KAFKA1_PORT="9092" 
KAFKA2_PORT="9093"
KAFKA3_PORT="9094"
SCHEMA_REGISTRY_PORT="8081"
```

## Development mode

When in development mode, connection strings for kafka and database containers in 
api and consumer services are set to their localhost bindings. That is done in order
to connect to them via services that are run from our local computer (for example with npm run dev), 
and no from within docker network.

So, use this mode when you want to start **api_service** and **consumer_service** from your terminal.
In order to run **api_service** from terminal, in /api_service folder you need to run:

* *npm install* - installing all of the dependencies from package.json
* *npm run dev* - run application with nodemon and tsc - looking for changes, so you do not need to restart server when developing new features.

To run **consumer_service** from terminal, in /consumer_service folder you need to run:

* *npm install* - installing all of the dependencies from package.json
* *npm run dev:inventory* or *npm run dev:skuAndProduct* - run application with nodemon and tsc - looking for changes, you don't need to restart manually. There are two different commands because of consumer types. Former lets you create inventory consumer, that will consume events for quantity change in your shop. SkuAndProduct lets you create consumer for consuming manipulation events on product and sku (INSERT, UPDATE, DELETE).

When in development mode, you need to update _docker-compose.yml_ file, in order to remove api and consumer 
services. They will not bother your development (with localy started api and consumer services), but will take extra space and resources - that's why it's better to update _docker compose_.

## Production mode
When in production mode, whole system can be started by one single command:

```
    docker compose --env-file ./main.env up
```

This will bring all of the services defined in docker-compose file to life.

## Testing API

Import given collections to postman. You can access the api on ${API_PORT} that you provided in .env file. 

Collection _mock-api-postman.json_ enables you to see all of the routes, and mock answers of our api server. This will help you understand better the whole structure before you test it.

Collection _tests-example.json_ helps you to test api server. It exists multiple folders, that are structured by 
resources on the server, which enables you to easily test all of the routes that can be found in our api.

### Test running order

Firstly, you need to create some users with users/CREATE folder. When it comes to manipulation of resources (CREATE, UPDATE, DELETE) - there is some form of the authorization going on in api. Because of that, you will need to create at least 3 different users in order to test whole API:

* *SUPPLY_MANAGER* - can only manipulate with *products* resource
* *SHOP_WORKER* - can only manipulate with *skus* resource
* *SHOP_ANALYST* - only user that can access and read log tables

So, firstly, with users/CREATE make at least 3 different user types. After that:
* You need to authenticate them using oauth2 protocol. That is done by users/AUTH, where you need to provide your credentials in order to get your *access_token* back. Store that access token for all of the users, you're gonna need it below. All of the routes that manipulate with resources can be called only with appropriate token value. Meaning, only user types that are allowed to change that resource, can change it. Take into consideration that all these kind of routes need appropriate user token in order to work properly.
* Create some categories for your products with commands from categories/CREATE
* Read categories
* Create products (products/CREATE)
+ Create categories for products
+ Read, Update products
+ Delete product categories, and finally delete product
* Create skus (skus/CREATE)
* Read, update, delete skus - when update-ing, try updating only **quantityInStock** vs. updating any other group of parameters. That is important because it fires different log events in api service.
* Read, Update, Delete users - Update & delete are enabled only for user that has token for that account.

Finally, in **logs** folder you can find routes for logging events generated because of all actions that you did above. Make sure that appropriate token (of *SUPPLY_ANALYST*) is provided in authentication header in postman.


# Technical documentation summary

## Database 

Database is dockerized, and it is created by appripriate .sql dump file. ER Diagram of our database is showed below:

![database](https://github.com/PetrovicArmin/ecommerce-backend/assets/89392479/1aebde47-8a30-47a8-b790-a9b01e224506)

## API

API is RESTful, which means that we implemented:

* Resource based url representations
* HATEOAS communcation links provided by server
* Implicit caching with *Last-Modified* and *If-Modified-Since* headers
* Password role based authorization with oauth2
* Access token authentication with oauth2
* Resource protection userType-wise with firewall middleware

For next updates, it is planned to implement explicit caching using **redis database**

## Kafka service

For kafka service, we used KRaft protocol, which enabled us to remove zookeeper from kafka dependencies. That enables better security structure, faster loading times etc etc. Because kafka is needed for logging purposes, we decided to make its architecture as follows (topic design):

* **productLogs** - used for logging events related to product objects
    * 2 partitions
    * 2 replicas
* **skuLogs** - used for sku objects logging
    * 2 partitions 
    * 2 replicas
* **inventoryLogs** - used for sku objects quantityInStock update logging
    * 5 partitions
    * 2 replicas

We used 5 partitions on inventory because it is much more frequent operation than other two logging operations.

In order to put concurrence to work, we made multiple consumers with our docker-compose file. Structure of our kafka service with consumers is conceptually shown below:

![drawing](https://github.com/PetrovicArmin/ecommerce-backend/assets/89392479/6e7f175a-0a88-4dbc-acc5-7d2ea1240c36)


Keep in mind that above is logical representation of the system. Multiple brokers and replication factors make system much more different - implementation-wise, which means much more reliable and efficient system.



