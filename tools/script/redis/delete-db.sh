#!/bin/bash
set -e

source ./config.conf

bash ./stop-db.sh

echo "=> Delete container $CONTAINER_NAME"
docker rm $CONTAINER_NAME
echo "=> Done"