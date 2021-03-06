#
# Regression server docker image file
#
# build:
#    docker build --force-rm -t jacobwang05/regression-server .
# push:
#    docker push jacobwang05/regression-server .
#

### BASE
FROM node:9.3.0-alpine AS base
LABEL maintainer "Jake Wang <jaceyshome@gmail.com>"
# Set the working directory
WORKDIR /home/node/app
# Copy project specification and dependencies lock files
COPY package.json yarn.lock ./


### DEPENDENCIES
FROM base AS dependencies
# Install Node.js dependencies (only production)
RUN yarn --production
# Copy production dependencies aside
RUN cp -R node_modules /tmp/node_modules
# Install ALL Node.js dependencies
RUN yarn


### TEST
FROM dependencies AS test
# Copy web sources
COPY . .
# Run linters and tests
RUN yarn lint && yarn test


### RELEASE
FROM base AS release
# Copy production dependencies
COPY --from=dependencies /tmp/node_modules ./node_modules
# Copy source files, except folders and files in docker ignore files, including datastore, logs etc
COPY . .
# Create mountable folders
RUN mkdir /home/node/app/logs
RUN mkdir /home/node/app/datastore
# FIXME: set node user and group not working
# Set the working directory user and group
#RUN chown node:node -R /home/node/app
# Allow the logs directory to be mounted
# Set node user to run this image
#USER node
ONBUILD VOLUME ["/home/node/app/logs"]
# Allow the datastore directory to be mounted
ONBUILD VOLUME ["/home/node/app/datastore"]
# Expose application port, production port
EXPOSE 7071
# In production environment
ENV NODE_ENV production
# Run
CMD ["node", "web"]

