#!/bin/bash
set -e

source ./config.conf

bash ./create-volume.sh

echo "=> Create mySQL container..."
docker run \
  --name gravis-db \
  --volume $VOLUME_NAME:/var/lib/mysql \
  -p 3306:3306 \
  -e MYSQL_DATABASE=$CONTAINER_NAME \
  -e MYSQL_ROOT_PASSWORD=$DB_PASSWORD \
  -d mysql:5.7
echo "=> Done! Container name: $CONTAINER_NAME"