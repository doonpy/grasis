#!/bin/bash
set -e

echo "1. Install dependencies"
yarn install

echo "2. Build"
yarn build

echo "3. Deploy"
yarn start:prod