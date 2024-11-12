const menu = document.getElementById("menu");
const cartBtn = document.getElementById("cart-btn");
const cartModal = document.getElementById("cart-modal");
const cartItemsContainer = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const checkoutBtn = document.getElementById("checkout-btn");
const closeModalBtn = document.getElementById("close-modal-btn");
const cartCounter = document.getElementById("cart-count");
const addressInput = document.getElementById("address");
const addressWarn = document.getElementById("address-warn");

let cart = [];

// Abrir o carrinho
cartBtn.addEventListener("click", function() {
    cartModal.style.display = "flex";
});

// Fechar o carrinho
cartModal.addEventListener("click", function(event) {
    if (event.target === cartModal) {
        cartModal.style.display = "none";
    }
});

// Fechar o carrinho (botão fechar)
closeModalBtn.addEventListener("click", function() {
    cartModal.style.display = "none";
});

// Botão para adicionar ao carrinho (menu)
menu.addEventListener("click", function(event) {
    let parentButton = event.target.closest(".add-to-cart-btn");

    if (parentButton) {
        const name = parentButton.getAttribute("data-name");
        const price = parseFloat(parentButton.getAttribute("data-price").replace('R$', '').trim());

        addToCart(name, price);
    }
});

// Função para adicionar no carrinho
function addToCart(name, price) {
    const existingItem = cart.find(item => item.name === name);

    if (existingItem) {
        // Se o item já existe, apenas aumenta a quantidade
        existingItem.quantity += 1;
    } else {
        // Caso o item não exista, adiciona o item ao carrinho
        cart.push({
            name,
            price,
            quantity: 1,
        });
    }

    updateCartModal();
}

// Função para remover um item do carrinho
function removeFromCart(name) {
    cart = cart.filter(item => item.name !== name);
    updateCartModal();
}

// Função para atualizar o modal do carrinho
function updateCartModal() {
    cartItemsContainer.innerHTML = "";
    let total = 0;

    cart.forEach(item => {
        const cartItemElement = document.createElement("div");
        cartItemElement.classList.add('flex', 'justify-between', 'items-center', 'border-b', 'p-2', 'mb-2');
        
        cartItemElement.innerHTML = `
            <div class="flex gap-4">
                <p class="font-medium">${item.name}</p>
                <p class="font-medium">Quantidade: ${item.quantity}</p>
                <p class="font-medium">R$ ${item.price.toFixed(2)}</p>
            </div>
            <div>
                <button class="remove-btn bg-red-500 text-white py-1 px-3 rounded">
                    Remover
                </button>
            </div>
        `;

        // Adicionando o evento de remover item
        cartItemElement.querySelector('.remove-btn').addEventListener('click', () => {
            removeFromCart(item.name);
        });

        cartItemsContainer.appendChild(cartItemElement);

        // Calculando o total
        total += item.price * item.quantity;
    });

    // Atualiza o total no modal
    cartTotal.innerText = `R$ ${total.toFixed(2)}`;

    // Atualizar o contador do carrinho no footer
    cartCounter.innerText = `(${cart.length})`;
}

// Verificar a hora de funcionamento do restaurante
function checkRestaurantOpen() {
    const data = new Date();
    const hora = data.getHours();
    return hora >= 10 && hora < 23; // true = restaurante está aberto
}

const spanItem = document.getElementById("date-span");
const isOpen = checkRestaurantOpen();

if (isOpen) {
    spanItem.classList.remove("bg-red-500");
    spanItem.classList.add("bg-green-600");
} else {
    spanItem.classList.remove("bg-green-600");
    spanItem.classList.add("bg-red-500");
}

// Evento de checkout
checkoutBtn.addEventListener("click", function() {
    const isOpen = checkRestaurantOpen(); // Verifica se o restaurante está aberto
    if (!isOpen) {
        // Mostra o Toastify se o restaurante estiver fechado
        Toastify({
            text: "Ops, o restaurante está fechado",
            duration: 3000,
            destination: "https://github.com/apvarun/toastify-js",
            close: true,
            gravity: "top", // `top` ou `bottom`
            position: "left", // `left`, `center` ou `right`
            stopOnFocus: true, // Impede o fechamento do toast ao passar o mouse
            style: {
                background: "#ef4444", // Cor do fundo do toast (vermelho)
            },
        }).showToast();

        // Impede a continuação da execução da função
        return; // Interrompe a execução do código, caso o restaurante esteja fechado
    }

    // Verifica se o endereço foi preenchido
    if (!addressInput.value) {
        // Exibe aviso se o endereço não for informado
        addressWarn.style.display = "block";
        return; // Interrompe a execução se o endereço não for válido
    } else {
        // Esconde o aviso de endereço
        addressWarn.style.display = "none";
        alert("Pedido finalizado!");
    }

    // Preparar e enviar pedido para o WhatsApp
    const cartItems = cart.map((item) => {
        return `${item.name} Quantidade: (${item.quantity}) Preço: R$${item.price} |`;
    }).join(" ");

    const message = encodeURIComponent(cartItems + " Endereço: " + addressInput.value);
    const phone = "19991055655"; // Número do WhatsApp para enviar a mensagem

    // Abre a conversa no WhatsApp com a mensagem formatada
    window.open(`https://wa.me/${phone}?text=${message}`, "_blank");
});
