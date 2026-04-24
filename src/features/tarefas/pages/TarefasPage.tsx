import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { clearAuthToken } from '../../../shared/lib/token'
import { getOrCreateDeviceId } from '../../../shared/lib/device-id'
import { getSocketClient } from '../../../shared/socket/socket-client'
import TarefasList from '../components/TarefasList'
import { useTarefasAgrupadas } from '../hooks/useTarefas'
import {
  carregarEtapaAtual,
  carregarTarefasAluno,
  type TarefaAluno,
} from '../services/tarefas-service'

type UsuarioAluno = {
  matricula: string
  nome: string
  perfil: string
}

function getUsuarioAluno() {
  try {
    return JSON.parse(localStorage.getItem('currentUser') || 'null') as UsuarioAluno | null
  } catch {
    return null
  }
}

function emitirComAck<TPayload>(
  socket: ReturnType<typeof getSocketClient>,
  evento: string,
  payload: TPayload,
  timeoutMs = 2500,
) {
  return new Promise<void>((resolve, reject) => {
    let done = false

    const timeoutId = window.setTimeout(() => {
      if (done) return
      done = true
      reject(new Error('Tempo esgotado ao sincronizar com o servidor'))
    }, timeoutMs)

    socket.emit(evento, payload, (resposta?: { ok?: boolean; error?: string }) => {
      if (done) return
      done = true
      window.clearTimeout(timeoutId)

      if (!resposta || resposta.ok !== true) {
        reject(new Error(resposta?.error || 'Falha na confirmacao do servidor'))
        return
      }

      resolve()
    })
  })
}

export default function TarefasPage() {
  const navigate = useNavigate()
  const socket = useMemo(() => getSocketClient(), [])
  const [usuario] = useState<UsuarioAluno | null>(() => getUsuarioAluno())
  const [tarefas, setTarefas] = useState<TarefaAluno[]>([])
  const [mensagemErro, setMensagemErro] = useState<string | null>(null)
  const [tarefaIdEmAndamento, setTarefaIdEmAndamento] = useState<number | null>(null)
  const [loadingTaskId, setLoadingTaskId] = useState<number | null>(null)

  const tarefasAgrupadas = useTarefasAgrupadas(tarefas)

  const carregar = useCallback(async () => {
    if (!usuario?.matricula) return

    try {
      setMensagemErro(null)
      const [etapaAtual, tarefasAluno] = await Promise.all([
        carregarEtapaAtual(),
        carregarTarefasAluno(usuario.matricula),
      ])

      setTarefaIdEmAndamento(etapaAtual?.tarefa_id || null)
      setTarefas(tarefasAluno || [])
    } catch (error) {
      setMensagemErro(error instanceof Error ? error.message : 'Nao foi possivel carregar tarefas')
    }
  }, [usuario?.matricula])

  useEffect(() => {
    if (!usuario || !usuario.matricula || usuario.perfil !== 'Aluno') {
      navigate('/login', { replace: true })
      return
    }

    void carregar()
  }, [carregar, navigate, usuario])

  useEffect(() => {
    const onEtapaAtualizada = ({ tarefa_id }: { tarefa_id: number | null }) => {
      setTarefaIdEmAndamento(tarefa_id || null)
    }

    socket.on('etapaAtualizada', onEtapaAtualizada)
    return () => {
      socket.off('etapaAtualizada', onEtapaAtualizada)
    }
  }, [socket])

  async function handleIniciarTarefa(tarefa: TarefaAluno) {
    if (!usuario) return

    try {
      setMensagemErro(null)
      setLoadingTaskId(tarefa.id)

      const deviceId = getOrCreateDeviceId()

      await emitirComAck(socket, 'alunoEntrou', {
        nome: usuario.nome,
        deviceId,
      })
      await emitirComAck(socket, 'marcarPresenca', { nome: usuario.nome })
      await emitirComAck(socket, 'mudarStatus', {
        nome: usuario.nome,
        status: 'fazendo',
      })

      sessionStorage.setItem('acomp_nome_autofill', usuario.nome || '')
      sessionStorage.setItem('acomp_tarefa_ativa', String(tarefa.id))

      navigate('/aluno')
    } catch (error) {
      setMensagemErro(error instanceof Error ? error.message : 'Nao foi possivel iniciar a tarefa')
      setLoadingTaskId(null)
    }
  }

  function handleSair() {
    clearAuthToken()
    navigate('/login', { replace: true })
  }

  function handleIrAcompanhamento() {
    if (usuario?.nome) {
      sessionStorage.setItem('acomp_nome_autofill', usuario.nome)
    }
    navigate('/aluno')
  }

  return (
    <main className="min-h-screen bg-[#1e272e] text-[#ecf0f1]">
      <header className="flex flex-wrap items-center justify-between gap-3 bg-[#2c3e50] px-4 py-3 shadow-[0_2px_8px_rgba(0,0,0,0.4)] md:px-8">
        <h1 className="text-lg font-semibold">Minhas Tarefas</h1>

        <div className="flex items-center gap-2">
          <strong id="nome-aluno-tarefas" className="text-sm text-[#ecf0f1]">
            {usuario?.nome || 'Aluno'}
          </strong>

          <button
            id="btn-ir-acompanhamento"
            type="button"
            onClick={handleIrAcompanhamento}
            className="rounded border-2 border-[#ecf0f1] px-3 py-1.5 text-sm text-[#ecf0f1] transition hover:bg-white/10"
          >
            Acompanhamento
          </button>

          <button
            id="btn-sair"
            type="button"
            onClick={handleSair}
            className="rounded border-2 border-[#ecf0f1] px-3 py-1.5 text-sm text-[#ecf0f1] transition hover:bg-white/10"
          >
            Sair
          </button>
        </div>
      </header>

      <section className="p-6">
        <div
          id="mensagem-tarefas"
          className={`mb-4 rounded bg-[#f8d7da] px-3 py-2 text-sm text-[#721c24] ${mensagemErro ? '' : 'hidden'}`}
        >
          {mensagemErro || ''}
        </div>

        <div id="tarefas-container" className="grid grid-cols-1 gap-4">
          <TarefasList
            tarefasAgrupadas={tarefasAgrupadas}
            tarefaIdEmAndamento={tarefaIdEmAndamento}
            loadingTaskId={loadingTaskId}
            onIniciarTarefa={(tarefa) => {
              void handleIniciarTarefa(tarefa)
            }}
          />
        </div>
      </section>
    </main>
  )
}
