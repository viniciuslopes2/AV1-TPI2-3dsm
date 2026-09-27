import { test } from 'node:test';
import assert from 'node:assert/strict';
import { Competencia } from '../models/Competencia';
import { Profissional } from '../models/Profissional';
import { Projeto } from '../models/Projeto';
import { CalculadorCompatibilidade } from './CalculadorCompatibilidade';
import { GeradorRelatorio } from './GeradorRelatorio';
import { ValidadorConsistencia } from './ValidadorConsistencia';
import { OrquestradorPadrao } from '../template/OrquestradorPadrao';
import { RegrasOrcamento } from '../strategy/RegrasOrcamento';

const disponibilidade = { inicio: new Date('2026-01-01'), fim: new Date('2026-12-31') };

test('visitantes distintos operam sobre o mesmo profissional sem altera-lo', () => {
  const profissional = new Profissional('prof-1', 'Ana', [new Competencia('roteiro', 5)], disponibilidade, 2000);

  const consistente = profissional.aceitar(new ValidadorConsistencia());
  const compatibilidade = profissional.aceitar(new CalculadorCompatibilidade());
  const relatorio = profissional.aceitar(new GeradorRelatorio());

  assert.equal(consistente, true);
  assert.equal(compatibilidade, 1);
  assert.equal(typeof relatorio, 'string');
  assert.equal(profissional.competencias.length, 1);
});

test('validador de consistencia rejeita projeto sem equipe formada', () => {
  const projeto = new Projeto('p1', 'ficcao', 30, 5000, new Date('2026-06-01'));

  const resultado = projeto.aceitar(new ValidadorConsistencia());

  assert.equal(resultado, false);
});

test('validador de consistencia confere se o orcamento cobre a equipe', () => {
  const profissional = new Profissional('prof-1', 'Ana', [new Competencia('roteiro', 5)], disponibilidade, 2000);
  const orquestrador = new OrquestradorPadrao([profissional]);
  const comOrcamento = new Projeto('p2', 'ficcao', 30, 5000, new Date('2026-06-01'));
  const semOrcamento = new Projeto('p3', 'ficcao', 30, 1000, new Date('2026-06-01'));
  orquestrador.orquestrar(comOrcamento, new RegrasOrcamento());
  orquestrador.orquestrar(semOrcamento, new RegrasOrcamento());

  assert.equal(comOrcamento.aceitar(new ValidadorConsistencia()), true);
  assert.equal(semOrcamento.aceitar(new ValidadorConsistencia()), false);
});
