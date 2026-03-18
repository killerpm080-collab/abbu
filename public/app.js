const STORAGE_KEYS = {
  orders: 'stickerflow-orders',
  products: 'stickerflow-products',
  settings: 'stickerflow-settings'
};

function readStorage(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (error) {
    return fallback;
  }
}

function writeStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function ensureSeedData() {
  if (!readStorage(STORAGE_KEYS.products, null)) {
    writeStorage(STORAGE_KEYS.products, window.STICKER_DATA.products);
  }

  if (!readStorage(STORAGE_KEYS.orders, null)) {
    writeStorage(STORAGE_KEYS.orders, window.STICKER_DATA.seedOrders);
  }

  if (!readStorage(STORAGE_KEYS.settings, null)) {
    writeStorage(STORAGE_KEYS.settings, window.STICKER_DATA.payoneer);
  }
}

function money(value) {
  return `$${Number(value).toFixed(0)}`;
}

function renderHeroMetrics() {
  const metrics = window.STICKER_DATA.metrics;
  const target = document.getElementById('hero-metrics');
  target.innerHTML = `
    <div class="kpi-card"><strong>${metrics.turnaround}</strong><span class="muted">Typical turnaround</span></div>
    <div class="kpi-card"><strong>${metrics.satisfaction}</strong><span class="muted">Happy clients</span></div>
    <div class="kpi-card"><strong>${metrics.countries}</strong><span class="muted">Markets served</span></div>
  `;
}

function getProducts() {
  return readStorage(STORAGE_KEYS.products, window.STICKER_DATA.products);
}

function renderProducts() {
  const productGrid = document.getElementById('product-grid');
  const select = document.getElementById('product-select');
  const products = getProducts();

  productGrid.innerHTML = products
    .map(
      (product) => `
        <article class="product-card">
          <header>
            <div>
              <div class="badge">${product.badge}</div>
              <h3 style="margin-top:0.8rem;">${product.name}</h3>
              <div class="meta">${product.category}</div>
            </div>
            <div class="price">${money(product.price)}</div>
          </header>
          <p class="muted">${product.description}</p>
          <ul class="list">
            ${product.features.map((feature) => `<li>${feature}</li>`).join('')}
          </ul>
          <div class="inline-actions" style="margin-top:1rem;">
            <button class="button button-secondary" data-product="${product.id}">Choose pack</button>
          </div>
        </article>
      `
    )
    .join('');

  select.innerHTML = products
    .map((product) => `<option value="${product.id}">${product.name} — ${money(product.price)}</option>`)
    .join('');

  productGrid.querySelectorAll('[data-product]').forEach((button) => {
    button.addEventListener('click', () => {
      select.value = button.dataset.product;
      updateSummary();
      document.getElementById('checkout').scrollIntoView({ behavior: 'smooth' });
    });
  });
}

function updateSummary() {
  const products = getProducts();
  const selected = products.find((product) => product.id === document.getElementById('product-select').value) || products[0];
  document.getElementById('summary-product').textContent = selected.name;
  document.getElementById('summary-price').textContent = money(selected.price);
}

function renderPayoneerNotice() {
  const settings = readStorage(STORAGE_KEYS.settings, window.STICKER_DATA.payoneer);
  document.getElementById('payoneer-note').textContent = `${settings.note} Primary account: ${settings.accountName} (${settings.email}).`;
}

function setupOrderForm() {
  const form = document.getElementById('order-form');
  const select = document.getElementById('product-select');
  const message = document.getElementById('order-message');

  select.addEventListener('change', updateSummary);

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const formData = new FormData(form);
    const products = getProducts();
    const product = products.find((item) => item.id === formData.get('productId'));
    const qty = Number(formData.get('qty'));
    const amount = product.price * qty;
    const order = {
      id: `ORD-${Math.floor(Date.now() / 1000)}`,
      customer: formData.get('customer'),
      email: formData.get('email'),
      productId: product.id,
      qty,
      amount,
      paymentPlatform: formData.get('paymentPlatform'),
      deadline: formData.get('deadline') || 'Flexible',
      notes: formData.get('notes'),
      status: 'Awaiting Payment Proof',
      payoutRoute: 'Payoneer settlement queue',
      date: new Date().toISOString().slice(0, 10)
    };

    const orders = readStorage(STORAGE_KEYS.orders, []);
    orders.unshift(order);
    writeStorage(STORAGE_KEYS.orders, orders);

    message.className = 'message';
    message.textContent = `Order ${order.id} saved. Ask the customer to complete payment via ${order.paymentPlatform}, then confirm it from the admin panel and reconcile it through your Payoneer workflow.`;
    message.classList.remove('hide');
    form.reset();
    select.value = product.id;
    updateSummary();
  });
}

ensureSeedData();
renderHeroMetrics();
renderProducts();
renderPayoneerNotice();
updateSummary();
setupOrderForm();
