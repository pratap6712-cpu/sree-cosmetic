let products = [
    { name: "Lipstick", price: 299, image: "images/lipstick.jpg" },
    { name: "Face Wash", price: 199, image: "images/face-wash.jpg" },
    { name: "Perfume", price: 499, image: "images/perfume.jpg" },
    { name: "Serum", price: 399, image: "images/serum.jpg" },
    { name: "Foundation", price: 599, image: "images/foundation.jpg" },
    { name: "Compact Powder", price: 249, image: "images/compact-powder.jpg" }
];

let cartCount = 0;
let cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
let totalPrice = parseInt(localStorage.getItem("totalPrice")) || 0;

const SUPABASE_URL = "https://mdptetvirfxfhfpjylkk.supabase.co";
const SUPABASE_KEY = "sb_publishable_BvNM859TFgKaPOKV99ds9A_Qigy8-Jp";

const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);

function loadProducts() {
    let productList = document.getElementById("product-list");
    productList.innerHTML = "";

    products.forEach(product => {
        let div = document.createElement("div");
        div.className = "product";

        div.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p><strong>Rs ${product.price}</strong></p>
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
        cartItems.push({ name, price: Number(price), qty: 1 });
    }

    localStorage.setItem("cartItems", JSON.stringify(cartItems));
    updateCart();
}

function updateCart() {
    let cartList = document.getElementById("cart-items");
    cartList.innerHTML = "";

    let total = 0;

    cartItems.forEach((item, index) => {
        total += parseInt(item.price) * parseInt(item.qty);

        let li = document.createElement("li");
        li.innerHTML = `
<div>
    <strong>${item.name}</strong><br>
    Rs ${item.price} × ${item.qty}
</div>
<div>
    <button onclick="increaseQty(${index})">+</button>
    <button onclick="decreaseQty(${index})">-</button>
    <button onclick="removeItem(${index})">x</button>
</div>
`;

        cartList.appendChild(li);
    });

    const countElement = document.getElementById("cart-count");
    if (countElement) {
        countElement.innerText = cartItems.length;
    }

    totalPrice = total;
    document.getElementById("total-price").innerText = total;

    localStorage.setItem("cartItems", JSON.stringify(cartItems));
    localStorage.setItem("totalPrice", total);
}

function showCart() {
    let cartSection = document.getElementById("cart-section");
    let cartList = document.getElementById("cart-items");

    cartSection.style.display = "block";
    cartList.innerHTML = "";

    cartItems.forEach(item => {
        let li = document.createElement("li");
        li.innerText = `${item.name} - Rs ${item.price} × ${item.qty}`;
        cartList.appendChild(li);
    });
}

function clearCart() {
    cartItems = [];
    totalPrice = 0;

    localStorage.removeItem("cartItems");
    localStorage.removeItem("totalPrice");

    const countElement = document.getElementById("cart-count");
    if (countElement) {
        countElement.innerText = 0;
    }
    document.getElementById("cart-items").innerHTML = "";
    document.getElementById("total-price").innerText = 0;
}

window.onload = function () {
    cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
    totalPrice = parseInt(localStorage.getItem("totalPrice")) || 0;

    if (document.getElementById("product-list")) {
        loadProducts();
    }

    if (document.getElementById("cart-items")) {
        updateCart();
    }
};

function payNow() {
    if (totalPrice === 0) {
        alert("Cart is empty!");
        return;
    }

    let customerName = document.getElementById("customer-name").value;
    let phone = document.getElementById("customer-phone").value;
    let address = document.getElementById("customer-address").value;

    if (!customerName || !phone || !address) {
        alert("Please fill all customer details");
        return;
    }

    let upiID = "ratan90422@barodampay";
    let storeName = "Sree Cosmetics";
    let amount = totalPrice;

    let url = `upi://pay?pa=${upiID}&pn=${storeName}&am=${amount}&cu=INR`;
    window.location.href = url;
}

async function paymentSuccess() {

    let customerName = localStorage.getItem("customerName") || "";
    let customerPhone = localStorage.getItem("customerPhone") || "";
    let customerAddress = localStorage.getItem("customerAddress") || "";
    let customerCity = localStorage.getItem("customerCity") || "";
    let customerPincode = localStorage.getItem("customerPincode") || "";

    console.log("CART ITEMS BEFORE ORDER:", cartItems);

    let order = {
        orderId: "ORD" + Date.now(),
        customerName: customerName,
        customerPhone: customerPhone,
        customerAddress: customerAddress,
        customerCity: customerCity,
        customerPincode: customerPincode,
        total: totalPrice,
        items: cartItems
    };
const { error } = await supabaseClient
    .from("orders")
    .insert([{
        order_id: order.orderId,
        customer_name: order.customerName,
        customer_phone: order.customerPhone,
        customer_address: order.customerAddress,
        customer_city: order.customerCity,
        customer_pincode: order.customerPincode,
        total: order.total,
        products: order.items,
        status: "New Order"
    }]);

if (error) {
    console.error("Supabase order error:", error);
    alert("Order saved locally, but could not be sent to the server.");
} else {
    console.log("Order successfully saved to Supabase!");
}
    localStorage.setItem("lastOrder", JSON.stringify(order));
let orders = JSON.parse(localStorage.getItem("orders")) || [];

orders.push(order);

localStorage.setItem("orders", JSON.stringify(orders));
    localStorage.removeItem("cartItems");
    localStorage.removeItem("totalPrice");

    window.location.href = "success.html";
}

function generateQR() {
    let customerName = document.getElementById("customer-name").value;
let customerPhone = document.getElementById("customer-phone").value;
let customerAddress = document.getElementById("customer-address").value;

if (
    customerName.trim() === "" ||
    customerPhone.trim() === "" ||
    customerAddress.trim() === ""
) {
    alert("Please fill all customer details");
    return;
}
    let upiID = "ratan90422@barodampay";
    let storeName = "Sree Cosmetics";
    let amount = totalPrice;

    let upiURL = `upi://pay?pa=${upiID}&pn=${storeName}&am=${amount}&cu=INR`;
    let qrURL = "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=" + encodeURIComponent(upiURL);

    document.getElementById("upi-qr").src = qrURL;
    document.getElementById("payment-box").style.display = "block";
}

function handlePayment() {

    if (totalPrice === 0) {
        alert("Cart is empty!");
        return;
    }

    let customerName = document.getElementById("customer-name").value.trim();
    let customerPhone = document.getElementById("customer-phone").value.trim();
    let customerAddress = document.getElementById("customer-address").value.trim();
    let customerCity = document.getElementById("customer-city").value.trim();
    let customerPin = document.getElementById("customer-pincode").value.trim();

    if (customerName === "") {
        alert("Please enter your name.");
        return;
    }

    if (customerPhone === "") {
        alert("Please enter your mobile number.");
        return;
    }

    if (customerAddress === "") {
        alert("Please enter your delivery address.");
        return;
    }

    if (customerCity === "") {
        alert("Please enter your city.");
        return;
    }

    if (!/^\d{6}$/.test(customerPin)) {
        alert("Please enter a valid 6-digit PIN Code.");
        return;
    }
localStorage.setItem("customerName", customerName);
localStorage.setItem("customerPhone", customerPhone);
localStorage.setItem("customerAddress", customerAddress);
localStorage.setItem("customerCity", customerCity);
localStorage.setItem("customerPincode", customerPin);
    let upiID = "ratan90422@barodampay";
    let storeName = "Sree Cosmetics";
    let amount = totalPrice;

    let upiURL =
        `upi://pay?pa=${upiID}&pn=${storeName}&am=${amount}&cu=INR`;

    let qrURL =
        "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=" +
        encodeURIComponent(upiURL);

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
            <p style="color: green; font-weight: bold;">Rs ${product.price}</p>
            <button onclick="addToCart('${product.name}', ${product.price})">
                Add to cart 
            </button>
        `;

        productListDiv.appendChild(div);
    });
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
