<template>
    <div class="el-card wrapper">
        <div class="el-card__header text-center dark-text title">
            <i class="fas fa-cog"></i>&nbsp;&nbsp;পাসওয়ার্ড পরিবর্তন
        </div>

        <div class="el-card__body">
            <el-form ref="form" :model="models" :rules="rules" @submit.native.prevent="submit" status-icon>
                <el-form-item prop="mobile">
                    <label for="mobile" class="d-block">মোবাইল নম্বর</label>
                    <el-input id="mobile" v-model="models.mobile">
                        <i class="el-icon-user-solid el-input__icon" slot="prefix"></i>
                    </el-input>
                </el-form-item>

                <div class="text-center mt-2">
                    <el-button
                            class="login-btn"
                            :icon="!loading? 'el-icon-s-promotion' : 'el-icon-loading'"
                            type="primary"
                            nativeType="submit"
                            :disabled="loading"
                    >&nbsp;&nbsp;সাবমিট
                    </el-button>
                </div>
            </el-form>
        </div>
    </div>

</template>

<script>
    import config from '@/config';
    import mixin from './mixin';

    export default {
        mixins: [mixin],

        data() {
            const {requiredRule} = this;


            return {
                models: {
                    mobile: ''
                },

                rules: {
                    mobile: [requiredRule('মোবাইল নম্বর বা ইমেইল লিখুন।')]
                },
            };
        },

        methods: {
            async submit() {
                try {
                    await this.$refs.form.validate();
                } catch (e) {
                    return;
                }

                // Show spinner
                this.loading = true;

                const {mobile} = this.models;

                const response = await this.$fetch('forgot-password', {
                    method: 'POST',
                    body: {mobile, type: 3}
                }).response();


                // Hide spinner
                this.loading = false;

                if (response.status === 422) {
                    return this.$notify({
                        message: 'দুঃখিত কোনো একাউন্ট পাওয়া যায়নি',
                        type: 'error'
                    });
                }

                sessionStorage.setItem(config.prpk, JSON.stringify({
                    mobile: this.models.mobile,
                    type: 3,
                    key: response.json().key
                }));

                this.$router.push({
                    path: '/password-reset'
                });
            }
        }
    };
</script>

<style lang="scss" scoped>
    @import "../../styles/var";

    .title {
        font-size: 1.3rem;
    }

    .login-btn {
        width: 100%;
    }

    @media all and (min-width: $--md) {
        .wrapper {
            width: 500px;
            margin: 100px auto;
        }
    }
</style>
