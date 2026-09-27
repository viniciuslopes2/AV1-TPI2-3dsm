import { test } from 'node:test';
import assert from 'node:assert/strict';
import { Competencia } from '../models/Competencia';
import { Profissional } from '../models/Profissional';
import { Projeto } from '../models/Projeto';
import { SimilaridadeCosseno } from '../strategy/SimilaridadeCosseno';
import { OrquestradorPadrao } from '../template/OrquestradorPadrao';
import { AuditoriaRecomendacao } from './AuditoriaRecomendacao';
import { SistemaRecomendacao } from './SistemaRecomendacao';

test('observadores reagem de forma independente ao mesmo evento', () => {
  const disponibilidade = { inicio: new Date('2026-01-01'), fim: new Date('2026-12-31') };
  const profissional = new Profissional('prof-1', 'Ana', [new Competencia('roteiro', 4)], disponibilidade, 2000);
  const projeto = new Projeto('p1', 'ficcao', 30, 5000, new Date('2026-06-01'));
  const orquestrador = new OrquestradorPadrao([profissional]);
  const sistema = new SistemaRecomendacao(orquestrador, new SimilaridadeCosseno());

  const auditoria = new AuditoriaRecomendacao();
  let notificacoesRecebidas = 0;
  sistema.adicionarObservador(auditoria);
  sistema.adicionarObservador({
    atualizar: () => {
      notificacoesRecebidas += 1;
    },
  });

  sistema.executarRecomendacao(projeto);

  assert.equal(auditoria.registros.length, 1);
  assert.equal(notificacoesRecebidas, 1);
});
