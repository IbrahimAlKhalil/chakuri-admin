<template>
    <el-dialog :visible="show" :fullscreen="$store.state.isMobile"
               :title="`${type==='create'?'Create':'Update'} ${title}`" center
               append-to-body @close="$emit(`update:show`, false)">
        <el-form :model="models" ref="form" action="#"
                 @submit.native.prevent="submit" status-icon>
            <template v-for="(field, index) in fields">
                <template v-if="field.type === 'select'">
                    <el-form-item :prop="field.name" :key="index" :rules="field.rules">
                        <label :for="type+'-'+field.name" class="d-block">{{field.label}}</label>
                        <el-select :id="type+'-'+field.name" v-model="models[field.name]" class="w-100"
                                   popper-class="data-form-select"
                                   :placeholder="`Select ${field.label}`" :multiple="!!field.multiple">
                            <div slot="empty" class="p-1 text-center">
                                <i v-if="!field.loaded" class="el-icon-loading"></i>
                                <span v-else>Empty</span>
                            </div>
                            <el-option v-for="(option, index) in field.data" :key="index"
                                       :value="option[field.hasOwnProperty('map')?field.map.value:'id']"
                                       :label="option[field.hasOwnProperty('map')?field.map.label:'name']"/>
                        </el-select>
                    </el-form-item>
                </template>

                <template v-else-if="field.type !== 'hidden'">
                    <el-form-item :prop="field.name" :rules="field.rules">
                        <label :for="type+'-'+field.name" class="d-block">{{field.label}}</label>
                        <el-input :id="type+'-'+field.name" v-model="models[field.name]" :type="field.type"
                                  :placeholder="field.placeholder">
                            <template v-if="field.prepend" #prepend>
                                {{field.prepend(models)}}
                            </template>
                        </el-input>
                    </el-form-item>
                </template>
            </template>

            <div class="text-center">
                <el-button class="login-btn" :icon="!loading? 'el-icon-s-promotion' : 'el-icon-loading'"
                           type="primary"
                           nativeType="submit" :disabled="loading">&nbsp;&nbsp;Submit
                </el-button>
            </div>
        </el-form>
    </el-dialog>

</template>

<script>
    import {elButton, elForm, elFormItem, elInput, elOption, elSelect, elDialog} from '@/el';

    export default {
        components: {elForm, elFormItem, elInput, elSelect, elButton, elOption, elDialog},
        props: ['fields', 'endpoint', 'type', 'item', 'show', 'title'],

        data() {

            // Setup models

            return {
                loading: false,
                models: {}
            };
        },

        methods: {
            async submit() {
                try {
                    await this.$refs.form.validate();

                    this.loading = true;

                    const {endpoint, type, item} = this.$props;

                    const response = await this.$fetch(`${endpoint}/${type === 'edit' ? item.id : ''}`, {
                        method: type === 'create' ? 'POST' : 'PATCH',
                        body: this.models
                    }).response();

                    this.loading = false;
                    if (response.status === 200 || response.status === 204) {
                        if (type === 'edit') {
                            return this.updated();
                        }

                        this.$emit('submitted', response.json());
                    }
                } catch (e) {
                }
            },

            changeEditItem(item) {
                const {fields} = this.$props;
                const {models} = this;

                if (!item) {
                    return;
                }

                fields.forEach(field => {
                    if (!item.hasOwnProperty(field.name)) {
                        return;
                    }

                    const valueKey = field.map ? field.map.id : 'id';
                    const select = field.type === 'select';
                    const {name} = field;

                    // TODO: Fix this bug #Value can be only id instead of whole entity
                    if (select && field.multiple) {
                        this.$set(models, name, item[name].map(val => val[valueKey]));

                        return;
                    }

                    const value = item[name];

                    if (select && typeof value === 'object') {
                        this.$set(models, name, item[name][valueKey]);
                        return;
                    } else if (select) {
                        this.$set(models, name, item[name]);
                    }

                    this.$set(models, name, item[name]);
                });
            },

            updated() {
                const {models} = this;
                const {item, fields} = this.$props;

                const old = {};

                fields.forEach(function (field) {
                    if (!item.hasOwnProperty(field.name)) {
                        return;
                    }

                    const valueKey = field.map ? field.map.id : 'id';
                    const select = field.type === 'select';
                    const {name} = field;
                    const model = models[name];

                    old[name] = item[name];

                    if (select && field.multiple) {
                        item[name] = field.data.filter(op => model.includes(op[valueKey]));
                        return;
                    }

                    if (select) {
                        item[name] = field.data.filter(op => model === op[valueKey])[0];
                        return;
                    }

                    item[name] = model;
                });


                this.$emit('submitted', {
                    old,
                    item
                });
            }
        },

        created() {
            const {fields, type, item} = this.$props;
            const {models} = this;

            if (type === 'create') {
                fields.forEach(field => {
                    this.$set(models, field.name, field.value || null);
                });
            } else {
                this.$watch('item', function (item) {
                    this.changeEditItem(item);
                });
            }

            if (type === 'edit' && !!item) {
                this.changeEditItem(item);
            }

            for (const field of fields) {

                if (field.type === 'select') {
                    this.$set(field, 'loaded', true);

                    if (field.hasOwnProperty('source')) {
                        field.loaded = false;

                        // Load

                        this.$fetch(field.source).response().then(response => {
                            this.$set(field, 'data', response.json());
                            field.loaded = true;
                        });
                    }
                }
            }
        }
    };
</script>

<style lang="scss">
    .data-form-select {
        z-index: 90000 !important;
    }
</style>
