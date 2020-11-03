#!/bin/bash
set -e

source ./config.conf

echo "=> Creating database container..."
docker run \
  --name $CONTAINER_NAME \
  -p 3306:3306 \
  -e MYSQL_ROOT_PASSWORD=$DB_PASSWORD \
  -e MYSQL_DATABASE=$DATABASE \
  -d $MSSQL_IMAGE

echo "=> Done! Container name: $CONTAINER_NAME"