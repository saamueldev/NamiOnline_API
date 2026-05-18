const express = require("express")

const router = express.Router()

router.post("/notificacoes", (req, res) => {

  const { notificacoes } = req.body

  console.log("Notificações:", notificacoes)

  res.json({
    sucesso: true,
    mensagem: "Configuração salva",
  })

})

module.exports = router