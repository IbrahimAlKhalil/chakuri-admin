<template>
    <div>
        <div class="el-form-item__content">{{label}}</div>

        <div class="mt-1 mb-1">
            <!--<div class="el-form-item__content">
                ইনপুটের ধরণ (আপনি যেই দৃষ্টিকোণ থেকে নিচের ইনপুট দিচ্ছেন)
            </div>-->

            <div>
                <el-radio-group v-model="type" @change="rangeTypeChange">
                    <el-radio-button :label="1">Minimum</el-radio-button>
                    <el-radio-button :label="2">Maximum</el-radio-button>
                    <el-radio-button :label="3">So Much So</el-radio-button>
                    <el-radio-button :label="4">Out And Out</el-radio-button>
                    <el-radio-button v-if="negotiable" :label="5">
                        Negotiable
                    </el-radio-button>
                </el-radio-group>
            </div>
        </div>

        <div class="group">
            <template v-if="![4, 5].includes(type)">
                <el-form-item v-if="type === 1 || type === 3" :prop="`${name}_from`">
                    <el-input type="number" v-model="models[`${name}_from`]" min="0">
                        <template v-if="type !== 3" slot="prepend">{{prepend}}</template>

                        <template slot="append">{{type === 3?'From':append}}</template>
                    </el-input>
                </el-form-item>

                <el-form-item v-if="type === 2 || type === 3" :prop="`${name}_to`">
                    <el-input type="number" v-model="models[`${name}_to`]" min="0">
                        <template v-if="type !== 3" slot="prepend">{{prepend}}</template>

                        <template slot="append">{{append}}</template>
                    </el-input>
                </el-form-item>
            </template>


            <el-form-item v-else-if="type === 5">
                <el-input type="number" disabled>
                    <template slot="append">{{append}}</template>
                </el-input>
            </el-form-item>


            <el-form-item v-else>
                <el-input type="number" v-model="exact" min="0">
                    <template slot="append">{{append}}</template>
                </el-input>
            </el-form-item>
        </div>


    </div>


</template>

<script>
    import {elFormItem, elInput, elRadioButton, elRadioGroup} from '@/el';

    export default {
        components: {elFormItem, elInput, elRadioButton, elRadioGroup},

        props: ['name', 'append', 'models', 'label', 'negotiable'],

        data() {
            const {models, name} = this.$props;
            const fromValue = models[`${name}_from`];
            const toValue = models[`${name}_to`];
            let type = 1;

            if (toValue > 0 && !fromValue) {
                type = 2;
            } else if (fromValue === toValue && (fromValue && toValue)) {
                type = 4;
            } else if (fromValue < toValue) {
                type = 3;
            }

            return {
                type,
                exactValue: 0,
            };
        },

        computed: {
            prepend() {
                const {type} = this;

                switch (type) {
                    case 1:
                        return 'Minimum';
                    case 2:
                        return 'Maximum';
                    default:
                        return '';
                }
            },

            exact: {
                get() {
                    const {models, name} = this.$props;

                    return models[`${name}_from`];
                },

                set(value) {
                    const {models, name} = this.$props;

                    models[`${name}_from`] = models[`${name}_to`] = value;
                    this.exactValue = value;
                },
            },
        },

        methods: {
            rangeTypeChange(evt) {
                const {name, models} = this.$props;

                models[`${name}_from`] = models[`${name}_to`] = 0;
                this.exact = 0;

                this.$emit('typeChange', evt);
            },
        },

        created() {
            const {name, models} = this.$props;
            const fromName = `${name}_from`;
            const toName = `${name}_to`;

            if (!models.hasOwnProperty(fromName)) {
                this.$set(models, fromName, 0);
            }

            if (!models.hasOwnProperty(toName)) {
                this.$set(models, toName, 0);
            }
        },
    };
</script>

<style lang="scss" scoped>
    .group {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        grid-gap: 10px;
    }
</style>
