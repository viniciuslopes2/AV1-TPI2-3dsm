import type { EventoRecomendacao } from './EventoRecomendacao';
import type { Observador } from './Observador';

export class AuditoriaRecomendacao implements Observador {
  readonly registros: EventoRecomendacao[] = [];

  atualizar(evento: EventoRecomendacao): void {
    this.registros.push(evento);
  }
}
