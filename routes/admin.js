const express = require("express")
const router = express.Router()

router.get('/',(req, res)=>{
  res.render('admin/index')
})

router.get('/posts', (req, res)=>{
  res.send('Página de posts')
})

module.exports = router
