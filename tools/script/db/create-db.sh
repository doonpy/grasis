#!/bin/bash
set -e

source ./config.conf

echo "=> Create MSSQL container..."
docker run \
  --name $CONTAINER_NAME \
  -p 1433:1433 \
  -e MYSQL_ROOT_PASSWORD=$DB_PASSWORD \
  -d $MSSQL_IMAGE

echo "=> Done! Container name: $CONTAINER_NAME"