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
FROM node:9.3.0 AS base
### Display nodejs version
RUN node -v
LABEL maintainer "Jake Wang <jake.wang@sydney.edu.au>"
# Set the working directory
WORKDIR /web
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
# Copy app sources
COPY . .
# Allow the logs directory to be mounted
ONBUILD VOLUME ["/app/logs"]
# Allow the datastore directory to be mounted
ONBUILD VOLUME ["/app/datastore"]
# Expose application port, production port is 7071
EXPOSE 7071
# In production environment
ENV NODE_ENV production
# Run
CMD ["node", "web"]
