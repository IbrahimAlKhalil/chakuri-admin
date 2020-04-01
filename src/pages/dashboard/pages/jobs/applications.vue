<template>
    <data-list endpoint="job-applications"
               title="Job"
               :decorator="decorate"
               :per-page="9"
               :query="query"
               :actions="['delete']"
               @deleted="resetList">

        <template v-if="!$store.state.isMobile" #inputs="{methods}">
            <div class="p-1 flex align-center">
                <el-select placeholder="ফিল্টার" v-model="query.show" @change="methods.reset">
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

            <div v-if="job" class="el-card mb-1 is-always-shadow">
                <div class="el-card__body text-center">

                    <router-link :to="`/jobs/${job.id}`" class="link job-name">{{job.name}}</router-link>
                    <el-divider/>
                    <strong>মোট {{data.total|enToBn()}} টি আবেদন</strong>
                </div>
            </div>

            <div class="wrapper">
                <div v-for="(item, index) in data.items" :key="index"
                     :class="['el-card item','is-always-shadow', {checked: item.checked}]"
                     @click="methods.check(item)">

                    <el-checkbox v-show="item.checked" class="checkbox" size="medium"
                                 v-model="item.checked"></el-checkbox>


                    <div v-if="item.shortlisted" class="el-badge special">
                        <span class="el-badge__content el-badge__content--success">বাছাইকৃত</span>
                    </div>

                    <el-popover popper-class="popover action-menu" placement="left-start">
                        <el-button class="action-btn" slot="reference" size="small" icon="fas fa-ellipsis-v"
                                   @click.stop.prevent=""></el-button>

                        <div class="el-menu">
                            <div class="el-menu-item" @click="showResume(item)">
                                <i class="fa fa-file"></i> পূর্ণ জীবনবৃত্তান্ত দেখুন
                            </div>
                            <div class="el-menu-item" @click="toggleShortlist(item)"><i
                                    :class="`fa fa-${item.shortlisted?'user-times':'user-check'}`"></i>
                                {{item.shortlisted?'বাছাইকৃত থেকে ডিলিট করুন':'বাছাই করে রাখুন'}}
                            </div>
                            <div class="el-menu-item" @click="methods.removeItem(item)">
                                <i class="fa fa-trash"></i>আবেদন ডিলিট করুন
                            </div>
                        </div>
                    </el-popover>

                    <div class="el-card__header flex flex-wrap justify-center">
                        <img :src="item.photo?$fileUrl(item.photo):altPhoto" :alt="item.name">

                        <div class="w-100 text-center mt-1" v-highlight="data.highlight">{{item.name}}</div>
                    </div>

                    <div class="el-card__body">
                        <div class="mt-1">
                            <strong>মোবাইল নম্বরঃ</strong> {{item.mobile | enToBn}}
                        </div>
                        <div v-if="item.email" class="mt-1">
                            <strong>ইমেইলঃ</strong> {{item.email}}
                        </div>
                        <div v-if="item.dob" class="mt-1">
                            <strong>জন্ম তারিখঃ</strong> {{item.dob | bnDate}}
                        </div>
                        <div class="mt-1">
                            <strong>আবেদনের তারিখঃ</strong> {{item.created_at | bnDate}}
                        </div>
                    </div>
                </div>
            </div>
        </template>
    </data-list>
</template>

<script>
    import {elButton, elRadioButton, elTooltip, elSelect, elOption, elCheckbox, elPopover, elDivider} from '@/el';
    import dataList from '@/components/data-list/lazy';
    import itemsCount from '@/components/items-count';
    import altPhoto from '@/assets/images/user.svg';

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
            elDivider
        },

        data() {
            const parent = this.$route.params.id;

            return {
                altPhoto,
                query: {
                    show: 'all',
                    parent
                },

                filters: [
                    {
                        label: 'সবগুলো',
                        value: 'all'
                    }, {
                        label: 'বাছাইকৃত',
                        value: 'shortlisted'
                    }, {
                        label: 'বাছাইকৃত ব্যাতিত',
                        value: 'not-shortlisted'
                    }
                ],

                job: null
            };
        },

        methods: {
            decorate(item) {
                item.checked = false;

                return item;
            },

            resetList({methods}) {
                methods.reset();
            },

            toggleShortlist(item) {
                this.$fetch(`job-applications/${item.id}`, {
                    method: 'PATCH'
                }).response()
                    .then(response => {
                        if (response.status === 200 || response.status === 204) {
                            item.shortlisted = !item.shortlisted;
                            return this.$notify({
                                type: 'success',
                                message: 'প্রক্রিয়াটি সফলভাবে সম্পন্ন হয়েছে'
                            });
                        }

                        return this.$notify({
                            type: 'error',
                            message: 'কিছু ভুল হয়েছে দয়া করে পরে চেষ্টা করুন'
                        });
                    });
            },

            showResume(item) {
                const parent = this.$route.params.id;

                this.$router.push({
                    name: 'resume',
                    params: {
                        jobId: parent,
                        application: item.id
                    }
                });
            }
        },

        created() {
            this.$fetch(`jobs/${this.$route.params.id}`).response()
                .then(response => {
                    if (response.status === 404) {
                        return this.$router.replace({name: 'four-zero-four'});
                    }

                    this.job = response.json();
                });
        }
    };
</script>

<style lang="scss" scoped>
    @import '../../../../styles/var';

    .wrapper {
        display: grid;
        gap: 15px;
    }

    img {
        width: 110px;
        border-radius: 5px;
        background: #fff;
        display: block;
        margin: 0;
    }

    .item {
        padding: 0;
        word-break: break-all;
        position: relative;
        cursor: pointer;
        display: block;

        &.checked {
            border: 3px solid $--color-primary;
        }
    }

    .checkbox {
        position: absolute;
        left: 20px;
        top: 20px;
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

    .job-link {
        font-size: 1.2rem;
    }

    @media all and (min-width: $--md) {
        .wrapper {
            grid-template-columns: repeat(3, minmax(200px, 1fr));
        }
    }
</style>
