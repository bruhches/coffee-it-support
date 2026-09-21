# Correção de segurança — feed do Instagram

## O problema original
O token de acesso estava escrito diretamente em `js/app.js`. Como esse JavaScript é enviado ao navegador, qualquer visitante conseguiria recuperar o token pelo código-fonte ou pelo DevTools.

## O que foi alterado
- O token foi totalmente removido do frontend.
- `js/app.js` agora chama somente `/api/instagram`.
- Foi criada `api/instagram.js`, uma função serverless para Vercel.
- O backend lê o segredo de `process.env.INSTAGRAM_ACCESS_TOKEN`.
- Foi criado `.env.example` apenas como modelo, sem segredo real.
- `.gitignore` impede o commit acidental de arquivos `.env`.
- Se a API falhar, o site mantém os cards estáticos definidos em `js/config.js`.

## Como publicar com o feed funcionando
Este projeto agora precisa de um ambiente que execute a função `/api/instagram`. A estrutura fornecida está pronta para Vercel.

1. Suba o projeto para um repositório Git, já com esta versão corrigida.
2. Importe o repositório na Vercel.
3. Em Project Settings > Environment Variables, crie `INSTAGRAM_ACCESS_TOKEN` e coloque o token do Instagram como valor.
4. Faça um novo deploy.
5. Abra o site e confirme que `/api/instagram` responde com os posts.

## GitHub Pages
GitHub Pages hospeda apenas conteúdo estático e não executa `api/instagram.js`. Você pode manter o código no GitHub, mas para esta solução completa publique o site na Vercel, ou hospede o backend separadamente e altere a URL usada em `fetch()`.

## Sobre o token antigo
O token antigo foi removido deste pacote. Como boa prática, gere/renove o token antes da publicação e use somente o novo valor na variável de ambiente do servidor. Nunca coloque o novo token em `app.js`, `config.js`, HTML ou em qualquer arquivo versionado.
