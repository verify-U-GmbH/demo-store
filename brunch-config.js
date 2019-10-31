module.exports = {
  files: {
    javascripts: {
      joinTo: 'js/app.js'
    },
    stylesheets: {
      joinTo: 'app.css'
    }
  },

  plugins: {
    babel: {
      ignore: [/vendor/]
    }
  }
};