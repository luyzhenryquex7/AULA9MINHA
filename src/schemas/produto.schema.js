module.exports = {
    type: "object",
    properties: {
        nome: {type: "string"},
        descricao: {type: "string"},
        preco: {type: "integer"},
        userId: {type: "integer"}
    },
    required: ["nome", "preco", "userId"],
    additionalProperties: false
}