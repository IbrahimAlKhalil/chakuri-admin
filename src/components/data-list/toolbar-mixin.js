import {elInput, elTooltip, elPopover, elButton} from '@/el';

export default {
    components: {elInput, elTooltip, elPopover, elButton},

    props: {
        search: {
            type: Boolean,
            default: true
        },

        menuIcon: {
            type: String,
            default: 'fas fa-ellipsis-v'
        },

        crud: {
            type: Boolean,
            default: true
        },

        hideToolbar: {
            type: Boolean,
            default: false
        },

        actions: {
            type: Array,
            default: () => ['create', 'delete']
        },

        query: Object
    },

    computed: {
        builtQuery() {
            const {$props} = this;

            const query = {
                ...$props.query
            };

            if ($props.search) {
                query.keyword = this.keyword;
            }

            let queryString = '?';

            for (let key in query) {
                queryString += `${key}=${query[key]}&`;
            }

            return queryString;
        }
    },

    data() {
        return {
            keyword: ''
        };
    }
};
