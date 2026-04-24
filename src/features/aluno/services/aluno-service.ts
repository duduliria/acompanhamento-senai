import { apiPost } from '../../../shared/api/client'

export async function sincronizarConclusaoTarefa(
	matricula: string,
	tarefaId: number,
	concluida: boolean,
) {
	const response = await apiPost(
		`/api/alunos/${encodeURIComponent(matricula)}/tarefas/${tarefaId}/concluir`,
		{ concluida },
	)

	if (!response.ok) {
		const payload = await response
			.json()
			.catch(() => ({ error: 'Falha ao sincronizar tarefa' }))
		throw new Error(payload.error ?? 'Falha ao sincronizar tarefa')
	}

	return response.json() as Promise<{ success: boolean }>
}
