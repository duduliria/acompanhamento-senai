type AlunoActionsProps = {
	canHelp: boolean
	canFinish: boolean
	timeoutActive: boolean
	onTerminei: () => void
	onAjuda: () => void
	onFazendo: () => void
	onSairTarefa: () => void
}

function buttonClass(baseColor: string) {
	return `cursor-pointer rounded-lg px-5 py-3 text-[1.05rem] font-semibold text-white transition hover:opacity-90 active:scale-95 disabled:cursor-not-allowed disabled:opacity-45 disabled:active:scale-100 ${baseColor}`
}

export default function AlunoActions({
	canHelp,
	canFinish,
	timeoutActive,
	onTerminei,
	onAjuda,
	onFazendo,
	onSairTarefa,
}: AlunoActionsProps) {
	return (
		<div className="flex flex-col gap-3" id="botoes-acoes-aluno">
			<button
				id="btn-terminei"
				type="button"
				disabled={!canFinish || timeoutActive}
				onClick={onTerminei}
				className={buttonClass('bg-[#27ae60]')}
			>
				Terminei esta etapa
			</button>

			<button
				id="btn-ajuda"
				type="button"
				disabled={!canHelp || timeoutActive}
				onClick={onAjuda}
				className={`${buttonClass('bg-[#e74c3c]')} ${!canHelp ? 'hidden' : ''}`}
			>
				Preciso de ajuda
			</button>

			<button
				id="btn-fazendo"
				type="button"
				disabled={timeoutActive}
				onClick={onFazendo}
				className={buttonClass('bg-[#95a5a6]')}
			>
				Voltar para fazendo
			</button>

			<button
				id="btn-sair-tarefa"
				type="button"
				disabled={timeoutActive}
				onClick={onSairTarefa}
				className={buttonClass('bg-[#95a5a6]')}
			>
				Sair da tarefa
			</button>
		</div>
	)
}
