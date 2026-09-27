export class Avaliacao {
  constructor(
    private _nota: number,
    private comentario: string,
    private data: Date,
  ) {}

  get nota(): number {
    return this._nota;
  }
}
