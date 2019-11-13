import request from '@/modules/request';

const mixin = {
    data() {
        return {
            // Hold all the requests so we can cancel them before component destroyed
            $$_requests: []
        };
    },

    methods: {
        $fetch(endPoint, options) {
            const {$$_requests} = this.$data;

            const fetcher = request(endPoint, options);

            // Store it
            $$_requests.push(fetcher);

            // Remove the request after completed
            fetcher.after(() => {
                $$_requests.splice($$_requests.indexOf(fetcher), 1);
            }, false);

            return fetcher;
        }
    },

    beforeDestroy() {
        // Cancel requests
        this.$data.$$_requests.forEach(request => request.abort());
        this.$data.$$_requests = [];
    }
};

export default {
    install(Vue) {
        Vue.mixin(mixin);
    }
};
