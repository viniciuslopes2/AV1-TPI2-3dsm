import type { Papel } from '../models/Papel';
import type { Profissional } from '../models/Profissional';
import type { Projeto } from '../models/Projeto';
import { Equipe } from '../models/Equipe';
import { MembroEquipe } from '../models/MembroEquipe';
import type { RecomendacaoStrategy } from '../strategy/RecomendacaoStrategy';

export abstract class OrquestradorEquipe {
  constructor(protected profissionais: Profissional[]) {}

  orquestrar(projeto: Projeto, estrategia: RecomendacaoStrategy): Equipe {
    if (!this.validarRestricoes(projeto)) {
      throw new Error(`Projeto ${projeto.id} nao atende as restricoes minimas`);
    }

    const profissionaisNormalizados = this.normalizarDados(projeto, this.profissionais);
    const recomendacoes = estrategia.recomendar(projeto, profissionaisNormalizados);
    const recomendacoesFinal = this.posProcessar(recomendacoes);

    const equipe = new Equipe(`equipe-${projeto.id}`, new Date(), 'formada');
    for (const [papel, candidatos] of recomendacoesFinal) {
      const escolhido = candidatos[0];
      if (escolhido) {
        equipe.adicionarMembro(new MembroEquipe(papel, escolhido));
      }
    }

    projeto.definirEquipe(equipe);
    return equipe;
  }

  protected abstract validarRestricoes(projeto: Projeto): boolean;
  protected abstract normalizarDados(projeto: Projeto, profissionais: Profissional[]): Profissional[];
  protected abstract posProcessar(recomendacoes: Map<Papel, Profissional[]>): Map<Papel, Profissional[]>;
}
