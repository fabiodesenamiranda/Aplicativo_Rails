import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="cart"
export default class extends Controller {
  initialize() {
    const cart = JSON.parse(localStorage.getItem("cart"))
    if (!cart){
      return
    }

    let total = 0
    for (let i=0; i < cart.length; i++){
      const item = cart[i]
      total += item.price * item.quantity
      const div = document.createElement("div")
      div.classList.add("mt-2")
      div.innerText = `Item: ${item.name} - ${item.price} - ${item.size} - Quantidade: ${item.quantity}`
      const deleteButton = document.createElement("button")
      deleteButton.innerText = "Remover"
      deleteButton.value = item.id
      deleteButton.classList.add("bg-gray-500", "rounded", "text-white", "px-2", "py-1", "ml-2")
      deleteButton.addEventListener("click", this.removeFromCart)
      div.appendChild(deleteButton)
      this.element.prepend(div)
    }

    const totalEl = document.createElement("div")
    totalEl.innerText = `Total R$: ${total}`
    let totalContainer = document.getElementById("total")
    if (totalContainer) {
      totalContainer.appendChild(totalEl)
    }
  }

  clear() {
    localStorage.removeItem("cart")
    window.location.reload()
  }

  removeFromCart(event) {
    const cart = JSON.parse(localStorage.getItem("cart"))
    const id = event.target.value
    const index = cart.findIndex(item => item.id === id)
    cart.splice(index, 1)
    localStorage.setItem("cart", JSON.stringify(cart))
    window.location.reload()
  }

  checkout() {
    const cart = JSON.parse(localStorage.getItem("cart"))
    const payload = {
      authenticity_token: document.querySelector("[name='csrf-token']").content, // Certifique-se de que o CSRF token está sendo corretamente obtido
      cart: cart
    }
    
    console.log("Payload enviado:", payload); // Adicione esta linha para verificar o payload no console

    const csrfToken = document.querySelector("[name='csrf-token']").content
    fetch("/checkout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRF-Token": csrfToken
      },
      body: JSON.stringify(payload)
    }).then(response => {
      if(response.ok){
        response.json().then(body => {
          window.location.href = body.url
        })
      } else {
        response.json().then(body => {
          const errorEl = document.createElement("div")
          errorEl.innerText = `Erro ao processar seu pedido: ${body.error}`
          let errorContainer = document.getElementById("errorContainer")
          if (errorContainer) {
            errorContainer.appendChild(errorEl)
          }
        }).catch(error => {
          const errorEl = document.createElement("div")
          errorEl.innerText = "Erro ao processar seu pedido. Por favor, tente novamente."
          let errorContainer = document.getElementById("errorContainer")
          if (errorContainer) {
            errorContainer.appendChild(errorEl)
          }
        })
      }
    }).catch(error => {
      const errorEl = document.createElement("div")
      errorEl.innerText = "Erro ao processar seu pedido. Por favor, tente novamente."
      let errorContainer = document.getElementById("errorContainer")
      if (errorContainer) {
        errorContainer.appendChild(errorEl)
      }
    })
  }
}
