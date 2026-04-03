let products = [
    { name: "Lipstick", price: 299, image: "images/lipstick.jpg" },
    { name: "Face Wash", price: 199, image: "images/face wash.jpg" },
    { name: "Perfume", price: 499, image: "images/Perfume.jpg" },
    { name: "Serum", price: 399, image: "images/Serum.jpg" },
    { name: "Foundation", price: 599, image: "images/Foundation.jpg" },
    { name: "Compact Powder", price: 249, image: "images/Compact Powder.jpg" }
];

let cartCount = 0;
let cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
let totalPrice = parseInt(localStorage.getItem("totalPrice")) || 0;

function loadProducts() {
    let productList = document.getElementById("product-list");
    productList.innerHTML = "";

    products.forEach(product => {
        let div = document.createElement("div");
        div.className = "product";

        div.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p>${product.price}</p>
            <button onclick="addToCart('${product.name}', ${product.price})">
                Add to Cart
            </button>
        `;

        productList.appendChild(div);
    });
}
function addToCart(name, price) {

    let existing = cartItems.find(item => item.name === name);

    if (existing) {
        existing.qty++;
    } else {
        cartItems.push({ name, price, qty: 1 });
    }

    totalPrice += price;

    localStorage.setItem("cartItems", JSON.stringify(cartItems));
    localStorage.setItem("totalPrice", totalPrice);

    updateCart();
}
function updateCart() {
    let cartList = document.getElementById("cart-items");
    cartList.innerHTML = "";

    totalPrice = 0;

    cartItems.forEach((item, index) => {

        totalPrice += item.price * item.qty;

        let li = document.createElement("li");

        li.innerHTML = `
            ${item.name} - ₹${item.price} × ${item.qty}

            <button onclick="increaseQty(${index})">+</button>
            <button onclick="decreaseQty(${index})">-</button>
            <button onclick="removeItem(${index})">❌</button>
        `;

        cartList.appendChild(li);
    });

    document.getElementById("cart-count").innerText = cartItems.length;
    document.getElementById("total-price").innerText = totalPrice;

    localStorage.setItem("cartItems", JSON.stringify(cartItems));
    localStorage.setItem("totalPrice", totalPrice);
}

function showCart() {
    let cartSection = document.getElementById("cart-section");
    let cartList = document.getElementById("cart-items");

    cartSection.style.display = "block";
    cartList.innerHTML = "";

    cartItems.forEach(item => {
        let li = document.createElement("li");
        li.innerText = item;
        cartList.appendChild(li);
    });
}

function clearCart() {
    cartItems = [];
    cartCount = 0;
    totalPrice = 0;

    localStorage.removeItem("cartItems");
    localStorage.removeItem("totalPrice");

    document.getElementById("cart-count").innerText = 0;
    document.getElementById("cart-items").innerHTML = "";
    document.getElementById("total-price").innerText = 0;
}
window.onload = function () {
    loadProducts();

    cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
    totalPrice = parseInt(localStorage.getItem("totalPrice")) || 0;

    updateCart();
};
function payNow() {
    let upiID = "ratan90422@barodampay";
    let name = "Sree Cosmetics";
    let amount = totalPrice;

    let url =
    'upi://pay?pa=${upiID}&pn=${name}&am=${amount}&cu=INR';

    window.location.href = url;
}
function payNow() {
    if (totalPrice === 0) {
        alert("Cart is empty!");
        return;
    }

    let upiID = "ratan90422@barodampay";
    let name = "Sree Cosmetics";
    let amount = totalPrice;

    let url = `upi://pay?pa=${upiID}&pn=${name}&am=${amount}&cu=INR`;

    window.location.href = url;
}
function generateQR() {

    let upiID = "ratan90422@barodampay";
    let name = "Sree Cosmetics";
    let amount = totalPrice;

    let upiURL = `upi://pay?pa=${upiID}&pn=${name}&am=${amount}&cu=INR`;

    let qrURL = "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=" 
                + encodeURIComponent(upiURL);

    document.getElementById("upi-qr").src = qrURL;
    document.getElementById("payment-box").style.display = "block";

}
function handlePayment() {

    if (totalPrice === 0) {
        alert("Cart is empty!");
        return;
    }

    let upiID = "ratan90422@barodampay";
    let name = "Sree Cosmetics";
    let amount = totalPrice;

    let upiURL = `upi://pay?pa=${upiID}&pn=${name}&am=${amount}&cu=INR`;

    // ❌ don't redirect for now
    // window.location.href = upiURL;

   let qrURL = "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=" 
            + encodeURIComponent(upiURL);

console.log(qrURL); // DEBUG

document.getElementById("upi-qr").src = qrURL;
document.getElementById("payment-box").style.display = "block";
}
function increaseQty(index) {
    cartItems[index].qty++;
    updateCart();
}
function decreaseQty(index) {
    if (cartItems[index].qty > 1) {
        cartItems[index].qty--;
    } else {
        cartItems.splice(index, 1);
    }
    updateCart();
}
function removeItem(index) {
    cartItems.splice(index, 1);
    updateCart();
}
function searchProducts() {
    let input = document.getElementById("search").value.toLowerCase();

    let filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(input)
    );

    displayProducts(filteredProducts);
}
function displayProducts(productList) {
    let productListDiv = document.getElementById("product-list");
    productListDiv.innerHTML = "";

    productList.forEach(product => {
        let div = document.createElement("div");
        div.className = "product";

        div.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p style="color: green; font-weight: bold;">₹${product.price}</p>
            <button onclick="addToCart('${product.name}', ${product.price})">
                Add to Cart 🛒
            </button>
        `;

        productListDiv.appendChild(div);
    });
}
function loadProducts() {
    displayProducts(products);
}
function filterProducts(category) {

    if (category === "all") {
        displayProducts(products);
        return;
    }

    let filtered = products.filter(product =>
        product.name.toLowerCase().includes(category)
    );

    displayProducts(filtered);
}
