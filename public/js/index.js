document.addEventListener('DOMContentLoaded', () => {
  // --- Funcionalidade dos botões de texto ---
  const texts = document.querySelectorAll('#textContainer .text');
  const btnSaiba = document.getElementById('btn-saiba');
  const btnContato = document.getElementById('btn-contato');
  const btnAnuncie = document.getElementById('btn-anuncie');

  function hideTexts() {
    texts.forEach(t => t.style.display = 'none');
  }

  // Oculta todos os textos ao carregar a página
  hideTexts(); 

  btnSaiba.addEventListener('click', () => {
    hideTexts();
    document.getElementById('textSaiba').style.display = 'block';
  });

  btnContato.addEventListener('click', () => {
    hideTexts();
    document.getElementById('textContato').style.display = 'block';
  });

  btnAnuncie.addEventListener('click', () => {
    hideTexts();
    document.getElementById('textAnuncie').style.display = 'block';
  });

  // --- Carrossel de imagens ---
  const carouselImages = document.querySelectorAll('.carousel img');
  let atual = 0;

  function mostrarImagem(index) {
    carouselImages.forEach((img, i) => {
      img.style.display = i === index ? 'block' : 'none';
    });
  }

  function iniciarCarrossel() {
    mostrarImagem(atual);
    setInterval(() => {
      atual = (atual + 1) % carouselImages.length;
      mostrarImagem(atual);
    }, 4000);
  }

  iniciarCarrossel();

  // --- Funcionalidade de Expansão da Imagem (Lightbox) ---
  let expandedImageContainer = document.querySelector('.expanded-image-container');
  let expandedImage = document.querySelector('.expanded-image'); 

  // Garante que o container de expansão e a imagem existam no HTML
  if (!expandedImageContainer) {
    expandedImageContainer = document.createElement('div');
    expandedImageContainer.classList.add('expanded-image-container');
    document.body.appendChild(expandedImageContainer);
  }

  if (!expandedImage) {
    expandedImage = document.createElement('img');
    expandedImage.classList.add('expanded-image');
    expandedImageContainer.appendChild(expandedImage);
  }

  // Inicialmente esconde o container da imagem expandida
  expandedImageContainer.style.display = 'none';

  // Evento para fechar a imagem expandida ao clicar fora dela
  expandedImageContainer.addEventListener('click', (event) => {
    // Pega as dimensões ATUAIS da imagem expandida no lightbox
    const rect = expandedImage.getBoundingClientRect();
    const clickedOnImage = (event.clientX >= rect.left && event.clientX <= rect.right &&
                           event.clientY >= rect.top && event.clientY <= rect.bottom);

    // Fecha o lightbox se o clique foi FORA da imagem
    if (!clickedOnImage) {
      expandedImageContainer.style.display = 'none';
    }
  });


  carouselImages.forEach(img => {
    img.addEventListener('click', () => {
      expandedImageContainer.style.display = 'flex'; // Exibe o container de expansão (fundo escuro)
      expandedImage.src = img.src; // Define a imagem a ser exibida
      expandedImage.style.opacity = 1; // Garante que a imagem esteja visível
      expandedImage.style.pointerEvents = 'auto'; // Garante que a imagem seja clicável (para fechar o lightbox)
    });
  });

  // Remove os event listeners de mousemove e mouseleave do container expandido
  // para garantir que nenhuma lógica de lupa residual afete o comportamento
  expandedImageContainer.removeEventListener('mousemove', () => {});
  expandedImageContainer.removeEventListener('mouseleave', () => {});

});