module.exports = {
  files: {
    javascripts: {
      joinTo: 'js/app.js'
    },
    stylesheets: {
      joinTo: 'app.css'
    }
  },

  conventions: {
    assets: /static/
  },

  plugins: {
    babel: {
      ignore: [/vendor/]
    }
  }
};