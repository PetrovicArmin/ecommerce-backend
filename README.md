# Ecommerce backend API

## User manual

In order to use this API, you need to have docker engine installed.
At the root of the project (where docker-compose is), you need to provide file named
"main.env", for configuration purposes. Example can be found down below:

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
