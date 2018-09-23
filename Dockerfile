#
# KOA REST API BOILERPLATE
#
# build:
#   docker build --force-rm -t jacobwang05/regression-test-server .
#
#

### BASE
FROM node:9.3.0 AS base
LABEL maintainer "Jake Wang <jake.wang@sydney.edu.au>"
# Set the working directory
WORKDIR /app
# Copy project specification and dependencies lock files
COPY package.json yarn.lock ./
# Install pm2-runtime
RUN npm install pm2 -g
# Install pm2-logrotate
RUN pm2 install pm2-logrotate


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
# Expose health endpoint
EXPOSE 9615
# In production environment
ENV NODE_ENV production
# Run
CMD ["pm2-runtime", "--json", "process.json", "--web", "9651"]
