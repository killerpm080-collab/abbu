const STORAGE_KEYS = {
  orders: 'stickerflow-orders',
  products: 'stickerflow-products',
  settings: 'stickerflow-settings',
  session: 'stickerflow-admin-session'
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

function productMap() {
  return Object.fromEntries(readStorage(STORAGE_KEYS.products, []).map((product) => [product.id, product]));
}

function showMessage(id, text, isError = false) {
  const node = document.getElementById(id);
  node.className = isError ? 'message error' : 'message';
  node.textContent = text;
  node.classList.remove('hide');
}

function renderDashboard() {
  const orders = readStorage(STORAGE_KEYS.orders, []);
  const products = productMap();
  const totalRevenue = orders.reduce((sum, order) => sum + Number(order.amount || 0), 0);
  const awaiting = orders.filter((order) => order.status === 'Awaiting Payment Proof').length;
  const paid = orders.filter((order) => order.status === 'Paid').length;

  document.getElementById('total-orders').textContent = orders.length;
  document.getElementById('total-revenue').textContent = money(totalRevenue);
  document.getElementById('awaiting-orders').textContent = awaiting;
  document.getElementById('paid-orders').textContent = paid;

  document.getElementById('orders-table').innerHTML = orders
    .map((order, index) => {
      const product = products[order.productId];
      const statusClass = order.status === 'Paid' ? 'status-paid' : order.status === 'Awaiting Payment Proof' ? 'status-awaiting' : 'status-review';
      return `
        <tr>
          <td><strong>${order.id}</strong><div class="muted">${order.date}</div></td>
          <td>${order.customer}<div class="muted">${order.email || 'No email saved'}</div></td>
          <td>${product ? product.name : order.productId}<div class="muted">Qty ${order.qty}</div></td>
          <td>${money(order.amount)}</td>
          <td>${order.paymentPlatform}</td>
          <td><span class="status-pill ${statusClass}">${order.status}</span></td>
          <td>${order.payoutRoute}</td>
          <td>
            <select data-order-index="${index}" class="order-status-select">
              <option ${order.status === 'Awaiting Payment Proof' ? 'selected' : ''}>Awaiting Payment Proof</option>
              <option ${order.status === 'In Review' ? 'selected' : ''}>In Review</option>
              <option ${order.status === 'Paid' ? 'selected' : ''}>Paid</option>
              <option ${order.status === 'In Production' ? 'selected' : ''}>In Production</option>
              <option ${order.status === 'Shipped' ? 'selected' : ''}>Shipped</option>
            </select>
          </td>
        </tr>
      `;
    })
    .join('');

  document.querySelectorAll('.order-status-select').forEach((select) => {
    select.addEventListener('change', (event) => {
      const items = readStorage(STORAGE_KEYS.orders, []);
      const order = items[Number(event.target.dataset.orderIndex)];
      order.status = event.target.value;
      if (order.status === 'Paid') {
        order.payoutRoute = 'Paid out to Payoneer';
      } else if (order.status === 'Awaiting Payment Proof') {
        order.payoutRoute = 'Payoneer settlement queue';
      } else {
        order.payoutRoute = 'Under admin review';
      }
      writeStorage(STORAGE_KEYS.orders, items);
      renderDashboard();
    });
  });
}

function loadSettings() {
  const settings = readStorage(STORAGE_KEYS.settings, window.STICKER_DATA.payoneer);
  const form = document.getElementById('settings-form');
  form.accountName.value = settings.accountName;
  form.email.value = settings.email;
  form.note.value = settings.note;
}

function setupForms() {
  const settingsForm = document.getElementById('settings-form');
  settingsForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(settingsForm);
    const settings = Object.fromEntries(formData.entries());
    writeStorage(STORAGE_KEYS.settings, settings);
    showMessage('settings-message', 'Payoneer instructions updated successfully.');
  });

  const productForm = document.getElementById('product-form');
  productForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(productForm);
    const products = readStorage(STORAGE_KEYS.products, []);
    const product = {
      id: String(formData.get('name')).toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      name: formData.get('name'),
      category: formData.get('category'),
      price: Number(formData.get('price')),
      badge: formData.get('badge'),
      description: formData.get('description'),
      features: String(formData.get('features')).split(',').map((item) => item.trim()).filter(Boolean)
    };
    products.unshift(product);
    writeStorage(STORAGE_KEYS.products, products);
    productForm.reset();
    showMessage('product-message', `Product ${product.name} added to storefront data.`);
  });
}

function showDashboard() {
  document.getElementById('login-view').classList.add('hide');
  document.getElementById('dashboard-view').classList.remove('hide');
  loadSettings();
  renderDashboard();
  setupForms();
}

function setupLogin() {
  const session = readStorage(STORAGE_KEYS.session, false);
  if (session) {
    showDashboard();
    return;
  }

  document.getElementById('login-form').addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const { username, password } = Object.fromEntries(formData.entries());
    const creds = window.STICKER_DATA.adminCredentials;
    if (username === creds.username && password === creds.password) {
      writeStorage(STORAGE_KEYS.session, true);
      showDashboard();
      return;
    }

    showMessage('login-message', 'Invalid credentials. Use the demo login shown in the placeholders.', true);
  });
}

ensureSeedData();
setupLogin();
