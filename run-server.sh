#!/bin/bash

#Production server log directory and data directory
logDirectory="/mnt/storage/regression-test-server";
dataDirectory="/mnt/storage/regression-test-server";

docker run  -d \
        --name regression-test-server  \
        -v ${dataDirectory}/datastore:/app/datastore \
        -v ${logDirectory}/logs:/app/logs \
        -p 7071:7071 \
        -p 9651:9651 \
        jacobwang05/regression-test-server