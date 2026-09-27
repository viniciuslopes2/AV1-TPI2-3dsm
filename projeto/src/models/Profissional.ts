import type { Competencia } from './Competencia';
import type { Avaliacao } from './Avaliacao';
import type { VisitanteProjeto } from '../visitor/VisitanteProjeto';

export interface Intervalo {
  inicio: Date;
  fim: Date;
}

export class Profissional {
  readonly avaliacoes: Avaliacao[] = [];

  constructor(
    private _id: string,
    private _nome: string,
    private _competencias: Competencia[],
    private _disponibilidade: Intervalo,
    private _precoMedio: number,
  ) {}

  get id(): string {
    return this._id;
  }

  get nome(): string {
    return this._nome;
  }

  get competencias(): Competencia[] {
    return this._competencias;
  }

  get disponibilidade(): Intervalo {
    return this._disponibilidade;
  }

  get precoMedio(): number {
    return this._precoMedio;
  }

  receberAvaliacao(avaliacao: Avaliacao): void {
    this.avaliacoes.push(avaliacao);
  }

  aceitar(visitante: VisitanteProjeto): any {
    return visitante.visitarProfissional(this);
  }
}
