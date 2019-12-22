function init() {

  // DOM Variables

  const gameContainer = document.querySelector('.game_container')
  const start = document.querySelector('.start')
  const domScore = document.querySelector('.score')
  // const sideBar = document.querySelector('.side_bar')
  const nextGrid = document.querySelector('.next')
  const domBank = document.querySelector('.bank')
  const domPause = document.querySelector('.paused')
  const theme = document.querySelector('#theme')
  const pop = document.querySelector('#pop')
  const tetris = document.querySelector('.tetris')
  const tetrisPlay = document.querySelector('.tetris_selector')
  const selectorContainer = document.querySelector('.selector_container')
  const back = document.querySelector('.back')

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

  class Block {
    constructor() {
      this.initId = initGen()
      this.rotId = rotGen()
      this.init = tetriminos[this.initId][this.rotId]
      this.colour = colourGen()
      this.blocks = this.init()
    }
  }

  let current
  let next
  let bank
  let passing

  let timerId = null
  let active = []
  let score = 0
  let speed = 500
  let levelUpScore = 250

  let banked = false

  let colourRotator = 4
  const colour1 = 'maroon'
  let colour1Array = []
  const colour2 = 'magenta'
  let colour2Array = []
  const colour3 = 'cyan'
  let colour3Array = []
  const colour4 = 'green'
  let colour4Array = []
  const colour5 = 'gold'
  let colour5Array = []

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

  // Generate Board Functions

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
        nextGrid.appendChild(square)
        nextSquares.push(square)
      }
    }
  }

  function bankGridCreate() {
    for (let i = 0; i < width - sideBarDiff; i++) {
      for (let i = 0; i < width - sideBarDiff; i++) {
        const square = document.createElement('div')
        square.classList.add('game_square')
        domBank.appendChild(square)
        bankSquares.push(square)
      }
    }
  }

  // Block property Functions

  function initGen() {
    return Math.floor(Math.random() * (tetriminos.length))
  }

  function rotGen() {
    return Math.floor(Math.random() * 4)
  }

  function colourGen() {
    colourRotator++
    if (colourRotator === 5) {
      colourRotator = 0
    }
    switch (colourRotator) {
      case 0:
        return colour1
      case 1:
        return colour2
      case 2:
        return colour3
      case 3:
        return colour4
      case 4:
        return colour5
    }
    console.log(colourRotator)
  }


  function colourArraySwitch() {
    switch (current.colour) {
      case colour1:
        colour1Array = colour1Array.concat(current.blocks)
        break
      case colour2:
        colour2Array = colour2Array.concat(current.blocks)
        break
      case colour3:
        colour3Array = colour3Array.concat(current.blocks)
        break
      case colour4:
        colour4Array = colour4Array.concat(current.blocks)
        break
      case colour5:
        colour5Array = colour5Array.concat(current.blocks)
        break
    }
  }

  function rotateBlock() {
    if (current.rotId === tetriminos[current.initId].length - 1) { 
      current.rotId = 0
    } else {
      current.rotId++
    }
    current.init = tetriminos[current.initId][current.rotId]
    current.blocks = current.init()
    if ((rightWallRotChecker() || leftWallRotChecker()) && (leftBlockRotChecker() || rightBlockRotChecker()) && !baseChecker()) {
      removeAndRepaint()
    } else {
      if (current.rotId === 0) {
        current.rotId = tetriminos[current.initId].length - 1
      } else {
        current.rotId--
      }
      current.init = tetriminos[current.initId][current.rotId]
      current.blocks = current.init()
    }
    removeAndRepaint()
  }

  function blockPick() {
    current = new Block()
  }

  function nextBlockPick() {
    if (next) {
      current = next
    }
    width = 4
    x = 6
    next = new Block
    nextBlockPaint()
    width = 10
  }

  function nextBlockPaint() {
    nextSquares.forEach(square => square.className = 'game_square')
    next.blocks.forEach(index => nextSquares[index].classList.add(next.colour))
    resetX()
  }

  function removeAndRepaint() {
    squares.forEach(square => square.classList.remove(colour1, colour2, colour3, colour4, colour5))
    current.blocks.forEach(index => squares[index].classList.add(current.colour))
    colour1Array.forEach(index => squares[index].classList.add(colour1))
    colour2Array.forEach(index => squares[index].classList.add(colour2))
    colour3Array.forEach(index => squares[index].classList.add(colour3))
    colour4Array.forEach(index => squares[index].classList.add(colour4))
    colour5Array.forEach(index => squares[index].classList.add(colour5))
  }

  function resetX() {
    x = 15
  }

  function baseCollision() {
    if ((baseChecker() || blockChecker()) && playing) {
      pop.play()
      active = active.concat(current.blocks)
      colourArraySwitch()
      gameOverFunc()
      resetX()
      scoreFunc()
      nextBlockPick()
    }
  }

  function spliceFromEachColour(z) {
    if (colour1Array.includes(z)) {
      const index = colour1Array.indexOf(z)
      colour1Array.splice(index, 1)
    }
    if (colour2Array.includes(z)) {
      const index = colour2Array.indexOf(z)
      colour2Array.splice(index, 1)
    }
    if (colour3Array.includes(z)) {
      const index = colour3Array.indexOf(z)
      colour3Array.splice(index, 1)
    }
    if (colour4Array.includes(z)) {
      const index = colour4Array.indexOf(z)
      colour4Array.splice(index, 1)
    }
    if (colour5Array.includes(z)) {
      const index = colour5Array.indexOf(z)
      colour5Array.splice(index, 1)
    }
  }

  function moveDownEachColour(inc, z) {
    if (colour1Array[inc] < z) {
      colour1Array[inc] += width
    }
    if (colour2Array[inc] < z) {
      colour2Array[inc] += width
    }
    if (colour3Array[inc] < z) {
      colour3Array[inc] += width
    }
    if (colour4Array[inc] < z) {
      colour4Array[inc] += width
    }
    if (colour5Array[inc] < z) {
      colour5Array[inc] += width
    }
  }

  function scoreFunc() {
    active.sort((a, b) => a - b)
    let n = 0
    for (let i = 0; i < height * width; i += width) {
      const rowComplete = active.filter(item => item >= i && item < (i + width))
      if (rowComplete.length === width) {
        n++
        for (let q = 0; q < rowComplete.length; q++) {
          const index = active.indexOf(rowComplete[q])
          active.splice(index, 1)
          spliceFromEachColour(rowComplete[q])
        }
        for (let q = 0; q < active.length; q++) {
          if (active[q] < rowComplete[0]) {
            active[q] += width
            moveDownEachColour(q, rowComplete[0])
          }
        }
      }
    }
    score += (10 * (n * n))
    domScore.innerHTML = score
    speedUp()
  }

  function gravityTimer() {
    baseCollision()
    x += width
    current.blocks = current.init()
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
    if (!banked) {
      bank = current
      bank.blocks = bank.init()
      bank.blocks.forEach(index => bankSquares[index].classList.add(bank.colour))
      resetX()
      nextBlockPick()
      banked = true
    } else {
      width = 10 
      x = bankedX
      current.blocks = bank.init()
      if ((rightWallRotChecker() || leftWallRotChecker()) && (leftBlockRotChecker() || rightBlockRotChecker()) && !baseChecker()) {
        x = 6
        width = 4
        passing = current
        current = bank
        bank = passing
        bank.blocks = bank.init()
        bankSquares.forEach(index => index.classList.remove(colour1, colour2, colour3, colour4, colour5))
        bank.blocks.forEach(index => bankSquares[index].classList.add(bank.colour))
        x = bankedX
      }
    }
    width = 10
    current.blocks = current.init()
    removeAndRepaint()
  }

  // Collision detection Functions
  

  function rightWallChecker() {
    return !current.blocks.some(index => index % width === width - 1)
  }

  function leftWallChecker() {
    return !current.blocks.some(index => index % width === 0)
  }

  function rightWallRotChecker() {
    return !current.blocks.some(index => index % width === 0)
  }

  function leftWallRotChecker() {
    return !current.blocks.some(index => index % width === width - 1)
  }

  function baseChecker() {
    return current.blocks.some(index => index + width >= height * width)
  }

  function blockChecker() {
    return current.blocks.some(index => active.includes(index + width))
  }

  function rightBlockChecker() {
    return !current.blocks.some(index => active.includes(index + 1))
  }

  function leftBlockChecker() {
    return !current.blocks.some(index => active.includes(index - 1))
  }

  function leftBlockRotChecker() {
    return !current.blocks.some(index => active.includes(index))
  }

  function rightBlockRotChecker() {
    return !current.blocks.some(index => active.includes(index))
  }

  function startTimer() {
    timerId = setInterval(gravityTimer, speed)
  }
  
  // Button Functions

  function pause() {
    if (paused) {
      domPause.style.display = 'block'
    } else {
      domPause.style.display = 'none'
    }
  }

  function startFunc() {
    if (!playing) {
      if (!paused) {
        resetFunc()
        blockPick()
        nextBlockPick()
      }
      theme.play()
      startTimer()
      start.innerHTML = 'Pause'
      paused = false
      playing = true
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

  function resetFunc() {
    playing = false
    clearInterval(timerId)
    start.innerHTML = 'Play'
    theme.pause()
    theme.currentTime = 0
    active = []
    colour1Array = []
    colour2Array = []
    colour3Array = []
    colour4Array = []
    colour5Array = []
    squares.forEach(square => square.classList.remove(colour1, colour2, colour3, colour4, colour5))
    bankSquares.forEach(index => index.classList.remove(colour1, colour2, colour3, colour4, colour5))
    nextSquares.forEach(index => index.classList.remove(colour1, colour2, colour3, colour4, colour5))
    score = 0
    domScore.innerHTML = score
    resetX()
  }

  function stopGame() {
    clearInterval(timerId)
    tryAgainPopUp()
    playing = false
    start.innerHTML = 'Play'
    theme.pause()
    theme.currentTime = 0
  }

  function gameOverFunc(){
    if (active.some(item => item < width * 5)) {
      stopGame()
    }
  }

  function tryAgainPopUp() {
    domPause.style.display = 'block'
    domPause.innerHTML = 'Bad Luck, Try Again!'
  }

  function keyDownEvents(e) {
    if (playing) {
      if (e.key === 'ArrowRight' && rightWallChecker() && rightBlockChecker()) {
        x++
        current.blocks = current.init()
        removeAndRepaint()
      } else if (e.key === 'ArrowLeft' && leftWallChecker() && leftBlockChecker()) {
        x--
        current.blocks = current.init()
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

  function displayTetris() {
    selectorContainer.style.display = 'none'
    tetris.style.display = 'flex'
    back.style.display = 'block'
  }

  function returnToMain() {
    resetFunc()
    domPause.style.display = 'none'
    selectorContainer.style.display = 'flex'
    tetris.style.display = 'none'
    back.style.display = 'none'
  }

  nextGridCreate()
  gridCreate()
  bankGridCreate()

  // Event Handlers
  
  back.addEventListener('click', returnToMain)
  tetrisPlay.addEventListener('click', displayTetris)
  window.addEventListener('keyup', keyUpEvents)
  window.addEventListener('keydown', keyDownEvents)
  start.addEventListener('click', startFunc)
}

window.addEventListener('DOMContentLoaded', init)