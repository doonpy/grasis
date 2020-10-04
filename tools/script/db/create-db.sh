#!/bin/bash
set -e

source ./config.conf

echo "=> Create MSSQL container..."
docker run \
  --name $CONTAINER_NAME \
  -p 1433:1433 \
  -e SA_PASSWORD=$DB_PASSWORD \
  -e ACCEPT_EULA="Y" \
  -d $MSSQL_IMAGE

echo "=> Done! Container name: $CONTAINER_NAME"