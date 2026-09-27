import type { Projeto } from '../models/Projeto';
import type { Profissional } from '../models/Profissional';
import type { VisitanteProjeto } from './VisitanteProjeto';

export class GeradorRelatorio implements VisitanteProjeto {
  visitarProjeto(projeto: Projeto): string {
    const totalMembros = projeto.equipe?.membros.length ?? 0;
    return `Projeto ${projeto.id} (${projeto.genero}): orcamento R$${projeto.orcamento}, equipe com ${totalMembros} membro(s)`;
  }

  visitarProfissional(profissional: Profissional): string {
    return `Profissional ${profissional.nome}: preco medio R$${profissional.precoMedio}, ${profissional.competencias.length} competencia(s)`;
  }
}
