const mongoose = require("mongoose");

const EspecialidadeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },

  requerGuia: {
    type: Boolean,
    default: false
  }
});

module.exports = mongoose.model("Especialidade", EspecialidadeSchema);