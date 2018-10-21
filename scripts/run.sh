#!/bin/bash

#Production server log directory and data directory
#For local development, don't share the log and data as different system has different location
logDirectory="/mnt/storage/regression";
dataDirectory="/mnt/storage/regression";


#Pull the latest updates
docker pull sydneyuni/regression-server
#Stop the current container
docker stop regression-server
#Remove the current container
docker rm -f regression-server
#Create a new one
docker run  -d \
        --name regression-server  \
        -v ${dataDirectory}/regression-server/datastore:/app/datastore \
        -v ${logDirectory}/regression-server/logs:/app/logs \
        -p 7071:7071 \
        -p 9651:9651 \
        sydneyuni/regression-server
