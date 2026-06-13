import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '@/pages/HomePage.vue';
import LoginPage from '@/modules/auth/pages/LoginPage.vue';
import DashboardPage from '@/modules/dashboard/pages/DashboardPage.vue';
import { authGuard } from '@/router/guards';

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            name: 'home',
            component: HomePage,
        },
        {
            path: '/login',
            name: 'login',
            component: LoginPage,
            meta: { guest: true },
        },
        {
            path: '/dashboard',
            name: 'dashboard',
            component: DashboardPage,
            meta: { requiresAuth: true },
        },
    ],
});

router.beforeEach(authGuard);

export default router;
