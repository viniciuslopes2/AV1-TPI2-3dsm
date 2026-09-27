import type { Projeto } from '../models/Projeto';
import type { Profissional } from '../models/Profissional';
import type { VisitanteProjeto } from './VisitanteProjeto';

const NIVEL_MAXIMO = 5;

export class CalculadorCompatibilidade implements VisitanteProjeto {
  visitarProjeto(projeto: Projeto): number {
    if (!projeto.equipe || projeto.equipe.membros.length === 0) return 0;

    const compatibilidades = projeto.equipe.membros.map((membro) =>
      this.visitarProfissional(membro.profissional),
    );
    return compatibilidades.reduce((soma, valor) => soma + valor, 0) / compatibilidades.length;
  }

  visitarProfissional(profissional: Profissional): number {
    if (profissional.competencias.length === 0) return 0;

    const somaNiveis = profissional.competencias.reduce((soma, c) => soma + c.nivel, 0);
    return somaNiveis / (profissional.competencias.length * NIVEL_MAXIMO);
  }
}
