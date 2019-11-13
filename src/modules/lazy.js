import store from '@/store';

export default function (component) {
    store.commit('loading', true);

    component.then(() => {
        store.commit('loading', false);
    });

    return {component};
}
