const {Sequelize} = require('sequelize')

const sequelize = new Sequelize('cadastro', 'root', 'Password', {
    host: 'localhost',
    dialect: 'mysql'
})

try {
    sequelize.authenticate()
    console.log('Conectamos com sucesso')
} catch (error) {
  console.log(error)  
}

module.exports = sequelize