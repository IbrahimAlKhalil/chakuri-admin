<template>
    <div class="el-card" v-loading="!initialized">
        <div class="el-card__header text-center">
            <h3><i class="fa fa-cogs"></i> Application Settings</h3>
        </div>

        <div class="el-card__body">
            <setting v-for="(object, index) in settings" :object="object" :key="index"/>
        </div>
    </div>
</template>

<script>
    import setting from './setting';
    import hash from '@/mixins/hash';

    export default {
        mixins: [hash],

        components: {
            setting
        },

        data() {
            return {
                initialized: false,
                settings: null
            };
        },

        computed: {
            rules() {
                return {};
            }
        },

        async created() {
            const response = await this.$fetch('dashboard/settings').response();

            this.settings = response.json();

            this.initialized = true;
        },
    };
</script>
