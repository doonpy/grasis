#!/bin/bash
set -e

source ./config.conf

echo "=> Run container $CONTAINER_NAME"
docker start $CONTAINER_NAME
echo "=> Done"