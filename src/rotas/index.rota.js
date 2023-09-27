const express = require('express')
const router = express.Router()
const { Produto, Usuario } = require('../db/models')
const moment = require('moment')
moment.locale('pt-br')

router.get('/', async (req, res) => {
        const produtos = await Produto.findAll({
            limit: 10,
            order: [['createdAt', 'DESC']],
            include: [{
                model: Usuario
            }], raw: true, nest: true
        })
    
        const produtoResult = produtos.map((produto) => prepararResultado(produto))
        res.render('pages/produtos', {produtos: produtoResult, layout: 'layouts/layout-blog.ejs'})
    })

router.get('/produto/:id', async (req, res) => {
        const produto = await Produto.findByPk(req.params.id, 
            {include: [{model: Usuario}], raw: true, nest: true})
        res.render('pages/produto', {produto:prepararResultado(produto), layout: 'layouts/layout-blog.ejs'})
    })

function prepararResultado(produto){

        const result = Object.assign({}, produto)
        result.postadoEm = moment(new Date(result.createdAt)).format('DD [de] MMMM [de] yyyy [as] HH:mm')

        if (result.createdAt) delete result.createdAt
        if (result.updatedAt) delete result.updatedAt
        if (result.userId) delete result.userId
        if (result.Usuario){
                if (result.Usuario.senha) delete result.Usuario.senha
                if (result.Usuario.createdAt) delete result.Usuario.createdAt
                if (result.Usuario.updatedAt) delete result.Usuario.updatedAt
        }
        return result
}

module.exports = router