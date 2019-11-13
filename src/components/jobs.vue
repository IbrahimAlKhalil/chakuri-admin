<template>
    <div class="wrapper">
        <div v-for="(job, index) in jobs" :key="index" :class="job.focus?'focused':''">
            <router-link class="job" :to="`/jobs/${job.id}`">
                <div class="flex">
                    <div v-if="job.logo">
                        <img :src="job.logo | fileUrl" :alt="job.institute">
                    </div>

                    <div class="title-wrapper">
                        <div class="name" v-highlight="{keyword, sensitive: false}">{{job.institute}}</div>
                        <div class="title" v-highlight="{keyword, sensitive: false}">{{job.position}}</div>
                    </div>
                </div>

                <div class="info mt-1">
                    <div class="row">
                        <div><i :class="showDeadline?'fas fa-clock':'fas fa-graduation-cap'"></i>&nbsp&nbsp;<span
                                class="requirement">{{showDeadline?deadline(job.deadline):job.education}}</span>
                        </div>
                        <div><i class="fas fa-briefcase"></i>&nbsp&nbsp;<span class="requirement">{{experience(job)}} (অভিজ্ঞতা)</span>
                        </div>
                    </div>

                    <div class="row">
                        <div><i class="fas fa-map-marked-alt"></i>&nbsp&nbsp;<span
                                class="requirement" v-highlight="{keyword, sensitive: false}">{{job.thana}}, {{job.district}}</span>
                        </div>
                        <div><b>৳</b>&nbsp&nbsp;<span
                                class="requirement">{{salary(job)}}</span>
                        </div>
                    </div>
                </div>
            </router-link>
            <slot v-bind:item="job"/>
        </div>
    </div>
</template>

<script>

    export default {
        props: ['jobs', 'keyword', 'show-deadline'],
        methods: {
            experience(job) {
                const enToBn = this.$enToBn;

                let experience;

                if (job.experience_from === job.experience_to || job.experience_from === 0) {
                    experience = enToBn(job.experience_from) + ' বছর';
                } else {
                    experience = `${enToBn(job.experience_from)} - ${enToBn(job.experience_to)} বছর`;
                }

                return experience;
            },

            salary(job) {
                const enToBn = this.$enToBn;
                let salary;

                if (job.salary_from === job.salary_to || job.salary_from === 0) {
                    salary = enToBn(job.salary_from) + ' টাকা (মাসিক)';
                } else {
                    salary = `${enToBn(job.salary_from)} - ${enToBn(job.salary_to)} টাকা (মাসিক)`;
                }

                return salary;
            },

            deadline(deadline) {
                const date = new Date(deadline);

                return this.$bnDate(date);
            }
        }
    };
</script>

<style lang="scss" scoped>
    @import "../styles/var";

    .wrapper {
        display: grid;
        grid-template-columns: repeat(1, minmax(300px, 1fr));
        gap: 15px;
        grid-area: jobs;
    }

    img {
        width: 60px;
        border-radius: $--border-radius-circle;
        box-shadow: $--box-shadow-base;
        background: #fff;
    }

    .job {
        min-height: 140px;
        display: flex;
        flex-wrap: wrap;
        padding: 10px;
        border-radius: $--card-border-radius;
        box-shadow: $--box-shadow-base;
        background: #fff;
        text-decoration: none;
        color: $--color-secondary;
        transition: all 150ms ease-in-out;

        &:hover {
            transform: scale(1.02);
            background: $--color-secondary;
            color: #fff;
        }
    }

    .requirement {
        font-weight: bold;
    }

    .name {
        text-shadow: 0 0;
        font-size: 1.1em;
    }

    .title {
        font-size: 0.9em;
        margin-top: 10px;
        color: #52d0d3;
        font-weight: bold;
    }

    .title-wrapper {
        margin-left: 15px;
    }

    .info {
        align-self: flex-end;
        width: 100%;
        display: grid;
        grid-template-columns: 1fr 1fr;
        grid-gap: 15px;
    }

    .row > div {
        margin-top: 8px;
    }

    .focused {
        border: 2px solid #32ff32;
    }

    @media all and (min-width: $--md) {
        .wrapper {
            grid-column-start: 2;
            grid-template-columns: repeat(2, minmax(300px, 1fr));
        }
    }
</style>
