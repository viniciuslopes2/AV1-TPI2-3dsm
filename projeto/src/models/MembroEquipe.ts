import type { Papel } from './Papel';
import type { Profissional } from './Profissional';

export class MembroEquipe {
  constructor(
    private _papel: Papel,
    private _profissional: Profissional,
    private confirmado: boolean = false,
  ) {}

  get papel(): Papel {
    return this._papel;
  }

  get profissional(): Profissional {
    return this._profissional;
  }

  confirmar(): void {
    this.confirmado = true;
  }

  trocarProfissional(profissional: Profissional): void {
    this._profissional = profissional;
    this.confirmado = false;
  }
}
