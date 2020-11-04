document.addEventListener('DOMContentLoaded', () => {
    const root = document.querySelector('.root')
    const doodler = document.createElement('div')
    let doodlerLeftSpace = 80
    let startPoint = 150
    let doodlerBottomSpace = startPoint
    let isGameOver = false
    let platformCount = 5
    let platforms = []
    let upTimerId
    let downTimerId
    let isJumping = true
    let isGoingLeft = false
    let isGoingRight = false
    let leftTimerId
    let rightTimerId
    let score = 0

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
                platform.bottom -= 4 //平台移動速度
                let visual = platform.visual
                visual.style.bottom = platform.bottom + 'px'
                
                if (platform.bottom < 10) {
                    let firstPlatform = platforms[0].visual
                    firstPlatform.classList.remove('platform') //將超出的平台去除
                    platforms.shift()
                    score++
                    console.log(platforms);
                    let newPlatform = new Platform(600)
                    platforms.push(newPlatform)
                }
            })
        }
    }
    
    function createDoodler() {
        root.appendChild(doodler)
        doodler.classList.add('doodler')
        doodlerLeftSpace = platforms[0].left
        doodler.style.left = doodlerLeftSpace + 'px'
        doodler.style.bottom = doodlerBottomSpace + 'px'
    }

    function jump() {
        clearInterval(downTimerId)
        isJumping = true
        upTimerId = setInterval(() => {
            console.log(startPoint);
            console.log('1', doodlerBottomSpace);
            doodlerBottomSpace += 20
            doodler.style.bottom = doodlerBottomSpace + 'px'
            console.log('2', doodlerBottomSpace);
            console.log('s', startPoint);
            if(doodlerBottomSpace > startPoint + 200) {
                fall()
                isJumping = false
            }
        }, 30)
    }

    function fall() {
        isJumping = false
        clearInterval(upTimerId)
        downTimerId = setInterval(() => {
            doodlerBottomSpace -= 5
            doodler.style.bottom = doodlerBottomSpace + 'px'
            if (doodlerBottomSpace <= 0) {
                gameOver()
            }
            platforms.forEach(platform => {
                if (
                    (doodlerBottomSpace >= platform.bottom) &&
                    (doodlerBottomSpace <= platform.bottom + 15) && //視平台高而定
                    ((doodlerLeftSpace + 60) >= platform.left) &&
                    (doodlerLeftSpace <= (platform.left + 85)) &&
                    !isJumping
                ) {
                    console.log('landed');
                    startPoint = doodlerLeftSpace
                    jump()
                    console.log('start', startPoint);
                    isJumping = true
                }
            })
        }, 20)
    }

    function moveLeft() {
        if (isGoingRight) {
            clearInterval(rightTimerId)
            isGoingRight = false
        }
        isGoingLeft = true
        leftTimerId = setInterval(() => {
            if (doodlerLeftSpace >= 0) {
                doodlerLeftSpace -=5
                doodler.style.left = doodlerLeftSpace + 'px'
            } else moveRight()        
        }, 20)
    }
    
    function moveRight() {
        if (isGoingLeft) {
            clearInterval(leftTimerId)
            isGoingLeft = false
        }
        isGoingRight = true
        rightTimerId = setInterval(() => {
            //要符合player圖片的大小
            if (doodlerLeftSpace <= 313) {
                console.log('going right');
                doodlerLeftSpace +=5
                doodler.style.left = doodlerLeftSpace + 'px'
            } else moveLeft()
        }, 20)
    }
    
    function moveStraight() {
        isGoingRight = false
        isGoingLeft = false
        clearInterval(rightTimerId)
        clearInterval(leftTimerId)
    }
    
    function control(e){
        doodler.style.bottom = doodlerBottomSpace + 'px'
        if(e.key === "ArrowLeft") {
            moveLeft()
        } else if (e.key === "ArrowRight") {
            moveRight()
        } else if (e.key === "ArrowUp") {
            moveStraight()
        }
    }
    
    function gameOver() {
        isGameOver = true
        while (root.firstChild) {
            console.log('remove');
            root.removeChild(root.firstChild)
        }
        root.innerHTML = score
        clearInterval(upTimerId)
        clearInterval(downTimerId)
        clearInterval(leftTimerId)
        clearInterval(rightTimerId)
    }

    function start() {
        if (!isGameOver) {
            createPlatforms()
            createDoodler()
            setInterval(movePlatforms, 30)
            jump()
            document.addEventListener('keyup', control)
        }
    }
    //碰到底部
    start()
});