import { createRouter, createWebHistory } from 'vue-router';
import LoginPage from '@/modules/auth/pages/LoginPage.vue';
import DashboardPage from '@/modules/dashboard/pages/DashboardPage.vue';
import { authGuard } from '@/router/guards';

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            name: 'home',
            component: DashboardPage,
            meta: { requiresAuth: true },
        },
        {
            path: '/login',
            name: 'login',
            component: LoginPage,
            meta: { guest: true },
        },
    ],
});

router.beforeEach(authGuard);

export default router;
