require("dotenv").config();
 
const express = require("express");
const mysql = require("mysql2/promise");
 
const app = express();
const PORT = process.env.PORT || 3000;
 
app.use(express.json());
app.use(express.static("public"));
 
// =============================================
// CONEXÃO COM O BANCO (Aiven exige SSL)
// =============================================
const db = mysql.createPool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: { rejectUnauthorized: false }
});
 
db.getConnection()
  .then((conn) => {
    console.log("Conectado ao MySQL!");
    conn.release();
  })
  .catch((erro) => console.error("Erro ao conectar ao banco:", erro.message));
 
// =============================================
// BUSCAR FILME NA API OMDb
// A chave fica no servidor (.env), nunca no front-end!
// =============================================
app.get("/api/buscar", async (req, res) => {
  const titulo = req.query.titulo;
 
  if (!titulo) {
    return res.status(400).json({ erro: "Informe o título do filme." });
  }
 
  try {
    const url = `https://www.omdbapi.com/?t=${encodeURIComponent(titulo)}&apikey=${process.env.OMDB_API_KEY}`;
    const resposta = await fetch(url);
    const dados = await resposta.json();
 
    if (dados.Response !== "True") {
      return res.status(404).json({ erro: dados.Error || "Filme não encontrado." });
    }
 
    res.json({
      imdb_id: dados.imdbID,
      titulo: dados.Title,
      ano: dados.Year,
      poster: dados.Poster
    });
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: "Erro ao consultar a API de filmes." });
  }
});
 
// =============================================
// READ - Listar avaliações salvas
// =============================================
app.get("/api/avaliacoes", async (req, res) => {
  try {
    const [linhas] = await db.query("SELECT * FROM avaliacoes ORDER BY id DESC");
    res.json(linhas);
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: "Erro ao buscar avaliações." });
  }
});
 
// =============================================
// CREATE / UPDATE - Salvar avaliação
// Se o filme já foi avaliado, atualiza a nota.
// =============================================
app.post("/api/avaliacoes", async (req, res) => {
  const { imdb_id, titulo, ano, poster, nota } = req.body;
 
  if (!imdb_id || !titulo || !nota) {
    return res.status(400).json({ erro: "Dados incompletos." });
  }
  if (nota < 1 || nota > 5) {
    return res.status(400).json({ erro: "A nota deve ser de 1 a 5." });
  }
 
  try {
    await db.query(
      `INSERT INTO avaliacoes (imdb_id, titulo, ano, poster, nota)
       VALUES (?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE nota = VALUES(nota)`,
      [imdb_id, titulo, ano, poster, nota]
    );
    res.status(201).json({ mensagem: "Avaliação salva!" });
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: "Erro ao salvar avaliação." });
  }
});
 
// =============================================
// DELETE - Excluir avaliação
// =============================================
app.delete("/api/avaliacoes/:id", async (req, res) => {
  try {
    const [resultado] = await db.query("DELETE FROM avaliacoes WHERE id = ?", [req.params.id]);
 
    if (resultado.affectedRows === 0) {
      return res.status(404).json({ erro: "Avaliação não encontrada." });
    }
    res.json({ mensagem: "Avaliação excluída!" });
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: "Erro ao excluir avaliação." });
  }
});
 
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
 
 