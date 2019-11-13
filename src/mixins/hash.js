export default {
    mounted() {
        this.$nextTick(() => {
            const {hash} = this.$route.query;

            if (hash) {
                location.hash = '#' + hash;
            }
        });
    }
};
