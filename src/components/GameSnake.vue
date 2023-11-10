<template>
<div class="snake-wrapper">
    <!-- Game area -->
    <div class="game-area" :style="gameAreaSize">
        <div v-if="isStarted">
            <!-- Stars -->
            <div v-for="(star, index) in game.starsHtml" :key="'st' + index"
                 class="star"
                 :class="star._class"
                 :style="star._style"
            >
                <i class="fa fa-apple"></i>
            </div>
            <!-- Snake -->
            <div v-for="(ball, index) in game.snake" :key="'sn' + index" class="snake" :style="ballStyle(ball)">
                <span v-show="ball.head"><i class="fa fa-meh-o"></i></span>
                <span v-show="!ball.head" class="ball-body"></span>
            </div>
        </div>
        <!-- Game over -->
        <game-over v-show="isGameOver">Game Over</game-over>
    </div>
    <!-- Game control -->
    <div class="game-control">
        <info-pad
            :score="score"
        >
        </info-pad>
        <control-buttons
            :isStarted="isStarted"
            :isPaused="isPaused"
            :isGameOver="isGameOver"
            @start="onStart()"
            @pause="onPause()"
            @settings="onSettings()"
        >
        </control-buttons>
    </div>
    <!-- Modal: Game settings -->
    <dialog-settings
        v-model:show="isShowModal"
        v-model:gameIndex="gameIndex"
        v-model:starsIndex="starsIndex"
    >
    </dialog-settings>
</div>
</template>

<script>
import InfoPad from '@/components/InfoPad.vue'
import ControlButtons from '@/components/ControlButtons.vue'
import GameOver from '@/components/GameOver.vue'
import DialogSettings from '@/components/DialogSettings.vue'

import { gameTypes, starsCount } from '@/consts/settings'
import { MOVE_KEYS, CONTROL_KEYS } from '@/consts/keyCodes'
import { random } from '@/helpers/random'
import { playSound } from '@/helpers/playSound'

const KEY_CODE = {...MOVE_KEYS, ...CONTROL_KEYS}

export default {
    name: 'GameSnake',
    components: {
        InfoPad,
        ControlButtons,
        GameOver,
        DialogSettings
    },
    data() {
        return {
            gameIndex: 0,
            starsIndex: 0,
            score: {
                green: 0,
                yellow: 0,
                red: 0,
                total: 0,
                level: 1
            },
            isStarted: false,
            isPaused: false,
            isGameOver: false,
            game: {
                nextStep: 1,
                direction: 'down',
                nextDirection: 'down',
                speed: 100,
                count: 0,
                stars: new Array(),
                starsHtml: new Array(),
                snake: new Array(),
                intervalId: null,
                starsGreen: 0,
                starsYellow: 0,
                starsRed: 0,
            },
            isShowModal: false
        }
    },
    computed: {
        hSize () {
            return gameTypes[this.gameIndex].h_size
        },
        wSize () {
            return gameTypes[this.gameIndex].w_size
        },
        gameAreaSize () {
            return {
                width: 16 * this.wSize + 'px',
                height: 16 * this.hSize + 'px'
            }
        },
        starsCnt () {
            return starsCount[this.starsIndex]
        },
    },
    methods: {
        ballStyle (ball) {
            const res = {
                top: ball.y*16,
                left: ball.x*16,
                'transition-duration': this.game.speed / 1000 + 's',
                '-webkit-transition-duration': this.game.speed / 1000 + 's',
            }

            if (ball.x == ball.next_x) {
                if (ball.next_y > ball.y ) res.top += this.game.nextStep*4;
                else res.top -= this.game.nextStep*4;
            }
            if (ball.y == ball.next_y) {
                if (ball.next_x > ball.x ) res.left += this.game.nextStep*4;
                else res.left -=this.game.nextStep*4;
            }

            res.top += 'px'
            res.left += 'px'
            return res
        },
        onStart () {
            this.reset()
            this.start()
        },
        onPause () {
            if (this.isStarted && !this.isGameOver)
                this.isPaused = !this.isPaused
        },
        onSettings () {
            this.isPaused = true
            this.isShowModal = true
        },
        reset () {
            // Reset flags
            this.isStarted = false
            this.isPaused = false
            this.isGameOver = false

            // Reset score params
            this.score.green = 0
            this.score.yellow = 0
            this.score.red = 0
            this.score.total = 0
            this.score.level = 1

            // Reset game params
            this.game.nextStep = 1
            this.game.direction = 'down'
            this.game.nextDirection = 'down'
            this.game.speed = 100
            this.game.count = 0
            this.game.stars = new Array()
            this.game.starsHtml = new Array()
            this.game.snake = new Array()

            if (this.intervalId !== null) {
                clearInterval(this.intervalId)
                this.intervalId = null
            }
        },
        start () {

            // Init stars array
            this.game.stars = new Array(this.hSize)
            for (let i = 0; i < this.hSize; i++) {
                this.game.stars[i] = new Array(this.wSize)
                for (let j = 0; j < this.wSize; j++)
                    this.game.stars[i][j] = 0
            }
            // Init stars count
            this.game.starsRed = Math.floor(0.1 * this.starsCnt + 0.5)
            this.game.starsYellow = 2 * this.game.starsRed
            this.game.starsGreen = this.starsCnt - (this.game.starsYellow + this.game.starsRed)
            // Init snake params
            this.game.snake = new Array()
            this.game.snake.push({ x: 1, y: 3, next_x: 1, next_y: 4, head: true })
            this.game.snake.push({ x: 1, y: 2, next_x: 1, next_y: 3, head: false })
            this.game.snake.push({ x: 1, y: 1, next_x: 1, next_y: 2, head: false })

            for (let i = 0; i < this.game.starsGreen; i++) this.addStar(1)
            for (let i = 0; i < this.game.starsYellow; i++) this.addStar(2)
            for (let i = 0; i < this.game.starsRed; i++) this.addStar(3)

            this.runInterval()

            this.isStarted = true
        },
        addStar (colorId) {
            let isBusy = true
            while (isBusy) {

                let i = random(0, this.hSize - 1)
                let j = random(0, this.wSize - 1)

                if (this.game.stars[i][j] != 0) continue
                if (this.game.snake[0].next_y == i && this.game.snake[0].next_x == j) continue

                isBusy = false
                for (let k = 0; k < this.game.snake.length; k++)
                    if (this.game.snake[k].y == i && this.game.snake[k].x == j) { 
                        isBusy = true
                        break
                    }

                if(!isBusy) {
                    let _style = { top: i*16 + 'px', left: j*16 + 'px' }
                    let _class = ''
                    if (colorId == 1) _class = { green: true }
                    if (colorId == 2) _class = { yellow: true }
                    if (colorId == 3) _class = { red: true }
                    
                    this.game.stars[i][j] = colorId
                    this.game.starsHtml.push({ y: i, x: j, colorId: colorId, _class: _class, _style: _style }) 
                    break
                }
            }
        },
        moveSnake () {
            
            if (this.game.nextStep == 1 && !this.checkCrash()) {
                this.isGameOver = true
                playSound(999)
            }

            if(this.game.nextStep == 4) this.checkStar()

            if (this.game.nextStep < 4) {
                this.game.nextStep += 1
            } else {

                for (let i = 0; i < this.game.snake.length; i++) {
                    this.game.snake[i].x = this.game.snake[i].next_x
                    this.game.snake[i].y = this.game.snake[i].next_y
                }

                this.game.direction = this.game.nextDirection

                switch(this.game.direction) {
                    case "left":
                        this.game.snake[0].next_x = this.game.snake[0].x - 1
                        break
                    case "right":
                        this.game.snake[0].next_x = this.game.snake[0].x + 1
                        break
                    case "up":
                        this.game.snake[0].next_y = this.game.snake[0].y - 1
                        break
                    case "down":
                        this.game.snake[0].next_y = this.game.snake[0].y + 1
                        break
                }

                for (let i = 1; i < this.game.snake.length; i++) {
                    this.game.snake[i].next_x = this.game.snake[i - 1].x
                    this.game.snake[i].next_y = this.game.snake[i - 1].y;
                }

                this.game.nextStep = 1
            }
        },
        runInterval () {
            this.intervalId = setInterval(() => {
                if (!this.isPaused && this.isStarted && !this.isGameOver) this.moveSnake()
            }, this.game.speed);
        },
        checkCrash () {
            // Check Crash wall
            switch (this.game.direction) {
                case "up":
                    if(this.game.snake[0].next_y < 0) return false
                    break
                case "down":
                    if(this.game.snake[0].next_y > this.hSize - 1) return false
                    break
                case "left":
                    if(this.game.snake[0].next_x < 0) return false
                    break
                case "right":
                    if(this.game.snake[0].next_x > this.wSize - 1) return false
                    break
            }
            // Check crash snake body
            for (let i = 1; i < this.game.snake.length; i++)
                if (this.game.snake[0].next_x == this.game.snake[i].x && this.game.snake[0].next_y == this.game.snake[i].y) return false

            return true
        },
        checkStar () {
            
            const i = this.game.snake[0].next_y
            const j = this.game.snake[0].next_x
            const colorId = this.game.stars[i][j]
            if (colorId == 0) return

            this.game.stars[i][j] = 0
            for (let k = 0; k < this.game.starsHtml.length; k++)
                if (this.game.starsHtml[k].y == i && this.game.starsHtml[k].x == j) {
                    this.game.starsHtml.splice(k, 1)
                    break
                }

            this.incScore(colorId)
            playSound(colorId)

            let tmpLength
            switch (colorId) {
                case 1:							// Add 1 ball
                    this.addBall()
                    break
                case 2:							// Add 2 ball
                    this.addBall()
                    this.addBall()
                    break
                case 3:							// Divide 2 ball
                    tmpLength = Math.floor(this.game.snake.length / 2 + 0.5)
                    if (tmpLength < 3) tmpLength = 3
                    this.game.snake.splice(tmpLength, this.game.snake.length - tmpLength)
                    break
            }

            this.addStar(colorId)

            // Increase game level and game speed
            if (this.score.total % 10 == 0) {
                this.score.level++
                if (this.game.speed > 30) this.game.speed -= 5
                if (this.intervalId !== null) {
                    clearInterval(this.intervalId)
                    this.intervalId = null
                }
                this.runInterval()
            }

        },
        incScore (colorId) {
            switch (colorId) {
                case 1:            // Green
                    this.score.green += 1
                    break
                case 2:            // Yellow
                    this.score.yellow += 1
                    break
                case 3:            // Red
                    this.score.red += 1
                    break
            }

            this.score.total += 1
        },
        addBall () {
            const lastBall = this.game.snake[this.game.snake.length - 1]
            let tmp_x, tmp_y

            if (lastBall.x == lastBall.next_x) {
                tmp_y = 2*lastBall.y - lastBall.next_y
                this.game.snake.push({
                    x: lastBall.x,
                    y: tmp_y,
                    next_x: lastBall.x,
                    next_y: lastBall.y,
                    head: false
                })
            }

            if(lastBall.y == lastBall.next_y) {
                tmp_x = 2*lastBall.x - lastBall.next_x
                this.game.snake.push({
                    x: tmp_x,
                    y: lastBall.y,
                    next_x: lastBall.x,
                    next_y: lastBall.y,
                    head: false
                })
            }
        },
        keyHandler (e) {

            if (e.keyCode !== KEY_CODE.START && 
                e.keyCode !== KEY_CODE.PAUSE && 
                e.keyCode !== KEY_CODE.SETTINGS &&
                e.keyCode !== KEY_CODE.LEFT &&
                e.keyCode !== KEY_CODE.UP &&
                e.keyCode !== KEY_CODE.RIGHT &&
                e.keyCode !== KEY_CODE.DOWN) return
            
            if (e.keyCode === KEY_CODE.START) this.onStart()
            if (e.keyCode === KEY_CODE.PAUSE) this.onPause()
            if (e.keyCode === KEY_CODE.SETTINGS) this.onSettings()

            if (!this.isStarted || this.isPpaused) return

            switch (e.keyCode) {
                case KEY_CODE.LEFT:
                    if (this.game.direction != "left" && this.game.direction != "right") this.game.nextDirection = "left"
                    break
                case KEY_CODE.UP:
                    if(this.game.direction != "up" && this.game.direction != "down") this.game.nextDirection = "up"
                    break
                case KEY_CODE.RIGHT:
                    if(this.game.direction != "left" && this.game.direction != "right") this.game.nextDirection = "right"
                    break
                case KEY_CODE.DOWN:
                    if(this.game.direction != "up" && this.game.direction != "down") this.game.nextDirection = "down"
                    break
            }
            
            e.preventDefault()
        }
    },
    watch: {
        gameIndex() {
            this.reset()
        },
        starsIndex() {
            this.reset()
        }
    },
    mounted() {
        window.addEventListener('keydown', this.keyHandler)
    },
    beforeUnmount() {
        window.removeEventListener('keydown', this.keyHandler)

        if (this.intervalId !== null) {
            clearInterval(this.intervalId)
            this.intervalId = null
        }

    }
}
</script>

<style lang="scss" scoped>
.snake-wrapper {
    background: linear-gradient(to right, black -50%, rgb(17, 46, 61) 150%);
    padding: 20px;
    border: 1px solid #000;
    border-radius: 10px;
    position: relative;
    display: flex;
    justify-content: space-between;
    .game-area {
        position: relative;
        background-color: #000;
        border-radius: 10px;
        background: linear-gradient(to right, black -50%, rgb(175, 204, 219) 150%);
        .star {
            position: absolute;
            width: 16px;
            height: 16px;
            font-size: 16px;
            text-shadow: 2px 4px 3px rgba(0, 0, 0, 0.3);
            &.green { color: #0BF410; }
            &.yellow { color: #F1C40F; }
            &.red { color: #F80A0A; }
        }
        .snake {
            position: absolute;
            width: 16px;
            height: 16px;
            transition: all .1s linear;
            span {
                display: block;
                width: 16px;
                height: 16px;
                border-radius: 16px;
                font-size: 16px;
                color: black;
                background: linear-gradient(to right, rgb(100, 61, 3) -50%, rgb(230, 180, 17) 150%);
                background: linear-gradient(to right, rgb(88, 86, 235) -50%, rgb(21, 18, 170) 150%);
                &.ball-body {
                    width: 12px;
                    height: 12px;
                    margin: 2px;
                    background: linear-gradient(to right, rgb(88, 86, 235) -50%, rgb(21, 18, 170) 150%);
                    border-radius: 12px;
                }
            }
        }
    }
    .game-control {
        width: 200px;
        margin-left: 30px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
    }
}
</style>