import type { Papel } from '../models/Papel';
import type { Profissional } from '../models/Profissional';
import type { Projeto } from '../models/Projeto';
import { OrquestradorEquipe } from './OrquestradorEquipe';

export class OrquestradorPadrao extends OrquestradorEquipe {
  protected validarRestricoes(projeto: Projeto): boolean {
    return projeto.orcamento > 0 && projeto.duracao > 0;
  }

  protected normalizarDados(projeto: Projeto, profissionais: Profissional[]): Profissional[] {
    return profissionais.filter(
      (p) => p.disponibilidade.inicio <= projeto.prazo && p.disponibilidade.fim >= projeto.prazo,
    );
  }

  protected posProcessar(recomendacoes: Map<Papel, Profissional[]>): Map<Papel, Profissional[]> {
    const limitado = new Map<Papel, Profissional[]>();
    for (const [papel, candidatos] of recomendacoes) {
      limitado.set(papel, candidatos.slice(0, 3));
    }
    return limitado;
  }
}
