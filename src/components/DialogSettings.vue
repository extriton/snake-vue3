<template>
    <div class="dialog-settings" v-if="show" @click="hideDialog">
        <div class="dialog-settings__content" @click.stop>
            <div class="settings">
                <div class="game-size">
                    <h2>Game size</h2>
                    <div v-for="(item, index) in gameTypes" :key="'gt' + index">
                        <input type="radio" :id="item.type" :value="index" v-model="settings.gameIndex">
                        <label :for="item.type">{{ item.desc }}</label>
                    </div>
                </div>
                <div class="apple-count">
                    <h2>Apple count</h2>
                    <div v-for="(item, index) in starsCount" :key="'sc' + index">
                        <input type="radio" :id="'sc' + index" :value="index" v-model="settings.starsIndex">
                        <label :for="'sc' + index">{{ item }}</label>
                    </div>
                </div>
            </div>
            <div class="buttons">
                <my-button class="button" @click="onConfirm">Ok</my-button>
                <my-button class="button" @click="hideDialog">Cancel</my-button>
            </div>
        </div>
    </div>
</template>

<script>
import { gameTypes, starsCount } from '@/consts/settings'

export default {
    name: 'dialog-settings',
    props: {
        show: {
            type: Boolean,
            default: false
        },
        gameIndex: {
            type: Number,
            required: true
        },
        starsIndex: {
            type: Number,
            required: true
        }
    },
    data () {
        return {
            gameTypes,
            starsCount,
            settings: {
                gameIndex: this.gameIndex,
                starsIndex: this.starsIndex
            }
        }
    },
    methods: {
        hideDialog() {
            this.$emit('update:show', false)
        },
        onConfirm() {
            this.$emit('update:gameIndex', this.settings.gameIndex)
            this.$emit('update:starsIndex', this.settings.starsIndex)
            this.hideDialog()
        }
    },
    emits: ['update:show', 'update:gameIndex', 'update:starsIndex']
}
</script>

<style lang="scss" scoped>
.dialog-settings {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, .8);
    border-radius: 10px;
    &:hover {
        cursor: pointer;
    }
    display: flex;
    justify-content: center;
    align-items: center;
    &__content {
        width: 400px;
        background: linear-gradient(to right, rgb(7, 36, 51) -50%, rgb(17, 46, 61) 150%);
        border-radius: 5px;
        padding: 15px;
        border: 1px solid #333;
        box-shadow: #333 2px 2px 3px;
        &:hover {
            cursor: default;
        }
        .settings {
            display: flex;
            justify-content: space-between;
            .game-size, .apple-count {
                width: 45%;
                h2 {
                    color: brown;
                    margin-bottom: 20px;
                    font-size: 20px;
                    border-bottom: 1px solid brown;
                    text-shadow: 2px 2px 3px rgba(0, 0, 0, 1.0);
                }
                label {
                    margin-left: 8px;
                    position: relative;
                    top: 1px;
                    color: teal;
                    text-shadow: 2px 4px 3px rgba(0, 0, 0, 1.0);
                }
                div {
                    margin-bottom: 15px;
                }
            }
        }
        .buttons {
            margin-top: 20px;
            display: flex;
            justify-content: space-around;
            & > button {
                width: 40%;
            }
        }
    }
}
</style>