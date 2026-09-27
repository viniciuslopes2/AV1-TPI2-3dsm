import type { Papel } from '../models/Papel';
import type { Profissional } from '../models/Profissional';
import type { Projeto } from '../models/Projeto';
import { rankingParaOsPapeisDoProjeto, type RecomendacaoStrategy } from './RecomendacaoStrategy';

export class RegrasOrcamento implements RecomendacaoStrategy {
  recomendar(projeto: Projeto, profissionais: Profissional[]): Map<Papel, Profissional[]> {
    const dentroDoOrcamento = profissionais.filter((p) => p.precoMedio <= projeto.orcamento);
    const candidatos = dentroDoOrcamento.length > 0 ? dentroDoOrcamento : profissionais;
    const ranking = [...candidatos].sort((a, b) => a.precoMedio - b.precoMedio);
    return rankingParaOsPapeisDoProjeto(projeto, ranking);
  }
}
