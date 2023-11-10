<template>
    <div class="control-buttons">
        <my-button
            @click="$emit('start')"
        >
            {{ !isStarted ? 'Start (R)' : 'Restart (R)' }}
        </my-button>

        <my-button
            style="margin-top: 10px;"
            :class="{ disabled: !isStarted }"
            :disabled="!isStarted || isGameOver"
            @click="$emit('pause')"
        >
            {{ !isPaused ? 'Pause (P)' : 'Continue (P)' }}
        </my-button>

        <my-button
            style="margin-top: 10px;"
            @click="$emit('settings')"
        >
            Settings (S)
        </my-button>
    </div>
</template>

<script>
export default {
    name: 'ControlButtons',
    props: {
        isStarted: {
            type: Boolean,
            required: true
        },
        isPaused: {
            type: Boolean,
            required: true
        },
        isGameOver: {
            type: Boolean,
            required: true
        },
    },
    emits: ['start', 'pause', 'settings']
}
</script>

<style lang="scss" scoped>

</style>