// Executa o arquivo database/banco.sql no banco configurado no .env
// Uso: npm run criar-tabela   (rodar uma vez)
require("dotenv").config();
const fs = require("fs");
const path = require("path");
const mysql = require("mysql2/promise");
 
async function main() {
  const sql = fs.readFileSync(path.join(__dirname, "database", "banco.sql"), "utf8");
 
  const conexao = await mysql.createConnection({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ssl: { rejectUnauthorized: false },
    multipleStatements: true
  });
 
  await conexao.query(sql);
  console.log("Tabela criada com sucesso!");
  await conexao.end();
}
 
main().catch((erro) => {
  console.error("Erro:", erro.message);
  process.exit(1);
});
 
 