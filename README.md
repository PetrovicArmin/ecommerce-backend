# Ecommerce backend API

## User manual

In order to use this API, you need to have docker engine installed.
At the root of the project (where docker-compose is), you need to provide file named
"main.env", for configuration purposes. Example can be found down below:

```
PG_CONTAINER_NAME="postgres"
POSTGRES_DB="test"
POSTGRES_USER="armin"
POSTGRES_PASSWORD="mojasifra"
POSTGRES_PORT="5500"

API_URL="http://localhost"
API_PORT="8080"
NODE_ENV="PRODUCTION"

SALT_ROUNDS="10"

KAFKA1_PORT="9092"
KAFKA2_PORT="9093"
KAFKA3_PORT="9094"
SCHEMA_REGISTRY_PORT="8081"


```
