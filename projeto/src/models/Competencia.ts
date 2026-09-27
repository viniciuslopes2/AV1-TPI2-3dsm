export class Competencia {
  constructor(
    private nome: string,
    private _nivel: number,
  ) {}

  get nivel(): number {
    return this._nivel;
  }
}
