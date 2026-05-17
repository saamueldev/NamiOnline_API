require("dotenv").config();

const mongoose = require("mongoose");
const connectDatabase = require("../config/database");
const CategoriaExame = require("../models/categoriaExameModel");
const TipoExame = require("../models/tipoExameModel");

async function limparTiposExamesOrfaos() {
  try {
    await connectDatabase();

    const deveExcluir = process.argv.includes("--confirm");

    const categorias = await CategoriaExame.find({}, "_id nome");
    const categoriasIds = categorias.map((categoria) => categoria._id);

    const tiposOrfaos = await TipoExame.find({
      $or: [
        { categoriaExameId: { $exists: false } },
        { categoriaExameId: null },
        { categoriaExameId: { $nin: categoriasIds } },
      ],
    }).populate("categoriaExameId", "nome");

    if (tiposOrfaos.length === 0) {
      console.log("Nenhum tipo de exame órfão encontrado.");
      await mongoose.connection.close();
      return;
    }

    console.log(`Tipos de exame órfãos encontrados: ${tiposOrfaos.length}`);
    console.log("");

    tiposOrfaos.forEach((tipo) => {
      console.log(`- ${tipo.nome}`);
      console.log(`  ID: ${tipo._id}`);
      console.log(`  categoriaExameId: ${tipo.categoriaExameId || "sem categoria"}`);
      console.log("");
    });

    if (!deveExcluir) {
      console.log("Modo simulação: nenhum dado foi excluído.");
      console.log("Para excluir de verdade, rode:");
      console.log("node src/scripts/limparTiposExamesOrfaos.js --confirm");

      await mongoose.connection.close();
      return;
    }

    const idsParaExcluir = tiposOrfaos.map((tipo) => tipo._id);

    const resultado = await TipoExame.deleteMany({
      _id: { $in: idsParaExcluir },
    });

    console.log(`${resultado.deletedCount} tipo(s) de exame órfão(s) excluído(s) com sucesso.`);

    await mongoose.connection.close();
  } catch (error) {
    console.error("Erro ao limpar tipos de exame órfãos:", error);
    await mongoose.connection.close();
    process.exit(1);
  }
}

limparTiposExamesOrfaos();