import { test } from 'node:test';
import assert from 'node:assert/strict';
import { Papel } from '../models/Papel';
import { Competencia } from '../models/Competencia';
import { Avaliacao } from '../models/Avaliacao';
import { Profissional } from '../models/Profissional';
import { Projeto } from '../models/Projeto';
import { SimilaridadeCosseno } from './SimilaridadeCosseno';
import { FiltragemColaborativa } from './FiltragemColaborativa';
import { RegrasOrcamento } from './RegrasOrcamento';
import { OrquestradorPadrao } from '../template/OrquestradorPadrao';
import { SistemaRecomendacao } from '../observer/SistemaRecomendacao';

const disponibilidade = { inicio: new Date('2026-01-01'), fim: new Date('2026-12-31') };

function criarProfissional(id: string, niveis: number[], nota: number, preco: number): Profissional {
  const competencias = niveis.map((nivel, indice) => new Competencia(`competencia-${indice}`, nivel));
  const profissional = new Profissional(id, id, competencias, disponibilidade, preco);
  profissional.receberAvaliacao(new Avaliacao(nota, '', new Date()));
  return profissional;
}

test('SimilaridadeCosseno prioriza o vetor de competencias mais proximo do ideal', () => {
  const baixo = criarProfissional('baixo', [1, 5], 3, 1000);
  const alto = criarProfissional('alto', [5, 5], 3, 1000);
  const projeto = new Projeto('p1', 'ficcao', 30, 5000, new Date('2026-06-01'));

  const recomendacoes = new SimilaridadeCosseno().recomendar(projeto, [baixo, alto]);

  assert.equal(recomendacoes.get(Papel.EDITOR)?.[0]?.id, 'alto');
});

test('FiltragemColaborativa ordena pela media de avaliacoes', () => {
  const ruim = criarProfissional('ruim', [3], 1, 1000);
  const bom = criarProfissional('bom', [3], 5, 1000);
  const projeto = new Projeto('p2', 'documentario', 20, 5000, new Date('2026-06-01'));

  const recomendacoes = new FiltragemColaborativa().recomendar(projeto, [ruim, bom]);

  assert.equal(recomendacoes.get(Papel.DIRETOR)?.[0]?.id, 'bom');
});

test('RegrasOrcamento descarta quem estoura o orcamento do projeto', () => {
  const caro = criarProfissional('caro', [3], 3, 9000);
  const barato = criarProfissional('barato', [3], 3, 2000);
  const projeto = new Projeto('p3', 'animacao', 10, 5000, new Date('2026-06-01'));

  const recomendacoes = new RegrasOrcamento().recomendar(projeto, [caro, barato]);
  const ranking = recomendacoes.get(Papel.SONOPLASTA) ?? [];

  assert.equal(ranking[0]?.id, 'barato');
  assert.ok(!ranking.some((p) => p.id === 'caro'));
});

test('trocar a estrategia muda a equipe recomendada para o mesmo projeto', () => {
  const caro = criarProfissional('caro', [5, 5], 5, 3000);
  const barato = criarProfissional('barato', [2, 2], 3, 1000);
  const projeto = new Projeto('p4', 'ficcao', 30, 5000, new Date('2026-06-01'));
  const sistema = new SistemaRecomendacao(new OrquestradorPadrao([caro, barato]), new FiltragemColaborativa());

  const comColaborativa = sistema.executarRecomendacao(projeto);
  sistema.definirEstrategia(new RegrasOrcamento());
  const comOrcamento = sistema.executarRecomendacao(projeto);

  assert.equal(comColaborativa.membros[0]?.profissional.id, 'caro');
  assert.equal(comOrcamento.membros[0]?.profissional.id, 'barato');
});
