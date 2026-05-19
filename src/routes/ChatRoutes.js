const express = require("express");
const router = express.Router();

const Chat = require("../models/Chat");

// ==========================================
// ENVIAR
// ==========================================
router.post("/", async (req, res) => {
  try {

    console.log("BODY:", req.body);

    const novaMensagem =
      new Chat(req.body);

    await novaMensagem.save();

    console.log(
      "SALVO:",
      novaMensagem
    );

    res.status(201).json(
      novaMensagem
    );

  } catch (error) {

    console.log(
      "ERRO CHAT:",
      error
    );

    res.status(500).json({
      erro: error.message,
    });
  }
});

// ==========================================
// CONVERSA
// ==========================================
router.get(
  "/conversa/:usuarioId",
  async (req, res) => {
    try {

      const mensagens =
        await Chat.find({
          $or: [
            {
              remetenteId:
                req.params.usuarioId,
            },
            {
              destinatarioId:
                req.params.usuarioId,
            },
          ],
        }).sort({
          createdAt: 1,
        });

      res.json(mensagens);

    } catch (error) {

      console.log(error);

      res.status(500).json({
        erro:
          "Erro ao buscar conversa",
      });
    }
  }
);

module.exports = router;