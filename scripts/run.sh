#!/bin/bash

#Production server log directory and data directory
#For local development, don't share the log and data as different system has different location
logDirectory="/mnt/storage/regression-test-server";
dataDirectory="/mnt/storage/regression-test-server";


#Pull the latest updates
docker pull sydneyuni/regression-test-server
#Stop the current container
docker stop regression-test-server
#Remove the current container
docker rm -f regression-test-server
#Create a new one
docker run  -d \
        --name regression-test-server  \
        -v ${dataDirectory}/datastore:/app/datastore \
        -v ${logDirectory}/logs:/app/logs \
        -p 7071:7071 \
        -p 9651:9651 \
        sydneyuni/regression-test-server