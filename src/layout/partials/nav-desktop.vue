<template>
    <div class="flex flex-md-and-up nav-desktop">
        <avatar v-if="$auth.user"/>
    </div>
</template>

<script>
    import avatar from './avatar';

    export default {
        components: {avatar}
    };
</script>

<style lang="scss" scoped>
    .btn {
        text-decoration: none;
        margin-right: 10px;

        i {
            margin-right: 10px;
        }
    }
</style>
