<template>
    <main v-loading="!initialized" id="app"
          class="flex direction-column w-100">
        <template v-if="initialized">
            <partial-header/>
            <transition name="el-fade-in">
                <router-view/>
            </transition>

            <transition name="el-fade-in">
                <div v-if="user && confirm.show" class="confirm-pass flex justify-center align-center">
                    <div class="el-card is-always-shadow">
                        <div class="el-card__header text-center">
                            <div>
                                <div class="pic ml-auto mr-auto">
                                    <img :src="user.photo?$fileUrl(user.photo):$auth.altPhoto" :alt="user.name">
                                </div>

                                <p class="text-center">{{user.name}}</p>
                            </div>
                        </div>
                        <el-form :model="confirm.model" :rules="confirm.rules" ref="form"
                                 @submit.native.prevent="submit"
                                 class="el-card__body">

                            <label class="d-block">
                        <span class="d-block mb-1">
                            পাসওয়ার্ড
                        </span>
                                <el-form-item prop="pass">
                                    <el-input type="password" v-model="confirm.model.pass"
                                              :placeholder="confirm.label"></el-input>
                                </el-form-item>
                            </label>

                            <div class="btn-group flex justify-center">
                                <el-button-group>
                                    <el-button type="primary" size="medium" icon="el-icon-close"
                                               @click="cancel">
                                        বাতিল
                                    </el-button>
                                    <el-button type="danger" size="medium" icon="el-icon-check" native-type="submit">
                                        সাবমিট
                                    </el-button>
                                </el-button-group>
                            </div>
                        </el-form>
                    </div>
                </div>
            </transition>
        </template>
    </main>
</template>

<script>
    import partialHeader from '@/layout/partials/header';
    import {elFormItem, elForm, elButtonGroup, elButton, elInput} from '@/el';

    export default {
        components: {partialHeader, elFormItem, elForm, elButtonGroup, elButton, elInput},

        computed: {
            confirm() {
                return this.$store.state.additional.confirmPass;
            },

            user() {
                return this.$auth.user;
            },

            loading() {
                return this.$store.state.loading;
            },

            initialized() {
                return this.$store.state.initialized;
            }
        },

        methods: {
            cancel() {
                this.$store.commit('additional/resolveConfirmPass', true);
            },

            async submit() {
                const {form} = this.$refs;

                try {
                    await form.validate();
                } catch (e) {
                    return;
                }

                this.$store.commit('additional/resolveConfirmPass');
            }
        }
    };
</script>

<style lang="scss">
    .confirm-pass {
        position: fixed;
        top: 0;
        z-index: 2000;
        background: rgba(255, 255, 255, 0.84);
        width: 100%;
        height: 100%;
        left: 0;
        text-shadow: 0 0;

        .el-card__header {
            border-bottom: 1px solid #dadada;
        }

        .el-card {
            width: 360px;
            max-width: calc(100% - 30px);
            background: #e8efff;
        }

        .pic {
            width: 50px;
            height: 50px;
            border-radius: 50%;
            overflow: hidden;
            box-shadow: 0 1px 3px rgba(0, 0, 0, .4);
        }

        .btn-group {
            margin-top: 20px;
        }
    }
</style>
