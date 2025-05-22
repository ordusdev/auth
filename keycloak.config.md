# 🛡️ Configurar o Keycloak

## 🔧 Passo a passo: Configuração no Keycloak

### ✅ 1. Criar Cliente no Keycloak

1. Acesse o Keycloak Admin ([http://localhost:8080/admin](http://localhost:8080/admin)).
2. Navegue até **Clientes** → **Criar Cliente**.
3. Defina:

   - **Client ID:** `your-client-id`
   - **Client Type:** **Confidential**
   - **Root URL:** (opcional)

4. Clique em **Salvar**.

---

### 🔥 2. Configurar Credenciais do Cliente

1. Vá para a aba **Credenciais**.
2. Copie o valor de **Client Secret** — você precisará dele nas variáveis de ambiente.

---

### 🔐 3. Ativar Permissão para Token Exchange

1. Na aba **Settings** do cliente:

   - Marque **Service Accounts Enabled**: ✅

2. Vá para a aba **Client Scopes** → **Evaluate**:

   - Confirme que o escopo inclui `offline_access` (para token de refresh).

3. Navegue até **Client Settings**:

   - Ative:

     - **Authorization Enabled:** ✅
     - **Direct Access Grants Enabled:** ✅ (necessário para password grant)
     - **Service Accounts Enabled:** ✅ (necessário para token exchange)
     - **Standard Flow Enabled:** ✅ (opcional, se usar OAuth padrão)

4. Na aba **Advanced Settings**:

   - Em **OAuth 2.0 Device Authorization Grant Enabled:** ✅ (se usar device flow)

---

### 🔄 4. Permitir Token Exchange

1. Acesse **Clients** → seu cliente → **Authorization** → **Settings**:

   - Ative **Authorization Enabled:** ✅

2. Vá para **Clients** → seu cliente → **Authorization** → **Permissions**:

   - Habilite a política que permite o cliente fazer token exchange.

Se a aba Authorization não aparecer:

- Verifique se está usando Keycloak >= 19 com a UI habilitada.
- Caso não, habilite via configuração do servidor.

---

### 🔄 5. Permitir Tokens de Refresh

1. Acesse **Client Scopes**.
2. Confirme se há um escopo chamado **`offline_access`**.

   - Caso não tenha, crie.

3. Na aba **Settings** do cliente:

   - Garanta que a opção **`Allow offline tokens`** está habilitada.

> 🔸 **Tokens de Refresh** são emitidos automaticamente quando você inclui `scope=offline_access` na solicitação de token.

---

## 🏗️ Fluxo da Autenticação

### 🔐 Obter Access Token + Refresh Token

Endpoint:

```
POST /realms/{realm}/protocol/openid-connect/token
```

Payload (application/x-www-form-urlencoded):

```
grant_type=password
client_id={client_id}
client_secret={client_secret}
username={username}
password={password}
scope=offline_access
```

Resposta:

```json
{
  "access_token": "...",
  "refresh_token": "...",
  "expires_in": 300,
  "refresh_expires_in": 1800,
  ...
}
```

---

### 🔄 Token Exchange

Troca um token de serviço por um token de usuário (impersonação controlada).

> Atenção: é necessário configurar o serviço do keycloak para permitir troca de tokens, para isso você deve subir o container do keycloak com a variavel ambiente **`KC_FEATURES`**, bem como habilitar essa configuração no painel do keycloak

```sh
KC_FEATURES=token-exchange,token-exchange-standard
```

Endpoint:

```
POST /realms/{realm}/protocol/openid-connect/token
```

Payload:

```
grant_type=urn:ietf:params:oauth:grant-type:token-exchange
client_id={client_id}
client_secret={client_secret}
subject_token={user_token}
subject_token_type=urn:ietf:params:oauth:token-type:access_token
```

Resposta:

```json
{
  "access_token": "...",
  "expires_in": 300,
  ...
}
```

---

### 🔄 Refresh Token

Endpoint:

```
POST /realms/{realm}/protocol/openid-connect/token
```

Payload:

```
grant_type=refresh_token
client_id={client_id}
client_secret={client_secret}
refresh_token={refresh_token}
```

---

## 🧠 Exemplos de Uso

### 🔐 Login

```ts
import { SignInUsecase } from '@ordus/auth'

const token = await new SignInUsecase().execute({
  username: 'john',
  password: 'password123',
})

console.log(token.access_token, token.refresh_token)
```

### 🔄 Refresh Token

```ts
import { RefreshTokenUsecase } from '@ordus/auth'

const refreshed = await new RefreshTokenUsecase().execute({
  refresh_token: 'your-refresh-token',
})

console.log(refreshed.access_token)
```

<!-- ### 🔄 Token Exchange

```ts
import { TokenExchangeUsecase } from '@ordus/auth';

const exchanged = await new TokenExchangeUsecase().execute({
  subjectToken: 'access-token-to-exchange',
});

console.log(exchanged.access_token);
``` -->
