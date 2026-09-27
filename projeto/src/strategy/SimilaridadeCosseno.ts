import type { Papel } from '../models/Papel';
import type { Profissional } from '../models/Profissional';
import type { Projeto } from '../models/Projeto';
import { rankingParaOsPapeisDoProjeto, type RecomendacaoStrategy } from './RecomendacaoStrategy';

const NIVEL_IDEAL = 5;

function calcularSimilaridade(profissional: Profissional): number {
  const niveis = profissional.competencias.map((c) => c.nivel);
  if (niveis.length === 0) return 0;

  const produtoEscalar = niveis.reduce((soma, nivel) => soma + nivel * NIVEL_IDEAL, 0);
  const normaProfissional = Math.sqrt(niveis.reduce((soma, nivel) => soma + nivel * nivel, 0));
  const normaIdeal = Math.sqrt(niveis.length * NIVEL_IDEAL * NIVEL_IDEAL);

  if (normaProfissional === 0 || normaIdeal === 0) return 0;
  return produtoEscalar / (normaProfissional * normaIdeal);
}

export class SimilaridadeCosseno implements RecomendacaoStrategy {
  recomendar(projeto: Projeto, profissionais: Profissional[]): Map<Papel, Profissional[]> {
    const ranking = [...profissionais].sort(
      (a, b) => calcularSimilaridade(b) - calcularSimilaridade(a),
    );
    return rankingParaOsPapeisDoProjeto(projeto, ranking);
  }
}
