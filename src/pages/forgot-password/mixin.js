import {elForm, elFormItem, elInput, elButton} from '@/el';

export default {
    components: {elForm, elFormItem, elInput, elButton},

    data() {
        return {
            loading: false,
        };
    },

    methods: {
        requiredRule(suffix) {
            const please = 'অনুগ্রহ করে আপনার ';

            return {
                required: true,
                message: `${please}${suffix}।`
            };
        }
    }
};
