<template>
    <div ref="elm"></div>
</template>

<script>
    export default {
        props: {
            container: {
                default: null
            }
        },

        created() {
            const {container} = this.$props;

            this.$nextTick(() => {
                const {elm} = this.$refs;

                let options = {
                    root: container,
                    rootMargin: '0px',
                    threshold: 1.0
                };

                let observer = this.$observer = new IntersectionObserver((entries) => {
                    const entry = entries[0];

                    if (entry.isIntersecting) {
                        this.$emit('reveal', {entry, observer, elm});
                    }
                }, options);

                observer.observe(elm);
            });
        },

        beforeDestroy() {
            this.$observer.unobserve(this.$refs.elm);
        }
    };
</script>
