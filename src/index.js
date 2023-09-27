const express = require("express");
const rotaProduto = require('./rotas/produto.rota')
const rotaUsuario = require('./rotas/usuario.rota')
var expressLayouts = require('express-ejs-layouts')
const indexRoute = require('./rotas/index.rota')
const  logger = require ('./utils/logger')
const logMiddleware = require ('./middleware/log.mid')

const app = express();

app.use(express.json());
app.set('view engine', 'ejs')

app.use(logMiddleware)

app.set('layout', 'layouts/layout')

app.use(expressLayouts)

app.use('/static', express.static('public'))

app.use('/api/usuarios', rotaUsuario)
app.use('/api/produtos', rotaProduto)

app.use('/', indexRoute)

app.get("/api", (req, res) => {
  res.json({ msg: "Hello from Express!" });
});

app.use((err, req, res, next) => {
  const { statusCode, msg } = err
  res.status(statusCode).json({msg: msg})
})

app.listen(8080, () => {
  logger.info(`Iniciando no ambiente ${process.env.NODE_ENV}`)
  logger.info('Servidor pronto na porta 8080')
})