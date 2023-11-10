<template>
<div class="gameover">
    <slot></slot>
</div>
</template>

<script>
export default {

}
</script>

<style lang="scss" scoped>
.gameover {
    width: 260px;
    padding: 10px 20px;
    font-family: "Comic Sans MS", sans;
    font-weight: bold;
    font-style: italic;
    font-size: 36px;
    line-height: 36px;
    color: red;
    border: 1px solid #000;
    border-radius: 8px;
    background-color: #444;
    position: absolute;
    text-align: center;
    text-shadow: 2px 2px 3px black;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}
</style>