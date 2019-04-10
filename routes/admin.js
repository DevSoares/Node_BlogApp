const express = require("express")
const router = express.Router()
const mongoose = require('mongoose')
require('../models/Categoria')
const Categoria = mongoose.model('categorias')

router.get('/',(req, res)=>{
  res.render('admin/index')
})

router.get('/categorias',(req, res)=>{
  Categoria.find().then((categorias)=>{
    res.render('admin/categorias', {categorias: categorias})
  }).catch((err)=>{
    req.flash('error_msg','Houve um erro ao listar as categorias!')
    req.redirect('/admin')
  })

})

router.get('/categorias/add',(req, res)=>{
  res.render('admin/addcategorias')
})

router.post('/categorias/nova', (req,res)=>{

  var erros = []

  if(!req.body.nome || typeof req.body.nome==undefined || req.body.nome== null){
    erros.push({texto:'Nome inválido'})
  }
  if(!req.body.slug || typeof req.body.slug== undefined || req.body.slug== null){
    erros.push({texto: 'Slug inválido'})
  }
  if(req.body.nome.length < 2){
    erros.push({texto: 'Nome da categoria é muito curto'})
  }
  if(erros.length>0){
    res.render('admin/addcategorias',{erros:erros})
  }else{
    const novaCategoria = {
      nome: req.body.nome,
      slug: req.body.slug
    }

    new Categoria(novaCategoria).save().then(()=>{
      req.flash('success_msg','Categoria cadastrada com sucesso')
      res.redirect('/admin/categorias')
    }).catch((err)=>{
      req.flash('error_msg', 'Houve um problema ao cadastrar.')
      res.redirect('/admin')
    })
  }
})

router.get('/categorias/edit/:id', (req, res)=>{
      Categoria.findOne({_id:req.params.id}).then((categoria)=>{
        res.render('admin/editcategorias', {categoria:categoria})
      }).catch((err)=>{
        req.flash('error_msg', 'Esta categoria não existe')
        res.redirect('/admin/categorias')
      })
})

router.post('/categorias/edit',(req,res)=>{
  Categoria.findOne({_id:req.body.id}).then((categoria)=>{
    var erros = []

    if(!req.body.nome || typeof req.body.nome==undefined || req.body.nome== null){
      erros.push({texto:'Nome inválido'})
    }
    if(!req.body.slug || typeof req.body.slug== undefined || req.body.slug== null){
      erros.push({texto: 'Slug inválido'})
    }
    if(req.body.nome.length < 2){
      erros.push({texto: 'Nome da categoria é muito curto'})
    }
    if(erros.length>0){
      res.render('admin/editcategorias', {categoria:categoria, erros:erros} )
    }else{
      categoria.nome = req.body.nome
      categoria.slug = req.body.slug
      categoria.save().then(()=>{
        req.flash('success_msg', 'Categoria editada com sucesso!')
        res.redirect('/admin/categorias')
      }).catch((err)=>{
        req.flash('error_msg', 'Houve um erro ao salvar a categoria!')
        res.redirect('/admin/categorias')
      })
      }
  }).catch((err)=>{
    req.flash('error_msg', 'Houve um erro ao editar a categoria!')
    res.redirect('/admin/categorias')
  })
})

router.post('/categorias/deletar', (req, res)=>{
  Categoria.deleteOne({_id: req.body.id}).then(()=>{
    req.flash('success_msg', 'Categoria removida com sucesso!')
    res.redirect('/admin/categorias')
  }).catch((err)=>{
    req.flash('error_msg', 'Houve um erro ao remover a categoria!')
    res.redirect('/admin/categorias')
  })
})

router.get('/postagens', (req, res)=>{
  res.render('admin/postagens')
})

router.get('/postagens/add', (req, res)=>{
  Categoria.find().then((categorias)=>{
    res.render('admin/addpostagens', {categorias:categorias})
  }).catch((err)=>{
    req.flash('error_msg', 'Houve um erro ao carregar o formulário')
    res.redirect('/admin')
  })
})

module.exports = router
