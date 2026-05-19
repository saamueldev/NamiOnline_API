const express = require("express")

const router = express.Router()

router.post("/tema", (req, res) => {

  const { tema } = req.body

 

  res.json({
    sucesso: true,
    mensagem: "Tema salvo",
    tema,
  })

})

module.exports = router;

