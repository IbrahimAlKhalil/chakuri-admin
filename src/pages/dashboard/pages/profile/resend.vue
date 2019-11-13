<template>
    <div v-loading="data.loading"
         class="mt-1 el-card not-received is-always-shadow">
        <div class="p-1 text-center">
            <b v-if="!change">{{title}} পাননি?</b>
            <b v-else>{{name}} পরিবর্তন করুন</b>
        </div>


        <div class="el-card__body text-center">
            <el-form v-if="change" :model="model" @submit.native.prevent="edit">
                <el-form-item prop="value" :rules="rules">
                    <el-input v-model="model.value"/>
                </el-form-item>

                <el-button-group>
                    <el-button type="success"
                               icon="fa fa-check" @click="edit"></el-button>
                    <el-button type="danger"
                               icon="fa fa-times" @click="change = false"></el-button>
                </el-button-group>
            </el-form>

            <template v-else>
                <el-button type="primary"
                           @click="change = true">{{name}} পরিবর্তন করুন
                </el-button>
                <el-button type="primary" @click="resendToken">আবার
                    পাঠান
                </el-button>
            </template>
        </div>
    </div>
</template>

<script>
    import {elButton, elInput, elForm, elFormItem, elButtonGroup} from '@/el';

    export default {
        components: {elButton, elInput, elForm, elFormItem, elButtonGroup},

        props: ['data', 'title', 'type', 'name', 'rules'],

        data() {
            return {
                change: false,
                model: {
                    value: ''
                }
            };
        },

        methods: {
            resendToken() {
                const {type, data} = this.$props;

                // Show spinner
                data.loading = true;

                this.$fetch(`resend-${type}`).response().then(response => {
                    // Hide spinner
                    data.loading = false;

                    if (response.status === 422) {
                        return this.$emit('error', response.text);
                    }

                    data.timeout = false;
                    data.time = 180;

                    this.$emit('sent');
                });
            },

            async edit() {
                const {type, data} = this.$props;

                // Show spinner
                data.loading = true;

                const body = {payload: this.model.value, type};


                const response = await this.$fetch('update-verification-payload', {
                    method: 'POST',
                    body
                }).response();


                // Hide spinner
                data.loading = false;

                if (response.status === 422) {
                    return this.$emit('error', response.text);
                }


                data.timeout = false;
                data.time = 180;

                this.$emit('update', body);
            }
        }
    };
</script>
