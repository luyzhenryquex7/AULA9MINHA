const express = require('express')
const router = express.Router()
const produtoMid = require('../middleware/validarProduto.middleware')
const { Produto, Usuario } = require('../db/models')
var multer = require('multer')
const path = require('path')
const ErrorHandler = require('../utils/ErrorHandler')

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads')
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname))
    }
})

const fileFilter = (req, file, cb) => {
    const extensoes = /jpeg|jpg/i
    if (extensoes.test(path.extname(file.originalname))) {
        cb(null, true)
    } else {
        return cb('Arquivo não suportado. Apenas jpg e jpeg são suportados.')
    }
}

var upload = multer({ storage: storage, fileFilter: fileFilter })

router.post('/', upload.single('foto'))
router.post('/', produtoMid)
router.put('/', produtoMid)

router.get('/', async (req, res) => {
    const produtos = await Produto.findAll()
    res.json({ produtos: Object.values(produtos) })
})

router.get('/:id', async (req, res) => {
    const produto = await Produto.findByPk(req.params.id,
        { include: [{ model: Usuario }], raw: true, nest: true })

    const prodProcessado = prepararResultado(produto)

    res.json({ produtos: prodProcessado })
})

router.post('/:id/upload', upload.single('foto'), async (req, res) => {
    console.log(req.file)
    const id = req.params.id
    const produto = await Produto.findByPk(id)

    if (produto) {
        produto.foto = `/static/uploads/${req.file.filename}`
        await produto.save()
        res.json({ msg: "Upload realizado com sucesso!" })
    } else {
        res.status(400).json({ msg: "Produto não encontrado!" })
    }

})

router.post('/', async (req, res, next) => {
    const data = req.body
    if (req.file){
            data.foto = `/static/uploads/${req.file.filename}`
    }
    try{
            const post = await Post.create(data)
            res.json({msg: "Post adicionado com sucesso!"})
    }catch (err){
            next(new ErrorHandler(500, 'Falha interna ao adicionar postagem'))
    }

})

router.delete('/', async (req, res) => {
    const id = req.query.id
    const produto = await Produto.findByPk(id)
    if (produto) {
        await produto.destroy()
        res.json({ msg: "Produto deletado com sucesso!" })
    } else {
        res.status(400).json({ msg: "Produto não encontrado!" })
    }

})

router.put('/', async (req, res) => {

    const id = req.query.id
    const produto = await Produto.findByPk(id)

    if (produto) {
        produto.nome = req.body.nome
        produto.descricao = req.body.descricao
        produto.preco = req.body.preco
        await produto.save()
        res.json({ msg: "Produto atualizado com sucesso!" })
    } else {
        res.status(400).json({ msg: "Produto não encontrado!" })
    }

})

function prepararResultado(produto) {
    const result = Object.assign({}, produto)

    if (result.createdAt) delete result.createdAt
    if (result.updateAt) delete result.updatedAt
    if (result.userId) delete result.userId
    if (result.Usuario) {
        if (result.Usuario.senha) delete result.Usuario.senha
    }
    return result
}

module.exports = router



