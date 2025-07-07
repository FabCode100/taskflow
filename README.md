# 🗂️ TaskFlow - Aplicativo de Organização Pessoal

O **TaskFlow** é um sistema completo de organização pessoal que centraliza o gerenciamento de tarefas, metas e finanças. Ideal para quem deseja ter mais controle sobre a rotina, acompanhar objetivos e visualizar o progresso em tempo real.

---

## 🚀 Funcionalidades

✅ Gerenciamento de tarefas diárias e pendências  
✅ Criação de tarefas recorrentes automáticas  
✅ Definição de metas pessoais e acompanhamento do progresso  
✅ Controle financeiro com registro de receitas e despesas  
✅ Dashboard interativo com gráficos e indicadores  
✅ Filtros inteligentes por tags, busca e datas  
✅ Histórico completo de ações  
✅ Autenticação de usuários com segurança JWT  

---

## 🛠️ Tecnologias Utilizadas

**Frontend:**  
- [Next.js](https://nextjs.org/)  
- [React](https://react.dev/)  
- [Recharts](https://recharts.org/en-US)  
- [Tailwind CSS](https://tailwindcss.com/)  

**Backend:**  
- [NestJS](https://nestjs.com/)  
- [Prisma ORM](https://www.prisma.io/)  
- [MongoDB](https://www.mongodb.com/)  
- [JWT](https://jwt.io/) para autenticação  

---

## 💻 Como Rodar o Projeto Localmente

### Pré-requisitos:
- Node.js 18+  
- MongoDB local ou Atlas (nuvem)  
- Yarn ou NPM  

### Passo a Passo:

# Clone o repositório
git clone https://github.com/seu-usuario/taskflow.git
cd taskflow

#### Backend (API NestJS):

cd backend
npm install

# Configure as variáveis de ambiente
.env
# Edite o arquivo .env e insira sua DATABASE_URL, JWT_TOKEN e GEMINI_API_KEY

# Inicie o backend
npm run start:dev

#### Frontend (Next.js):

cd frontend
npm install

# Inicie o frontend
npm run dev

Acesse o aplicativo no navegador:
➡️ [http://localhost:3002](http://localhost:3002)

---

## 🏷️ Estrutura do Projeto

taskflow/
├── backend/      # API com NestJS + Prisma
├── frontend/     # Aplicação Frontend com Next.js
└── README.md

---

## ✨ Funcionalidades Futuras

* Sistema de notificações por e-mail ou app
* Exportação de relatórios em PDF
* Integração com Google Calendar
* Aplicativo mobile (React Native ou Expo)

---

## 👨‍💻 Desenvolvedor

Desenvolvido por [Fabrício Bastos Cardoso](https://github.com/FabCode100) — Transformando organização pessoal em algo simples e eficiente.
