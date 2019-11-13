import Vue from 'vue';

import Vuex from 'vuex';
import VueRouter from 'vue-router';

// Directives
import Loading from 'element-ui/packages/loading/src/directive';
import highlight from 'vue-highlight-text/public/directive.min.js';


import App from '@/layout/app';

// Styles
import '@/styles/styles.scss';

import store from '@/store';
import router from '@/router';
import common from '@/plugins/common.plugin';
import request from '@/plugins/fetch.plugin';
import initializeStore from '@/modules/store-initializer';

Vue.use(VueRouter);
Vue.use(Vuex);
Vue.use(Loading);
Vue.directive('highlight', highlight);
Vue.use(common);
Vue.use(request);

new Vue({
    store,
    router,
    render: h => h(App),
    async created() {
        await initializeStore(this.$store);

        this.$store.commit('loading', false);
        this.$store.commit('initialized');
    }
}).$mount('#app');
