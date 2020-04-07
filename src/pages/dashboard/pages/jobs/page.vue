<template>
    <data-list endpoint="dashboard/jobs"
               title="Job"
               :decorator="decorate"
               :per-page="9"
               :query="query"
               :actions="['create']"
               @deleted="resetList"
               :before-create="create">

        <template v-if="!$store.state.isMobile" #inputs="{methods}">
            <div class="p-1 flex align-center">
                <el-select placeholder="Filter" v-model="query.show" @change="methods.reset">
                    <el-option v-for="(option, index) in filters" :value="option.value" :label="option.label"
                               :key="index"></el-option>
                </el-select>
            </div>
        </template>

        <template v-if="$store.state.isMobile" #after-toolbar="{methods}">
            <div class="p-1 flex align-center">
                <div class="mr-1">
                    ফিল্টারঃ
                </div>
                <div>
                    <el-select placeholder="ফিল্টার" v-model="query.show" @change="methods.reset">
                        <el-option v-for="(option, index) in filters" :value="option.value" :label="option.label"
                                   :key="index"></el-option>
                    </el-select>
                </div>
            </div>
        </template>

        <template #default="{data, methods}">

            <items-count :data="data"/>

            <div class="wrapper">
                <a v-for="(item, index) in data.items" :key="index"
                   class="el-card item is-always-shadow no-underline"
                   :href="`https://khidmatbd.com/jobs/${item.id}`" target="_blank">

                    <div v-if="item.special" class="el-badge special">
                        <span class="el-badge__content el-badge__content--success">জরুরি নিয়োগ</span>
                    </div>

                    <el-popover popper-class="popover action-menu" placement="left-start">
                        <el-button class="action-btn" slot="reference" size="small" icon="fas fa-ellipsis-v"
                                   @click.stop.prevent=""></el-button>

                        <div class="el-menu">
                            <div class="el-menu-item" @click="edit(item)"><i class="fa fa-edit"></i> Edit</div>
                            <div class="el-menu-item" @click="methods.removeItem(item)">
                                <i class="fa fa-trash"></i> Delete
                            </div>
                        </div>
                    </el-popover>

                    <div class="el-card__header flex flex-wrap justify-center">
                        <div class="w-100 text-center mt-1" v-highlight="data.highlight">{{item.position}}</div>
                    </div>

                    <div class="el-card__body">
                        <div class="mt-1">
                            <strong>Address: </strong> <span v-highlight="data.highlight">{{item.thana}}, {{item.district}}</span>
                        </div>

                        <div class="mt-1">
                            <strong>Created At:</strong> {{item.created_at | bnDate}}
                        </div>
                        <div class="mt-1">
                            <strong>Expiry Date:</strong> {{item.deadline | bnDate}}
                        </div>
                    </div>
                </a>
            </div>
        </template>
    </data-list>
</template>

<script>
    import {elButton, elCheckbox, elOption, elPopover, elRadioButton, elSelect, elTooltip} from '@/el';
    import dataList from '@/components/data-list/paginated';
    import itemsCount from '@/components/items-count';

    export default {

        components: {
            itemsCount,
            dataList,
            elButton,
            elRadioButton,
            elTooltip,
            elSelect,
            elOption,
            elCheckbox,
            elPopover,
        },

        data() {
            return {
                query: {
                    show: 'all',
                },

                filters: [
                    {
                        label: 'All',
                        value: 'all',
                    }, {
                        label: 'Only Mine',
                        value: 'mine',
                    },
                ],
            };
        },

        methods: {
            create() {
                this.$router.push('/dashboard/post-job');
            },

            decorate(item) {
                return item;
            },

            resetList({methods}) {
                methods.reset();
            },

            edit(item) {
                return this.$router.push(`/dashboard/post-job/${item.id}`);
            },
        },
    };
</script>

<style lang="scss" scoped>
    @import '../../../../styles/var';

    .wrapper {
        display: grid;
        gap: 15px;
    }

    .item {
        padding: 0;
        word-break: break-all;
        position: relative;
        cursor: pointer;
        display: block;
    }

    .action-menu {
        z-index: 200 !important;
    }

    .action-btn {
        position: absolute;
        right: 10px;
        top: 10px;
    }

    .special {
        position: absolute;
        top: -2px;
        left: -2px;
        padding: 0;

        .el-badge__content {
            border-radius: 0 !important;
        }
    }

    .msg {
        margin-top: 12px;
        border: 2px solid #ef6b6c;
        padding: 4px;
        border-radius: 3px;
        font-weight: bold;
    }

    @media all and (min-width: $--md) {
        .wrapper {
            grid-template-columns: repeat(3, minmax(200px, 1fr));
        }
    }
</style>
