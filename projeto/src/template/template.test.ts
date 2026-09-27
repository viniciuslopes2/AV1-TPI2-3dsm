import { test } from 'node:test';
import assert from 'node:assert/strict';
import type { Papel } from '../models/Papel';
import { Competencia } from '../models/Competencia';
import { Profissional } from '../models/Profissional';
import { Projeto } from '../models/Projeto';
import { RegrasOrcamento } from '../strategy/RegrasOrcamento';
import { OrquestradorPadrao } from './OrquestradorPadrao';

const disponibilidade = { inicio: new Date('2026-01-01'), fim: new Date('2026-12-31') };

test('orquestrar monta a equipe usando a estrategia informada', () => {
  const profissional = new Profissional('prof-1', 'Ana', [new Competencia('roteiro', 4)], disponibilidade, 2000);
  const projeto = new Projeto('p1', 'ficcao', 30, 5000, new Date('2026-06-01'));
  const orquestrador = new OrquestradorPadrao([profissional]);

  const equipe = orquestrador.orquestrar(projeto, new RegrasOrcamento());

  assert.ok(equipe.membros.length > 0);
  assert.equal(projeto.equipe, equipe);
});

test('orquestrar rejeita projeto com orcamento invalido', () => {
  const projeto = new Projeto('p2', 'ficcao', 30, 0, new Date('2026-06-01'));
  const orquestrador = new OrquestradorPadrao([]);

  assert.throws(() => orquestrador.orquestrar(projeto, new RegrasOrcamento()));
});

test('orquestrar sempre executa as etapas na mesma ordem', () => {
  const etapas: string[] = [];

  class OrquestradorEspiao extends OrquestradorPadrao {
    protected validarRestricoes(projeto: Projeto): boolean {
      etapas.push('validar');
      return super.validarRestricoes(projeto);
    }
    protected normalizarDados(projeto: Projeto, profissionais: Profissional[]): Profissional[] {
      etapas.push('normalizar');
      return super.normalizarDados(projeto, profissionais);
    }
    protected posProcessar(recomendacoes: Map<Papel, Profissional[]>): Map<Papel, Profissional[]> {
      etapas.push('pos-processar');
      return super.posProcessar(recomendacoes);
    }
  }
  const estrategia = {
    recomendar(projeto: Projeto, profissionais: Profissional[]) {
      etapas.push('estrategia');
      return new RegrasOrcamento().recomendar(projeto, profissionais);
    },
  };
  const profissional = new Profissional('prof-1', 'Ana', [new Competencia('roteiro', 4)], disponibilidade, 2000);
  const projeto = new Projeto('p3', 'ficcao', 30, 5000, new Date('2026-06-01'));

  new OrquestradorEspiao([profissional]).orquestrar(projeto, estrategia);

  assert.deepEqual(etapas, ['validar', 'normalizar', 'estrategia', 'pos-processar']);
});
