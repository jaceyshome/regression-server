#Regression server
Regression server is a RESTful API server to get and save information related to the regression test. It is for [regression-puppeteer](https://github.com/jaceyshome/regression-puppeteer).



## Getting started
These instructions will get you a copy of the project up and running on your local machine for development.



## Prerequisites
Install latest [Docker](https://docs.docker.com/install/), [docker-compose](https://docs.docker.com/compose/install/) and nodeJs 9.3.0 ( with [NVM](https://github.com/creationix/nvm) ).



## Installing
Install node modules with
```
npm install
```
or
```
yarn
```


## Running the application
```zsh
# Run normally
$ yarn start
# Run the application with nodemon for development
$ yarn dev
```


### Running the test
```zsh
# Test
$ yarn test                           # Run all test
# Test (Watch Mode for development)
$ yarn test:watch                     # Run all test with watch mode
```



## Deployment
To build the package, run `npm build`

The `Dockerfile` is ready to use, related configuration file is `config/config-docker.js`. To build an image, set your docker repository in the `package.json`, for example
```
  "config": {
    "imageRepo": "jacobwang05/regression-server",
    "imageName": "regression-server",
    "imagePort": "7071"
  },
```
When you build an image, run
```
npm run docker:build
```
publish the image
```
npm run docker:publish
```

More details about using npm scripts for docker are in [duluca/npm-scripts-for-docker.md](https://gist.github.com/duluca/d13e501e870215586271b0f9ce1781ce/).



## Built with
[Bunyan](https://www.npmjs.com/package/bunyan)

[Jest](https://jestjs.io/)

[Joi](https://www.npmjs.com/package/joi)

[Koa.js](https://koajs.com/)

[NeDB](https://github.com/louischatriot/nedb)

[npm-scripts-for-docker.md](https://gist.github.com/duluca/d13e501e870215586271b0f9ce1781ce/)

[posquit0/koa-rest-api-boilerplate](https://github.com/posquit0/koa-rest-api-boilerplate)

[SwaggerHub](https://app.swaggerhub.com/apis/jaceyshome/regression-test-server/1.5.0)


## License
Provided under the terms of the MIT License.
