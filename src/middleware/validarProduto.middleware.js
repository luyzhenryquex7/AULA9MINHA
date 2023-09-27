const Ajv = require('ajv')
const ajv = new Ajv()
const addFormats = require('ajv-formats')
const produtoSchema = require('../schemas/produto.schema')
const { and } = require('sequelize')
addFormats(ajv)

function validarProduto(req, res, next) {
    const produto = req.body
    if(produto.userId){
        produto.userId = Number(produto.userId)
    }
    if(produto.preco){
        produto.preco = Number(produto.preco)
    }
    const validate = ajv.compile(produtoSchema)
    const valid = validate(produto)
    
    if (valid) {
        next()
    }else{
        res.status(400).json({msg: 'Dados Inválidos!', erros: validate.errors})
    }
}

module.exports = validarProduto