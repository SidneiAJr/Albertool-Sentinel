# 🛡️ Albertool Sentinel

<p align="center">
  <img src="https://img.shields.io/badge/VS%20Code-1.85.0+-blue?style=flat-square&logo=visual-studio-code"/>
  <img src="https://img.shields.io/badge/Node.js-18%2B-green?style=flat-square&logo=node.js"/>
  <img src="https://img.shields.io/badge/License-MIT-yellow?style=flat-square"/>
  <img src="https://img.shields.io/badge/status-active-success?style=flat-square"/>
</p>

> O guardião das suas variáveis de ambiente — escaneia, valida e gera `.env` automaticamente!

---

## ✨ Funcionalidades

- 🔍 **Escaneia** todo o projeto em busca de variáveis de ambiente
- 📋 **Compara** com o `.env` existente e aponta o que falta
- ⚠️ **Alerta** sobre variáveis ausentes em tempo real
- ✅ **Indica** o que já está configurado (com valor mascarado `••••••`)
- 📦 **Gera `.env` Enterprise** com seções organizadas por categoria
- ⚡ **Gera `.env` Lite** com as variáveis essenciais do projeto
- 🔄 **Atualiza automaticamente** ao salvar qualquer arquivo `.env` ou `env-config`
- 🗂️ **Sidebar dedicada** com status visual de cada variável

---

## 📦 Instalação

### Via Marketplace
1. Abrir VS Code
2. Ir em Extensions (`Ctrl+Shift+X`)
3. Buscar por `Albertool Sentinel`
4. Clicar em **Install**

### Via VSIX (manual)
1. Baixar o arquivo `.vsix` na aba [Releases](../../releases)
2. No VS Code: `Ctrl+Shift+P` → `Extensions: Install from VSIX`
3. Selecionar o arquivo baixado

---

## 🚀 Como usar

### 1. Sidebar
Clique no ícone 🛡️ na barra lateral esquerda do VS Code.

```
SENTINEL 🛡️ ENV VALIDATOR
  ⚠️ 2 variável(is) faltando de 6
  ➕ Criar .env Enterprise
  ⚡ Criar .env Lite
  ❌ Faltando (2)
     ❌ JWT_SECRET       FALTANDO
     ❌ DB_PASSWORD      FALTANDO
  ✅ Configuradas (4)
     ✅ PORT             ••••••
     ✅ DB_HOST          ••••••
```

### 2. Gerar `.env` automaticamente
Se o projeto não tiver `.env`, o Sentinel **cria automaticamente** ao abrir o VS Code.

Ou use os botões na sidebar:

| Botão | Descrição |
|-------|-----------|
| `➕ Criar .env Enterprise` | Gera `.env` completo com todas as seções organizadas por categoria (Aplicação, Banco de Dados, Auth, Cache, Email, Storage, Logs, Integrações) |
| `⚡ Criar .env Lite` | Gera `.env` enxuto com as variáveis essenciais: PORT, NODE_ENV, DB e JWT |

### 3. Refresh manual
Clique no ícone 🔄 no topo da sidebar ou use `Ctrl+Shift+P` → `Sentinel: Refresh`.

---

## 📁 Estrutura do `.env` Enterprise

```env
#################################################################
#             GERADO PELO ALBERTOOL SENTINEL                    #
#             NÃO COMMITAR ESTE ARQUIVO NO GIT                  #
#################################################################

# 🌐 APLICAÇÃO
NODE_ENV=
PORT=
APP_NAME=
APP_URL=

# 🗄️ BANCO DE DADOS
DB_HOST=
DB_PORT=
DB_USER=
DB_PASSWORD=
DB_NAME=

# 🔐 AUTENTICAÇÃO & SEGURANÇA
JWT_SECRET=
JWT_EXPIRES_IN=

# 📦 CACHE & FILAS
REDIS_HOST=
REDIS_PORT=

# ... e muito mais
```

---

## ⚙️ Fontes de escaneamento

O Sentinel detecta variáveis em:

- `src/config/env-config.ts` — padrão Albertool
- `.env.example` — variáveis documentadas
- Qualquer arquivo `.ts` ou `.js` com `process.env.VARIAVEL`

---

## 🔒 Segurança

- Valores exibidos na sidebar sempre **mascarados** (`••••••`)
- Apenas os primeiros 3 caracteres visíveis no tooltip
- **Nunca commite seu `.env`** — adicione ao `.gitignore`:

```
.env
```

---

## 🛣️ Roadmap

- [ ] Suporte a múltiplos ambientes (`.env.production`, `.env.staging`)
- [ ] Validação de tipos (número, URL, booleano)
- [ ] Integração com Docker Compose
- [ ] Export para GitHub Secrets

---

## 🤝 Contribuindo

1. Fork o repositório
2. Crie sua branch: `git checkout -b feat/minha-feature`
3. Commit: `git commit -m 'feat: minha feature'`
4. Push: `git push origin feat/minha-feature`
5. Abra um Pull Request

---

## 📄 Licença

MIT © [Albertool](https://github.com/albertool)

---

<p align="center">Feito com ☕ e muita variável de ambiente</p>
