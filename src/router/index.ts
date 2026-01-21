import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'home',
            component: () => import('../views/HomeView.vue')
        },
        {
            path: '/register',
            name: 'register',
            component: () => import('../views/RegisterView.vue')
        },
        {
            path: '/balance',
            name: 'balance',
            component: () => import('../views/BalanceView.vue')
        },
        {
            path: '/pay-way',
            name: 'pay-way',
            component: () => import('../views/PayWayView.vue')
        },
        {
            path: '/invoice',
            name: 'invoice',
            component: () => import('../views/InvoiceView.vue')
        },

        {
            path: '/charging-status',
            name: 'charging-status',
            component: () => import('../views/ChargingStatusView.vue')
        },
        {
            path: '/charging-history',
            name: 'charging-history',
            component: () => import('../views/ChargingHistoryView.vue')
        },
        {
            path: '/member',
            name: 'member',
            component: () => import('../views/Member/MemberView.vue')
        },
        {
            path: '/member/setting',
            name: 'member-setting',
            component: () => import('../views/Member/MemberSettingView.vue')
        }
    ]
})

export default router
