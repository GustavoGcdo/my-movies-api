## My movies api

API Criada para o Projeto My Movies utilizando a API do The Movie DB. 
Link da API Publicada: [https://gustavo-my-movies-api.herokuapp.com/](https://gustavo-my-movies-api.herokuapp.com/)
Frontend da aplicação publicada: [https://gustavo-my-movies-app.herokuapp.com/login](https://gustavo-my-movies-app.herokuapp.com/login)
Link do repositório do frontEnd: https://github.com/GustavoGcdo/my-movies-front.git

### Requisitos
- Node.js
- yarn ou npm

### Instruções de uso

1.  `git clone https://github.com/GustavoGcdo/my-movies-api.git`

2.  `yarn ou npm install `

4.  Verifique as variáveis de ambiente (.env.dev e .env.test):
    	`DB_URI` url do banco de dados mongodb
    	`LANGUAGE` linguagem de consulta na API do The Movie DB
    	`TMDB_KEY` Key da API do The Movie DB
    	`TMDB_URL_BASE` Url base da API do The Movie DB (atual é https://api.themoviedb.org/3) 
    	`TMDB_TOKEN` Token da API do The Movie DB
    	`PORT` Porta que o servidor vai rodar
    	
5. Iniciar a aplicação em desenvolvimento: `yarn start:dev`

6. Criar um build da aplicação em desenvolvimento: `yarn build`

7. Executar os testes: `yarn test`


