import { useMemo } from 'react'
import type { AlunoStatus, TarefaStatus } from '../../../shared/types/aluno.types'

export function useAlunoActions(status: AlunoStatus, tarefaStatus: TarefaStatus | null) {
	return useMemo(() => {
		const tarefaEmAndamento = tarefaStatus === 'em_andamento'
		const timeoutActive = status === 'em_timeout'
		const ajudaBloqueada =
			status === 'aguardando_ajuda' ||
			status === 'em_atendimento' ||
			status === 'terminou' ||
			timeoutActive

		return {
			timeoutActive,
			canHelp: tarefaEmAndamento && !ajudaBloqueada,
			canFinish: tarefaEmAndamento && status !== 'terminou' && !timeoutActive,
			showQueue: status === 'aguardando_ajuda',
		}
	}, [status, tarefaStatus])
}
