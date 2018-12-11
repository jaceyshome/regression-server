#Regression server
Regression server is a RESTful API server to get and set information related to the regression test.


## Docker image
jacobwang05/regression-server


## How to use
### Install
```zsh
$ yarn
$ yarn start
```

### Run
```zsh
# Run normally
$ yarn start
# Run the application with nodemon for development
$ yarn dev
```

### Test
```zsh
# Test
$ yarn test                           # Run all test
# Test (Watch Mode for development)
$ yarn test:watch                     # Run all test with watch mode
```

### API docs
location: `web/spec/swagger.json`

## Dependencies
This project is developed based on the [posquit0/koa-rest-api-boilerplate](https://github.com/posquit0/koa-rest-api-boilerplate) using ES6, Jest and Swagger API.


## License
Provided under the terms of the MIT License.
