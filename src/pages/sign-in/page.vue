<template>
    <el-card class="wrapper">
        <div slot="header" class="text-center dark-text title">
            <i class="fas fa-sign-in-alt"></i>&nbsp;&nbsp;লগ-ইন
        </div>

        <el-form ref="form" :model="models" :rules="rules" @submit.native.prevent="submit" status-icon>
            <el-form-item prop="username">
                <label for="username" class="d-block">ইমেইল / ফোন নম্বর</label>
                <el-input id="username" v-model="models.username">
                    <i class="el-icon-user-solid el-input__icon" slot="prefix"></i>
                </el-input>
            </el-form-item>

            <el-form-item prop="password">
                <label for="password" class="d-block">পাসওয়ার্ড</label>
                <el-input id="password" type="password" v-model="models.password">
                    <i class="el-icon-key el-input__icon" slot="prefix"></i>
                </el-input>
            </el-form-item>

            <el-form-item prop="rememberMe">
                <el-checkbox v-model="models.rememberMe" class="remember-me">এই কম্পিউটারে আমাকে মনে রাখুন</el-checkbox>
            </el-form-item>

            <div class="text-center">
                <el-button
                        class="login-btn"
                        :icon="!formLoading? 'el-icon-s-promotion' : 'el-icon-loading'"
                        type="primary"
                        nativeType="submit"
                        :disabled="formLoading"
                >&nbsp;&nbsp;লগ-ইন
                </el-button>
            </div>


            <div class="mt-2 text-center">
                <router-link class="link" :to="{path: '/forgot-password'}">পাসওয়ার্ড ভুলে গেছেন?</router-link>
            </div>
        </el-form>
    </el-card>
</template>

<script>
    import {elCard, elInput, elButton, elCheckbox, elForm, elFormItem} from '@/el';
    import {saveToken} from '@modules/tokenizer';

    export default {
        components: {elCard, elInput, elButton, elCheckbox, elForm, elFormItem},

        data() {
            return {
                formLoading: false,
                models: {
                    username: '',
                    password: '',
                    rememberMe: false,
                },
                rules: {
                    username: [
                        {
                            required: true,
                            message: 'অনুগ্রহ করে আপনার মোবাইল নম্বর বা ইমেইল লিখুন।'
                        }
                    ],

                    password: [
                        {
                            required: true,
                            message: 'অনুগ্রহ করে আপনার পাসওয়ার্ড লিখুন।'
                        }
                    ]
                }
            };
        },

        methods: {
            async submit() {
                try {
                    await this.$refs.form.validate();

                    this.formLoading = true;


                    const response = await this.$fetch('authenticate', {
                        auth: false,
                        method: 'POST',
                        body: {
                            username: this.models.username,
                            password: this.models.password,
                            user_type_id: 3,
                            grant_type: 'password',
                            client_id: 1
                        }
                    }).response();

                    if (response.status === 200) {
                        // Redirect to homepage

                        const jwt = response.json();

                        saveToken(jwt.access_token, this.models.rememberMe);

                        await this.$store.dispatch('auth/signIn');

                        return this.$router.push('/');
                    }

                    this.$notify({
                        message: 'দুঃখিত আপনার দেয়া তথ্য সঠিক নয়',
                        type: 'warning'
                    });
                } catch (e) {
                }

                this.formLoading = false;
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
