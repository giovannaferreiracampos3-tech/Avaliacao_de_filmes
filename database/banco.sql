CREATE TABLE IF NOT EXISTS avaliacoes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  imdb_id VARCHAR(20) NOT NULL UNIQUE,
  titulo VARCHAR(200) NOT NULL,
  ano VARCHAR(20),
  poster VARCHAR(500),
  nota TINYINT NOT NULL,
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
 
-- INSERT IGNORE: pode rodar mais de uma vez sem duplicar.
INSERT IGNORE INTO avaliacoes (imdb_id, titulo, ano, poster, nota) VALUES
('tt0343818', 'I, Robot', '2004', 'N/A', 4),
('tt0816692', 'Interstellar', '2014', 'N/A', 5);
 
 