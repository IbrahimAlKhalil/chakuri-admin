export default {
    namespaced: true,

    state: {
        dashboard: [],
        show: false
    },

    mutations: {
        toggle(state, show) {
            state.show = show;
        },

        items(state, items) {
            state.dashboard = items;
        }
    },
};
