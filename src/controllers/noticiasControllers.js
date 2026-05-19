const Noticia = require("../models/Noticias");

function montarImagem(dataUrl) {
  if (!dataUrl || typeof dataUrl !== "string") return undefined;

  const match = dataUrl.match(/^data:(.+);base64,(.+)$/);

  if (!match) return undefined;

  return {
    contentType: match[1],
    data: Buffer.from(match[2], "base64"),
  };
}

function montarDadosNoticia(body) {
  const dados = {
    Autor: body.Autor ?? body.author,
    Titulo: body.Titulo ?? body.title,
    Data: body.Data ?? body.date,
    Categoria: body.Categoria ?? body.category,
    Resumo: body.Resumo ?? body.summary,
    Conteudo: body.Conteudo ?? body.content,
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

function serializarNoticia(noticia) {
  const noticiaObj = noticia.toObject ? noticia.toObject() : noticia;
  const imagem = noticiaObj.Imagem;

  if (imagem?.data && imagem?.contentType) {
    const buffer = bufferFromImageData(imagem.data);

    if (!buffer) return noticiaObj;

    return {
      ...noticiaObj,
      imageUrl: `data:${imagem.contentType};base64,${buffer.toString("base64")}`,
    };
  }

  return noticiaObj;
}

async function listarNoticias(req, res) {
  try {
    const noticias = await Noticia.find().sort({ Data: -1, createdAt: -1 });
    return res.status(200).json(noticias.map(serializarNoticia));
  } catch (error) {
    return res.status(500).json({
      mensagem: "Erro ao listar noticias.",
      erro: error.message,
    });
  }
}

async function buscarNoticiaPorId(req, res) {
  try {
    const noticia = await Noticia.findById(req.params.id);

    if (!noticia) {
      return res.status(404).json({ mensagem: "Noticia nao encontrada." });
    }

    return res.status(200).json(serializarNoticia(noticia));
  } catch (error) {
    return res.status(500).json({
      mensagem: "Erro ao buscar noticia.",
      erro: error.message,
    });
  }
}

async function cadastrarNoticia(req, res) {
  try {
    const dadosNoticia = montarDadosNoticia(req.body);
    const novaNoticia = await Noticia.create(dadosNoticia);

    return res.status(201).json(serializarNoticia(novaNoticia));
  } catch (error) {
    return res.status(400).json({
      mensagem: "Erro ao cadastrar noticia.",
      erro: error.message,
    });
  }
}

async function atualizarNoticia(req, res) {
  try {
    const noticiaAtualizada = await Noticia.findByIdAndUpdate(
      req.params.id,
      montarDadosNoticia(req.body),
      { new: true, runValidators: true }
    );

    if (!noticiaAtualizada) {
      return res.status(404).json({ mensagem: "Noticia nao encontrada." });
    }

    return res.status(200).json(serializarNoticia(noticiaAtualizada));
  } catch (error) {
    return res.status(400).json({
      mensagem: "Erro ao atualizar noticia.",
      erro: error.message,
    });
  }
}

async function excluirNoticia(req, res) {
  try {
    const noticiaExcluida = await Noticia.findByIdAndDelete(req.params.id);

    if (!noticiaExcluida) {
      return res.status(404).json({ mensagem: "Noticia nao encontrada." });
    }

    return res.status(200).json(serializarNoticia(noticiaExcluida));
  } catch (error) {
    return res.status(500).json({
      mensagem: "Erro ao excluir noticia.",
      erro: error.message,
    });
  }
}

module.exports = {
  listarNoticias,
  buscarNoticiaPorId,
  cadastrarNoticia,
  atualizarNoticia,
  excluirNoticia,
};
