<template>
    <router-link :to="item.link" class="el-menu-item" :index="index.toString()">
        <i v-if="item.icon" :class="item.icon"></i> {{ item.title }}
    </router-link>
</template>

<script>

    export default {
        props: ['item', 'index']
    }
</script>


<style lang="scss" scoped>
    @import "../../styles/var";

    .el-menu-item {
        text-decoration: none;
        color: $--color-secondary;

        &:hover {
            background-color: $--dropdown-menuItem-hover-fill !important;
        }
    }

    .router-link-exact-active {
        border-left: 2px solid $--color-primary;

        @media all and (min-width: $--md) {
            border-bottom: 2px solid $--color-primary;
            border-left: 0;
        }
    }
</style>
