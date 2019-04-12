module.exports = {
  eAdmin: function(req, res, next){
    if(req.isAuthenticated() && req.user.admin ==1){
      return next()
    }
    req.flash('error_msg', 'Você deve ser administrador para esta rota.')
    res.redirect('/')
  }
}
