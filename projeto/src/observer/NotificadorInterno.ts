import type { EventoRecomendacao } from './EventoRecomendacao';
import type { Observador } from './Observador';

export class NotificadorInterno implements Observador {
  atualizar(evento: EventoRecomendacao): void {
    console.log(`[mensagem interna] evento ${evento.tipo} recebido de ${evento.origem}`);
  }
}
