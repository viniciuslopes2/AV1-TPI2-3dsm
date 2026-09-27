import type { MembroEquipe } from './MembroEquipe';

export class Equipe {
  readonly membros: MembroEquipe[] = [];

  constructor(
    private _id: string,
    private dataFormacao: Date,
    private status: string,
  ) {}

  get id(): string {
    return this._id;
  }

  adicionarMembro(membro: MembroEquipe): void {
    this.membros.push(membro);
  }
}
