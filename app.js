// CARREGANDO MÓDULOS
  const express = require('express')
  const handlebars =  require('express-handlebars')
  const bodyParser = require('body-parser')
  const mongoose = require('mongoose')
  const app = express()
  const admin = require('./routes/admin')
  const path = require('path')
  const session = require('express-session')
  const flash = require('connect-flash')
//CONFIGURACOES
  // Sessão
    app.use(session({
      secret: 'cursodenode',
      resave: true,
      saveUninitialized: true
    }))
    app.use(flash())
  // Middleware
    app.use((req, res, next)=>{
      res.locals.success_msg = req.flash('success_msg')
      res.locals.error_msg = req.flash('error_msg')
      next()
    })
  // bodyParser
    app.use(bodyParser.urlencoded({extended:true}))
    app.use(bodyParser.json())
  // handlebars
    app.engine('handlebars', handlebars({defaultLayout:'main'}))
    app.set('view engine', 'handlebars')
  // mongoose
    mongoose.Promise = global.Promise
    mongoose.connect('mongodb://localhost/blogapp', {useNewUrlParser: true}).then(()=>{
      console.log('Conectado ao mongo')
    }).catch((err)=>{
      console.log('Erro ao se conectar: '+err)
    })
  // Public
    app.use(express.static(path.join(__dirname, 'public')))

//ROTAS
  app.use('/admin', admin)
//OUTROS
const port = 8093
app.listen(port,()=>{
  console.log('Servidor rodando!')
})
