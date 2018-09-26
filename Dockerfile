#
# KOA REST API BOILERPLATE
#
# test and development:
#    using docker-compose: docker-compose up --build
# build:
#    docker build --force-rm -t sydneyuni/regression-test-server .
# push:
#    docker push sydneyuni/regression-test-server .
#

### BASE
FROM node:9.3.0-alpine AS base
# TODO may need to run as non-root user inside the docker container
# See https://vimeo.com/171803492 at 17:20 mark
# RUN groupadd -r nodejs && useradd -m -r -g nodejs nodejs
# now run as new user nodejs from group nodejs
# USER nodejs
### Display nodejs version
RUN node -v
LABEL maintainer "Jake Wang <jake.wang@sydney.edu.au>"
# Set the working directory
WORKDIR /app
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
# Allow the logs directory to be mounted
ONBUILD VOLUME ["/app/logs"]
# Allow the datastore directory to be mounted
ONBUILD VOLUME ["/app/datastore"]
# Expose application port, production port is 7071
EXPOSE 7071
# In development environment
ENV NODE_ENV development
# Run
CMD ["node", "web"]

