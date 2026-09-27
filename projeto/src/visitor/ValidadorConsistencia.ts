import type { Projeto } from '../models/Projeto';
import type { Profissional } from '../models/Profissional';
import type { VisitanteProjeto } from './VisitanteProjeto';

export class ValidadorConsistencia implements VisitanteProjeto {
  // Todos os papeis exigidos estao preenchidos e o orcamento cobre o custo da equipe
  visitarProjeto(projeto: Projeto): boolean {
    const membros = projeto.equipe?.membros ?? [];
    const papeisPreenchidos = projeto.papeis.every((papel) => membros.some((m) => m.papel === papel));

    const profissionais = new Set(membros.map((m) => m.profissional));
    const custo = [...profissionais].reduce((soma, p) => soma + p.precoMedio, 0);

    return papeisPreenchidos && custo <= projeto.orcamento;
  }

  visitarProfissional(profissional: Profissional): boolean {
    return profissional.precoMedio > 0 && profissional.competencias.length > 0;
  }
}
