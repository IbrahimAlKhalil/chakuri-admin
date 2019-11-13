<template>
    <section>
        <template v-if="!notFound">
            <template v-if="!job">
                <div v-loading="true">
                    <br><br><br>
                    <br><br><br>
                </div>

                <div v-loading="true">
                    <br><br><br>
                    <br><br><br>
                </div>
            </template>

            <template v-else>
                <el-card>
                    <div class="title flex justify-between align-center">
                        <h2>{{job.institute}}</h2>
                        <div v-if="!authenticated || normalUser" :class="`favorite-btn${favorite?' favorite':''}`"
                             @click="makeFavorite"><i
                                class="fas fa-heart"></i></div>
                    </div>
                    <p class="pos"><b>{{job.position}}</b></p>
                    <el-divider/>
                    <template v-if="job.vacancy">
                        <h4>লোক লাগবে</h4>
                        <p class="data">{{job.vacancy | enToBn}} জন</p>
                    </template>

                    <h4>চাকরীর ধরন</h4>
                    <p class="data">{{job.nature}}</p>
                    <h4>দায়িত্ব</h4>
                    <div>
                        <ul>
                            <li v-for="(item, index) in responsibilities" :key="index">{{item}}</li>
                        </ul>
                    </div>

                    <h4>আবেদনকারীর জন্য আবশ্যকীয়</h4>
                    <div>
                        <ul>
                            <li v-for="(item, index) in additinal" :key="index">{{item}}</li>
                        </ul>
                    </div>
                    <h4>বেতন</h4>
                    <p class="data">{{salary}} {{job.nature?'(আলোচনা সাপেক্ষে)':''}}</p>
                    <h4>ঠিকানা</h4>
                    <p class="data">{{job.location}}</p>
                </el-card>

                <div>
                    <el-card>
                        <div class="sidebar-job-info">
                            <p>
                                <span>বয়সঃ</span>
                                <span>&nbsp;&nbsp; {{job.age_from | enToBn}} - {{job.age_to | enToBn}} বছর</span>
                            </p>

                            <p>
                                <span>লিঙ্গঃ</span>
                                <span>&nbsp;&nbsp; {{job.gender}}</span>
                            </p>

                            <p>
                                <span>শিক্ষাগত যোগ্যতাঃ</span>
                                <span>&nbsp;&nbsp; {{job.education}}</span>
                            </p>

                            <p>
                                <span>অভিজ্ঞতাঃ</span>
                                <span>&nbsp;&nbsp; {{job.experience_from | enToBn}} - {{job.experience_to | enToBn}} বছর</span>
                            </p>

                            <p>
                                <span>আবেদনের শেষ তারিখঃ</span>
                                <span>&nbsp;&nbsp; {{job.deadline | bnDate}}</span>
                            </p>
                        </div>
                    </el-card>

                    <el-card v-if="!authenticated || normalUser" class="mt-1 text-center">
                        <el-button v-if="!applied" type="primary" size="big"
                                   :icon="applying?'el-icon-loading':'fab fa-telegram-plane'"
                                   @click="apply" :disabled="applying">&nbsp;&nbsp;
                            আবেদন করুন
                        </el-button>

                        <el-button v-else type="info" size="big" icon="fas fa-check">&nbsp;&nbsp;
                            আপনি ইতিমধ্যে এই কাজের জন্য আবেদন করেছেন
                        </el-button>
                    </el-card>
                </div>

            </template>
        </template>

        <template v-else>
            <four-zero-four/>

            <div class="el-card"></div>
        </template>
    </section>
</template>

<script>
    import {elCard, elDivider, elButton} from '@/el';
    import fourZeroFour from '@/components/four-zero-four';

    export default {
        components: {elCard, elDivider, elButton, fourZeroFour},

        data() {
            return {
                job: null,
                applied: false,
                favorite: false,
                applying: false,
                notFound: false
            };
        },

        methods: {

            async apply() {
                if (!this.$auth.user) {
                    this.$router.push('/sign-in');
                }


                const {job} = this;

                this.applying = true;

                const response = await this.$fetch('applications', {
                    method: 'POST',
                    body: {
                        id: job.id
                    }
                }).response();

                this.applying = false;

                if (response.status !== 200) {
                    return this.$notify({
                        type: 'error',
                        message: response.text
                    });
                }

                this.applied = true;

                return this.$notify({
                    type: 'success',
                    message: response.text
                });
            },

            async makeFavorite() {
                if (!this.$auth.user) {
                    this.$router.push('/sign-in');
                }

                const {job} = this;

                const response = await this.$fetch('favorites', {
                    method: 'POST',
                    body: {
                        id: job.id
                    }
                }).response();

                if (response.status === 200) {
                    this.favorite = !this.favorite;
                }
            }
        },

        computed: {

            responsibilities() {
                return this.job.responsibilities.split('\n');
            },

            additinal() {
                return this.job.additional.split('\n');
            },

            salary() {
                const {salary_from, salary_to} = this.job;
                const enToBn = this.$enToBn;

                if (salary_from === 0) {
                    return `${enToBn(salary_from)} টাকা (মাসিক)`;
                }

                if (salary_from === salary_to) {
                    return `${enToBn(salary_from)} টাকা (মাসিক)`;
                }

                return enToBn(`${salary_from} - ${salary_to}  টাকা (মাসিক)`);
            },

            authenticated() {
                return !!this.$auth.user;
            },

            normalUser() {
                return this.authenticated && this.$auth.user.type === 1;
            }
        },

        async created() {
            const {id} = this.$route.params;
            const urls = [`job-filter/${id}`];

            if (this.normalUser) {
                urls.push(`favorite-and-applied/${id}`);
            }

            const responses = await Promise.all(urls.map(url => this.$fetch(url).response()));

            if (responses[0].status === 404) {
                this.notFound = true;
                return;
            }

            this.job = responses[0].json();

            if (this.normalUser) {
                const favoriteAndApplied = responses[1].json();

                this.favorite = favoriteAndApplied.favorite;
                this.applied = favoriteAndApplied.applied;
            }
        }
    };
</script>

<style lang="scss" scoped>
    @import "../../styles/var";

    section {
        padding: 15px;
        display: grid;
        grid-gap: 15px;
        align-items: start;

        @media all and (min-width: $--md) {
            grid-template-columns: 10fr 5fr;
        }
    }

    .title {
        color: $--color-primary;
    }

    .sidebar-job-info {
        p span:first-child {
            font-weight: bold;
        }
    }

    .pos {
        color: #000;
    }

    .data {
        text-indent: 1rem;
    }

    .favorite {
        color: #ff004c !important;
    }

    .favorite-btn {
        font-size: 2em;
        color: #989898;
        margin: 0 10px;
        cursor: pointer;
    }
</style>
