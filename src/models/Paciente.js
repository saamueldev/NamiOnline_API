const mongoose = require("mongoose");

const PacienteSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Usuario",
        required: [true, "O paciente deve estar vinculado a um usuário." ],
    },
    prontuario: {
        type: String,
        required: [true, "O prontuario é obrigatório." ],
        unique: true,
        trim: true,
    }
}, {
    timestamps: true
});

module.exports = mongoose.model("Paciente", PacienteSchema);

/*
POST /PACIENTES
{
  "user": "ID_DO_USUARIO",
  "prontuario": "PAC-001"
}
*/
