// After Dispatching all the siblings asynchronously
// then dispatch children independently


export async function dispatch(modules, action) {

    const children = Object.keys(modules).map(module => modules[module]);

    if (!children.length) {
        return;
    }

    await Promise.all(
        children.map(module => {
            if (module._rawModule.hasOwnProperty('actions') && module._rawModule.actions.hasOwnProperty(action)) {
                return module.context.dispatch(action);
            }
        })
    );

    await Promise.all(
        children.map(child => dispatch(child._children, action))
    );
}

export default async function initializeStore(store) {
    const {_modules} = store;

    await dispatch(_modules, 'initialize');
    await dispatch(_modules, 'initialized');

    await store.dispatch('bootstrapped');
}
