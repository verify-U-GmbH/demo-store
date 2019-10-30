module.exports = {
  files: {
    javascripts: {
      joinTo: {
        'js/app.js':  [/^app/]
      }
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