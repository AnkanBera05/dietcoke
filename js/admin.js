/**
 * DIET COKE BRAND ADMIN DASHBOARD CONTROLLER
 * Full management suite: Authentication, Product Catalog CRUD,
 * Site Copy Editor, Live Telemetry Metrics, Brand Defaults Reset.
 */

class DietCokeAdminApp {
    constructor() {
        this.token = localStorage.getItem('dc_admin_token') || null;
        this.currentTab = 'products';
        this.products = [];
        this.content = {};
        this.editingProductId = null;

        this.init();
    }

    async init() {
        this.setupEventListeners();
        await this.checkAuth();
    }

    setupEventListeners() {
        // Login form
        const loginForm = document.getElementById('adminLoginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        }

        // Logout button
        const logoutBtn = document.getElementById('adminLogoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => this.handleLogout());
        }

        // Tab switches
        const tabBtns = document.querySelectorAll('.admin-nav-tab');
        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const target = btn.getAttribute('data-tab');
                this.switchTab(target);
            });
        });

        // Content form submit
        const contentForm = document.getElementById('siteContentForm');
        if (contentForm) {
            contentForm.addEventListener('submit', (e) => this.handleSaveContent(e));
        }

        // Product Modal open/close
        const openAddProductBtn = document.getElementById('openAddProductBtn');
        if (openAddProductBtn) {
            openAddProductBtn.addEventListener('click', () => this.openProductModal());
        }

        const closeProductModalBtn = document.getElementById('closeProductModalBtn');
        if (closeProductModalBtn) {
            closeProductModalBtn.addEventListener('click', () => this.closeProductModal());
        }

        const productForm = document.getElementById('productForm');
        if (productForm) {
            productForm.addEventListener('submit', (e) => this.handleSaveProduct(e));
        }

        // Change password form
        const changePwdForm = document.getElementById('changePasswordForm');
        if (changePwdForm) {
            changePwdForm.addEventListener('submit', (e) => this.handleChangePassword(e));
        }

        // Reset defaults button
        const resetBtn = document.getElementById('resetDefaultsBtn');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => this.handleResetDefaults());
        }

        // Refresh analytics
        const refreshStatsBtn = document.getElementById('refreshAnalyticsBtn');
        if (refreshStatsBtn) {
            refreshStatsBtn.addEventListener('click', () => this.loadTelemetry());
        }
    }

    async checkAuth() {
        if (!this.token) {
            this.showLoginModal(true);
            return;
        }

        try {
            const resp = await fetch('/api/auth/verify', {
                headers: { 'X-Admin-Token': this.token }
            });
            const data = await resp.json();
            if (data.authenticated) {
                this.showLoginModal(false);
                this.loadDashboardData();
            } else {
                this.token = null;
                localStorage.removeItem('dc_admin_token');
                this.showLoginModal(true);
            }
        } catch (e) {
            this.showLoginModal(true);
        }
    }

    showLoginModal(show) {
        const loginOverlay = document.getElementById('loginOverlay');
        const dashboardMain = document.getElementById('dashboardMain');
        if (loginOverlay) loginOverlay.style.display = show ? 'flex' : 'none';
        if (dashboardMain) dashboardMain.style.display = show ? 'none' : 'block';
    }

    async handleLogin(e) {
        e.preventDefault();
        const userInp = document.getElementById('loginUsername').value;
        const pwdInp = document.getElementById('loginPassword').value;
        const errorElem = document.getElementById('loginError');

        try {
            const resp = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: userInp, password: pwdInp })
            });
            const data = await resp.json();
            if (data.success && data.token) {
                this.token = data.token;
                localStorage.setItem('dc_admin_token', data.token);
                if (errorElem) errorElem.textContent = '';
                this.showLoginModal(false);
                this.showToast('Authentication successful', 'success');
                this.loadDashboardData();
            } else {
                if (errorElem) errorElem.textContent = data.message || 'Login failed';
            }
        } catch (err) {
            if (errorElem) errorElem.textContent = 'Server connection error';
        }
    }

    async handleLogout() {
        if (this.token) {
            fetch('/api/auth/logout', {
                method: 'POST',
                headers: { 'X-Admin-Token': this.token }
            }).catch(() => {});
        }
        this.token = null;
        localStorage.removeItem('dc_admin_token');
        this.showLoginModal(true);
        this.showToast('Logged out', 'info');
    }

    switchTab(tabId) {
        this.currentTab = tabId;
        const tabBtns = document.querySelectorAll('.admin-nav-tab');
        tabBtns.forEach(b => b.classList.toggle('active', b.getAttribute('data-tab') === tabId));

        const tabPanes = document.querySelectorAll('.admin-tab-pane');
        tabPanes.forEach(pane => {
            pane.classList.toggle('active', pane.id === `tab-${tabId}`);
        });

        if (tabId === 'analytics') {
            this.loadTelemetry();
        }
    }

    async loadDashboardData() {
        await Promise.all([
            this.loadProducts(),
            this.loadSiteContent(),
            this.loadTelemetry()
        ]);
    }

    async loadProducts() {
        try {
            const resp = await fetch('/api/admin/products', {
                headers: { 'X-Admin-Token': this.token }
            });
            if (!resp.ok) return;
            this.products = await resp.json();
            this.renderProductsTable();
        } catch (e) {
            this.showToast('Error loading products', 'error');
        }
    }

    renderProductsTable() {
        const tbody = document.getElementById('productsTableBody');
        if (!tbody) return;
        tbody.innerHTML = '';

        this.products.forEach(p => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>
                    <div class="table-product-cell">
                        <span class="color-swatch" style="background:${p.accent_color}; box-shadow:0 0 10px ${p.accent_color};"></span>
                        <div>
                            <strong>${p.name}</strong>
                            <div class="product-slug-text">/${p.slug}</div>
                        </div>
                    </div>
                </td>
                <td><span class="admin-badge" style="border-color:${p.accent_color}; color:${p.accent_color}">${p.badge}</span></td>
                <td>${p.calories} cal / ${p.sugar}</td>
                <td>${p.sort_order}</td>
                <td>
                    <span class="status-indicator ${p.is_active ? 'active' : 'inactive'}">
                        ${p.is_active ? 'Active' : 'Disabled'}
                    </span>
                </td>
                <td>
                    <div class="table-actions">
                        <button class="action-btn edit-btn" onclick="adminApp.openProductModal(${p.id})">Edit</button>
                        <button class="action-btn delete-btn" onclick="adminApp.deleteProduct(${p.id})">Delete</button>
                    </div>
                </td>
            `;
            tbody.appendChild(tr);
        });
    }

    openProductModal(id = null) {
        this.editingProductId = id;
        const modal = document.getElementById('productModal');
        const title = document.getElementById('productModalTitle');
        const form = document.getElementById('productForm');

        if (!modal || !form) return;

        if (id) {
            title.textContent = 'Edit Flavor / Product';
            const prod = this.products.find(p => p.id === id);
            if (prod) {
                document.getElementById('prodName').value = prod.name;
                document.getElementById('prodSlug').value = prod.slug;
                document.getElementById('prodTagline').value = prod.tagline || '';
                document.getElementById('prodAccentColor').value = prod.accent_color;
                document.getElementById('prodSecondaryColor').value = prod.accent_secondary || '#880000';
                document.getElementById('prodBadge').value = prod.badge || '';
                document.getElementById('prodCalories').value = prod.calories;
                document.getElementById('prodSugar').value = prod.sugar;
                document.getElementById('prodCaffeine').value = prod.caffeine || '46mg';
                document.getElementById('prodVolume').value = prod.volume || '355 mL';
                document.getElementById('prodDesc').value = prod.description || '';
                document.getElementById('prodTasteNotes').value = (prod.taste_notes || []).join(', ');
                document.getElementById('prodSortOrder').value = prod.sort_order;
                document.getElementById('prodIsActive').checked = prod.is_active === 1;
            }
        } else {
            title.textContent = 'Add New Flavor / Product';
            form.reset();
            document.getElementById('prodAccentColor').value = '#E4002B';
            document.getElementById('prodSecondaryColor').value = '#B00020';
            document.getElementById('prodCalories').value = '0';
            document.getElementById('prodSugar').value = '0g';
            document.getElementById('prodSortOrder').value = this.products.length + 1;
            document.getElementById('prodIsActive').checked = true;
        }

        modal.style.display = 'flex';
    }

    closeProductModal() {
        const modal = document.getElementById('productModal');
        if (modal) modal.style.display = 'none';
        this.editingProductId = null;
    }

    async handleSaveProduct(e) {
        e.preventDefault();

        const notesRaw = document.getElementById('prodTasteNotes').value;
        const notesArr = notesRaw.split(',').map(s => s.trim()).filter(Boolean);

        const payload = {
            slug: document.getElementById('prodSlug').value.trim(),
            name: document.getElementById('prodName').value.trim(),
            tagline: document.getElementById('prodTagline').value.trim(),
            accent_color: document.getElementById('prodAccentColor').value,
            accent_secondary: document.getElementById('prodSecondaryColor').value,
            badge: document.getElementById('prodBadge').value.trim() || 'DIET COKE',
            calories: parseInt(document.getElementById('prodCalories').value) || 0,
            sugar: document.getElementById('prodSugar').value.trim() || '0g',
            caffeine: document.getElementById('prodCaffeine').value.trim() || '46mg',
            volume: document.getElementById('prodVolume').value.trim() || '355 mL / 12 FL OZ',
            description: document.getElementById('prodDesc').value.trim(),
            taste_notes: notesArr,
            sort_order: parseInt(document.getElementById('prodSortOrder').value) || 1,
            is_active: document.getElementById('prodIsActive').checked ? 1 : 0,
            is_featured: 1
        };

        const isEdit = this.editingProductId !== null;
        const url = isEdit ? `/api/admin/products/${this.editingProductId}` : '/api/admin/products';
        const method = isEdit ? 'PUT' : 'POST';

        try {
            const resp = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    'X-Admin-Token': this.token
                },
                body: JSON.stringify(payload)
            });
            const data = await resp.json();
            if (resp.ok) {
                this.showToast(data.message || 'Product saved successfully', 'success');
                this.closeProductModal();
                await this.loadProducts();
            } else {
                this.showToast(data.detail || 'Error saving product', 'error');
            }
        } catch (err) {
            this.showToast('Network error saving product', 'error');
        }
    }

    async deleteProduct(id) {
        if (!confirm('Are you sure you want to delete this flavor?')) return;

        try {
            const resp = await fetch(`/api/admin/products/${id}`, {
                method: 'DELETE',
                headers: { 'X-Admin-Token': this.token }
            });
            if (resp.ok) {
                this.showToast('Product deleted', 'success');
                await this.loadProducts();
            } else {
                this.showToast('Could not delete product', 'error');
            }
        } catch (e) {
            this.showToast('Error deleting product', 'error');
        }
    }

    async loadSiteContent() {
        try {
            const resp = await fetch('/api/admin/content', {
                headers: { 'X-Admin-Token': this.token }
            });
            if (!resp.ok) return;
            this.content = await resp.json();

            // Populate form fields
            for (const [key, val] of Object.entries(this.content)) {
                const elem = document.getElementById(`content_${key}`);
                if (elem) elem.value = val;
            }
        } catch (e) {
            this.showToast('Error loading content', 'error');
        }
    }

    async handleSaveContent(e) {
        e.preventDefault();
        const form = document.getElementById('siteContentForm');
        const formData = new FormData(form);
        const contentUpdates = {};

        for (const [key, val] of formData.entries()) {
            contentUpdates[key] = val;
        }

        try {
            const resp = await fetch('/api/admin/content', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Admin-Token': this.token
                },
                body: JSON.stringify({ content: contentUpdates })
            });
            const data = await resp.json();
            if (resp.ok) {
                this.showToast('Site content updated and published live!', 'success');
            } else {
                this.showToast(data.detail || 'Could not update content', 'error');
            }
        } catch (e) {
            this.showToast('Network error saving content', 'error');
        }
    }

    async loadTelemetry() {
        try {
            const resp = await fetch('/api/admin/telemetry', {
                headers: { 'X-Admin-Token': this.token }
            });
            if (!resp.ok) return;
            const data = await resp.json();

            const metricVisits = document.getElementById('metricVisits');
            const metricPops = document.getElementById('metricCanPops');
            const metricSound = document.getElementById('metricSound');
            const metricEngage = document.getElementById('metricEngagement');

            if (metricVisits) metricVisits.textContent = Number(data.visits).toLocaleString();
            if (metricPops) metricPops.textContent = Number(data.can_pops).toLocaleString();
            if (metricSound) metricSound.textContent = Number(data.sound_toggles).toLocaleString();
            if (metricEngage) metricEngage.textContent = `${data.engagement_rate}%`;

            // Render flavor popularity chart
            this.renderFlavorPopularity(data.flavor_clicks || {});
        } catch (e) {}
    }

    renderFlavorPopularity(flavorClicks) {
        const chartContainer = document.getElementById('flavorPopularityChart');
        if (!chartContainer) return;
        chartContainer.innerHTML = '';

        const maxClicks = Math.max(...Object.values(flavorClicks), 1);

        for (const [flavor, count] of Object.entries(flavorClicks)) {
            const pct = Math.round((count / maxClicks) * 100);
            const row = document.createElement('div');
            row.className = 'chart-bar-row';
            row.innerHTML = `
                <div class="chart-label">${flavor.toUpperCase()}</div>
                <div class="chart-track">
                    <div class="chart-fill" style="width: ${pct}%;"></div>
                </div>
                <div class="chart-val">${count} clicks</div>
            `;
            chartContainer.appendChild(row);
        }
    }

    async handleChangePassword(e) {
        e.preventDefault();
        const curPwd = document.getElementById('curPassword').value;
        const newPwd = document.getElementById('newPassword').value;

        try {
            const resp = await fetch('/api/auth/change-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Admin-Token': this.token
                },
                body: JSON.stringify({ current_password: curPwd, new_password: newPwd })
            });
            const data = await resp.json();
            if (resp.ok) {
                this.showToast('Password changed successfully', 'success');
                document.getElementById('changePasswordForm').reset();
            } else {
                this.showToast(data.detail || 'Password change failed', 'error');
            }
        } catch (e) {
            this.showToast('Error changing password', 'error');
        }
    }

    async handleResetDefaults() {
        if (!confirm('RESET ALL CONTENT & PRODUCTS TO BRAND DEFAULTS? This will restore original Coca-Cola copy and products.')) return;

        try {
            const resp = await fetch('/api/admin/reset-defaults', {
                method: 'POST',
                headers: { 'X-Admin-Token': this.token }
            });
            if (resp.ok) {
                this.showToast('Restored authentic brand defaults!', 'success');
                await this.loadDashboardData();
            } else {
                this.showToast('Failed to reset', 'error');
            }
        } catch (e) {
            this.showToast('Error resetting defaults', 'error');
        }
    }

    showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `admin-toast toast-${type}`;
        toast.textContent = message;
        document.body.appendChild(toast);

        setTimeout(() => toast.classList.add('visible'), 20);
        setTimeout(() => {
            toast.classList.remove('visible');
            setTimeout(() => toast.remove(), 300);
        }, 3200);
    }
}

window.adminApp = new DietCokeAdminApp();
