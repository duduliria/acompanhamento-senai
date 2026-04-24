import { Link } from 'react-router-dom'
import type { StageInfo, TaskOption } from '../../../shared/types/professor.types'

type ProfessorHeaderProps = {
  etapa: StageInfo
  etapaTitulo: string
  tarefas: TaskOption[]
  tarefaSelecionada: string
  isSavingTask: boolean
  isSocketConnected: boolean
  alunosTotal: number
  totalPresentes: number
  onChangeTarefaSelecionada: (value: string) => void
  onDefinirTarefaAtual: () => void
  onAbrirCadastro: () => void
}

export default function ProfessorHeader({
  etapa,
  etapaTitulo,
  tarefas,
  tarefaSelecionada,
  isSavingTask,
  isSocketConnected,
  alunosTotal,
  totalPresentes,
  onChangeTarefaSelecionada,
  onDefinirTarefaAtual,
  onAbrirCadastro,
}: ProfessorHeaderProps) {
  return (
    <header className="flex flex-wrap items-center justify-between gap-3 bg-[#2c3e50] px-4 py-3 shadow-[0_2px_8px_rgba(0,0,0,0.4)] md:px-8">
      <h1 className="text-base font-semibold">Dashboard</h1>

      <div className="rounded-full bg-white/10 px-4 py-1 text-sm">
        <span className="mr-2 text-xs uppercase tracking-wide text-[#95a5a6]">Etapa</span>
        <strong id="etapa-atual-label" data-etapa-id={etapa.id}>
          {etapaTitulo}
        </strong>
      </div>

      <div className="flex flex-wrap items-center gap-2 text-sm">
        <select
          id="select-tarefa-atual"
          className="min-w-56 rounded border border-[#455a64] bg-[#1e272e] px-2 py-1.5 text-[#ecf0f1]"
          value={tarefaSelecionada}
          onChange={(event) => onChangeTarefaSelecionada(event.target.value)}
        >
          <option value="">Selecionar tarefa</option>
          {tarefas.map((tarefa) => (
            <option key={tarefa.id} value={tarefa.id}>
              {tarefa.nome}
            </option>
          ))}
        </select>

        <button
          id="btn-definir-tarefa"
          type="button"
          disabled={isSavingTask}
          onClick={onDefinirTarefaAtual}
          className="rounded bg-[#3498db] px-3 py-2 text-xs font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Definir tarefa atual
        </button>

        <button
          type="button"
          onClick={onAbrirCadastro}
          className="rounded bg-[#27ae60] px-3 py-2 text-xs font-semibold text-white transition hover:opacity-90"
        >
          Cadastrar alunos
        </button>

        <span id="total-alunos" className="text-[#bdc3c7]">
          {alunosTotal} cadastrado(s) - {totalPresentes} presente(s)
        </span>

        <span
          className={`rounded-full px-2 py-1 text-xs ${
            isSocketConnected
              ? 'bg-emerald-700/40 text-emerald-300'
              : 'bg-red-700/30 text-red-200'
          }`}
        >
          {isSocketConnected ? 'Socket online' : 'Socket offline'}
        </span>

        <Link
          to="/admin"
          className="rounded border border-[#ecf0f1] px-3 py-1.5 text-xs font-semibold text-[#ecf0f1] transition hover:bg-white/10"
        >
          Administracao
        </Link>
      </div>
    </header>
  )
}
