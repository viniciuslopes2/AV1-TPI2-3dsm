import type { Papel } from '../models/Papel';
import type { Profissional } from '../models/Profissional';
import type { Projeto } from '../models/Projeto';

export interface RecomendacaoStrategy {
  recomendar(projeto: Projeto, profissionais: Profissional[]): Map<Papel, Profissional[]>;
}

export function rankingParaOsPapeisDoProjeto(projeto: Projeto, ranking: Profissional[]): Map<Papel, Profissional[]> {
  const recomendacoes = new Map<Papel, Profissional[]>();
  for (const papel of projeto.papeis) {
    recomendacoes.set(papel, ranking);
  }
  return recomendacoes;
}
