# clinica-api-v1

## Configuração

Crie um arquivo `.env` na raiz (não versionado) baseado no `.env.example`:

```env
MONGODB_URI=mongodb+srv://<usuario>:<senha>@<host>/<db>?retryWrites=true&w=majority
PORT=3000
CORS_ORIGIN=*
```

## Rodar localmente

```bash
npm install
npm run dev
```

## Qualidade

```bash
npm run typecheck
npm run lint
npm test
```
