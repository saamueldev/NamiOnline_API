const express = require("express")

const router = express.Router()

router.post("/avatar", (req, res) => {

  const { avatar } = req.body

  console.log("Avatar recebido")

  res.json({
    sucesso: true,
    mensagem: "Avatar salvo com sucesso",
    avatar,
  })

})

module.exports = router