# ⚙️ Projeto Elevate: Backend

Bem-vindo ao repositório do backend do Projeto Elevate! Esta é a camada de servidor da nossa plataforma, responsável por toda a lógica de negócios, gestão de dados e comunicação segura com o banco de dados Supabase e APIs externas.

## ✨ Visão Geral

O backend do Elevate é a espinha dorsal da aplicação, projetado para ser robusto, seguro e escalável. Ele fornece uma API RESTful para o frontend, lidando com autenticação de usuários, gestão de trilhas de aprendizado e progresso, funcionalidades de fórum, emissão de certificados, e integrações com serviços de Inteligência Artificial e mídia.

## 💻 Tecnologias Utilizadas

Este backend foi desenvolvido com as seguintes tecnologias e bibliotecas-chave:

* **Node.js** ![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=nodedotjs&logoColor=white)
    * *Por que*: Permite a construção de APIs assíncronas e de alta performance, utilizando JavaScript em toda a stack.
* **Express.js** ![Express.js](https://img.io/badge/Express.js-000000?style=flat-square&logo=express&logoColor=white)
    * *Por que*: Framework web minimalista e flexível para Node.js, otimizado para a construção de APIs RESTful.
* **@supabase/supabase-js** ![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=flat-square&logo=supabase&logoColor=white)
    * *Por que*: Cliente JavaScript oficial para interagir com o Supabase, permitindo manipular o banco de dados e a autenticação com privilégios de Service Role Key (para operações de servidor).
* **Joi** ![Joi](https://img.shields.io/badge/Joi-1A6993?style=flat-square&logoColor=white)
    * *Por que*: Biblioteca robusta para validação de esquemas de dados de entrada, garantindo a integridade e segurança dos dados recebidos pela API.
* **Axios** ![Axios](https://img.io/badge/Axios-5A29E4?style=flat-square&logo=axios&logoColor=white)
    * *Por que*: Cliente HTTP para fazer requisições a APIs externas (ex: YouTube Data API, OpenAI), facilitando a comunicação do servidor com serviços de terceiros.
* **Dotenv** ![Dotenv](https://img.shields.io/badge/Dotenv-ECD53F?style=flat-square&logo=dot-env&logoColor=black)
    * *Por que*: Fundamental para o gerenciamento seguro de credenciais e configurações sensíveis, mantendo-as fora do controle de versão.
* **Slugify** ![Slugify](https://img.shields.io/badge/Slugify-20232A?style=flat-square&logoColor=white)
    * *Por que*: Gera slugs (cadeias de caracteres amigáveis para URLs) a partir de strings de texto, essencial para criar URLs limpas e legíveis.
* **Crypto (Node.js nativo)** 🔒
    * *Por que*: Módulo nativo do Node.js para operações criptográficas, utilizado para gerar códigos únicos para certificados de forma segura.
* **Path & FS/Promises (Node.js nativo)** 📁
    * *Por que*: Módulos para manipulação de caminhos de arquivo e operações de sistema de arquivos assíncronas, necessários para carregar assets (ex: imagens para PDFs) no servidor.
* **OpenAI** ![OpenAI](https://img.shields.io/badge/OpenAI-412991?style=flat-square&logo=openai&logoColor=white) 🧠
    * *Por que*: Biblioteca oficial para integração com a API da OpenAI, habilitando a funcionalidade de simulação de entrevista com inteligência artificial.

### Banco de Dados

* **PostgreSQL** ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=flat-square&logo=postgresql&logoColor=white) (via Supabase)
    * *Por que*: Banco de dados relacional robusto e escalável, escolhido pela sua confiabilidade, flexibilidade, e suporte a recursos avançados (como JSONB, Views, Funções).
* **Supabase** ![Supabase](https://img.io/badge/Supabase-3ECF8E?style=flat-square&logo=supabase&logoColor=white) (BaaS - Backend as a Service)
    * *Por que*: Fornece um conjunto completo de serviços de backend gerenciados (Autenticação, Banco de Dados, Armazenamento, Edge Functions), acelerando significativamente o desenvolvimento e o deploy.

## 📁 Estrutura do Projeto

O código do backend é organizado em uma estrutura modular que segue princípios de separação de responsabilidades, facilitando o desenvolvimento e a manutenção.

```bash
src/
├── config/             # Configurações de serviços externos (ex: supabaseClient.js)
├── controllers/        # Contém a lógica de negócio principal e manipula requisições da API.
│   ├── aiController.js:            Gerencia interações com o Mentor IA.
│   ├── authController.js:         Lida com registro, login e logout.
│   ├── certificateController.js:  Controla a geração e validação de certificados.
│   ├── forumController.js:        Gerencia tópicos e posts do fórum.
│   ├── pathController.js:         Lida com a busca e gestão de trilhas de aprendizado.
│   ├── profileTestController.js:  Processa o teste de perfil e recomendações.
│   ├── progressController.js:     Gerencia o progresso do usuário em conteúdos.
│   └── subscribeController.js:    Registra interesse em novas funcionalidades.
├── data/               # Dados estáticos (ex: allPathsData.js, profileTestData.js).
├── middlewares/        # Funções que processam requisições antes de chegarem aos controllers.
│   ├── adminAuthMiddleware.js:    Autorização para rotas de administrador.
│   └── authMiddleware.js:         Proteção de rotas por autenticação JWT.
├── routes/             # Definição das rotas da API e associação com controllers/middlewares.
│   ├── aiRoutes.js:              Rotas para IA.
│   ├── authRoutes.js:            Rotas de autenticação.
│   ├── certificateRoutes.js:     Rotas para certificados.
│   ├── forumRoutes.js:           Rotas do fórum.
│   ├── pathRoutes.js:            Rotas para trilhas.
│   ├── profileTestRoutes.js:     Rotas do teste de perfil.
│   ├── progressRoutes.js:        Rotas de progresso.
│   └── subscribeRoutes.js:       Rotas de inscrição.
├── scripts/            # Scripts utilitários para operações de manutenção.
│   └── seed.js: Script para popular o banco de dados com dados iniciais.
├── utils/              # Funções auxiliares gerais (ex: pdfGenerator.js).
└── index.js            # Ponto de entrada principal do servidor Express.

```

## 🚀 Como Começar

Siga estas instruções para configurar e rodar o backend do Projeto Elevate em seu ambiente de desenvolvimento local.

### Pré-requisitos

* Node.js (versão 18.x ou superior)
* npm (gerenciador de pacotes)
* Um projeto Supabase ativo e configurado com o esquema de banco de dados (tabelas, chaves estrangeiras, views, funções, triggers) conforme o script SQL completo fornecido.

### 🛠️ Instalação

1.  **Clone o repositório do backend:**
    ```bash
    git clone <URL_DO_SEU_REPOSITORIO_BACKEND>
    cd <pasta-do-seu-backend>
    ```
2.  **Instale as dependências:**
    ```bash
    npm install
    ```

### 🔑 Configuração de Variáveis de Ambiente

1.  Crie um arquivo `.env` na raiz do projeto backend.
2.  Adicione as seguintes variáveis, substituindo os placeholders pelos valores reais do seu projeto Supabase e chaves de API:
    ```
    # Variáveis de Ambiente para o Backend
    SUPABASE_URL="https://seu-projeto-id.supabase.co"
    SUPABASE_SERVICE_KEY="sua-service-role-key-secreta-do-supabase" # CHAVE COM PRIVILÉGIOS ELEVADOS
    YOUTUBE_API_KEY="sua-chave-api-youtube-do-google-cloud-console"
    OPENAI_API_KEY="sua-chave-api-openai-ou-cohere"
    PORT=3001 # Porta em que o servidor irá rodar localmente
    ```

### 📊 População do Banco de Dados (Seeding)

Para preencher seu banco de dados Supabase com dados iniciais das trilhas, módulos e conteúdos (incluindo metadados de vídeos do YouTube):

1.  **Certifique-se de que o `YOUTUBE_API_KEY` está configurado corretamente** no seu `.env` e que a chave é válida.
2.  **Execute o script de seeding:**
    ```bash
    node src/scripts/seed.js
    ```
    * **Importante**: Observe a saída no console para confirmar que o processo foi concluído com sucesso e que os metadados do YouTube foram obtidos e inseridos. Se houver erros, depure antes de prosseguir.

### ▶️ Execução

Para iniciar o servidor backend:

```bash
npm start
O servidor estará rodando localmente em http://localhost:3001. Observe o terminal para logs de inicialização e quaisquer erros que possam ocorrer durante as requisições.
```
### ☁️ Deploy (Render)
O deploy contínuo do backend é automatizado e gerenciado através do Render.

Conecte seu repositório Git (ex: GitHub, GitLab) ao Render.
Crie um novo "Web Service" no Render, apontando para o repositório do seu backend.
Configure as variáveis de ambiente no Dashboard do Render:
No Dashboard do Render, vá em Environment (ou Environment Variables).
Adicione as mesmas variáveis do seu .env local: SUPABASE_URL, SUPABASE_SERVICE_KEY, YOUTUBE_API_KEY, OPENAI_API_KEY.
Verifique as configurações de Build & Run:
Build Command: npm install
Start Command: npm start (ou node src/index.js)
Configure o CORS no src/index.js para aceitar requisições do seu frontend deployado no Vercel:
JavaScript
```bash
// src/index.js (no backend)
app.use(cors({
  origin: 'https://projeto-elevate.vercel.app' // URL do seu frontend no Vercel
}));
```
Após o deploy, o Render fornecerá uma URL pública (ex: https://elevate-backend-1pwj.onrender.com).
Para popular o banco de dados do seu projeto Supabase vinculado ao Render (se ainda não o fez):
Vá na aba "Shell" do seu serviço de backend no Render (após o deploy).
```bash
Execute o comando: node src/scripts/seed.js
```
Importante: Após rodar o seed, vá no Dashboard do Supabase -> API -> API Settings e clique em "Refresh your schema" para garantir que o cache da API esteja atualizado.
### 🤝 Contribuição
Contribuições são bem-venidas! Sinta-se à vontade para abrir issues ou pull requests. Substitua SEU_USUARIO e SEU_REPOSITORIO_BACKEND pelas informações reais do seu repositório.
