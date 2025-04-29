const html = document.querySelector("html");
const focoBtn = document.querySelector(".app__card-button--foco");
const curtoBtn = document.querySelector(".app__card-button--curto");
const longoBtn = document.querySelector(".app__card-button--longo");
const banner = document.querySelector(".app__image");
const titulo = document.querySelector(".app__title");
const botoes = document.querySelectorAll(".app__card-button");
const startPauseBt = document.querySelector("#start-pause");
const iniciarOuPausarbt = document.querySelector("#start-pause span");
const botãoImagem = document.querySelector(".app__card-primary-butto-icon")
const tempoNaTela = document.getElementById("timer")

const musicaFocoInput = document.querySelector("#alternar-musica");
const musica = new Audio('/sons/luna-rise-part-one.mp3');

const musicaStart = new Audio('/sons/play.wav');
const musicaPause = new Audio('/sons/pause.mp3');
const musicaFinal = new Audio('/sons/beep.mp3');


musicaFinal.loop = true;
musica.loop = true;

let intervaloId = null;
let tempoOriginal = 2
let tempoDecorridoPorSegundo = tempoOriginal;

musicaFocoInput.addEventListener('change', () => {
  if (musica.paused){
    musica.play();
  }else {
    musica.pause();
  }
});

focoBtn.addEventListener('click', () =>{
  tempoOriginal = 2;
  alterarContexto('foco');
  focoBtn.classList.add('active');
  resetarTempo();
})

curtoBtn.addEventListener('click', () => {
  tempoOriginal = 300;
  alterarContexto('descanso-curto');
  curtoBtn.classList.add('active');
  resetarTempo();
})

longoBtn.addEventListener('click', () => {
  tempoOriginal = 900;
  alterarContexto('descanso-longo');
  longoBtn.classList.add('active');
  resetarTempo();
})

function alterarContexto(contexto){

  mostrarTempo()

  botoes.forEach(function (contexto){
      contexto.classList.remove('active');
  })
  html.setAttribute('data-contexto', contexto);
  banner.setAttribute('src', `/imagens/${contexto}.png`);
  switch (contexto) {
    case 'foco':
      titulo.innerHTML =
      ` Otimize sua produtividade,<br> <strong class="app__title-strong">mergulhe no que importa.</strong>`
      break;

    case 'descanso-curto':
      titulo.innerHTML =
      `
       Que tal dar<br> uma respirada? <strong class="app__title-strong">faça uma pausa curta</strong>
      `
      break;

      case 'descanso-longo':
        titulo.innerHTML = 
        `
        Hora de voltar<br> à superfície <strong class="app__title-strong">faça uma pausa longa</strong>
        `
        
    default:
      break;
  }
}



const contagemRegressiva = () => {

  if(tempoDecorridoPorSegundo <= 0){
    musicaFinal.currentTime = 0;
    musicaFinal.play();
    alert('Tempo Finalzado');

    const focoAtivo = html.getAttribute('data-contexto') == 'foco'
    if(focoAtivo){
      const evento = new CustomEvent('focoFinalizado')
      document.dispatchEvent(evento)
    }

    resetarTempo();
    zerar();
    musicaFinal.pause();
    musicaFinal.currentTime = 0;

    return
  }

  tempoDecorridoPorSegundo -= 1;
  mostrarTempo();
}

startPauseBt.addEventListener("click", iniciarOuPausar);

function iniciarOuPausar(){

  if(intervaloId){
    musicaPause.play();
    zerar();
    return
  }

  musicaStart.play();
  intervaloId = setInterval(contagemRegressiva, 1000);
  botãoImagem.setAttribute("src", "/imagens/pause.png");
  iniciarOuPausarbt.textContent = 'Pausar';
}

function zerar(){
  clearInterval (intervaloId);
  botãoImagem.setAttribute("src", "/imagens/play_arrow.png")
  iniciarOuPausarbt.textContent = 'Começar';
  intervaloId = null;
}

function mostrarTempo(){
  
    const tempo = new Date(tempoDecorridoPorSegundo * 1000)
    const tempoFormatado = tempo.toLocaleString('pt-br', {minute: '2-digit', second: '2-digit'})
    tempoNaTela.innerHTML = `${tempoFormatado}`
}

function resetarTempo(){
  zerar();
  tempoDecorridoPorSegundo = tempoOriginal
  mostrarTempo()
}

mostrarTempo()