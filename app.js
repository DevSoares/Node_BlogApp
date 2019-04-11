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
  require('./models/Postagem')
  const Postagem = mongoose.model('postagens')
  require('./models/Categoria')
  const Categoria = mongoose.model('categorias')
  const usuarios = require('./routes/usuario')
  const passport = require('passport')
  require('./config/auth')(passport)
//CONFIGURACOES
  // Sessão
    app.use(session({
      secret: 'cursodenode',
      resave: true,
      saveUninitialized: true
    }))
    app.use(passport.initialize())
    app.use(passport.session())
    app.use(flash())
  // Middleware
    app.use((req, res, next)=>{
      res.locals.success_msg = req.flash('success_msg')
      res.locals.error_msg = req.flash('error_msg')
      res.locals.error = req.flash('error')
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
  app.get('/', (req,res)=>{
    Postagem.find().populate('categoria').sort({data:'desc'}).then((postagens)=>{
      res.render('index', {postagens:postagens})
    }).catch((err)=>{
      req.flash('error_msg', 'Houve um erro interno')
      res.redirect('/404')
    })

  })

  app.get('/postagem/:slug',(req,res)=>{
    Postagem.findOne({slug: req.params.slug}).then((postagem)=>{
      if(postagem){
        res.render('postagem/index',{postagem:postagem})
      }else{
        req.flash('error_msg', 'Esta postagem não existe!')
        res.redirect('/')
      }
    }).catch((err)=>{
      req.flash('error_msg', 'Houve um erro interno.')
      res.redirect('/')
    })
  })

  app.get('/categorias', (req,res)=>{
    Categoria.find().then((categorias)=>{
      res.render('categorias/index', {categorias:categorias})
    }).catch((err)=>{
      req.flash('error_msg','Houve um erro interno ao listar as categorias.')
      res.redirect('/')
    })
  })

  app.get('/categorias/:slug', (req,res)=>{
    Categoria.findOne({slug:req.params.slug}).then((categoria)=>{
      if(categoria){
        Postagem.find({categoria:categoria._id}).then((postagens)=>{
          res.render('categorias/postagens',{postagens:postagens,categoria:categoria})
        }).catch((err)=>{
          req.flash('error_msg', 'Houve um erro ao listar os posts!')
          res.redirect('/')
        })
      }else {
        req.flash('error_msg', 'Esta categoria não existe.')
        res.redirect('/')
      }
    }).catch((err)=>{
      req.flash('error_msg','Erro ao carregar a página desta categoria.')
      res.redirect('/')
    })
  })

  app.get('/404', (req,res)=>{
    res.send('Error 404!')
  })

  app.use('/admin', admin)
  app.use('/usuarios', usuarios)
//OUTROS
const port = 8093
app.listen(port,()=>{
  console.log('Servidor rodando!')
})
