#!/bin/bash
set -e

source ./config.conf

echo "=> Creating Redis container..."
docker run \
  --name $CONTAINER_NAME \
  -p 6379:6379 \
  -d $MSSQL_IMAGE

echo "=> Done! Container name: $CONTAINER_NAME"