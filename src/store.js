import Vue from 'vue';
import Vuex from 'vuex';
import auth from '@/stores/auth.store';
import menu from '@/stores/menu.store';
import additional from '@/stores/additional.store';

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        loading: false,
        initialized: false,
        layout: 'master',
        isMobile: window.innerWidth < 992,
        homeUrl: process.env.NODE_ENV === 'development' ? 'http://localhost:8080' : 'https://khidmatbd.com'
    },
    mutations: {

        loading(state, loading) {
            state.loading = loading;
        },

        changeLayout(state, layout) {
            state.layout = layout;
        },

        changeDevice(state, isMobile) {
            state.isMobile = isMobile;
        },

        initialized(state) {
            state.initialized = true;
        }
    },
    actions: {
        async initialize({commit}) {
            window.matchMedia('(min-width: 992px)').addEventListener('change', e => {
                commit('changeDevice', !e.matches);
            });
        },

        async bootstrapped() {
        }
    },
    modules: {auth, additional, menu}
});
