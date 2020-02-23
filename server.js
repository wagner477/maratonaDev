const express = require('express')

const server = express()

// Configurar o servidor para apresentar arquivos estaticos
server.use(express.static('public'))

// habilitar body do formulário
server.use(express.urlencoded({ extended: true }))

// configurar a conexão com o banco de dados
const Pool = require('pg').Pool
const db = new Pool({
  user: 'postgres',
  password: '34990134w',
  host: 'localhost',
  port: 5432,
  database: 'doe'
})

// configurando a template engine
const nunjucks = require('nunjucks')
nunjucks.configure("./", {
  express: server,
  noCache: true
})

// Configurar a apresentação da página
server.get("/", (req, res) => {

  db.query("SELECT * FROM donors", (err, result) => {
    if(err) return res.send("Erro do banco de dados.")

    const donors = result.rows
    return res.render('index.html', { donors } )


  })

})

server.post('/', (req, res) => {
  // Pegar dados do formulário
  const name = req.body.name
  const email = req.body.email
  const blood = req.body.blood

  if (name == "" || email == "" || blood == "") {
    return res.send("Todos os campos são obrigatórios")
  }

  // Coloca valores dentro do banco de dados
  const query = `
    INSERT INTO donors ("name", "email", "blood")
    VALUES ($1, $2, $3)`
  
  const values = [name, email, blood]
  
  db.query(query, values, function(err) {
    // fluxo de erro
    if (err) {
      console.log(err)
      return res.send("erro no banco de dados.")
    }

    // fluxo ideal
    return res.redirect("/")
})

})



// ligar o servidor e permitir o acesso a porta 3000
server.listen(3000, () => {
  console.log('servidor iniciado');
})