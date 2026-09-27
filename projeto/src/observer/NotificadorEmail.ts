import type { EventoRecomendacao } from './EventoRecomendacao';
import type { Observador } from './Observador';

export class NotificadorEmail implements Observador {
  atualizar(evento: EventoRecomendacao): void {
    console.log(`[email] evento ${evento.tipo} recebido de ${evento.origem}`);
  }
}
