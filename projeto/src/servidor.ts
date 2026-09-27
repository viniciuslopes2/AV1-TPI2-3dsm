// TEMPORARIO: servidor HTTP feito so para cumprir o endpoint REST pedido no PDF da atividade.
// Se nao for mais usado, basta apagar este arquivo e o script "servidor" do package.json.
import { createServer } from 'node:http';
import type { IncomingMessage, ServerResponse } from 'node:http';
import { Competencia } from './models/Competencia';
import { Avaliacao } from './models/Avaliacao';
import { Profissional } from './models/Profissional';
import { Projeto } from './models/Projeto';
import { OrquestradorPadrao } from './template/OrquestradorPadrao';
import { SimilaridadeCosseno } from './strategy/SimilaridadeCosseno';
import { FiltragemColaborativa } from './strategy/FiltragemColaborativa';
import { RegrasOrcamento } from './strategy/RegrasOrcamento';
import { SistemaRecomendacao } from './observer/SistemaRecomendacao';
import { NotificadorEmail } from './observer/NotificadorEmail';
import { NotificadorInterno } from './observer/NotificadorInterno';
import { AuditoriaRecomendacao } from './observer/AuditoriaRecomendacao';

const disponibilidadeAnual = { inicio: new Date('2026-01-01'), fim: new Date('2026-12-31') };

const ana = new Profissional('prof-1', 'Ana Souza', [new Competencia('fotografia', 5), new Competencia('edicao', 4)], disponibilidadeAnual, 3000);
ana.receberAvaliacao(new Avaliacao(5, 'excelente', new Date('2025-01-01')));

const bruno = new Profissional('prof-2', 'Bruno Lima', [new Competencia('fotografia', 2), new Competencia('edicao', 2)], disponibilidadeAnual, 1200);
bruno.receberAvaliacao(new Avaliacao(3, 'regular', new Date('2025-01-01')));

const carla = new Profissional('prof-3', 'Carla Reis', [new Competencia('fotografia', 4), new Competencia('edicao', 3)], disponibilidadeAnual, 1800);
carla.receberAvaliacao(new Avaliacao(4, 'boa', new Date('2025-01-01')));

const estrategiaPadrao = new SimilaridadeCosseno();
const estrategias = {
  cosseno: estrategiaPadrao,
  colaborativa: new FiltragemColaborativa(),
  orcamento: new RegrasOrcamento(),
};

const sistema = new SistemaRecomendacao(new OrquestradorPadrao([ana, bruno, carla]), estrategiaPadrao);
sistema.adicionarObservador(new NotificadorEmail());
sistema.adicionarObservador(new NotificadorInterno());
sistema.adicionarObservador(new AuditoriaRecomendacao());

async function lerJson(req: IncomingMessage): Promise<any> {
  let texto = '';
  for await (const parte of req) texto += parte;
  return JSON.parse(texto);
}

function responder(res: ServerResponse, status: number, corpo: unknown): void {
  res.writeHead(status, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(corpo));
}

// POST /recomendar  { id, genero, duracao, orcamento, prazo, papeis?, estrategia? }
const servidor = createServer(async (req, res) => {
  if (req.method !== 'POST' || req.url !== '/recomendar') {
    responder(res, 404, { erro: 'use POST /recomendar' });
    return;
  }

  try {
    const dados = await lerJson(req);
    const projeto = new Projeto(dados.id, dados.genero, dados.duracao, dados.orcamento, new Date(dados.prazo), dados.papeis);
    sistema.definirEstrategia(estrategias[dados.estrategia as keyof typeof estrategias] ?? estrategiaPadrao);

    const equipe = sistema.executarRecomendacao(projeto);
    const membros = equipe.membros.map((m) => ({ papel: m.papel, profissional: m.profissional.nome }));
    responder(res, 200, { equipeId: equipe.id, membros });
  } catch (erro) {
    responder(res, 400, { erro: (erro as Error).message });
  }
});

servidor.listen(3000, () => console.log('servidor em http://localhost:3000'));
