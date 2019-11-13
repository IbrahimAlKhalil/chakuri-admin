<template>
    <div class="wrapper">
        <div class="el-menu">
            <notification
                    v-for="(item, index) in items"
                    :key="index" :item="item"/>
        </div>

        <intersection @reveal="load"/>

        <empty :empty="!items.length" :loading="notification.loading"/>
    </div>
</template>

<script>
    import {elCard} from '@/el';
    import {mapState} from 'vuex';
    import empty from '@/components/empty';
    import intersection from '@/components/intersection';
    import notification from '@/layout/partials/notification';

    export default {
        components: {elCard, notification, empty, intersection},

        computed: {
            ...mapState({
                notification: state => state.notification,
                items: ({notification}) => notification.items.slice(0, notification.page * notification.perPage)
            })
        },

        methods: {
            async load({entry, elm}) {
                const {dispatch} = this.$store;

                // TODO: Fix infinite loop

                await dispatch('notification/loadItems');
                dispatch('notification/hideCount');

                if (entry.rootBounds.top < elm.getBoundingClientRect().top) {
                    await dispatch('notification/loadItems');
                }
            }
        }
    };
</script>

<style lang="scss" scoped>
    @import "../../../../styles/var";

    .wrapper {
        box-shadow: $--box-shadow-light;
    }

    .el-menu-item {
        height: auto;
    }
</style>
