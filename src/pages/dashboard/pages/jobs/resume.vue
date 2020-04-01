<template>
    <div v-loading="!resumeData" class="el-card is-always-shadow">
        <template v-if="resumeData">
            <div class="el-card__header">
                <div class="text-center">
                    <div>
                        <img :class="['cv-pic', {shadowed: resume.photo}]"
                             :src="resume.photo?$fileUrl(resume.photo):altPhoto" :alt="resume.name">
                    </div>
                    <div class="mt-1">{{resume['name']}}</div>
                </div>

                <el-button-group class="action-btn-group">
                    <el-tooltip :content="application.shortlisted?'বাছাইকৃত থেকে ডিলিট করুন':'বাছাই করে রাখুন'">
                        <el-button size="medium"
                                   :type="application.shortlisted?'primary':'info'"
                                   icon="fa fa-user-check"
                                   @click="toggleShortlist">
                        </el-button>
                    </el-tooltip>

                    <el-tooltip content="আবেদন ডিলিট করুন">
                        <el-button size="medium"
                                   type="danger"
                                   icon="fa fa-trash"
                                   @click="remove">
                        </el-button>
                    </el-tooltip>
                </el-button-group>

                <el-popover popper-class="popover action-menu" placement="left-start">
                    <el-button class="action-btn" slot="reference" size="small" icon="fas fa-ellipsis-v"
                               @click.stop.prevent=""></el-button>

                    <div class="el-menu">
                        <div class="el-menu-item" @click="toggleShortlist"><i
                                :class="`fa fa-${application.shortlisted?'user-times':'user-check'}`"></i>
                            {{application.shortlisted?'বাছাইকৃত থেকে ডিলিট করুন':'বাছাই করে রাখুন'}}
                        </div>
                        <div class="el-menu-item" @click="remove">
                            <i class="fa fa-trash"></i>আবেদন ডিলিট করুন
                        </div>
                    </div>
                </el-popover>
            </div>

            <div class="el-card__body">

                <table>
                    <tbody>

                    <tr>
                        <th>লিঙ্গ</th>
                        <td>{{resume['gender']}}</td>
                    </tr>

                    <tr>
                        <th>জন্ম তারিখ</th>
                        <td>{{resume['dob'] | bnDate}}</td>
                    </tr>

                    <tr>
                        <th>পিতার নাম</th>
                        <td>{{resume['father']}}</td>
                    </tr>

                    <tr>
                        <th>মাতার নাম</th>
                        <td>{{resume['mother']}}</td>
                    </tr>

                    <tr>
                        <th>মোবাইল নাম্বার</th>
                        <td>{{resume['mobile'] | enToBn}}</td>
                    </tr>

                    <tr>
                        <th>ইমেইল</th>
                        <td>{{resume['email']}}</td>
                    </tr>

                    <tr>
                        <th>বৈবাহিক অবস্থা</th>
                        <td>{{resume['marital_status']}}</td>
                    </tr>

                    <tr>
                        <th>জাতীয়তা</th>
                        <td>{{resume['nationality']}}</td>
                    </tr>
                    </tbody>
                </table>

                <table v-if="getAddress('present_') || getAddress()">
                    <tbody>
                    <tr v-if="getAddress('present_')">
                        <th>বর্তমান ঠিকানা</th>
                        <td>{{getAddress('present_')}}</td>
                    </tr>

                    <tr v-if="getAddress()">
                        <th>স্থায়ী ঠিকানা</th>
                        <td>{{getAddress()}}</td>
                    </tr>
                    </tbody>
                </table>

                <template v-if="educations.length">
                    <h3>শিক্ষা</h3>

                    <table v-for="(education, index) in educations" :key="index">
                        <tbody>
                        <tr>
                            <th>মারহালা</th>
                            <td>{{education.marhala}}</td>
                        </tr>

                        <tr>
                            <th>ফলাফল</th>
                            <td>{{education.result}}</td>
                        </tr>

                        <tr>
                            <th>প্রতিষ্ঠান</th>
                            <td>{{education.madrasa}}</td>
                        </tr>

                        <tr>
                            <th>শিক্ষাবর্ষ</th>
                            <td>{{education.year | enToBn}}</td>
                        </tr>
                        </tbody>
                    </table>
                </template>

                <template v-if="educations.length">
                    <h3>অভিজ্ঞতা</h3>

                    <table v-for="(experience, index) in experiences" :key="index+'e'">
                        <tbody>
                        <tr>
                            <th>প্রতিষ্ঠান</th>
                            <td>{{experience.institute}}</td>
                        </tr>

                        <tr>
                            <th>ঠিকানা</th>
                            <td>{{experience.address}}</td>
                        </tr>

                        <tr>
                            <th>পদ</th>
                            <td>{{experience.designation}}</td>
                        </tr>

                        <tr>
                            <th>দায়িত্ব</th>
                            <td>{{experience.responsibilities}}</td>
                        </tr>

                        </tbody>
                    </table>
                </template>
            </div>
        </template>
    </div>
</template>

<script>
    import {elButton, elPopover, elButtonGroup, elTooltip} from '@/el';
    import deleteConfirmation from '@/pages/dashboard/mixins/delete-confirmation';
    import altPhoto from '@/assets/images/user.svg';

    export default {
        components: {elButton, elPopover, elButtonGroup, elTooltip},
        mixins: [deleteConfirmation],

        data() {
            return {
                altPhoto,
                resumeData: null
            };
        },

        computed: {
            resume() {
                return this.resumeData.resume;
            },

            educations() {
                return this.resumeData.educations;
            },

            experiences() {
                return this.resumeData.experiences;
            },

            application() {
                return this.resumeData.application;
            }
        },

        methods: {
            toggleShortlist() {
                const {application} = this;

                this.$fetch(`job-applications/${application.id}`, {
                    method: 'PATCH'
                }).response()
                    .then(response => {
                        if (response.status === 200 || response.status === 204) {
                            application.shortlisted = !application.shortlisted;
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


            async remove() {
                const confirmed = await this.confirm();

                if (!confirmed) {
                    return;
                }

                const response = await this.$fetch(`job-applications/${this.application.id}`, {
                    method: 'DELETE'
                }).response();

                if (response.status === 200 || response.status === 204) {
                    this.$notify({
                        type: 'success',
                        message: 'ডিলিট করা হয়েছে'
                    });

                    return this.$router.replace('/dashboard/jobs');
                }

                return this.$notify({
                    type: 'error',
                    message: 'Sorry, something went wrong'
                });
            },

            getAddress(state = '') {
                const {resume} = this;

                const village = resume[`${state}village`],
                    thana = resume[`${state}thana`],
                    district = resume[`${state}district`];

                if (village && thana && district) {
                    return `${village}, ${thana}, ${district}`;
                }

                return null;
            }
        },

        async created() {
            const {params} = this.$route;

            const response = await this.$fetch(`job-applications/${params.jobId}?application=${params.application}`).response();

            if (response.status === 422 || response.status === 404) {
                return this.$router.replace({name: 'four-zero-four'});
            }

            this.resumeData = response.json();
        },
    };

</script>

<style lang="scss" scoped>
    @import "../../../../styles/var";

    .el-card {
        position: relative;
    }


    h3 {
        text-indent: 20px;
    }

    table {
        width: 100%;
        border: 1px solid $--border-color-light;
        border-radius: 5px;
        border-collapse: collapse;
        margin-bottom: 50px;
    }

    th {
        padding: 15px;
        text-align: left;
        white-space: nowrap;
    }

    tr:nth-child(even) {
        background: transparentize($--color-primary, 0.95);
    }

    .cv-pic {
        width: 150px;
        border-radius: 4px;
    }

    .shadowed {
        box-shadow: 0 0 5px rgba(0, 0, 0, .2);
    }

    .action-btn {
        position: absolute;
        right: 10px;
        top: 10px;
    }

    .action-btn-group {
        display: none;
    }

    @media all and (min-width: $--md) {
        .action-btn {
            display: none;
        }

        .action-btn-group {
            position: absolute;
            left: 10px;
            top: 10px;
        }

        .el-card:hover .action-btn-group {
            display: block;
        }
    }
</style>
