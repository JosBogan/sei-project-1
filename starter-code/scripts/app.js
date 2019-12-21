function init() {

  // DOM Variables

  const gameContainer = document.querySelector('.game_container')
  const start = document.querySelector('.start')
  const domScore = document.querySelector('.score')
  // const sideBar = document.querySelector('.side_bar')
  const next = document.querySelector('.next')
  const domBank = document.querySelector('.bank')
  const domPause = document.querySelector('.paused')
  const theme = document.querySelector('#theme')
  const pop = document.querySelector('#pop')

  // Variables 

  const height = 24
  let width = 10
  const sideBarDiff = 6
  const squares = []
  const nextSquares = []
  const bankSquares = []
  let playing = false
  let paused = false
  let x
  let currentBlockInit
  let currentBlock
  let currentInitId
  let currentRotId
  let nextBlockInit
  let nextBlock
  let nextInitId
  let nextRotId
  let timerId = null
  let active = []
  let score = 0
  let speed = 500
  let levelUpScore = 250
  let bankedInit 
  let bankedInitId
  let bankedRotId
  let banked = false
  let bankBlock

  const tetriminos = [
    [
      function lo() {
        return [x, x - width, x + width, x + width + width]
      },
      function lo() {
        return [x + width, x + 1 + width, x - 1 - 1 + width, x - 1 + width]
      },
      function lo() {
        return [x - 1, x - width - 1, x - 1 + width, x - 1 + width + width]
      },
      function lo() {
        return [x, x + 1, x - 1 - 1, x - 1]
      }
    ],
    [
      function l() {
        return [x, x + 1, x - 1, x - 1 - width]
      },
      function l() {
        return [x, x - 1 - width, x + width, x - width]
      },
      function l() {
        return [x, x - 1, x + 1, x + 1 + width]
      },
      function l() {
        return [x, x - width, x + width , x - 1 + width]
      }
    ],
    [
      function bl() {
        return [x, x - 1, x + 1, x + 1 - width]
      },
      function bl() {
        return [x, x - width, x + width, x + width + 1]
      },
      function bl() {
        return [x, x - 1, x - 1 + width, x + 1]
      },
      function bl() {
        return [x, x - 1 - width, x - width, x + width]
      }
    ],
    [
      function s() {
        return [x, x - 1, x + width, x - 1 + width]
      },
      function s() {
        return [x, x - 1, x + width, x - 1 + width]
      },
      function s() {
        return [x, x - 1, x + width, x - 1 + width]
      },
      function s() {
        return [x, x - 1, x + width, x - 1 + width]
      }
    ],
    [
      function z() {
        return [x, x - 1, x - width, x - width + 1]
      },
      function z() {
        return [x, x - width, x + 1, x + width + 1]
      },
      function z() {
        return [x, x + 1, x + width, x - 1 + width]
      },
      function z() {
        return [x, x - 1, x - width - 1, x + width]
      }
    ],
    [
      function bz() {
        return [x, x - width, x - width - 1, x + 1]
      },
      function bz() {
        return [x, x + 1, x + 1 - width, x + width]
      },
      function bz() {
        return [x, x - 1, x + width, x + width + 1]
      },
      function bz() {
        return [x, x - width, x - 1, x - 1 + width]
      }
    ],
    [
      function t() {
        return [x, x - 1, x + 1, x - width]
      },
      function t() {
        return [x, x - width, x + 1, x + width]
      },
      function t() {
        return [x, x + 1, x - 1, x + width]
      },
      function t() {
        return [x, x - width, x + width, x - 1]
      }
    ]
  ]

  // Functions

  function randomBlockGen() {
    return Math.floor(Math.random() * (tetriminos.length))
  }

  function randomRotationGen() {
    return Math.floor(Math.random() * 4)
  }

  function rotateBlock() {
    if (currentRotId === tetriminos[currentInitId].length - 1) {
      currentRotId = 0
    } else {
      currentRotId++
    }
    currentBlockInit = tetriminos[currentInitId][currentRotId]
    currentBlock = currentBlockInit()
    if ((rightWallRotChecker() || leftWallRotChecker()) && (leftBlockRotChecker() || rightBlockRotChecker()) && !baseChecker()) {
      removeAndRepaint()
    } else {
      if (currentRotId === 0) {
        currentRotId = tetriminos[currentInitId].length - 1
      } else {
        currentRotId--
      }
      currentBlockInit = tetriminos[currentInitId][currentRotId]
      currentBlock = currentBlockInit()
    }
    removeAndRepaint()
  }

  function blockPick() {
    currentInitId = randomBlockGen()
    currentRotId = randomRotationGen()
    currentBlockInit = tetriminos[currentInitId][currentRotId]
    currentBlock = currentBlockInit()
    
  }


  function nextBlockPick() {
    if (nextBlock) {
      currentBlockInit = nextBlockInit
      currentInitId = nextInitId
      currentRotId = nextRotId
    }
    nextInitId = randomBlockGen()
    nextRotId = randomRotationGen()
    nextBlockInit = tetriminos[nextInitId][nextRotId]
    width = 4
    x = 6
    nextBlock = nextBlockInit()
    nextBlockPaint()
    
  }

  function nextBlockPaint() {
    nextSquares.forEach(square => square.classList.remove('active'))
    nextBlock.forEach(index => nextSquares[index].classList.add('active'))
    width = 10
    resetX()
  }

  function gridCreate() {
    for (let i = 0; i < height; i++) {
      for (let i = 0; i < width; i++) {
        const square = document.createElement('div')
        square.classList.add('game_square')
        gameContainer.appendChild(square)
        squares.push(square)
      }
    }
    squares.forEach((item, index) => {
      if (index < width * 4) {
        item.classList.add('invis')
      }
    })
  }

  function nextGridCreate() {
    for (let i = 0; i < width - sideBarDiff; i++) {
      for (let i = 0; i < width - sideBarDiff; i++) {
        const square = document.createElement('div')
        square.classList.add('game_square')
        // square.classList.add('next_block_square')
        next.appendChild(square)
        nextSquares.push(square)
      }
    }
  }

  function bankGridCreate() {
    for (let i = 0; i < width - sideBarDiff; i++) {
      for (let i = 0; i < width - sideBarDiff; i++) {
        const square = document.createElement('div')
        square.classList.add('game_square')
        // square.classList.add('bank')
        domBank.appendChild(square)
        bankSquares.push(square)
      }
    }
  }
  

  function removeAndRepaint() {
    squares.forEach(square => square.classList.remove('active'))
    currentBlock.forEach(index => squares[index].classList.add('active'))
    active.forEach(index => squares[index].classList.add('active'))

  }

  function resetX() {
    x = 15
  }

  function baseCollision() {
    if ((baseChecker() || blockChecker()) && playing) {
      pop.play()
      active = active.concat(currentBlock)
      gameOverFunc()
      resetX()
      scoreFunc()
      nextBlockPick()
    }
  }

  function scoreFunc() {
    active.sort((a, b) => a - b)
    let n = 0
    for (let i = 0; i < height * width; i += width) {
      const rowComplete = active.filter(item => item >= i && item < (i + width))
      if (rowComplete.length === width) {
        n++
        for (let i = 0; i < rowComplete.length; i++) {
          const index = active.indexOf(rowComplete[i])
          active.splice(index, 1)
        }
        for (let i = 0; i < active.length; i++) {
          if (active[i] < rowComplete[0]) {
            active[i] += width
          }
        }
        // score += 10
      }
    }
    score += (10 * (n * n))
    domScore.innerHTML = score
    speedUp()
  }

  function gravityTimer() {
    baseCollision()
    x += width
    currentBlock = currentBlockInit()
    removeAndRepaint()
  }


  function speedUp() {
    if (score > levelUpScore) {
      speed -= 100
      clearInterval(timerId)
      timerId = setInterval(gravityTimer, speed)
      levelUpScore *= 2
    }
  }

  function bankFunc() {
    width = 4
    const bankedX = x
    x = 6
    let passing
    let passingInitId
    let passingRotId
    if (!banked) {
      bankedInit = currentBlockInit
      bankedRotId = currentRotId
      bankedInitId = currentInitId
      bankBlock = currentBlockInit()
      bankBlock.forEach(index => bankSquares[index].classList.add('active'))
      resetX()
      nextBlockPick()
      banked = !banked
    } else {
      width = 10 
      x = bankedX
      currentBlock = bankedInit()
      if ((rightWallRotChecker() || leftWallRotChecker()) && (leftBlockRotChecker() || rightBlockRotChecker()) && !baseChecker()) {
        x = 6
        width = 4
        passing = currentBlockInit
        passingInitId = currentInitId
        passingRotId = currentRotId
        currentBlockInit = bankedInit
        currentInitId = bankedInitId
        currentRotId = bankedRotId
        bankedInit = passing
        bankedInitId = passingInitId
        bankedRotId = passingRotId
        bankBlock.forEach(index => bankSquares[index].classList.remove('active'))
        bankBlock = bankedInit()
        bankBlock.forEach(index => bankSquares[index].classList.add('active'))
        x = bankedX
      }
    }
    width = 10
    currentBlock = currentBlockInit()
    removeAndRepaint()
  }
  

  function rightWallChecker() {
    return !currentBlock.some(index => index % width === width - 1)
  }

  function leftWallChecker() {
    return !currentBlock.some(index => index % width === 0)
  }

  function rightWallRotChecker() {
    return !currentBlock.some(index => index % width === 0)
  }

  function leftWallRotChecker() {
    return !currentBlock.some(index => index % width === width - 1)
  }

  function baseChecker() {
    return currentBlock.some(index => index + width >= height * width)
  }

  function blockChecker() {
    return currentBlock.some(index => active.includes(index + width))
  }

  function rightBlockChecker() {
    return !currentBlock.some(index => active.includes(index + 1))
  }

  function leftBlockChecker() {
    return !currentBlock.some(index => active.includes(index - 1))
  }

  function leftBlockRotChecker() {
    return !currentBlock.some(index => active.includes(index))
  }

  function rightBlockRotChecker() {
    return !currentBlock.some(index => active.includes(index))
  }

  function startTimer() {
    timerId = setInterval(gravityTimer, speed)
  }

  function pause() {
    if (paused) {
      domPause.style.display = 'block'
    } else {
      domPause.style.display = 'none'
    }
  }

  function startFunc() {
    if (!playing) {
      theme.play()
      playing = true
      if (!paused) {
        resetX()
        resetFunc()
        blockPick()
        nextBlockPick()
      }
      startTimer()
      start.innerHTML = 'Paused'
      paused = false
      pause()
    } else {
      theme.pause()
      playing = false
      clearInterval(timerId)
      start.innerHTML = 'Play'
      paused = true
      pause()
    }
  }

  function gameOverFunc(){
    if (active.some(item => item < width * 5)) {
      clearInterval(timerId)
      tryAgainPopUp()
      playing = !playing
      start.innerHTML = 'Play'
      theme.pause()
      theme.currentTime = 0
    }
  }

  function tryAgainPopUp() {
    domPause.style.display = 'block'
    domPause.innerHTML = 'Bad Luck, Try Again!'
  }

  function resetFunc() {
    domPause.innerHTML = 'Pause'
    start.innerHTML = 'Play'
    active = []
    squares.forEach(square => square.classList.remove('active'))
    score = 0
    domScore.innerHTML = score
  }
  

  // Event Handlers

  function keyDownEvents(e) {
    if (playing) {
      if (e.key === 'ArrowRight' && rightWallChecker() && rightBlockChecker()) {
        x++
        currentBlock = currentBlockInit()
        removeAndRepaint()
      } else if (e.key === 'ArrowLeft' && leftWallChecker() && leftBlockChecker()) {
        x--
        currentBlock = currentBlockInit()
        removeAndRepaint()
      } else if (e.key === 'ArrowDown') {
        clearInterval(timerId)
        timerId = setInterval(gravityTimer, 50)
      } else if (e.key === 'ArrowUp') {
        rotateBlock()
      } else if (e.key === 'z') {
        bankFunc()
      }
    }
  }

  function keyUpEvents(e) {
    if (playing) {
      if (e.key === 'ArrowDown') {
        clearInterval(timerId)
        gravityTimer()
        startTimer()
      }
    }
  }

  nextGridCreate()
  gridCreate()
  bankGridCreate()

  window.addEventListener('keyup', keyUpEvents)
  window.addEventListener('keydown', keyDownEvents)
  start.addEventListener('click', startFunc)
}


window.addEventListener('DOMContentLoaded', init)