const tituloInput = document.getElementById("titulo");
const prioridadeInput = document.getElementById("prioridade");
const prazoInput = document.getElementById("prazo");
const btnAdicionar = document.getElementById("btnAdicionar");

const buscaInput = document.getElementById("busca");
const filtroStatus = document.getElementById("filtroStatus");
const filtroPrioridade = document.getElementById("filtroPrioridade");

const listaTarefas = document.getElementById("listaTarefas");
const mensagemVazia = document.getElementById("mensagemVazia");

const totalTarefas = document.getElementById("totalTarefas");
const tarefasPendentes = document.getElementById("tarefasPendentes");
const tarefasConcluidas = document.getElementById("tarefasConcluidas");

let tarefas = JSON.parse(localStorage.getItem("tarefas")) || [];

function salvarTarefas() {
  localStorage.setItem("tarefas", JSON.stringify(tarefas));
}

function atualizarResumo() {
  totalTarefas.textContent = tarefas.length;
  tarefasPendentes.textContent = tarefas.filter((t) => !t.concluida).length;
  tarefasConcluidas.textContent = tarefas.filter((t) => t.concluida).length;
}

function formatarData(data) {
  if (!data) return "Sem prazo";
  const [ano, mes, dia] = data.split("-");
  return `${dia}/${mes}/${ano}`;
}

function obterClassePrioridade(prioridade) {
  if (prioridade === "Alta") return "alta";
  if (prioridade === "Média") return "media";
  return "baixa";
}

function renderizarTarefas() {
  listaTarefas.innerHTML = "";

  const textoBusca = buscaInput.value.toLowerCase().trim();
  const statusSelecionado = filtroStatus.value;
  const prioridadeSelecionada = filtroPrioridade.value;

  const tarefasFiltradas = tarefas.filter((tarefa) => {
    const correspondeBusca = tarefa.titulo.toLowerCase().includes(textoBusca);

    const correspondeStatus =
      statusSelecionado === "todas" ||
      (statusSelecionado === "pendentes" && !tarefa.concluida) ||
      (statusSelecionado === "concluidas" && tarefa.concluida);

    const correspondePrioridade =
      prioridadeSelecionada === "todas" ||
      tarefa.prioridade === prioridadeSelecionada;

    return correspondeBusca && correspondeStatus && correspondePrioridade;
  });

  mensagemVazia.style.display =
    tarefasFiltradas.length === 0 ? "block" : "none";

  tarefasFiltradas.forEach((tarefa) => {
    const item = document.createElement("li");
    item.className = `tarefa ${obterClassePrioridade(tarefa.prioridade)} ${tarefa.concluida ? "concluida" : ""}`;

    item.innerHTML = `
      <div class="topo-tarefa">
        <div>
          <div class="titulo-tarefa">${tarefa.titulo}</div>
          <div class="info-tarefa">
            <span class="tag">Prioridade: ${tarefa.prioridade}</span>
            <span class="tag">Prazo: ${formatarData(tarefa.prazo)}</span>
            <span class="tag">Status: ${tarefa.concluida ? "Concluída" : "Pendente"}</span>
          </div>
        </div>
      </div>

      <div class="acoes">
        <button onclick="alternarConclusao(${tarefa.id})">
          ${tarefa.concluida ? "Reabrir" : "Concluir"}
        </button>
        <button class="btn-secundario" onclick="editarTarefa(${tarefa.id})">Editar</button>
        <button class="btn-danger" onclick="excluirTarefa(${tarefa.id})">Excluir</button>
      </div>
    `;

    listaTarefas.appendChild(item);
  });

  atualizarResumo();
}

function adicionarTarefa() {
  const titulo = tituloInput.value.trim();
  const prioridade = prioridadeInput.value;
  const prazo = prazoInput.value;

  if (titulo === "") {
    alert("Digite uma tarefa antes de adicionar.");
    return;
  }

  const novaTarefa = {
    id: Date.now(),
    titulo,
    prioridade,
    prazo,
    concluida: false,
  };

  tarefas.push(novaTarefa);
  salvarTarefas();
  renderizarTarefas();

  tituloInput.value = "";
  prioridadeInput.value = "Baixa";
  prazoInput.value = "";
}

function alternarConclusao(id) {
  tarefas = tarefas.map((tarefa) =>
    tarefa.id === id ? { ...tarefa, concluida: !tarefa.concluida } : tarefa,
  );

  salvarTarefas();
  renderizarTarefas();
}

function excluirTarefa(id) {
  tarefas = tarefas.filter((tarefa) => tarefa.id !== id);
  salvarTarefas();
  renderizarTarefas();
}

function editarTarefa(id) {
  const tarefa = tarefas.find((t) => t.id === id);

  const novoTitulo = prompt("Edite o nome da tarefa:", tarefa.titulo);
  if (novoTitulo === null) return;

  const tituloTratado = novoTitulo.trim();
  if (tituloTratado === "") {
    alert("O título da tarefa não pode ficar vazio.");
    return;
  }

  tarefa.titulo = tituloTratado;

  salvarTarefas();
  renderizarTarefas();
}

btnAdicionar.addEventListener("click", adicionarTarefa);
buscaInput.addEventListener("input", renderizarTarefas);
filtroStatus.addEventListener("change", renderizarTarefas);
filtroPrioridade.addEventListener("change", renderizarTarefas);

renderizarTarefas();
