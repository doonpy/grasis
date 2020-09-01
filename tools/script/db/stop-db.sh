#!/bin/bash
set -e

source ./config.conf

echo "Stop container $CONTAINER_NAME"
docker stop $CONTAINER_NAME
echo "=> Done"