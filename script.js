let data;
let indiceAtual = 1;
let fullscreenAtivado = false; // Controle para acionar fullscreen apenas na primeira interação
const elementoTitulo = document.getElementById('titulo');
const botaoUp = document.getElementById('botao-up');
const botaoDown = document.getElementById('botao-down');
const botaoFechar = document.getElementById('botao-fechar');
const elementoAudio = document.getElementById('player-audio');
const pastaAudios = 'audios/'; // Caminho da pasta dos áudios
const botaoAumentar = document.getElementById('botao-aumentar');
const botaoDiminuir = document.getElementById('botao-diminuir');
let tamanhoFonte = 24; // Tamanho inicial da fonte

// Função para verificar se a orientação está correta
function verificarOrientacao() {
  if (window.innerHeight > window.innerWidth) {
    document.getElementById('mensagem-orientacao').style.display = 'flex';
    document.getElementById('app-container').style.display = 'none';
  } else {
    document.getElementById('mensagem-orientacao').style.display = 'none';
    document.getElementById('app-container').style.display = 'flex';
  }
}

// Função para ativar o modo fullscreen
function ativarFullscreen() {
  const elem = document.documentElement; // Seleciona o elemento raiz (documento)
  if (elem.requestFullscreen) {
    elem.requestFullscreen();
  } else if (elem.mozRequestFullScreen) { // Para Firefox
    elem.mozRequestFullScreen();
  } else if (elem.webkitRequestFullscreen) { // Para Chrome, Safari e Opera
    elem.webkitRequestFullscreen();
  } else if (elem.msRequestFullscreen) { // Para IE/Edge
    elem.msRequestFullscreen();
  }
}

// Função para atualizar o conteúdo
function atualizarConteudo() {
  if (!data || !data.conteudos) {
    console.error('Dados não carregados ou estrutura inválida.');
    return;
  }
  
  const conteudoAtual = data.conteudos[indiceAtual];
  let textoTitulo = conteudoAtual.texto;
  
  // Verifica o comprimento do texto e o tamanho da fonte
  if (textoTitulo.length > 30 || parseInt(window.getComputedStyle(elementoTitulo).fontSize) > 24) {
    textoTitulo = textoTitulo.substring(0, 30) + '...'; // Corta o texto após 30 caracteres e adiciona "..."
  }

  elementoTitulo.innerText = textoTitulo;
  reproduzirAudio(conteudoAtual.audio);
}


// Função para reproduzir o áudio
function reproduzirAudio(arquivoAudio) {
  // Pausar o áudio atual, se estiver tocando
  if (!elementoAudio.paused) {
    elementoAudio.pause();
    elementoAudio.currentTime = 0;
  }
  const caminhoAudio = pastaAudios + arquivoAudio; // Concatena o caminho da pasta com o nome do arquivo
  elementoAudio.src = caminhoAudio;
  elementoAudio.load();
  elementoAudio.play().catch(error => {
    console.error('Erro ao reproduzir o áudio:', error);
  });
}

/// Função para aumentar o tamanho do texto
function aumentarTamanhoTexto() {
  // Ativa o fullscreen na primeira interação
  if (!fullscreenAtivado) {
    ativarFullscreen();
    fullscreenAtivado = true; // Evita que fullscreen seja acionado novamente
  }
  tamanhoFonte += 2;
  elementoTitulo.style.fontSize = `${tamanhoFonte}px`; // Ajusta o tamanho do título
  botaoUp.style.fontSize = `${tamanhoFonte}px`; // Ajusta o tamanho do texto do botão Up
  botaoDown.style.fontSize = `${tamanhoFonte}px`; // Ajusta o tamanho do texto do botão Down
  botaoFechar.style.fontSize = `${tamanhoFonte}px`; // Ajusta o tamanho do texto do botão Fechar
}

// Função para diminuir o tamanho do texto
function diminuirTamanhoTexto() {
  // Ativa o fullscreen na primeira interação
  if (!fullscreenAtivado) {
    ativarFullscreen();
    fullscreenAtivado = true; // Evita que fullscreen seja acionado novamente
  }
  if (tamanhoFonte > 12) { // Limite mínimo de fonte
    tamanhoFonte -= 2;
    elementoTitulo.style.fontSize = `${tamanhoFonte}px`; // Ajusta o tamanho do título
    botaoUp.style.fontSize = `${tamanhoFonte}px`; // Ajusta o tamanho do texto do botão Up
    botaoDown.style.fontSize = `${tamanhoFonte}px`; // Ajusta o tamanho do texto do botão Down
    botaoFechar.style.fontSize = `${tamanhoFonte}px`; // Ajusta o tamanho do texto do botão Fechar
  }
}

// Verificar a orientação sempre que a tela for redimensionada
window.addEventListener('resize', verificarOrientacao);
window.addEventListener('load', verificarOrientacao);

// Eventos para os botões de aumentar/diminuir
botaoAumentar.addEventListener('click', aumentarTamanhoTexto);
botaoDiminuir.addEventListener('click', diminuirTamanhoTexto);

// Event listeners para os botões
botaoUp.addEventListener('click', () => {
  if (!fullscreenAtivado) {
    ativarFullscreen();
    fullscreenAtivado = true; // Evita que fullscreen seja acionado novamente
  }
  if (indiceAtual > 0) {
    indiceAtual--;
    atualizarConteudo();
  }
});

botaoDown.addEventListener('click', () => {
  if (!fullscreenAtivado) {
    ativarFullscreen();
    fullscreenAtivado = true; // Evita que fullscreen seja acionado novamente
  }
  if (indiceAtual < data.conteudos.length - 1) {
    indiceAtual++;
    atualizarConteudo();
  }
});

botaoFechar.addEventListener('click', () => {
  window.close(); // Observação: Pode não funcionar em todos os navegadores
});

// Carregar o JSON em tempo de execução
window.addEventListener('load', () => {
  fetch('conteudo.json')
    .then(response => response.json())
    .then(jsonData => {
      data = jsonData;
      atualizarConteudo();
      botaoUp.focus(); // Foco inicial no botão "up" para acessibilidade
    })
    .catch(error => {
      console.error('Erro ao carregar o JSON:', error);
    });
});
