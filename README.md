# Agende Aqui

API para adicionar matérias semestrais e compromissos avulsos no **Google Calendar** de forma automática.

## Funcionalidades

- Adicionar matérias com aulas semanais recorrentes durante todo o semestre
- Adicionar compromissos avulsos (consultas, reuniões, etc.)
- Autenticação OAuth2 com o Google Calendar
- Documentação interativa via Swagger

## Setup

### 1. Configurar credenciais do Google

1. Acesse o [Google Cloud Console](https://console.cloud.google.com)
2. Crie um projeto (ou selecione um existente)
3. Ative a **Google Calendar API** em _APIs & Services > Library_
4. Crie credenciais OAuth2 em _APIs & Services > Credentials_:
   - Tipo: **Aplicativo da Web**
   - URI de redirecionamento autorizado: `http://localhost:3000/auth/google/callback`
5. Copie o **Client ID** e **Client Secret**

### 2. Configurar variáveis de ambiente

```bash
cp .env.example .env
```

Edite o `.env` com suas credenciais:

```env
GOOGLE_CLIENT_ID=seu_client_id
GOOGLE_CLIENT_SECRET=seu_client_secret
GOOGLE_REDIRECT_URI=http://localhost:3000/auth/google/callback
TIMEZONE=America/Sao_Paulo
```

### 3. Instalar dependências e rodar

```bash
npm install
npm run start:dev
```

API disponível em `http://localhost:3000`
Documentação Swagger em `http://localhost:3000/docs`

### 4. Autenticar com o Google (apenas uma vez)

Abra no navegador:
```
http://localhost:3000/auth/google
```

Autorize o acesso ao Google Calendar. Os tokens são salvos localmente em `tokens.json` e renovados automaticamente.

---

## Endpoints

### Auth
| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/auth/google` | Inicia o fluxo OAuth2 |
| GET | `/auth/google/callback` | Callback automático do Google |
| GET | `/auth/status` | Verifica se está autenticado |

### Matérias Semestrais
| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/subjects` | Adiciona matéria com aulas recorrentes |
| DELETE | `/subjects/:eventId` | Remove matéria e todas as recorrências |

### Compromissos Avulsos
| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/appointments` | Adiciona compromisso único |
| DELETE | `/appointments/:eventId` | Remove compromisso |

---

## Exemplos de uso

### Adicionar matéria semestral

```json
POST /subjects
{
  "name": "Cálculo I",
  "professor": "Prof. Daniela",
  "location": "Inatel Prédio 1 - Sala 9",
  "semester": {
    "startDate": "2026-02-16",
    "endDate": "2026-06-30"
  },
  "weeklyClasses": [
    { "dayOfWeek": "WE", "startTime": "08:00", "endTime": "10:00" },
    { "dayOfWeek": "TH", "startTime": "08:00", "endTime": "10:00" }
  ],
  "colorId": "9"
}
```

### Adicionar compromisso avulso

```json
POST /appointments
{
  "title": "Reunião NOE",
  "description": "Reunião sobre provas",
  "location": "Inatel I-15",
  "startDateTime": "2026-03-15T14:00:00",
  "endDateTime": "2026-03-15T15:00:00",
  "reminderMinutes": 60
}
```

### Cores disponíveis (`colorId`)
| ID | Cor |
|----|-----|
| 1 | Lavanda |
| 2 | Sálvia |
| 3 | Uva |
| 4 | Flamingo |
| 5 | Banana |
| 6 | Tangerina |
| 7 | Pavão (azul) |
| 8 | Grafite |
| 9 | Mirtilo (azul escuro) |
| 10 | Manjericão (verde escuro) |
| 11 | Tomate |

### Dias da semana (`dayOfWeek`)
| Valor | Dia |
|-------|-----|
| SU | Domingo |
| MO | Segunda-feira |
| TU | Terça-feira |
| WE | Quarta-feira |
| TH | Quinta-feira |
| FR | Sexta-feira |
| SA | Sábado |
