<template>
    <div class="el-card wrapper">
        <div v-if="verified && user" class="el-card__header">
            <div class="flex justify-center">
                <div class="profile-pic">
                    <img :src="user.photo?$fileUrl(user.photo):$auth.altPhoto" :alt="user.name">
                </div>
            </div>
            <h4 class="text-center">{{user.name}}</h4>
        </div>

        <div class="el-card__body">
            <el-form ref="form" :model="models" :rules="rules" @submit.native.prevent="" status-icon>
                <template v-if="!verified">
                    <el-form-item prop="token">
                        <label for="token" class="d-block">ভেরিফিকেশন কোড</label>
                        <el-input class="mt-1" id="token" v-model="models.token" type="text">
                            <i class="fas fa-key el-input__icon" slot="prefix"></i>
                        </el-input>
                    </el-form-item>

                    <div>
                        <b>
                            <small>আপনার মোবাইলে ৬ ডিজিটের একটি ভেরিফিকেশন কোড পাঠানো হয়েছে, উপরের বক্সে কোডটি লিখে
                                সাবমিট করুন
                            </small>
                        </b>
                    </div>
                </template>


                <template v-else>
                    <el-form-item prop="password">
                        <label for="password" class="d-block">পাসওয়ার্ড</label>
                        <el-input id="password" type="password" v-model="models.password" autocomplete="new-password">
                            <i class="el-icon-key el-input__icon" slot="prefix"></i>
                        </el-input>
                    </el-form-item>

                    <el-form-item prop="rePassword">
                        <label for="rePassword" class="d-block">পাসওয়ার্ডটি আবার লিখুন</label>
                        <el-input id="rePassword" type="password" v-model="models.rePassword">
                            <i class="el-icon-key el-input__icon" slot="prefix"></i>
                        </el-input>
                    </el-form-item>
                </template>

                <div class="text-center mt-2">
                    <el-button v-if="verified" class="login-btn"
                               :icon="!loading? 'el-icon-s-promotion' : 'el-icon-loading'"
                               type="primary"
                               nativeType="submit"
                               :disabled="loading || !(models.password && models.rePassword)" @click="reset">&nbsp;&nbsp;সাবমিট
                    </el-button>

                    <el-button v-else class="login-btn"
                               :icon="!loading? 'el-icon-s-promotion' : 'el-icon-loading'"
                               type="primary"
                               :disabled="loading || !models.token"
                               @click="verify"
                    >&nbsp;&nbsp;সাবমিট
                    </el-button>
                </div>
            </el-form>
        </div>
    </div>
</template>


<script>
    import config from '@/config';
    import {elForm, elFormItem} from '@/el';
    import mixin from '../forgot-password/mixin';

    export default {
        components: {elForm, elFormItem},

        mixins: [mixin],

        props: ['name', 'photo', 'token'],

        data() {
            return {
                resetToken: null,
                user: null,
                models: {
                    password: '',
                    rePassword: '',
                    token: ''
                },
                verified: false,
            };
        },

        methods: {
            rePassword(rule, value, callback) {
                if (this.models.password === this.models.rePassword) {
                    callback();
                }

                callback('দুঃখিত, এই পাসওয়ার্ড এবং উপরের পাসওয়ার্ডটি এক নয়।');
            },

            async verify() {
                this.loading = true;

                const data = JSON.parse(sessionStorage.getItem(config.prpk));

                const body = {
                    ...data,
                    token: this.models.token
                };

                const response = await this.$fetch('verify-password-token', {
                    method: 'POST',
                    body
                }).response();

                this.loading = false;

                if (response.status === 422) {
                    this.$notify({
                        type: 'error',
                        message: response.text
                    });
                }

                const json = response.json();

                this.resetToken = json.token;
                this.user = json.user;
                this.verified = true;
            },

            async reset() {
                const data = JSON.parse(sessionStorage.getItem(config.prpk));

                const body = {
                    token: this.resetToken,
                    password: this.models.password,
                    rePassword: this.models.rePassword,
                    mobile: data.mobile,
                    type: data.type
                };

                const response = await this.$fetch('reset-password', {
                    method: 'POST',
                    body
                }).response();

                if (response.status === 422) {
                    return this.$notify({
                        type: 'error',
                        message: response.text
                    });
                }

                sessionStorage.removeItem(config.prpk);

                this.$notify({
                    type: 'success',
                    message: 'আপনার পাসওয়ার্ডটি সফলভাবে পরিবর্তিত হয়েছে'
                });

                this.$router.push({
                    path: '/sign-in'
                });
            }
        },

        computed: {
            rules() {
                const {rePassword} = this;

                return {
                    password: [
                        this.requiredRule('পাসওয়ার্ড লিখুন'),
                        {
                            min: 8,
                            message: `দুঃখিত, পাসওয়ার্ডট কমপক্ষে আটটি অক্ষরের দৈর্ঘ্যের হতে হবে।`
                        }
                    ],

                    rePassword: [this.requiredRule('পাসওয়ার্ডটি পুনরায় লিখুন'), {validator: rePassword}]
                };
            }
        },

        async created() {
            if (!sessionStorage.getItem(config.prpk)) {
                this.$router.push({
                    path: 'forgot-password'
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

    .el-card__header {
        background: #e5eeff;
    }

    .profile-pic {
        width: 100px;
        height: 100px;
        border-radius: 50%;
        box-shadow: 0 0 3px rgba(0, 0, 0, .2);
        overflow: hidden;

        img {
            width: 100%;
            object-fit: cover;
        }
    }

    @media all and (min-width: $--md) {
        .wrapper {
            width: 500px;
            margin: 100px auto;
        }
    }
</style>
