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

            const body = new FormData;

            body.append('photo', photo);


            // Request to server
            const response = await this.$fetch('update-photo', {
                method: 'POST',
                body
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
