<template>
    <div class="row" :id="`setting-${setting.id}`">
        <div class="el-card">
            <div class="el-card__header row-header flex justify-between align-center">
                <span>{{setting.label}}</span>
                <div class="actions">
                    <el-tooltip :content="edit?'Cancel':'Edit'" placement="top">
                        <el-button size="medium" :type="edit?'danger':''"
                                   @click="edit = !edit" circle>
                            <i :class="edit?'el-icon-close':'el-icon-edit'"></i>
                        </el-button>
                    </el-tooltip>

                    <el-tooltip v-if="edit" content="Save" placement="top">
                        <el-button size="medium" type="success"
                                   @click="submit" circle>
                            <i class="el-icon-check"></i>
                        </el-button>
                    </el-tooltip>
                </div>
            </div>
            <div class="el-card__body" v-loading="loading" @keyup.enter.ctrl="submit">
                <template v-if="edit">
                    <template v-if="isPrimitive">
                        <el-input ref="input" :type="setting.type" v-model="setting.value"/>
                    </template>

                    <template v-else-if="setting.type === 'image'">
                        <input ref="input" type="file" accept="image/*">
                    </template>
                </template>

                <template v-else>
                    <span v-if="isPrimitive">{{setting.value}}</span>
                    <div v-else-if="setting.type === 'image'">
                        <div v-if="setting.value" class="flex justify-center align-center">
                            <img :src="setting.value | fileUrl" :alt="setting.name">
                        </div>
                        <span v-else><strong>Not Uploaded!</strong></span>
                    </div>
                </template>
            </div>
        </div>
    </div>
</template>

<script>
    import {elButton, elTooltip, elInput} from '@/el';

    export default {
        props: ['object'],

        components: {elButton, elTooltip, elInput},

        data() {
            return {
                edit: false,
                loading: false
            };
        },

        methods: {
            async submit() {
                const {setting} = this;

                this.loading = true;

                let value;
                let formData;

                switch (setting.type) {
                    case 'object':
                        value = JSON.stringify(setting.value);
                        break;
                    case 'image':
                        formData = new FormData;
                        value = true;

                        formData.append('value', this.$refs.input.files[0]);
                        break;
                    default:
                        value = setting.value;
                }

                if (!value) {
                    this.loading = false;
                    return this.$notify({
                        type: 'error',
                        title: 'Error',
                        message: 'This field is required.'
                    });
                }

                const response = await this.$fetch(`dashboard/settings/${setting.id}`, {
                    method: 'PATCH',
                    body: formData || {value}
                }).response();

                this.edit = false;
                this.loading = false;

                if (response.status === 200 || response.status === 204) {
                    if (setting.type === 'image') {
                        setting.value = response.text;
                    }

                    return this.$notify({
                        type: 'success',
                        message: 'Setting Updated',
                        title: 'Success'
                    });
                }

                return this.$notify({
                    type: 'error',
                    title: 'Error',
                    message: 'Something went wrong please try later, or check whether your input is valid'
                });
            }
        },

        computed: {
            setting() {
                const {object} = this.$props;

                const {value} = object;

                switch (object.type) {
                    case 'object':
                        object.value = JSON.stringify(value);
                        break;
                    case 'number':
                        object.value = Number(value);
                        break;
                    default:
                        object.value = value;
                }

                return object;
            },

            isPrimitive() {
                const {setting} = this;

                return ['text', 'number', 'textarea'].includes(setting.type);
            }
        }
    };
</script>

<style lang="scss" scoped>
    @import "../../../../styles/var";

    .row {
        padding: 12px 10px;

        &:hover {
            .actions {
                opacity: 1;
            }
        }
    }

    .label {
        margin-right: 50px;
        white-space: nowrap;
    }


    .row-header {
        border-bottom: 1px solid #dcdfe6;
        background: #f4f4f4;
        padding: 8px 20px;
    }

    .actions {
        opacity: 0;
        transition: 150ms ease-in-out;
        will-change: opacity;

        &.edit {
            opacity: 1;
        }
    }

    .opacify {
        opacity: 0 !important;
        pointer-events: none;
    }

    img {
        width: 150px;
    }

    @media all and (max-width: $--md) {

        .actions {
            opacity: 1;
        }
    }
</style>
