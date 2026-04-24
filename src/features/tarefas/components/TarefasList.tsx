import type { TarefaAluno } from '../services/tarefas-service'

type TarefasListProps = {
	tarefasAgrupadas: Record<string, TarefaAluno[]>
	tarefaIdEmAndamento: number | null
	loadingTaskId: number | null
	onIniciarTarefa: (tarefa: TarefaAluno) => void
}

export default function TarefasList({
	tarefasAgrupadas,
	tarefaIdEmAndamento,
	loadingTaskId,
	onIniciarTarefa,
}: TarefasListProps) {
	const unidades = Object.entries(tarefasAgrupadas)

	if (unidades.length === 0) {
		return (
			<section className="rounded-[10px] border-t-4 border-t-[#3498db] bg-[#2c3e50] p-5">
				<h2 className="mb-3 border-b border-white/10 pb-2 text-base uppercase tracking-wide text-[#ecf0f1]">
					Nenhuma tarefa vinculada
				</h2>
				<p className="text-[0.92rem] text-[#95a5a6]">
					Fale com o professor para liberar suas tarefas.
				</p>
			</section>
		)
	}

	return (
		<>
			{unidades.map(([unidade, lista]) => (
				<section
					key={unidade}
					className="rounded-[10px] border-t-4 border-t-[#3498db] bg-[#2c3e50] p-5"
				>
					<h2 className="mb-3 border-b border-white/12 pb-2 text-base uppercase tracking-wide text-[#ecf0f1]">
						{unidade}
					</h2>

					<div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
						{lista.map((tarefa) => {
							const concluida = Number(tarefa.concluida) === 1
							const emAndamento = Number(tarefa.id) === Number(tarefaIdEmAndamento)
							const desabilitado = concluida || !emAndamento || loadingTaskId === tarefa.id

							const statusTexto = concluida ? 'Concluida' : 'Pendente'
							const statusClass = concluida
								? 'bg-[#d4edda] text-[#155724]'
								: 'bg-[#dfe6e9] text-[#2d3436]'

							let textoBotao = 'Iniciar tarefa'
							if (loadingTaskId === tarefa.id) textoBotao = 'Sincronizando...'
							else if (concluida) textoBotao = 'Concluida'
							else if (!emAndamento) textoBotao = 'Aguardando inicio'

							return (
								<article
									key={tarefa.id}
									className="flex flex-col gap-2 rounded-lg bg-white/7 p-3"
								>
									<div className="flex items-center justify-between gap-2">
										<h3 className="text-[0.98rem] text-[#ecf0f1]">{tarefa.nome}</h3>
										<span
											className={`rounded-md px-2 py-1 text-xs font-semibold ${statusClass}`}
										>
											{statusTexto}
										</span>
									</div>

									<p className="min-h-10 text-sm leading-relaxed text-[#bdc3c7]">
										{tarefa.descricao || 'Sem descricao'}
									</p>

									<button
										type="button"
										disabled={desabilitado}
										onClick={() => onIniciarTarefa(tarefa)}
										className="self-start rounded-lg bg-[#3498db] px-3 py-2 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-45"
									>
										{textoBotao}
									</button>
								</article>
							)
						})}
					</div>
				</section>
			))}
		</>
	)
}
