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
import { ValidadorConsistencia } from './visitor/ValidadorConsistencia';
import { CalculadorCompatibilidade } from './visitor/CalculadorCompatibilidade';
import { GeradorRelatorio } from './visitor/GeradorRelatorio';

const disponibilidadeAnual = {
  inicio: new Date('2026-01-01'),
  fim: new Date('2026-12-31'),
};

const ana = new Profissional(
  'prof-1',
  'Ana Souza',
  [new Competencia('fotografia', 5), new Competencia('edicao', 4)],
  disponibilidadeAnual,
  3000,
);
ana.receberAvaliacao(new Avaliacao(5, 'excelente', new Date('2025-01-01')));

const bruno = new Profissional(
  'prof-2',
  'Bruno Lima',
  [new Competencia('fotografia', 2), new Competencia('edicao', 2)],
  disponibilidadeAnual,
  1200,
);
bruno.receberAvaliacao(new Avaliacao(3, 'regular', new Date('2025-01-01')));

const carla = new Profissional(
  'prof-3',
  'Carla Reis',
  [new Competencia('fotografia', 4), new Competencia('edicao', 3)],
  disponibilidadeAnual,
  1800,
);
carla.receberAvaliacao(new Avaliacao(4, 'boa', new Date('2025-01-01')));

const profissionais = [ana, bruno, carla];
const projeto = new Projeto('proj-1', 'documentario', 40, 5000, new Date('2026-06-01'));

const orquestrador = new OrquestradorPadrao(profissionais);
const sistema = new SistemaRecomendacao(orquestrador, new SimilaridadeCosseno());
sistema.adicionarObservador(new NotificadorEmail());
sistema.adicionarObservador(new NotificadorInterno());
const auditoria = new AuditoriaRecomendacao();
sistema.adicionarObservador(auditoria);

console.log('--- estrategia: similaridade de cosseno ---');
const equipeCosseno = sistema.executarRecomendacao(projeto);
console.log('vencedor:', equipeCosseno.membros[0]?.profissional.nome);

console.log('--- estrategia: filtragem colaborativa ---');
sistema.definirEstrategia(new FiltragemColaborativa());
const equipeColaborativa = sistema.executarRecomendacao(projeto);
console.log('vencedor:', equipeColaborativa.membros[0]?.profissional.nome);

console.log('--- estrategia: regras de orcamento ---');
sistema.definirEstrategia(new RegrasOrcamento());
const equipeOrcamento = sistema.executarRecomendacao(projeto);
console.log('vencedor:', equipeOrcamento.membros[0]?.profissional.nome);

console.log('--- auditoria acumulada ---');
console.log('total de eventos registrados:', auditoria.registros.length);

console.log('--- visitantes sobre a mesma estrutura de dados ---');
console.log('consistencia do projeto:', projeto.aceitar(new ValidadorConsistencia()));
console.log('compatibilidade da equipe:', projeto.aceitar(new CalculadorCompatibilidade()));
console.log(projeto.aceitar(new GeradorRelatorio()));
console.log(ana.aceitar(new GeradorRelatorio()));
