const path = require('path')

module.exports = {
  entry: './src/main.js',
  html: {
    template: './src/index.ejs',
    env: process.env.NODE_ENV,
  },
  devServer: {
    before(app) {
      app.get('/map-tiles/\*', (req, res) => {
        res.sendFile(req.path.slice('/map-tiles'.length), {
          root: 'C:/Repos/kedamamc-unoff-site/tiles',
        })
      })
    },
  },
}