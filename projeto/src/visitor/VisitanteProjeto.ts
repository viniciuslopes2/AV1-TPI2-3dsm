import type { Projeto } from '../models/Projeto';
import type { Profissional } from '../models/Profissional';

export interface VisitanteProjeto {
  visitarProjeto(projeto: Projeto): any;
  visitarProfissional(profissional: Profissional): any;
}
