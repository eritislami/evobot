#!/bin/bash

if [ -z $IMAGE_NAME ]; then
    export IMAGE_NAME="evobot-local"
fi

echo "Starting $IMAGE_NAME..."
docker run -it --rm --name "$IMAGE_NAME" --env-file .env "$IMAGE_NAME"
