// Variável global para armazenar os preços carregados do JSON
let marketPrices = {};

// Lista de produtos disponível para seleção
const productList = [
  'Arroz Tipo 1 Agulinha 5kg', 'Feijão Carioca 1kg', 'Café Almofada 500g',
  'Acém kg', 'Achocolatado em Pó 200g', 'Açucar Refinado 1kg', 'Atum Ralado em Óleo',
  'Azeitona Verde com Caroço 80g', 'Biscoito Maizena 170g', 'Biscoito Recheado Sabores 120g',
  'Biscoito Cream Cracker 164g', 'Mistura para Bolos 400g', 'Farinha de Trigo 1kg',
  'Farofa Temperada 400g', 'Fubá Mimoso 500g', 'Gelatina Sabores 20g', 'Goiabada 300g',
  'Leite Condensado 395g', 'Leite Longa vida Integral 1l', 'Ovos bandeja com 20 un',
  'Macarrão Espaguete 500g', 'Macarrão Parafuso 500g', 'Macarrão Instanäneo 70g',
  'Maionese 200g', 'Milho para Pipoca', 'Milho Verde 170g', 'Molho de Tomate 300g',
  'Extrato de Tomate Pouch 300g', 'Óleo de Soja 900ml', 'Sal 1kg', 'Sardinha em Óleo 80g',
  'Seleta de Legumes 170g', 'Sabão em pó 500g', 'Creme Dental', 'Papel Higienico 4 rolos',
  'Carvão pct 3kg', 'Linguiça Toscana 1kg', 'Queijo coalho', 'Picanha 1kg',
  'Cerveja Skol lt 350ml'
];


// --- Funções de Redirecionamento ---
function redirectToMarket(url) {
  window.location.href = url;
}

function redirectToHome() {
  window.location.href = 'index.html'; // Garante que a página principal é a index.html
}

// --- Funções de Carregamento e Inicialização ---

// Função para carregar os preços do arquivo JSON
async function loadPrices() {
  try {
    const response = await fetch('/data/price.json'); // Caminho para o seu arquivo JSON
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    marketPrices = await response.json();
    console.log('Preços carregados com sucesso:', marketPrices);

    // Inicia a lista de produtos APÓS o carregamento dos preços
    initializeProductList();

  } catch (error) {
    console.error('Erro ao carregar os preços:', error);
    alert('Erro ao carregar os dados de preços. Por favor, tente novamente mais tarde.');
  }
}

// Função para popular a lista de produtos na interface
function initializeProductList() {
    const listElement = document.getElementById('productList');
    if (!listElement) {
        console.error("Elemento 'productList' não encontrado no DOM.");
        return;
    }
    productList.forEach(prod => {
      const li = document.createElement('li');
      li.className = 'market-item';
      li.innerText = prod;
      li.onclick = () => addToCartAndRemove(li, prod);
      listElement.appendChild(li);
    });
}

// --- Lógica de Comparação de Preços ---

// Função para obter o preço de um produto em um mercado específico
function getProductPrice(marketKey, productName) {
  // Acessa o objeto 'products' dentro do mercado específico
  return marketPrices[marketKey]?.products?.[productName] || 0;
}

// Função principal para adicionar um produto ao carrinho e remover da lista
function addToCartAndRemove(element, productName) {
  element.remove(); // Remove o item da lista de produtos disponíveis

  const markets = [
    { id: 1, container: document.getElementById('addedProducts1'), totalElement: document.getElementById('totalValue1') },
    { id: 2, container: document.getElementById('addedProducts2'), totalElement: document.getElementById('totalValue2') },
    { id: 3, container: document.getElementById('addedProducts3'), totalElement: document.getElementById('totalValue3') }
  ];

  markets.forEach((market) => {
    const price = getProductPrice(`market${market.id}`, productName);
    
    const item = document.createElement('div');
    item.className = 'product-added';
    
    if (price === 0) {
      item.classList.add('price-unavailable'); // Adiciona classe para estilizar indisponíveis
      item.textContent = `${productName} - Indisponível`;
    } else {
      item.textContent = `${productName} - R$ ${price.toFixed(2)}`;
    }
    
    market.container.appendChild(item);

    // Atualiza o total apenas se o preço não for zero
    if (price !== 0) {
        let currentTotal = parseFloat(market.totalElement.dataset.totalPrice);
        currentTotal += price;
        market.totalElement.dataset.totalPrice = currentTotal.toFixed(2);
    }
    // Sempre atualiza o texto do total após adicionar o produto
    market.totalElement.textContent = `Total: R$ ${parseFloat(market.totalElement.dataset.totalPrice).toFixed(2)}`;
  });

  // Chamar a função para encontrar o menor total e destacar após cada adição
  highlightLowestTotal(markets);
}

// Função para destacar o mercado com o menor valor total
function highlightLowestTotal(markets) {
    let lowestTotal = Infinity;
    let lowestTotalMarketId = -1;
    let allTotalsAreZero = true; // Flag para verificar se todos os totais são zero

    // Primeiro, remove a classe de destaque de todos os mercados
    markets.forEach(market => {
        market.totalElement.classList.remove('lowest-price');
    });

    // Encontra o menor total entre os mercados
    markets.forEach(market => {
        const total = parseFloat(market.totalElement.dataset.totalPrice);
        if (total > 0) { // Considera apenas totais maiores que zero para encontrar o menor
            allTotalsAreZero = false;
            if (total < lowestTotal) {
                lowestTotal = total;
                lowestTotalMarketId = market.id;
            }
        }
    });

    // Aplica a classe de destaque ao mercado com o menor total,
    // apenas se houver pelo menos um total maior que zero
    if (!allTotalsAreZero && lowestTotalMarketId !== -1) {
        const lowestMarket = markets.find(market => market.id === lowestTotalMarketId);
        if (lowestMarket) {
            lowestMarket.totalElement.classList.add('lowest-price');
        }
    }
}


function checkProductListStatus() {
  const productListElement = document.getElementById('productList');
  const mainContentElement = document.querySelector('.main-content');

  if (productListElement && mainContentElement) {
    if (productListElement.children.length === 0) {
      mainContentElement.classList.add('no-products-left');
    } else {
      // Esta parte é mais para garantir consistência, embora no seu fluxo,
      // produtos não voltam para a lista.
      mainContentElement.classList.remove('no-products-left');
    }
  }
}

// Inicia o carregamento dos preços assim que a página é completamente carregada
window.onload = loadPrices;