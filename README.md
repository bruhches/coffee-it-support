# ☕ Coffee IT Support

**Tecnologia que resolve. Suporte que simplifica.**

Website institucional desenvolvido para apresentar os serviços da **Coffee IT Support**, com foco em suporte técnico, infraestrutura, consultoria e soluções de tecnologia.

O projeto também funciona como um case de desenvolvimento web da **B.A Dev Lab**, reunindo interface responsiva, acessibilidade, integração com serviços externos e deploy serverless.

---

## 🌐 Aplicação

Acesse o projeto publicado:

**Coffee IT Support**  
https://coffee-it-support.vercel.app/

---

## 📌 Sobre o projeto

O Coffee IT Support foi desenvolvido como uma presença digital para apresentação de serviços de tecnologia de forma simples, moderna e acessível.

A aplicação concentra informações sobre os serviços oferecidos, canais de contato e integração com redes sociais em uma interface responsiva preparada para diferentes dispositivos.

Além da função comercial, o projeto foi utilizado para aplicar conceitos de:

- desenvolvimento frontend;
- design responsivo;
- acessibilidade;
- integração com APIs;
- funções serverless;
- configuração por ambiente;
- deploy contínuo com Vercel.

---

## ✨ Principais recursos

### Interface responsiva

Layout desenvolvido para funcionar em diferentes resoluções, incluindo desktops, tablets e dispositivos móveis.

### Catálogo de serviços

Apresentação dos principais serviços da Coffee IT Support, incluindo áreas como:

- suporte técnico;
- computadores e servidores;
- impressoras;
- CFTV;
- roteadores e redes;
- formatação e backup;
- consultoria;
- planejamento de casas inteligentes.

### Integração com WhatsApp

O site possui recursos de contato direcionados ao WhatsApp para facilitar a comunicação com potenciais clientes.

### Integração com Instagram

O projeto utiliza uma rota serverless para consultar informações do Instagram sem expor o token de acesso diretamente no frontend.

```text
Frontend
   │
   ▼
/api/instagram
   │
   ▼
Instagram API
```

O token é obtido através de variável de ambiente:

```text
INSTAGRAM_ACCESS_TOKEN
```

Dessa forma, credenciais privadas não precisam ser armazenadas no JavaScript executado pelo navegador.

### Configuração centralizada

Informações utilizadas pelo frontend são organizadas em arquivos de configuração, facilitando alterações de serviços, contatos e demais informações da aplicação.

### Acessibilidade

O projeto recebeu melhorias voltadas à navegação, legibilidade e experiência de utilização em diferentes dispositivos e contextos.

---

## 🛠️ Tecnologias

O projeto utiliza principalmente:

- HTML5
- CSS3
- JavaScript
- Node.js
- Vercel Serverless Functions
- Instagram API
- Git
- GitHub
- Vercel

---

## 🏗️ Arquitetura

A aplicação utiliza uma arquitetura web simples, separando a interface pública das integrações que precisam permanecer no servidor.

```text
Usuário
   │
   ▼
Frontend
HTML / CSS / JavaScript
   │
   ├──────────────► WhatsApp
   │
   └──────────────► /api/instagram
                         │
                         ▼
                    Instagram API
```

A integração serverless permite que informações sensíveis permaneçam fora do código entregue ao navegador.

---

## 🔐 Segurança

Credenciais e tokens privados não devem ser armazenados diretamente no código-fonte.

O projeto utiliza variável de ambiente para a integração com Instagram:

```env
INSTAGRAM_ACCESS_TOKEN=
```

Arquivos locais contendo variáveis privadas são ignorados pelo Git através do `.gitignore`.

Um arquivo `.env.example` pode ser utilizado como referência para configuração do ambiente sem incluir credenciais reais.

---

## 📁 Estrutura do projeto

A organização principal segue aproximadamente:

```text
coffee-it-support/
│
├── api/
│   └── instagram.js
│
├── css/
│
├── img/
│
├── js/
│   ├── app.js
│   └── config.js
│
├── index.html
├── .env.example
├── .gitignore
├── README.md
└── SEGURANCA-INSTAGRAM.md
```

---

## 💻 Executando localmente

Clone o repositório:

```bash
git clone https://github.com/bruhches/coffee-it-support.git
```

Entre na pasta:

```bash
cd coffee-it-support
```

Para recursos exclusivamente frontend, o projeto pode ser aberto através de um servidor local.

Para utilizar recursos serverless e integrações dependentes de variáveis de ambiente, configure o ambiente correspondente antes da execução.

Nunca publique tokens ou credenciais reais no repositório.

---

## 🚀 Deploy

A aplicação está publicada através da **Vercel**.

O deploy permite hospedar tanto o frontend estático quanto as funções serverless utilizadas pelas integrações do projeto.

Site:

https://coffee-it-support.vercel.app/

---

## 🎯 Objetivos técnicos

Além de atender à necessidade comercial da Coffee IT Support, o desenvolvimento deste projeto permitiu trabalhar conceitos como:

- construção de interfaces web;
- responsividade;
- identidade visual;
- organização de código frontend;
- integração com APIs externas;
- proteção de credenciais;
- funções serverless;
- configuração de ambientes;
- Git e GitHub;
- publicação e manutenção através da Vercel.

---

## 🗺️ Evolução do projeto

Possíveis evoluções incluem:

- expansão das integrações;
- melhorias contínuas de acessibilidade;
- otimizações de performance;
- aprimoramento da experiência mobile;
- novas automações para atendimento;
- evolução dos componentes e da arquitetura frontend.

---

## 👨‍💻 Desenvolvimento

Desenvolvido por **Bruno Ribeiro**.

Projeto integrante do portfólio **B.A Dev Lab**.

**Desenvolvimento • Automação • Tecnologia**

---

## 📄 Status

🟢 **Projeto publicado e em funcionamento**

O Coffee IT Support continua recebendo melhorias conforme novas necessidades e funcionalidades são identificadas.