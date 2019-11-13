export default {
    data() {
        return {
            photo: null,
            loading: false,
        };
    },

    methods: {
        async save(photo) {
            // Show spinner
            this.loading = true;
            this.photo = null;
            this.$refs[this.reset].reset();


            // Request to server
            const response = await this.$fetch('update-photo', {
                method: 'POST',
                body: {photo}
            }).response();

            this.loading = false;

            if (response.status !== 200) {
                return this.$notify({
                    type: 'error',
                    message: response.text
                });
            }

            this.$store.commit('auth/updateUser', {
                prop: 'photo',
                value: response.text
            });
        },

        crop(evt) {
            const file = evt.target.files[0];

            if (!file) {
                return;
            }

            this.photo = URL.createObjectURL(file);
        },

        cancel() {
            this.photo = null;
            this.$refs[this.reset].reset();
        }
    }
};
