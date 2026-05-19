const Evento = require("../models/Eventos");

function montarImagem(dataUrl) {
  if (!dataUrl || typeof dataUrl !== "string") return undefined;

  const match = dataUrl.match(/^data:(.+);base64,(.+)$/);

  if (!match) return undefined;

  return {
    contentType: match[1],
    data: Buffer.from(match[2], "base64"),
  };
}

function montarDadosEvento(body) {
  const dados = {
    titulo: body.titulo ?? body.title,
    data: body.data ?? body.date,
    horario: body.horario ?? body.time,
    local: body.local ?? body.location,
    descricao: body.descricao ?? body.description,
  };

  const imagem = montarImagem(body.imageDataUrl ?? body.imageUrl ?? body.ImagemDataUrl);

  if (imagem) {
    dados.Imagem = imagem;
  }

  return dados;
}

function bufferFromImageData(imageData) {
  if (Buffer.isBuffer(imageData)) return imageData;
  if (imageData instanceof Uint8Array) return Buffer.from(imageData);
  if (Array.isArray(imageData)) return Buffer.from(imageData);
  if (Array.isArray(imageData?.data)) return Buffer.from(imageData.data);
  if (Buffer.isBuffer(imageData?.buffer)) return imageData.buffer;
  if (typeof imageData?.value === "function") return Buffer.from(imageData.value());

  return null;
}

function serializarEvento(evento) {
  const eventoObj = evento.toObject ? evento.toObject() : evento;
  const imagem = eventoObj.Imagem;

  if (imagem?.data && imagem?.contentType) {
    const buffer = bufferFromImageData(imagem.data);

    if (!buffer) return eventoObj;

    return {
      ...eventoObj,
      imageUrl: `data:${imagem.contentType};base64,${buffer.toString("base64")}`,
    };
  }

  return eventoObj;
}

async function listarEventos(req, res) {
  try {
    const eventos = await Evento.find().sort({ data: -1, createdAt: -1 });
    return res.status(200).json(eventos.map(serializarEvento));
  } catch (error) {
    return res.status(500).json({
      mensagem: "Erro ao listar eventos.",
      erro: error.message,
    });
  }
}

async function buscarEventoPorId(req, res) {
  try {
    const evento = await Evento.findById(req.params.id);

    if (!evento) {
      return res.status(404).json({ mensagem: "Evento nao encontrado." });
    }

    return res.status(200).json(serializarEvento(evento));
  } catch (error) {
    return res.status(500).json({
      mensagem: "Erro ao buscar evento.",
      erro: error.message,
    });
  }
}

async function cadastrarEvento(req, res) {
  try {
    const novoEvento = await Evento.create(montarDadosEvento(req.body));
    return res.status(201).json(serializarEvento(novoEvento));
  } catch (error) {
    return res.status(400).json({
      mensagem: "Erro ao cadastrar evento.",
      erro: error.message,
    });
  }
}

async function atualizarEvento(req, res) {
  try {
    const eventoAtualizado = await Evento.findByIdAndUpdate(
      req.params.id,
      montarDadosEvento(req.body),
      { new: true, runValidators: true }
    );

    if (!eventoAtualizado) {
      return res.status(404).json({ mensagem: "Evento nao encontrado." });
    }

    return res.status(200).json(serializarEvento(eventoAtualizado));
  } catch (error) {
    return res.status(400).json({
      mensagem: "Erro ao atualizar evento.",
      erro: error.message,
    });
  }
}

async function excluirEvento(req, res) {
  try {
    const eventoExcluido = await Evento.findByIdAndDelete(req.params.id);

    if (!eventoExcluido) {
      return res.status(404).json({ mensagem: "Evento nao encontrado." });
    }

    return res.status(200).json(serializarEvento(eventoExcluido));
  } catch (error) {
    return res.status(500).json({
      mensagem: "Erro ao excluir evento.",
      erro: error.message,
    });
  }
}

module.exports = {
  listarEventos,
  buscarEventoPorId,
  cadastrarEvento,
  atualizarEvento,
  excluirEvento,
};
