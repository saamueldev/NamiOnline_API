const AgendaBloqueio = require("../models/AgendaBloqueio");

async function createBlock(data) {
  return AgendaBloqueio.create(data);
}

async function listBlocks() {
  return AgendaBloqueio.find()
    .populate("medicoId")
    .sort({ createdAt: -1 });
}

async function findBlockById(id) {
  return AgendaBloqueio.findById(id).populate("medicoId");
}

async function updateBlock(id, data) {
  return AgendaBloqueio.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  }).populate("medicoId");
}

async function deleteBlock(id) {
  return AgendaBloqueio.findByIdAndDelete(id);
}

module.exports = {
  createBlock,
  listBlocks,
  findBlockById,
  updateBlock,
  deleteBlock,
};