import { Papel } from './Papel';
import type { Profissional } from './Profissional';
import type { Equipe } from './Equipe';
import type { VisitanteProjeto } from '../visitor/VisitanteProjeto';

export class Projeto {
  private _equipe: Equipe | undefined;

  constructor(
    private _id: string,
    private _genero: string,
    private _duracao: number,
    private _orcamento: number,
    private _prazo: Date,
    private _papeis: Papel[] = Object.values(Papel),
  ) {}

  get id(): string {
    return this._id;
  }

  get genero(): string {
    return this._genero;
  }

  get duracao(): number {
    return this._duracao;
  }

  get orcamento(): number {
    return this._orcamento;
  }

  get prazo(): Date {
    return this._prazo;
  }

  get papeis(): Papel[] {
    return this._papeis;
  }

  get equipe(): Equipe | undefined {
    return this._equipe;
  }

  definirEquipe(equipe: Equipe): void {
    this._equipe = equipe;
  }

  aceitarRecomendacao(papel: Papel, profissional: Profissional): void {
    this._equipe?.membros.find((m) => m.papel === papel)?.confirmar();
  }

  substituirMembro(papel: Papel, profissional: Profissional): void {
    this._equipe?.membros.find((m) => m.papel === papel)?.trocarProfissional(profissional);
  }

  solicitarReavaliacao(): void {
    this._equipe = undefined;
  }

  aceitar(visitante: VisitanteProjeto): any {
    return visitante.visitarProjeto(this);
  }
}
