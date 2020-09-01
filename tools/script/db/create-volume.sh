#!/bin/bash

set -e

source ./config.conf

echo "=> Create DB volume..."
docker volume create $VOLUME_NAME
echo "=> Done! Volume name: $VOLUME_NAME"