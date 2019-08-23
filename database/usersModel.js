const db = require('./dbConfig')

module.exports = {
    getAll,
    add,
    findByUsername,
    findById
}

function getAll(){
    return db('users')
}

function findByUsername(username){
    return db('users').where({username}).first()
}

function findById(id){
    return db('users').where({id})
}

function add(user){
    return db('users').insert(user).then(([id]) => findById(id))
}