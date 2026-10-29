const apiKey = '771bcb3b';
 
// Esses comandos "conectam" o JavaScript aos elementos do HTML
// usando os IDs que definimos no index.html
const btnBuscar = document.getElementById('btnBuscar');
const inputFilme = document.getElementById('inputFilme');
const container = document.getElementById('movie-container');
 
// =============================================
// EVENTO DE CLIQUE
// Quando o botão "Buscar" for clicado, este código é executado
// =============================================
btnBuscar.addEventListener('click', () => {
    const nomeFilme = inputFilme.value; // Lê o que o usuário digitou
    if (nomeFilme !== '') {
        container.innerHTML = '<p>Carregando...</p>';
        buscarFilme(nomeFilme);
    }
});
 
// =============================================
// FUNÇÃO PRINCIPAL: Buscar filme na API
// =============================================
async function buscarFilme(titulo) {
 
    // ----- LACUNA 1: MONTAR A URL DA API -----
    const url = `http://www.omdbapi.com/?t=${titulo}&apikey=${apiKey}`;
 
    try {
        // ----- LACUNA 2: MÉTODO HTTP -----
        const response = await fetch(url, {
            method: 'GET'
        });
 
        // ----- LACUNA 3: CONVERTER PARA JSON -----
        const data = await response.json();
 
        if (data.Response === "True") {
            exibirFilme(data);
        } else {
            container.innerHTML = '<p>Filme não encontrado. Tente outro título!</p>';
        }
 
    } catch (error) {
        console.error("Erro na requisição:", error);
        container.innerHTML = '<p>Erro na conexão com o servidor.</p>';
    }
}
 
// =============================================
// FUNÇÃO: Exibir os dados do filme na página
// =============================================
function exibirFilme(filme) {
 
    console.log(filme); // Use F12 > Console para ver o objeto
 
    // ----- LACUNA 4: EXTRAIR DADOS DO JSON -----
    const titulo = filme.Title;
    const ano = filme.Year;
    const imagem = filme.Poster;
 
    // ----- LACUNA 5: INJETAR NO HTML -----
    container.innerHTML = `
        <div class="movie-card">
            <img src="${imagem}" alt="Pôster de ${titulo}">
            <h2>${titulo}</h2>
            <p>Ano: ${ano}</p>
            <div class="avaliacoes">
                <span>⭐</span><span>⭐</span><span>⭐</span><span>⭐</span><span>⭐</span>
            </div>
        </div>
    `;
 
        function ativarEstrelas() {
        const estrelas = document.querySelectorAll('.avaliacoes span');
 
        estrelas.forEach((estrela, index) => {
            estrela.addEventListener('click', () => {
                estrelas.forEach((e, i) => {
                    if (i <= index) {
                        e.style.filter = 'grayscale(0%)';
                        e.style.transform = 'scale(1.2)';
                    } else {
                        e.style.filter = 'grayscale(100%)';
                        e.style.transform = 'scale(1)';
                    }
                });
            });
        });
    }
 
    ativarEstrelas();
 
}
 
 
 