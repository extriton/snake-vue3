<template>
    <button class="btn">
        <slot></slot>
    </button>
</template>

<script>
export default {
    name: 'my-button'
}
</script>

<style lang="scss" scoped>
.btn {
    width: 100%;
    position: relative;
    color: #3d4f61;
    text-decoration: none;
    user-select: none;
    padding: 7px 5px;
    outline: none;
    border-radius: 1px;
    background: linear-gradient(to left, rgba(0,0,0,.3), rgba(0,0,0,.0) 50%, rgba(0,0,0,.3)), linear-gradient(#3f2e21, #292522, #25180d);
    background-size: 100% 100%, auto;
    background-position: 50% 50%;
    box-shadow: inset #25241f 0 -1px 1px, inset 0 1px 1px #333331, #38332d 0 0 0 1px, #000 0 10px 15px -10px;
    transition: 0.2s;
    &:hover {
        background-size: 140% 100%, auto;
        cursor: pointer;
    }
    &:disabled {
        opacity: 0.4;
        &:hover {
            cursor: default
        }
    }
}
</style>