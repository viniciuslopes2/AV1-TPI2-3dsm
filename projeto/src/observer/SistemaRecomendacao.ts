import type { Projeto } from '../models/Projeto';
import type { Equipe } from '../models/Equipe';
import type { RecomendacaoStrategy } from '../strategy/RecomendacaoStrategy';
import type { OrquestradorEquipe } from '../template/OrquestradorEquipe';
import { EventoRecomendacao } from './EventoRecomendacao';
import type { Observador } from './Observador';

export class SistemaRecomendacao {
  private observadores: Observador[] = [];
  private estrategiaAtual: RecomendacaoStrategy;

  constructor(
    private orquestrador: OrquestradorEquipe,
    estrategiaInicial: RecomendacaoStrategy,
  ) {
    this.estrategiaAtual = estrategiaInicial;
  }

  definirEstrategia(estrategia: RecomendacaoStrategy): void {
    this.estrategiaAtual = estrategia;
  }

  executarRecomendacao(projeto: Projeto): Equipe {
    const equipe = this.orquestrador.orquestrar(projeto, this.estrategiaAtual);

    const dados = new Map<string, unknown>([
      ['projetoId', projeto.id],
      ['equipeId', equipe.id],
    ]);
    this.notificarObservadores(new EventoRecomendacao('RECOMENDACAO_GERADA', dados, 'SistemaRecomendacao'));

    return equipe;
  }

  adicionarObservador(observador: Observador): void {
    this.observadores.push(observador);
  }

  notificarObservadores(evento: EventoRecomendacao): void {
    for (const observador of this.observadores) {
      observador.atualizar(evento);
    }
  }
}
