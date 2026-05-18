require("dotenv").config();

console.log(process.env.MONGO_URI);
console.log(process.env.MONGO_URI)

<<<<<<< HEAD
// ROTAS
const retornoRoutes = require("./routes/retornoRoutes");
const notificacaoRoutes = require("./routes/notificacaoRoutes");
const configuracaoRoutes = require("./routes/configuracaoRoutes");
const authMiddleware = require("./middlewares/authMiddleware");
const requireRole = require("./middlewares/roleMiddleware");
=======
const express = require("express")
const cors = require("cors")
>>>>>>> c7b8e3a (backend funcionando)

const app = express()

// CONEXÃO COM BANCO
const connectDatabase = require("./config/database")

// ROTAS PRINCIPAIS
const userRoutes = require("./routes/usuarioRoutes")
const medicoRoutes = require("./routes/medicoRoutes")
const pacienteRoutes = require("./routes/pacienteRoutes")
const categoriaExameRoutes = require("./routes/categoriaExameRoutes")
const tipoExameRoutes = require("./routes/tipoExameRoutes")

// NOVAS ROTAS
const retornoRoutes = require("./routes/retornoRoutes")
const notificacaoRoutes = require("./routes/notificacaoRoutes")
const configuracaoRoutes = require("./routes/configuracaoRoutes")

const PORT = process.env.PORT || 3000

// MIDDLEWARES
app.use(cors())
app.use(express.json())

// ROTAS DA API
<<<<<<< HEAD
app.use("/retornos", authMiddleware, requireRole("usuario"), retornoRoutes);

app.use("/notificacoes", authMiddleware, requireRole("usuario"), notificacaoRoutes);

app.use("/configuracoes", authMiddleware, requireRole("usuario"), configuracaoRoutes);
=======
app.use("/usuarios", userRoutes)

app.use("/medicos", medicoRoutes)

app.use("/pacientes", pacienteRoutes)

app.use("/categorias-exames", categoriaExameRoutes)

app.use("/tipos-exames", tipoExameRoutes)

app.use("/retornos", retornoRoutes)

app.use("/notificacoes", notificacaoRoutes)

app.use("/configuracoes", configuracaoRoutes)
>>>>>>> c7b8e3a (backend funcionando)

// INICIAR SERVIDOR
async function startServer() {
  try {

    await connectDatabase()

    app.listen(PORT, () => {
      console.log(`Servidor rodando na porta ${PORT}`)
    })

  } catch (error) {

    console.error("Erro ao iniciar servidor:", error)

  }
}

<<<<<<< HEAD
startServer();
=======
startServer()
>>>>>>> c7b8e3a (backend funcionando)
