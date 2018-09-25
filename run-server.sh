#!/bin/bash

#Production server log directory and data directory
#For local development, don't share the log and data as different system has different location
#logDirectory="/tmp/regression-test-server";
#dataDirectory="/tmp/regression-test-server";


#Pull the latest updates
#docker pull sydneyuni/regression-test-server
#Stop the current container
docker stop regression-test-server
#Remove the current container
docker rm -f regression-test-server
#Create a new one
docker run  -d \
        --name regression-test-server  \
        -p 7071:7071 \
        sydneyuni/regression-test-server
