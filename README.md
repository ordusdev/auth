# 🛡️ Ordus Auth

> Biblioteca Node.js para integração com **Keycloak 26** (não testada em outras versões).

---

## 🚀 Funcionalidades

Esta biblioteca fornece uma camada de abstração para interações com o Keycloak, oferecendo funcionalidades como:

- 🔐 **Autenticação de usuários**
- 🚪 **Revogação de sessão (Logout)**
- 🔑 **Reset de senha**
- 👤 **Criação de usuários**
- 📄 **Listagem de usuários**
- 🔍 **Busca de usuário por e-mail**
- ✏️ **Atualização de dados do usuário**
- 🏷️ **Atribuição de grupos a usuários**
- ❌ **Remoção de grupos de usuários**
- 📜 **Listagem de grupos do sistema**

---

## ⚙️ Pré-requisitos

- ✅ Keycloak na versão **26** (ou compatível).
- ✅ Node.js com suporte a ES2020+.
- ✅ Ambiente configurado com as credenciais de acesso ao Keycloak.

---

## 🔑 Configuração

Adicione as seguintes variáveis de ambiente no seu `.env` ou no ambiente de execução:

```env
KEYCLOAK_CLIENT_ID=client_id
KEYCLOAK_CLIENT_SECRET=client_secret
KEYCLOAK_REALM=realm
KEYCLOAK_URL=http://keycloak-url
```

| Variável                 | Descrição                                                                  |
| ------------------------ | -------------------------------------------------------------------------- |
| `KEYCLOAK_CLIENT_ID`     | ID do cliente configurado no Keycloak                                      |
| `KEYCLOAK_CLIENT_SECRET` | Secret do cliente                                                          |
| `KEYCLOAK_REALM`         | Nome do Realm                                                              |
| `KEYCLOAK_URL`           | URL base do Keycloak (ex.: [http://localhost:8080](http://localhost:8080)) |

---

## Configuração do Keycloak

[Como configurar o Keycloak](./keycloak.config.md)

## 🧠 Instalação

Instale a biblioteca via NPM ou PNPM:

```bash
npm install @ordus/auth
# ou
pnpm add @ordus/auth
```

---

## 🛠️ Exemplos de uso

### 🔐 Autenticação

```ts
import { SignInUsecase } from '@ordus/auth'

const auth = await new SignInUsecase().execute({
  username: 'test@email.com',
  password: '1233456',
})

console.log(auth.data.access_token)
```

---

### 👤 Criar usuário

```ts
import { CreateUserUsecase } from '@ordus/auth'

await new CreateUserUsecase().execute({
  username: 'john.doe',
  email: 'john@example.com',
  firstName: 'John',
  lastName: 'Doe',
  enabled: true,
  password: '1234567',
  isTemporaryPassword: false,
})
```

---

### 🏷️ Atribuir grupo ao usuário

```ts
import { AssignGroupsToUserUsecase } from '@ordus/auth'

await new AssignGroupsToUserUsecase().execute({
  id: 'user-id',
  groups: ['group-id-1', 'group-id-2'],
})
```

---

### 📜 Listar grupos

```ts
import { ListGroupsUsecase } from '@ordus/auth'

const groups = await new ListGroupsUsecase().execute()

console.log(groups)
```

---

## 🚧 Observações

- Esta biblioteca foi desenvolvida e testada com o **Keycloak 26**.
- Outras versões podem ou não ser compatíveis. Testes são recomendados antes de uso em produção.
- Sugestões, melhorias ou issues são bem-vindas!

---

## 🤝 Contribuição

1. Faça um fork do projeto.
2. Crie uma branch para sua feature: `git checkout -b feature/sua-feature`.
3. Commit suas alterações: `git commit -m 'feat: sua feature'`.
4. Push para sua branch: `git push origin feature/sua-feature`.
5. Abra um Pull Request.

---

## 📝 Licença

Este projeto está licenciado sob a licença **MIT**.
