#!/bin/bash
set -e

echo "=> Hello, how can I help you?"
echo "1. Create local MySQL container."
echo "2. Start local MySQL container."
echo "3. Stop local MySQL container."
echo "4. Delete local MySQL container."
echo "=> Choose your command please..."

read command

case $command in
  "1")
    bash ./create-db.sh
    ;;
  "2")
    bash ./start-db.sh
    ;;
  "3")
    bash ./stop-db.sh
    ;;
  "4")
    bash ./delete-db.sh
    ;;
  *)
    echo "=> Sorry, command is invalid!"
    ;;
esac