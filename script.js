/* LOGIN */
const ADMIN_USER = "Adm";
const ADMIN_PASS = "Adm@";

let isAdmin = false;

const productsKey = "loja_products";

// Load & Save Products
function loadProducts() {
  return JSON.parse(localStorage.getItem(productsKey) || "[]");
}
function saveProducts(arr) {
  localStorage.setItem(productsKey, JSON.stringify(arr));
}

let products = loadProducts();

/* ELEMENTS */
const modal = document.getElementById("productModal");
const detailModal = document.getElementById("detailModal");

// LOGIN
document.getElementById("loginBtn").onclick = () => {
  let user = prompt("Usuário:");
  let pass = prompt("Senha:");

  if (user === ADMIN_USER && pass === ADMIN_PASS) {
    isAdmin = true;
    document.getElementById("addProductBtn").classList.remove("hidden");
    document.getElementById("logoutBtn").classList.remove("hidden");
    alert("Login feito!");
  } else {
    alert("Acesso negado!");
  }
};

document.getElementById("logoutBtn").onclick = () => {
  isAdmin = false;
  document.getElementById("addProductBtn").classList.add("hidden");
  document.getElementById("logoutBtn").classList.add("hidden");
};

/* RENDER */
function renderProducts() {
  const list = document.getElementById("productList");
  list.innerHTML = "";

  products.forEach(p => {
    let card = document.createElement("div");
    card.className = "product-card";

   card.innerHTML = `
  <img class="card-image" src="${p.images[0] || ""}">
  <h3>${p.title}</h3>
  <strong>R$ ${Number(p.price).toFixed(2)}</strong>

  <a 
    class="whats-btn"
    href="https://wa.me/5511999999999?text=Tenho interesse no produto: ${encodeURIComponent(p.title)}"
    target="_blank"
  >
    Mandar no WhatsApp
  </a>
`;

    card.onclick = () => openDetails(p.id);
    list.appendChild(card);
  });
}

renderProducts();

/* ADD PRODUCT */
document.getElementById("addProductBtn").onclick = () => {
  modal.classList.remove("hidden");
};

document.getElementById("closeModalBtn").onclick = () => {
  modal.classList.add("hidden");
};

document.getElementById("saveProductBtn").onclick = async () => {
  let title = document.getElementById("pTitle").value;
  let price = document.getElementById("pPrice").value;
  let cat = document.getElementById("pCategory").value;
  let desc = document.getElementById("pDesc").value;

  const files = Array.from(document.getElementById("pImages").files);
  const images = [];

  for (let f of files) {
    images.push(await fileToBase64(f));
  }

  products.push({
    id: crypto.randomUUID(),
    title,
    price,
    category: cat,
    description: desc,
    images
  });

  saveProducts(products);
  renderProducts();
  modal.classList.add("hidden");
};

function fileToBase64(file) {
  return new Promise(resolve => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.readAsDataURL(file);
  });
}

/* DETAILS */
function openDetails(id) {
  const p = products.find(x => x.id === id);

  detailModal.classList.remove("hidden");

  document.getElementById("detailContent").innerHTML = `
    <h2>${p.title}</h2>
    <img src="${p.images[0] || ""}" style="width:100%;border-radius:10px;">
    <p>${p.description}</p>
    <strong>R$ ${Number(p.price).toFixed(2)}</strong>
    <br><br>
    <a href="https://wa.me/5511999999999?text=Tenho interesse em ${encodeURIComponent(p.title)}">
      <button>WhatsApp</button>
    </a>
    ${
      isAdmin
        ? `<button onclick="deleteProduct('${p.id}')">Excluir</button>`
        : ""
    }
    <button onclick="detailModal.classList.add('hidden')">Fechar</button>
  `;
}

/* DELETE */
function deleteProduct(id) {
  products = products.filter(p => p.id !== id);
  saveProducts(products);
  renderProducts();
  detailModal.classList.add("hidden");
}