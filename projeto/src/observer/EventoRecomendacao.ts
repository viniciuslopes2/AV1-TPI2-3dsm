export class EventoRecomendacao {
  constructor(
    private _tipo: string,
    private dados: Map<string, unknown>,
    private _origem: string,
  ) {}

  get tipo(): string {
    return this._tipo;
  }

  get origem(): string {
    return this._origem;
  }
}
