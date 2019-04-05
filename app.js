// CARREGANDO MÓDULOS
  const express = require('express')
  const handlebars =  require('express-handlebars')
  const bodyParser = require('body-parser')
  //const mongoose = require('mongoose')
  const app = express()
  const admin = require('./routes/admin')
  const path = require('path')
//CONFIGURACOES
  // bodyParser
    app.use(bodyParser.urlencoded({extended:true}))
    app.use(bodyParser.json())
  // handlebars
    app.engine('handlebars', handlebars({deafaultLayout:'main'}))
    app.set('view engine', 'handlebars')
  // mongoose
    //em breve
  // Public
    app.use(express.static(path.join(__dirname, 'public')))
//ROTAS
  app.use('/admin', admin)
//OUTROS
const port = 8093
app.listen(port,()=>{
  console.log('Servidor rodando!')
})
