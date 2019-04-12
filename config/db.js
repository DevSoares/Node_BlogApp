if(process.env.Node_ENV=='production'){
  module.exports = {mongoURI:"mongodb+srv://DevSoaresMadmin:<password>@cluster0-gcyl0.azure.mongodb.net/test?retryWrites=true"}
}else{
  module.exports = {mongoURI:'mongodb://localhost/blogapp'}
}
