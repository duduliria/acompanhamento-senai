import type {
	ConclusoesPayload,
	TaskOption,
	TurmaOption,
} from '../../../shared/types/professor.types'

type RelatoriosPanelProps = {
	turmas: TurmaOption[]
	tarefas: TaskOption[]
	filtroTurma: string
	filtroTarefa: string
	relatorio: ConclusoesPayload | null
	onFiltroTurmaChange: (value: string) => void
	onFiltroTarefaChange: (value: string) => void
}

function cardTitleStyle(color: string) {
	return `border-b border-white/10 pb-2 text-sm font-semibold uppercase tracking-wide ${color}`
}

export default function RelatoriosPanel({
	turmas,
	tarefas,
	filtroTurma,
	filtroTarefa,
	relatorio,
	onFiltroTurmaChange,
	onFiltroTarefaChange,
}: RelatoriosPanelProps) {
	return (
		<section className="grid gap-4 px-4 pb-8 md:grid-cols-2 md:px-6">
			<article className="rounded-lg border-t-4 border-t-[#8e44ad] bg-[#2c3e50] p-4">
				<h3 className={cardTitleStyle('text-[#ecf0f1]')}>Filtros do relatorio</h3>

				<div className="mt-3 space-y-2">
					<select
						id="select-relatorio-turma"
						className="w-full rounded border border-[#455a64] bg-[#1e272e] px-2 py-2 text-sm text-[#ecf0f1]"
						value={filtroTurma}
						onChange={(event) => onFiltroTurmaChange(event.target.value)}
					>
						<option value="">Todas as turmas</option>
						{turmas.map((turma) => (
							<option key={turma.id} value={turma.id}>
								{turma.nome}
							</option>
						))}
					</select>

					<select
						id="select-relatorio-tarefa"
						className="w-full rounded border border-[#455a64] bg-[#1e272e] px-2 py-2 text-sm text-[#ecf0f1]"
						value={filtroTarefa}
						onChange={(event) => onFiltroTarefaChange(event.target.value)}
					>
						<option value="">Todas as tarefas</option>
						{tarefas.map((tarefa) => (
							<option key={tarefa.id} value={tarefa.id}>
								{tarefa.nome}
							</option>
						))}
					</select>
				</div>
			</article>

			<article className="rounded-lg border-t-4 border-t-[#8e44ad] bg-[#2c3e50] p-4">
				<h3 className={cardTitleStyle('text-[#ecf0f1]')}>Conclusoes (geral)</h3>
				<ul id="relatorio-geral" className="mt-3 space-y-2 text-sm">
					{!relatorio ? (
						<li className="italic text-[#7f8c8d]">Sem dados</li>
					) : (
						<>
							<li className="rounded bg-white/8 px-3 py-2">
								Total de vinculos: {relatorio.geral.total_vinculos}
							</li>
							<li className="rounded bg-white/8 px-3 py-2">
								Concluidas: {relatorio.geral.concluidas}
							</li>
							<li className="rounded bg-white/8 px-3 py-2">
								Pendentes: {relatorio.geral.pendentes}
							</li>
							<li className="rounded bg-white/8 px-3 py-2">
								Conclusao: {relatorio.geral.percentual_conclusao}%
							</li>
						</>
					)}
				</ul>
			</article>

			<article className="rounded-lg border-t-4 border-t-[#8e44ad] bg-[#2c3e50] p-4">
				<h3 className={cardTitleStyle('text-[#ecf0f1]')}>Conclusoes por turma</h3>
				<ul id="relatorio-por-turma" className="mt-3 space-y-2 text-sm">
					{!relatorio || relatorio.porTurma.length === 0 ? (
						<li className="italic text-[#7f8c8d]">Sem dados</li>
					) : (
						relatorio.porTurma.map((item) => (
							<li key={item.turma_id} className="rounded bg-white/8 px-3 py-2">
								{item.turma_nome}: {item.concluidas}/{item.total_vinculos} ({item.percentual_conclusao}
								%)
							</li>
						))
					)}
				</ul>
			</article>

			<article className="rounded-lg border-t-4 border-t-[#8e44ad] bg-[#2c3e50] p-4">
				<h3 className={cardTitleStyle('text-[#ecf0f1]')}>Conclusoes por tarefa</h3>
				<ul id="relatorio-por-tarefa" className="mt-3 space-y-2 text-sm">
					{!relatorio || relatorio.porTarefa.length === 0 ? (
						<li className="italic text-[#7f8c8d]">Sem dados</li>
					) : (
						relatorio.porTarefa.map((item) => (
							<li key={item.tarefa_id} className="rounded bg-white/8 px-3 py-2">
								{item.tarefa_nome}: {item.concluidas}/{item.total_vinculos} ({item.percentual_conclusao}
								%)
							</li>
						))
					)}
				</ul>
			</article>
		</section>
	)
}

