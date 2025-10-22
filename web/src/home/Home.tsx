import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import axios from 'axios'

const uri = import.meta.env.VITE_API_URI || 'http://10.87.202.165:3000'
axios.defaults.baseURL = uri

function Home() {
  const navigate = useNavigate()
  const professor = JSON.parse(window.localStorage.getItem('professor') ?? '{}')
  const [turmas, setTurmas] = useState<Array<{ id: number; nome: string }>>([])
  const [open, setOpen] = useState(false)
  const [nome, setNome] = useState("")
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!professor.id) {
      sair()
      return
    }
    axios.get('/turma/' + professor.id)
      .then(response => { setTurmas(response.data) })
      .catch(error => {
        console.error('Erro ao buscar turmas:', error)
      })
  }, [])

  function sair() {
    window.localStorage.removeItem('professor')
    navigate('/login')
  }

  function excluir(turmaId: number) {
    axios.delete('/turma/' + turmaId)
      .then(response => { return { status: response.status, response: response.data } })
      .then(({ status }) => {
        if (status == 204) {
          setTurmas(turmas.filter(turma => turma.id !== turmaId))
          return
        }
      })
      .catch((error) => {
        const status = error?.response?.status
        if (status === 409) {
          alert(error?.response.data?.message || 'Falha ao excluir turma.')
          return
        }
      })
  }

  return (<>
    {/* Header */}
    <header className="w-full bg-black text-white flex flex-row items-center justify-between px-8 h-16 shadow-md">
      <h1 className="font-bold text-lg">{professor.nome}</h1>
      <Button
        variant="destructive"
        className="bg-gray-800 hover:bg-gray-700 text-white font-medium px-4 rounded-lg transition-all"
        onClick={sair}
      >
        Sair
      </Button>
    </header>

    {/* Main content */}
    <main className="min-h-screen flex items-start justify-center p-6" style={{ backgroundColor: '#f5f5f5' }}>
      <div className="w-full max-w-4xl space-y-6">
        {/* Botão de cadastro */}
        <div className="w-full flex justify-end">
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gray-800 hover:bg-gray-700 text-white font-medium rounded-lg transition-all shadow-sm">
                + Nova Turma
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] bg-white rounded-2xl shadow-lg border border-gray-300 dark:bg-black dark:border-gray-700 dark:text-white">
              <DialogHeader>
                <DialogTitle className="text-black text-lg font-semibold dark:text-white">Cadastrar nova turma</DialogTitle>
                <DialogDescription className="text-gray-700 dark:text-gray-300">
                  Informe o nome da turma para adicioná-la à sua lista.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={(e) => {
                e.preventDefault()
                const professorId = Number(professor?.id)
                if (!professorId) {
                  alert('Professor inválido. Faça login novamente.')
                  return
                }
                setSubmitting(true)
                axios.post('/turma', { nome, professorId })
                  .then(() => {
                    setNome("")
                    setOpen(false)
                    return axios.get('/turma/' + professorId)
                  })
                  .then((response) => {
                    if (response) setTurmas(response.data)
                  })
                  .catch((error) => {
                    console.error('Erro ao cadastrar turma:', error)
                    alert(error?.response?.data?.message || 'Erro ao cadastrar turma')
                  })
                  .finally(() => setSubmitting(false))
              }} className="space-y-4">
                <Input
                  type="text"
                  placeholder="Nome da turma"
                  value={nome}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNome(e.target.value)}
                  className="border-gray-400 focus:ring-2 focus:ring-gray-500 rounded-lg"
                  required
                />
                <DialogFooter>
                  <Button
                    type="submit"
                    disabled={submitting || !nome.trim()}
                    className="bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-all"
                  >
                    {submitting ? 'Enviando...' : 'Salvar'}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Lista de turmas */}
        <section>
          <h2 className="font-semibold text-black text-xl mb-3 dark:text-white">Suas Turmas</h2>
          {turmas.length === 0 ? (
            <p className="text-gray-700 dark:text-gray-300 italic">Nenhuma turma cadastrada ainda.</p>
          ) : (
            <ul className="space-y-3">
              {turmas.map(turma => (
                <li
                  key={turma.id}
                  className="w-full flex justify-between items-center px-5 py-3 bg-white border border-gray-300 rounded-2xl shadow-sm hover:shadow-md transition-all dark:bg-black dark:border-gray-700 dark:text-white"
                >
                  <span className="text-black font-medium dark:text-white">{turma.id} — {turma.nome}</span>
                  <div className="flex space-x-2">
                    <Button
                      className="bg-red-800 hover:bg-red-700 text-white rounded-lg transition-all"
                      onClick={() => excluir(turma.id)}>
                      Excluir
                    </Button>
                    <Button
                      className="bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-all"
                      onClick={() => {
                        navigate('/atividades', {
                          state: { turmaId: turma.id, nome: turma.nome }
                        })
                      }}>
                      Visualizar
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  </>)
}

export default Home
