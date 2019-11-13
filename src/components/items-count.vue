<template>
    <div class="el-card mb-1 is-always-shadow">
        <div class="el-card__body">
            <strong>Total: {{data.total}}, Loaded: {{data.items.length}}</strong>
        </div>
    </div>
</template>

<script>
    export default {
        props: ['data']
    };
</script>
