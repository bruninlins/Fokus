const btnAdicionarTarefa = document.querySelector('.app__button--add-task');
const formAdcionarTarefa = document.querySelector('.app__form-add-task');
const textarea = document.querySelector('.app__form-textarea');
const ulTarefas = document.querySelector('.app__section-task-list');
const cancelarBtn = document.querySelector('.app__form-footer__button--cancel');
const paragrafoDescricaotarefa = document.querySelector('.app__section-active-task-description');
const andamentoParagrafo = document.querySelector('.app__section-active-task-label'); 

const btnRemoverConcluidas = document.querySelector('#btn-remover-concluidas');
const btnRemoverTodas = document.querySelector('#btn-remover-todas');



let tarefas = JSON.parse(localStorage.getItem('tarefas')) || [];
let tarefaSelecionada = null
let liDaTarefaSelecionada = null

function atualizarTarefas (){
  localStorage.setItem('tarefas', JSON.stringify(tarefas));
}

function criarElementoTarefa(tarefaDoTextarea) {
  const li = document.createElement('li');
  li.classList.add('app__section-task-list-item');

  const svg = document.createElement('svg');
  svg.innerHTML = 
  `
        <svg class="app__section-task-icon-status" width="24" height="24" viewBox="0 0 24 24" fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="12" fill="#FFF"></circle>
            <path d="M9 16.1719L19.5938 5.57812L21 6.98438L9 18.9844L3.42188 13.4062L4.82812 12L9 16.1719Z"
                fill="#01080E"></path>
        </svg>
  `

  const paragrafo = document.createElement('p');
  paragrafo.textContent = tarefaDoTextarea.descricao;
  paragrafo.classList.add('app__section-task-list-item-description');

  const botao = document.createElement('button');
  botao.classList.add('app_button-edit');

  botao.onclick = () => {
    const novaDescricao = prompt("Qual é o novo nome da tarefa?");

    if(novaDescricao == null){
      return
    }

    if (!novaDescricao || novaDescricao.trim() == "") {
      alert("Erro: o nome da tarefa não pode ser vazio.");
      return; // Sai da função sem fazer alterações
    }

    paragrafo.textContent = novaDescricao;
    tarefaDoTextarea.descricao = novaDescricao;
    atualizarTarefas();
  }
  
  const imagemBotao = document.createElement('img');
  imagemBotao.setAttribute('src', '/imagens/edit.png');
  botao.append(imagemBotao);

  li.append(svg);
  li.append(paragrafo);
  li.append(botao);

  if (tarefaDoTextarea.completa) {
    li.classList.add('app__section-task-list-item-complete');
    botao.setAttribute('desabld', 'desable');
  } else{
    li.onclick = () => {
  
      document.querySelectorAll('.app__section-task-list-item-active')
        .forEach(elemento => {
          elemento.classList.remove('app__section-task-list-item-active');
        });
  
      if(tarefaSelecionada == tarefaDoTextarea){
        paragrafoDescricaotarefa.textContent = '';
        tarefaSelecionada = null
        andamentoParagrafo.style.display = '';
        liDaTarefaSelecionada = null
        return
      };
  
      tarefaSelecionada = tarefaDoTextarea;
  
      liDaTarefaSelecionada = li
  
      paragrafoDescricaotarefa.textContent = tarefaDoTextarea.descricao;
      andamentoParagrafo.style.display = 'none';
      
      li.classList.add('app__section-task-list-item-active');
    }
  }


  return li
}

btnAdicionarTarefa.addEventListener('click', () => {
  formAdcionarTarefa.classList.toggle('hidden');
})

formAdcionarTarefa.addEventListener('submit', (evento) => {
  evento.preventDefault();
  const tarefaDoTextarea = {
    descricao: textarea.value
  }
  tarefas.push(tarefaDoTextarea);
  const elementoTarefa = criarElementoTarefa(tarefaDoTextarea);
  ulTarefas.append(elementoTarefa);
  atualizarTarefas();
  textarea.value = ''
  formAdcionarTarefa.classList.add('hidden');
})

cancelarBtn.addEventListener('click', () => {
  formAdcionarTarefa.classList.add('hidden');
  textarea.value = '';
})

tarefas.forEach(tarefaDoTextarea => {
  const elementoTarefa = criarElementoTarefa(tarefaDoTextarea);
  ulTarefas.append(elementoTarefa);
});

document.addEventListener('focoFinalizado', () => {
  if(tarefaSelecionada && liDaTarefaSelecionada){
    liDaTarefaSelecionada.classList.remove('app__section-task-list-item-active');
    liDaTarefaSelecionada.classList.add('app__section-task-list-item-complete');
    liDaTarefaSelecionada.querySelector('button').setAttribute('desabld', 'desable');
    tarefaSelecionada.completa = true;
    atualizarTarefas();
  }
})

const removerTarefas = (somenteCompletas) => {
/*   const seletor = somenteCompletas ? ".app__section-task-list-item-complete" : ".app__section-task-list-item" */
let seletor = "app__section-task-list-item";
if (somenteCompletas){
  seletor = "app__section-task-list-item-complete";
}
  document.querySelectorAll(seletor).forEach(elemento => {
    elemento.remove();
  })
  tarefas = somenteCompletas ? tarefas.filter(tarefaDoTextarea => !tarefaDoTextarea.completa) : [];
  atualizarTarefas();
}

btnRemoverConcluidas.onclick = () => removerTarefas(true);
btnRemoverTodas.onclick = () => removerTarefas(false);
