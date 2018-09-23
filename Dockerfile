#
# KOA REST API BOILERPLATE
#
# build:
#   docker build --force-rm -t jacobwang05/koa-rest-api-boilerplate .
# run:
#   docker run --env production --name regression-test-server -p 7071:7071 jacobwang05/koa-rest-api-boilerplate
#
#

### BASE
FROM node:9.3.0 AS base
LABEL maintainer "Jake Wang <jake.wang@sydney.edu.au>"
# Set the working directory
WORKDIR /web
# Copy project specification and dependencies lock files
COPY package.json yarn.lock ./

# Install pm2-runtime
RUN npm install pm2 -g


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
CMD ["pm2-runtime", "process.json"]
