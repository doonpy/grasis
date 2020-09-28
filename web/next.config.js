module.exports = {
  publicRuntimeConfig: {
    API_SERVER:
      process.env.NODE_ENV === 'production'
        ? 'https://grasis-api.herokuapp.com/'
        : 'http://localhost:3000'
  }
};
