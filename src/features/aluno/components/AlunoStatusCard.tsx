import type { ReactNode } from 'react'

type AlunoStatusCardProps = {
	nome: string
	etapaTitulo: string
	statusTexto: string
	statusClassName: string
	queueMessage: string | null
	syncMessage: { text: string; type: 'ok' | 'erro' } | null
	children: ReactNode
}

export default function AlunoStatusCard({
	nome,
	etapaTitulo,
	statusTexto,
	statusClassName,
	queueMessage,
	syncMessage,
	children,
}: AlunoStatusCardProps) {
	return (
		<div className="w-full max-w-105 rounded-xl bg-white px-10 py-8 text-center text-[#333] shadow-[0_4px_20px_rgba(0,0,0,0.1)]">
			<p className="mb-1 text-xl text-[#555]">
				Ola, <strong id="exibir-nome">{nome}</strong>
			</p>

			<div className="mb-4 flex items-center justify-center gap-2 rounded-lg bg-[#2c3e50] px-4 py-2 text-[0.95rem] text-[#ecf0f1]">
				<span className="text-sm text-[#95a5a6]">Etapa atual:</span>
				<span id="etapa-titulo-aluno">{etapaTitulo}</span>
			</div>

			<p id="status-atual" className={statusClassName}>
				{statusTexto}
			</p>

			<p
				id="msg-posicao-fila"
				className={`mb-3 rounded-lg border border-[#ffc107] bg-[#fff3cd] px-4 py-2 text-[0.95rem] font-semibold text-[#856404] ${queueMessage ? '' : 'hidden'}`}
			>
				{queueMessage || ''}
			</p>

			<p
				id="msg-sync-tarefa"
				className={`mb-3 rounded-lg border px-4 py-2 text-[0.95rem] font-semibold ${
					syncMessage
						? syncMessage.type === 'ok'
							? 'border-transparent bg-[rgba(39,174,96,0.2)] text-[#2ecc71]'
							: 'border-transparent bg-[rgba(231,76,60,0.2)] text-[#ff8a80]'
						: 'hidden'
				}`}
			>
				{syncMessage?.text || ''}
			</p>

			{children}
		</div>
	)
}
