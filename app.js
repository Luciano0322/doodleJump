document.addEventListener('DOMContentLoaded', () => {
    const root = document.querySelector('.root')
    const doodler = document.createElement('div')
    let doodlerLeftSpace = 80
    let doodlerBottomSpace = 150
    let isGameOver = false
    let platformCount = 5
    let platforms = []
    let upTimerId
    let downTimerId

    function createDoodler() {
        root.appendChild(doodler)
        doodler.classList.add('doodler')
        doodler.style.left = doodlerLeftSpace + 'px'
        doodler.style.bottom = doodlerBottomSpace + 'px'
    }

    class Platform {
        constructor(newPlatBottom) {
            this.bottom = newPlatBottom
            this.left = Math.random() * 315 //要依你的平台寬而定
            this.visual = document.createElement('div')

            const visual = this.visual
            visual.classList.add('platform')
            visual.style.left = this.left + 'px'
            visual.style.bottom = this.bottom + 'px'
            root.appendChild(visual)
        }
    }

    function createPlatforms() {
        for (let i = 0; i < platformCount; i++) {
            let platformGap = 600 / platformCount
            let newPlatBottom = 100 + i * platformGap
            let newPlatform = new Platform(newPlatBottom)
            platforms.push(newPlatform)
            console.log(platforms);
        }
    }

    function movePlatforms() {
        if (doodlerBottomSpace > 200) {
            platforms.forEach(platform => {
                platform.bottom -= 4
                let visual = platform.visual
                visual.style.bottom = platform.bottom + 'px'
            })
        }
    }
    
    function jump() {
        upTimerId = setInterval(() => {
            doodlerBottomSpace += 20
            doodler.style.bottom = doodlerBottomSpace + 'px'
            if(doodlerBottomSpace > 350) {
                fall()
            }
        }, 30)
    }

    function fall() {
        clearInterval(upTimerId)
        downTimerId = setInterval(() => {
            doodlerBottomSpace -= 5
            doodler.style.bottom = doodlerBottomSpace + 'px'
            if (doodlerBottomSpace <= 0) {
                gameOver()
            }
        }, 30)
    }

    function gameOver() {
        console.log('game over');
        isGameOver = true
        clearInterval(upTimerId)
        clearInterval(downTimerId)
    }

    function start() {
        if (!isGameOver) {
            createDoodler()
            createPlatforms()
            setInterval(movePlatforms, 30)
            jump()
        }
    }
    //碰到底部
    start()
});