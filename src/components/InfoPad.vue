<template>
<div class="info-pad">
    <div class="info-pad__row green">
        <div><i class="fa fa-apple"></i></div>
        <div>{{ score.green }}</div>
    </div>
    <div class="info-pad__row yellow">
        <div><i class="fa fa-apple"></i></div>
        <div>{{ score.yellow }}</div>
    </div>
    <div class="info-pad__row red">
        <div><i class="fa fa-apple"></i></div>
        <div>{{ score.red }}</div>
    </div>
    <br />
    <div class="info-pad__row total">
        <div>Total:</div>
        <div>{{ score.total }}</div>
    </div>
    <div class="info-pad__row total">
        <div>Level:</div>
        <div>{{ score.level }}</div>
    </div>
</div>
</template>

<script>
export default {
    name: 'InfoPad',
    props: {
        score: {
            type: Object,
            required: true
        }
    }
}
</script>

<style lang="scss" scoped>
.info-pad {
    text-shadow: 2px 4px 3px rgba(0, 0, 0, 0.3);
    &__row {
        display: flex;
        justify-content: space-between;
        border: 1px solid teal;
        border-radius: 20px;
        padding: 5px 10px;
        margin-bottom: 5px;
        text-shadow: 2px 4px 3px rgba(0, 0, 0, 1.0);
        &.green { color: #0BF410; }
        &.yellow { color: #F1C40F; }
        &.red { color: #F80A0A; }
        &.total { color: #CACACA; }
    }
}
</style>