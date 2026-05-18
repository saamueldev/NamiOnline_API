const guiaRoutes = require("./routes/guiaRoutes");

app.use(express.json());

app.use("/guia", guiaRoutes);