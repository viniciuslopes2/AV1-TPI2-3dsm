# Cinebridge - ATV1

Atividade da faculdade (Técnicas de Programação II) que implementa as classes
do diagrama do Cinebridge (uma plataforma fictícia de produção audiovisual)
usando 4 padrões de projeto:

- **Strategy** – trocar o algoritmo de recomendação de profissionais
  (similaridade de cosseno, filtragem colaborativa, regras de orçamento).
- **Template Method** – o fluxo fixo de montar uma equipe (validar, normalizar,
  recomendar, pós-processar).
- **Observer** – avisar quem estiver interessado (email, mensagem interna,
  auditoria) quando uma recomendação é gerada.
- **Visitor** – rodar operações externas (validação, cálculo de
  compatibilidade, relatório) sobre `Projeto` e `Profissional` sem precisar
  alterar essas classes.

O código fica em `src/`, organizado por padrão (`strategy/`, `template/`,
`observer/`, `visitor/`) e um `models/` com as entidades do diagrama.

## Versões usadas

- Node.js: **v24.13.1**
- npm: **11.8.0**
- TypeScript: **7.0.2**
- tsx (executa TypeScript direto, sem build): **4.23.15**

## Como iniciar

Instale as dependências:

```bash
npm install
```

Rode a demo, que mostra os 4 padrões funcionando juntos:

```bash
npm run dev
```

## Como testar (ver o programa funcionando)

Depois do `npm run dev`, o terminal deve mostrar algo assim:

```
--- estrategia: similaridade de cosseno ---
[email] evento RECOMENDACAO_GERADA recebido de SistemaRecomendacao
[mensagem interna] evento RECOMENDACAO_GERADA recebido de SistemaRecomendacao
vencedor: Bruno Lima
--- estrategia: filtragem colaborativa ---
[email] evento RECOMENDACAO_GERADA recebido de SistemaRecomendacao
[mensagem interna] evento RECOMENDACAO_GERADA recebido de SistemaRecomendacao
vencedor: Ana Souza
--- estrategia: regras de orcamento ---
[email] evento RECOMENDACAO_GERADA recebido de SistemaRecomendacao
[mensagem interna] evento RECOMENDACAO_GERADA recebido de SistemaRecomendacao
vencedor: Bruno Lima
--- auditoria acumulada ---
total de eventos registrados: 3
--- visitantes sobre a mesma estrutura de dados ---
consistencia do projeto: true
compatibilidade da equipe: 0.39999999999999997
Projeto proj-1 (documentario): orcamento R$5000, equipe com 6 membro(s)
Profissional Ana Souza: preco medio R$3000, 2 competencia(s)
```

Se apareceu algo assim, o programa está funcionando: as linhas `[email]` e
`[mensagem interna]` mostram os observadores reagindo a cada recomendação, a
auditoria contou os 3 eventos (um por chamada de `executarRecomendacao`) e os
visitantes geraram suas saídas sem erro no final. Isso já mostra os 4 padrões
funcionando juntos (Strategy trocando o critério de cada estratégia, Template
Method mantendo o fluxo fixo, Observer reagindo ao evento e Visitor operando
sobre os dados).

Se quiser testar também o endpoint REST temporário (`POST /recomendar`),
suba o servidor:

```bash
npm run servidor
```

Isso abre `http://localhost:3000`. Em outro terminal, chame o endpoint:

```bash
curl -X POST http://localhost:3000/recomendar \
  -H "Content-Type: application/json" \
  -d '{"id":"proj-1","genero":"documentario","duracao":40,"orcamento":5000,"prazo":"2026-06-01","estrategia":"cosseno"}'
```

Se voltar um JSON parecido com este (e não um erro), o servidor está
funcionando:

```json
{"equipeId":"equipe-proj-1","membros":[{"papel":"DIRETOR","profissional":"Bruno Lima"}, ...]}
```

### Testes automatizados (extra)

O projeto também tem testes unitários/integração de cada padrão, se quiser
rodar:

```bash
npm test
```

E para checar só os tipos, sem rodar nada:

```bash
npx tsc --noEmit
```

## Erros comuns e troubleshooting

**`'tsx' não é reconhecido como comando` (ou "command not found")**
As dependências não foram instaladas. Rode `npm install` na pasta `projeto/`
antes de qualquer script.

**Erro de import/módulo ao rodar (`Cannot use import statement...`)**
Confirme que está rodando os comandos de dentro da pasta `projeto/` (onde tem
o `package.json`), e não da raiz do repositório.

**`EADDRINUSE` ao rodar `npm run servidor`**
Já tem algo usando a porta 3000. Feche o processo antigo (ou o outro
`npm run servidor` que ficou aberto num terminal) e tente de novo.

**Testes passam mas `npx tsc --noEmit` reclama de tipo**
O `tsx` roda o código sem checar tipos com rigor (ele só transpila). Sempre
rode `npx tsc --noEmit` antes de considerar terminado, porque é ele que pega
erro de tipagem de verdade.

**A estratégia de similaridade de cosseno "escolheu" um profissional com
notas mais baixas**
Não é bug. Cosseno compara a direção do vetor de competências, não o valor
absoluto — então alguém com competências proporcionalmente parecidas com o
ideal pode vencer alguém com notas mais altas mas desproporcionais. É uma
limitação conhecida desse tipo de cálculo.
