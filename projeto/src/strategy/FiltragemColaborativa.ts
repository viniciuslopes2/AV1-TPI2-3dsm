import type { Papel } from '../models/Papel';
import type { Profissional } from '../models/Profissional';
import type { Projeto } from '../models/Projeto';
import { rankingParaOsPapeisDoProjeto, type RecomendacaoStrategy } from './RecomendacaoStrategy';

function calcularMediaAvaliacoes(profissional: Profissional): number {
  if (profissional.avaliacoes.length === 0) return 0;
  const soma = profissional.avaliacoes.reduce((total, avaliacao) => total + avaliacao.nota, 0);
  return soma / profissional.avaliacoes.length;
}

export class FiltragemColaborativa implements RecomendacaoStrategy {
  recomendar(projeto: Projeto, profissionais: Profissional[]): Map<Papel, Profissional[]> {
    const ranking = [...profissionais].sort(
      (a, b) => calcularMediaAvaliacoes(b) - calcularMediaAvaliacoes(a),
    );
    return rankingParaOsPapeisDoProjeto(projeto, ranking);
  }
}
