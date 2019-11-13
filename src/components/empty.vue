<template>
    <div v-show="(empty && !loading) || loading" :class="card?'el-card is-always-shadow mt-1':''">
        <div :class="card?'el-card__body':''">
            <div v-if="empty && !loading" :class="`empty-box ${size?size:''}`">
                <i class="fas fa-box-open"></i>
            </div>

            <div v-if="loading" class="text-center p-1">
                <i class="el-icon-loading"></i>
            </div>
        </div>
    </div>

</template>

<script>
    export default {
        props: ['size', 'empty', 'loading', 'card']
    };
</script>

<style lang="scss" scoped>
    .empty-box {
        color: #eef5ff;
        text-align: center;
        font-size: 10em;
        background: #fff;

        &.small {
            font-size: 5em;
        }
    }
</style>
