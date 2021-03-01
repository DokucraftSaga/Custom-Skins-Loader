const path = require('path')

module.exports = {
  port: 8080,
  buildPath: path.join(__dirname, '../../web-dist'),
  htmlInput: 'src/index.pug',
  styleInput: 'src/style.styl',
  scriptInput: 'src/script.js',
  buildOptions: {
    htmlFileName: 'index.html'
  }
}