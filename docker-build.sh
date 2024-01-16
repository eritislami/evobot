#!/bin/bash

if [ -z $IMAGE_NAME ]; then
    export IMAGE_NAME="evobot-local"
fi

echo "Building $IMAGE_NAME..."
docker build -t $IMAGE_NAME .
