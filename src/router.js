import Vue from 'vue';
import Router from 'vue-router';
// import kasir from './components/HelloWorld.vue'

Vue.use(Router);
export default new Router({
    mode: "history",
    routes: [
        {
            path:'/',
            component: () => import('./components/ListBarang.vue')
        },
        {
            path:'/kasir',
            component: () => import('./components/Kasir.vue')
        },
        {
            path:'/page1',
            component: () => import('./pages/Page1.vue'),
            children: [
                {
                    path: '/',
                    component: () => import('./pages/Page1Subpage.vue')
                },
                {
                    path: 'subpage1',
                    component: () => import('./pages/Subpage1.vue')
                },
                {
                    path: 'subpage2',
                    component: () => import('./pages/Subpage2.vue')
                },
            ]
        },
    ]
})