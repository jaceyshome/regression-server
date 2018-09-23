#!/bin/bash

#Production server log directory and data directory
#For local development, don't share the log and data as different system has different location
logDirectory="/tmp/regression-test-server";
dataDirectory="/tmp/regression-test-server";

docker run  -d \
        --name regression-test-server  \
        -v ${dataDirectory}/datastore:/app/datastore \
        -v ${logDirectory}/logs:/app/logs \
        -p 7071:7071 \
        -p 9651:9651 \
        sydneyuni/regression-test-server