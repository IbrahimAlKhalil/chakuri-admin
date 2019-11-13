import intersection from '@/components/intersection';

export default {
    components: {
        intersection,
        empty: () => import('@/components/empty')
    },

    props: {
        tag: {
            type: String,
            default: 'div'
        },

        perPage: {
            type: Number,
            default: 26
        },

        socketEvent: String,

        decorator: Function
    },

    data() {
        return {
            first: true,
            loading: false,
            resetting: false,

            exposed: {
                items: [],
                total: 0,
                highlight: {
                    keyword: [],
                    sensitive: false
                }
            }
        };
    },

    methods: {
        shouldLoad() {
            const {first, exposed, loadedCount} = this;

            const {total} = exposed;

            if (first) {
                return true;
            }

            if (total === 0) {
                return false;
            }

            return total !== loadedCount;
        },

        async load(overwrite) {
            const {nextPage, first, $props, take, exposed} = this;

            if (!this.shouldLoad()) {
                return;
            }

            // Show spinner
            this.loading = true;

            // Load data
            const response = await this.$fetch(`${this.$props.endpoint}${this.builtQuery}page=${nextPage}&perPage=${$props.perPage}&take=${take}`).response();

            // Hide spinner
            this.loading = false;

            const {data, total} = response.json();

            // Update total
            if (total !== exposed.total) {
                exposed.total = total;
                this.$emit('totalChanged', total);
            }

            // Store loaded items
            let decorated;

            if ($props.decorator) {
                decorated = data.map(item => $props.decorator(item));
            } else {
                decorated = data;
            }

            if (overwrite === true) {
                exposed.items = decorated;
            } else {
                decorated.forEach(item => exposed.items.push(item));
            }


            // Send data to parent component
            this.$emit('input', exposed);

            if (first) {
                this.$emit('init');
                this.first = false;
            }
        },

        async reset() {
            this.first = true;
            this.resetting = true;
            this.exposed.highlight.keyword = this.keyword.trim().split(' ');
            this.exposed.total = 0;

            await this.load(true);

            this.resetting = false;
        }
    },

    computed: {
        nextPage() {
            const {$props, loadedCount} = this;
            const {perPage} = $props;

            const divided = loadedCount / perPage;

            const page = Math.ceil(divided) || 1;
            const currentPage = Math.floor(divided);

            if (page === currentPage) {
                return page + 1;
            }

            return page;
        },

        loadedCount() {
            if (this.resetting) {
                return 0;
            }

            return this.exposed.items.length;
        },

        take() {
            const {perPage} = this.$props;
            const {loadedCount, nextPage} = this;

            return nextPage * perPage - loadedCount;
        }
    },

    async created() {
        // Update count
        this.$emit('input', this.exposed);

        const {socketEvent} = this.$props;

        if (socketEvent) {
            this.$socket().on(socketEvent, item => {
                this.addItem(item, true);
            });
        }
    },

    beforeDestroy() {
        const {socketEvent} = this.$props;

        if (socketEvent) {
            this.$socket().removeAllListeners(this.$props.socketEvent);
        }
    }
};
