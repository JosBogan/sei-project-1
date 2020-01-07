function init() {

  // DOM Variables

  const selectorContainer = document.querySelector('.selector_container')
  const back = document.querySelector('.back')

  // Variables

  let timerId = null

  // Tetris DOM Variables

  const tetrisGameContainer = document.querySelector('.tetris_game_container')
  const tetrisStart = document.querySelector('#tetris_start')
  const tetrisDomScore = document.querySelector('.score')
  const tetrisNextGrid = document.querySelector('.next')
  const tetrisDomBank = document.querySelector('.bank')
  const tetrisDomPause = document.querySelector('#tetris_paused')
  const tetrisTheme = document.querySelector('#theme')
  const tetrisPop = document.querySelector('#pop')
  const tetris = document.querySelector('#tetris')
  const tetrisPlay = document.querySelector('.tetris_selector')

  // TETRIS

  // Tetris Variables 

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
        tetrisGameContainer.appendChild(square)
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
        tetrisNextGrid.appendChild(square)
        nextSquares.push(square)
      }
    }
  }

  function bankGridCreate() {
    for (let i = 0; i < width - sideBarDiff; i++) {
      for (let i = 0; i < width - sideBarDiff; i++) {
        const square = document.createElement('div')
        square.classList.add('game_square')
        tetrisDomBank.appendChild(square)
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
      tetrisPop.play()
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
    tetrisDomScore.innerHTML = score
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
      tetrisDomPause.style.display = 'block'
    } else {
      tetrisDomPause.style.display = 'none'
    }
  }

  function startFunc() {
    if (!playing) {
      if (!paused) {
        resetFunc()
        blockPick()
        nextBlockPick()
      }
      tetrisTheme.play()
      startTimer()
      tetrisStart.innerHTML = 'Pause'
      paused = false
      playing = true
      pause()
    } else {
      tetrisTheme.pause()
      playing = false
      clearInterval(timerId)
      tetrisStart.innerHTML = 'Play'
      paused = true
      pause()
    }
  }

  function resetFunc() {
    playing = false
    clearInterval(timerId)
    tetrisStart.innerHTML = 'Play'
    tetrisTheme.pause()
    tetrisTheme.currentTime = 0
    active = []
    colour1Array = []
    colour2Array = []
    colour3Array = []
    colour4Array = []
    colour5Array = []
    banked = false
    squares.forEach(square => square.classList.remove(colour1, colour2, colour3, colour4, colour5))
    bankSquares.forEach(index => index.classList.remove(colour1, colour2, colour3, colour4, colour5))
    nextSquares.forEach(index => index.classList.remove(colour1, colour2, colour3, colour4, colour5))
    score = 0
    tetrisDomScore.innerHTML = score
    resetX()
  }

  function stopGame() {
    clearInterval(timerId)
    tryAgainPopUp()
    playing = false
    tetrisStart.innerHTML = 'Play'
    tetrisTheme.pause()
    tetrisTheme.currentTime = 0
  }

  function gameOverFunc(){
    if (active.some(item => item < width * 5)) {
      stopGame()
    }
  }

  function tryAgainPopUp() {
    tetrisDomPause.style.display = 'block'
    tetrisDomPause.innerHTML = 'Bad Luck, Try Again!'
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

  nextGridCreate()
  gridCreate()
  bankGridCreate()

  // Event Handlers

  tetrisPlay.addEventListener('click', displayTetris)
  window.addEventListener('keyup', keyUpEvents)
  window.addEventListener('keydown', keyDownEvents)
  tetrisStart.addEventListener('click', startFunc)

  // TETRIS END

  // FL TRON

  // FL Tron DOM Variables

  const flGameContainer = document.querySelector('.fl_tron_container')
  const flTron = document.querySelector('#fl_tron')
  const flStart = document.querySelector('#fl_start')
  const numPlayers = document.querySelector('#num_players')
  const numPlayersSpan = document.querySelector('label > span')
  const players = document.querySelectorAll('.fl_player')
  const flPoint = document.querySelectorAll('.fl_point')
  const flP1Points = document.querySelectorAll('.fl_P1_point')
  const flP2Points = document.querySelectorAll('.fl_P2_point')
  const flP3Points = document.querySelectorAll('.fl_P3_point')
  const flP4Points = document.querySelectorAll('.fl_P4_point')
  const flPlayerName = document.querySelector('#fl_player_name')
  const flWinMessage = document.querySelector('#fl_message')
  const flReset = document.querySelector('.fl_reset')
  const flRoundDom = document.querySelector('#fl_round')
  const flRoundMatch = document.querySelector('#fl_round_match')
  const colourInputs = document.querySelectorAll('.colour_input')
  const flTronPlay = document.querySelector('.fl_tron_selector')

  // Variables

  const flHeight = 80
  const flWidth = 104
  const flSquares = []
  const fl2PStart = ((flHeight * flWidth) / 2) + (flWidth / 4)
  const fl2PStart2 = ((flHeight * flWidth) / 2) + ((flWidth / 4) * 3)
  const fl3PStart = fl2PStart - ((flHeight * flWidth) / 4)
  const fl3PStart2 = fl2PStart2 - ((flHeight * flWidth) / 4)
  const fl3PStart3 = (((flHeight * flWidth) / 4) * 3) + (flWidth / 2)
  const fl4PStart3 = fl2PStart + ((flHeight * flWidth) / 4)
  const fl4PStart4 = fl2PStart2 + ((flHeight * flWidth) / 4)

  let flP1 = null
  let flP2 = null
  let flP3 = null
  let flP4 = null

  let arrayOfFlPlayers = []
  let arrayOfAllFlPlayers = []
  let flRound = 1

  const flSpeed = 40
  let flPlaying = false
  let flResetScreen = false

  class FlPlayer {
    constructor(x, active, name, pointList, player) {
      this.name = name,
      this.player = player,
      this.x = x,
      this.active = active,
      this.directions = [
        function() {
          return this.x + 1
        }, 
        function() {
          return this.x + flWidth
        }, 
        function() {
          return this.x - 1
        }, 
        function() {
          return this.x - flWidth
        }
      ]
      this.direction = this.directions[0],
      this.score = 0,
      this.pointsList = pointList
    }
    flPlayerEnd() {
      arrayOfFlPlayers.splice(arrayOfFlPlayers.indexOf(this), 1)
    }
    wallCollision() {
      if (
        this.x < 0 || 
        this.x > (flHeight * flWidth) ||
        ((this.x % flWidth === 0) && ((this.active[this.active.length - 1] + 1) % flWidth === 0)) ||
        (((this.x + 1 ) % flWidth === 0) && (this.active[this.active.length - 1] % flWidth === 0))
      ) {
        this.flPlayerEnd()
      }
    }
    playerCollision() {
      arrayOfAllFlPlayers.forEach(player => {
        if (player.active.includes(this.x)) {
          this.flPlayerEnd()
        }
      })
    }
  }

  function tronGridCreate() {
    for (let i = 0; i < flHeight; i++) {
      for (let i = 0; i < flWidth; i++) {
        const square = document.createElement('div')
        square.classList.add('fl_game_square')
        flGameContainer.appendChild(square)
        flSquares.push(square)
      }
    }
  }

  function flPaint() {
    arrayOfFlPlayers.forEach(player => {
      player.active.forEach(index => {
        flSquares[index].classList.add(`${player.name}background`)
      })
    })
  }

  function flResetPaint() {
    arrayOfAllFlPlayers.forEach(player => {
      player.active.forEach(index => {
        flSquares[index].classList.add(`${player.name}background`)
      })
    })
  }

  function clearFlPaint() {
    flSquares.forEach(index => index.classList.remove('flP1background', 'flP2background', 'flP3background', 'flP4background'))
  }

  function flPlayerCountCheck() {
    if (arrayOfFlPlayers.length === 1) {
      arrayOfFlPlayers[0].score++
      flUpdateScore()
      clearInterval(timerId)
      flResetScreen = true
      flPlaying = false
      flMessage()
      flWinMessage.style.display = 'inline'
    }
  }

  function flKeyDown() {
    if (!flPlaying) return
    switch (event.key) {
      case 'ArrowUp':
        if (flP1.direction === flP1.directions[1]) return
        flP1.direction = flP1.directions[3]
        break
      case 'ArrowLeft':
        if (flP1.direction === flP1.directions[0]) return
        flP1.direction = flP1.directions[2]
        break
      case 'ArrowDown':
        if (flP1.direction === flP1.directions[3]) return
        flP1.direction = flP1.directions[1]
        break
      case 'ArrowRight':
        if (flP1.direction === flP1.directions[2]) return
        flP1.direction = flP1.directions[0]
        break
    }
    flPaint()
  }

  function flKeyDown2() {
    if (!flPlaying) return
    switch (event.key) {
      case 'w':
        if (flP2.direction === flP2.directions[1]) return
        flP2.direction = flP2.directions[3]
        break
      case 'a':
        if (flP2.direction === flP2.directions[0]) return
        flP2.direction = flP2.directions[2]
        break
      case 's':
        if (flP2.direction === flP2.directions[3]) return
        flP2.direction = flP2.directions[1]
        break
      case 'd':
        if (flP2.direction === flP2.directions[2]) return
        flP2.direction = flP2.directions[0]
        break
    }
    flPaint()
  }

  function flKeyDown3() {
    if (!flPlaying) return
    if (!arrayOfFlPlayers.includes(flP3)) return
    switch (event.key) {
      case 't':
        if (flP3.direction === flP3.directions[1]) return
        flP3.direction = flP3.directions[3]
        break
      case 'f':
        if (flP3.direction === flP3.directions[0]) return
        flP3.direction = flP3.directions[2]
        break
      case 'g':
        if (flP3.direction === flP3.directions[3]) return
        flP3.direction = flP3.directions[1]
        break
      case 'h':
        if (flP3.direction === flP3.directions[2]) return
        flP3.direction = flP3.directions[0]
        break
    }
    flPaint()
  }

  function flKeyDown4() {
    if (!flPlaying) return
    if (!arrayOfFlPlayers.includes(flP4)) return
    switch (event.key) {
      case 'o':
        if (flP4.direction === flP4.directions[1]) return
        flP4.direction = flP4.directions[3]
        break
      case 'k':
        if (flP4.direction === flP4.directions[0]) return
        flP4.direction = flP4.directions[2]
        break
      case 'l':
        if (flP4.direction === flP4.directions[3]) return
        flP4.direction = flP4.directions[1]
        break
      case ';':
        if (flP4.direction === flP4.directions[2]) return
        flP4.direction = flP4.directions[0]
        break
    }
    flPaint()
  }

  function tick() {
    flPaint()
    arrayOfFlPlayers.forEach(flplayer => {
      flplayer.x = flplayer.direction()
      flplayer.playerCollision()
      flplayer.wallCollision()
      flplayer.active.push(flplayer.x)
    })
    flPlayerCountCheck()
  }

  function flMessage() {
    flPlayerName.innerHTML = arrayOfFlPlayers[0].player
    flRoundDom.innerHTML = flRound
    if (arrayOfFlPlayers[0].score === 3) {
      flRoundMatch.innerHTML = 'Match'
      flRoundDom.innerHTML = ''
    }
  }

  function winCondition() {
    if (arrayOfFlPlayers[0].score === 3) {
      flResetGame()
    }
  }

  function flResetGame() {
    numPlayers.disabled = false
    flPoint.forEach(point => point.classList.remove('fl_point_fill'))
    arrayOfAllFlPlayers.forEach(player => player.score = 0)
    flRound = 1
    flRoundMatch.innerHTML = 'Round'
  }

  function flResetMatch() {
    flWinMessage.style.display = 'none'
    clearFlPaint()
    resetPlayers()
    flResetPaint()
    flRound++
    winCondition()
    flResetScreen = false
    arrayOfFlPlayers = []
    arrayOfAllFlPlayers.forEach(player => arrayOfFlPlayers.push(player))
  }

  function resetPlayers() {
    arrayOfAllFlPlayers.forEach(player => {
      player.x = player.active[0]
      player.active = [player.x]
    })
  }

  function flStartFunc() {
    if (flPlaying || flResetScreen) return
    if (flRound === 1) {
      arrayOfAllFlPlayers = []
      arrayOfFlPlayers.forEach(player => arrayOfAllFlPlayers.push(player))
    }
    flPlaying = true
    timerId = setInterval(tick, flSpeed)
    numPlayers.disabled = true
  }

  function createPlayer1(position) {
    flP1 = null
    switch (position) {
      case 1:
        flP1 = new FlPlayer(fl2PStart, [fl2PStart], 'flP1', flP1Points, 'Player 1')
        break
      case 2:
        flP1 = new FlPlayer(fl3PStart, [fl3PStart], 'flP1', flP1Points, 'Player 1')
        break
    }
    arrayOfFlPlayers.push(flP1)
  }

  function createPlayer2(position) {
    flP2 = null
    switch (position) {
      case 1:
        flP2 = new FlPlayer(fl2PStart2, [fl2PStart2], 'flP2', flP2Points, 'Player 2')
        break
      case 2:
        flP2 = new FlPlayer(fl3PStart2, [fl3PStart2], 'flP2', flP2Points, 'Player 2')
        break
    }
    arrayOfFlPlayers.push(flP2)
  }

  function createPlayer3(position) {
    flP3 = null
    switch (position) {
      case 1:
        flP3 = new FlPlayer(fl3PStart3, [fl3PStart3], 'flP3', flP3Points, 'Player 3')
        break
      case 2:
        flP3 = new FlPlayer(fl4PStart3, [fl4PStart3], 'flP3', flP3Points, 'Player 3')
        break
    }
    arrayOfFlPlayers.push(flP3)
  }

  function createPlayer4() {
    flP4 = null
    flP4 = new FlPlayer(fl4PStart4, [fl4PStart4], 'flP4', flP4Points, 'Player 4')
    arrayOfFlPlayers.push(flP4)
  }

  function flUpdateScore() {
    for (let i = 0; i < arrayOfFlPlayers[0].score; i++) {
      arrayOfFlPlayers[0].pointsList[i].classList.add('fl_point_fill')
    }
  }

  function colourChange() {
    const flColour = event.target.value
    document.documentElement.style.setProperty(`--${this.dataset.name}`, flColour)
    flPaint()
  }

  function setplayerStarting() {
    switch (numPlayers.value) {
      case '2':
        arrayOfFlPlayers = []
        createPlayer1(1)
        createPlayer2(1)
        break
      case '3':
        arrayOfFlPlayers = []
        createPlayer1(2)
        createPlayer2(2)
        createPlayer3(1)
        break
      case '4':
        arrayOfFlPlayers = []
        createPlayer1(2)
        createPlayer2(2)
        createPlayer3(2)
        createPlayer4()
        break
    }
  }

  function changeNumPlayers() {
    numPlayersSpan.innerHTML = numPlayers.value
    players.forEach(player => player.style.visibility = 'hidden')
    for (let i = 0; i < numPlayers.value; i++) {
      players[i].style.visibility = 'visible'
    }
    clearFlPaint()
    setplayerStarting()
    flPaint()
  }

  function displayFlTron() {
    selectorContainer.style.display = 'none'
    flTron.style.display = 'flex'
    back.style.display = 'block'
  }

  createPlayer1(1)
  createPlayer2(1)

  tronGridCreate()
  flPaint()

  // Event Handlers

  window.addEventListener('keydown', flKeyDown)
  window.addEventListener('keydown', flKeyDown2)
  window.addEventListener('keydown', flKeyDown3)
  window.addEventListener('keydown', flKeyDown4)
  flStart.addEventListener('click', flStartFunc)
  numPlayers.addEventListener('change', changeNumPlayers)
  flReset.addEventListener('click', flResetMatch)
  colourInputs.forEach(colourInput => colourInput.addEventListener('change', colourChange))
  flTronPlay.addEventListener('click', displayFlTron)
  

  // FL TRON END

  // FROGGER

  // DOM VARIABLES

  const froggerPlay = document.querySelector('.frogger_selector')
  const frogger = document.querySelector('#frogger')
  const froggerGameContainer = document.querySelector('.frogger_game_container')
  const froggerStart = document.querySelector('#frogger_start')
  const froggerLifePoints = document.querySelectorAll('.frogger_life')
  const froggerSaved = document.querySelectorAll('.frogger_safe')
  const froggerDOMSecs = document.querySelector('#frogger_secs')
  const froggerDOMMins = document.querySelector('#frogger_mins')
  const froggerMessage = document.querySelector('#frogger_message')

  // VARIABLES

  let froggerPlaying = false

  const froggerHeight = 13
  const froggerWidth = 11
  const froggerSquares = []
  const frogs = []
  let activeFrog = null
  const froggerStartingPos = Math.floor((froggerWidth * froggerHeight) - (froggerWidth / 2))
  let froggerLives = 3
  let froggerGameTimerId = null
  let froggerMins = 3
  let froggerSeconds = 0

  const froggerWinSet = new Set([])

  class RowTraits {
    constructor(time, row, speed) {
      this.items = [],
      this.time = time,
      this.speed = speed
      this.createId = null,
      this.moveId = null
    }
  }

  class RightRow extends RowTraits {
    constructor(time, row, speed) {
      super(time, row, speed), 
      this.startingPosition = (froggerWidth * row) - froggerWidth
      this.endingPosition = (froggerWidth * row) - 1
    }
    edgeCollision() {
      this.items = this.items.filter(item => {
        if (item.positions.length === 0) {
          return false
        }
        return true
      })
    }
    move() {
      if (
        this.items.some(item => item.positions.includes(activeFrog.position)) &&
        froggerRows.logRows.includes(this) &&
        activeFrog.position !== this.endingPosition
      ) {
        activeFrog.position++
      }
      this.items.forEach(item => {
        for (let i = 0; i < item.truePositions.length; i++) {
          item.truePositions[i]++
        }
        item.trueToActive(this)
      })
      froggerLogCheck()
    }
  }

  class LeftRow extends RowTraits {
    constructor(time, row, speed) {
      super(time, row, speed), 
      this.startingPosition = (froggerWidth * row) - 1
      this.endingPosition = (froggerWidth * row) - froggerWidth
    }
    edgeCollision() {
      this.items = this.items.filter(item => {
        if (item.positions.length === 0) {
          return false
        }
        return true
      })
    }
    move() {
      if (
        this.items.some(item => item.positions.includes(activeFrog.position)) && 
        froggerRows.logRows.includes(this) &&
        activeFrog.position !== this.endingPosition
      ) {
        activeFrog.position--
      }
      this.items.forEach(item => {
        for (let i = 0; i < item.truePositions.length; i++) {
          item.truePositions[i]--
        }
        item.trueToActive(this)
      })
      froggerLogCheck()
    }
  }

  const row1 = new LeftRow(2500, 12, 500)
  const row2 = new RightRow(2250, 11, 750)
  const row3 = new LeftRow(2000, 10, 500)
  const row4 = new RightRow(3000, 9, 500)
  const row5 = new LeftRow(1250, 8, 250)
  const row6 = new LeftRow(2500, 6, 500)
  const row7 = new RightRow(1500, 5, 250)
  const row8 = new RightRow(4125, 4, 750)
  const row9 = new LeftRow(5500, 3, 500)
  const row10 = new RightRow(2000, 2, 250)


  const froggerRows = {
    left: [row1, row3, row5, row6, row9],
    right: [row2, row4, row7, row8, row10],
    all: [row1, row2, row3, row4, row5, row6, row7, row8, row9, row10],
    logRows: [row6, row7, row8, row9, row10],
    carRows: [row1, row2, row3, row4, row5]
  }
  
  let pavementArray = null
  let lilyPadArray = null
  let roadArray = null
  let waterArray = null


  class Frog {
    constructor(position, active) {
      this.position = position,
      this.active = active
    }
  }

  class Item {
    constructor(position, leng) {
      this.position = position
      this.leng = leng
      this.positions = []
      this.truePositions = []
    }
    trueToActive(row) {
      if (this.truePositions) {
        this.positions = this.truePositions.filter(position => {
          return (position >= row.startingPosition && position <= row.endingPosition) ||
                 (position <= row.startingPosition && position >= row.endingPosition)
        })
      }
    }
    populatePositions(row) {
      if (froggerRows.right.includes(row)) {
        for (let i = 0; i < this.leng; i++) {
          this.truePositions.push(this.position - i)
        }
      } else if (froggerRows.left.includes(row)) {
        for (let i = 0; i < this.leng; i++) {
          this.truePositions.push(this.position + i)
        }
      }
    }
  }

  // FUNCTIONS

  function froggerPaint() {
    froggerItemPaint()
    froggerSquares.forEach(square => square.classList.remove('frog'))
    if (pavementArray.includes(froggerSquares[activeFrog.position])) {
      document.documentElement.style.setProperty('--frog_bg', 'url("../assets/pavement_tile.svg")')
    } else if (roadArray.includes(froggerSquares[activeFrog.position])) {
      document.documentElement.style.setProperty('--frog_bg', 'url("../assets/road_tile.svg")')
    } else if (froggerRows.logRows.some(row => row.items.some(item => item.positions.includes(activeFrog.position)))) {
      if (froggerSquares[activeFrog.position].classList.contains('log_r')) {
        document.documentElement.style.setProperty('--frog_bg', 'url("../assets/log_r.svg"), url("../assets/Water.svg") ')
      } else if (froggerSquares[activeFrog.position].classList.contains('log_l')) {
        document.documentElement.style.setProperty('--frog_bg', 'url("../assets/log_l.svg"), url("../assets/Water.svg") ')
      } else if (froggerSquares[activeFrog.position].classList.contains('log_middle')) {
        document.documentElement.style.setProperty('--frog_bg', 'url("../assets/log_middle.svg"), url("../assets/Water.svg") ')
      }
    }
    froggerSquares[activeFrog.position].classList.add('frog')
  }

  function froggerItemPaint() {
    froggerSquares.forEach(square => square.classList.remove('log', 'log_r', 'log_l', 'log_middle', 'log_move_row_7_left', 'log_move_row_7_right'))
    froggerSquares.forEach(square => square.classList.remove('car1', 'car2', 'car_move_row_2', 'car_move_row_1', 'car_move_row_3', 'car_move_row_4', 'car_move_row_5'))
    froggerRows.logRows.forEach(row => row.items.forEach(log => {
      log.positions.forEach(pos => {
        if (log.truePositions.length === 2) {
          if (froggerRows.right.includes(row)) {
            if (log.truePositions[0] === pos) {
              froggerSquares[pos].classList.add('log_r')
              // froggerSquares[pos].classList.add('log_move_row_7_left')
            } else if (log.truePositions[1] === pos) {
              froggerSquares[pos].classList.add('log_l')
              // froggerSquares[pos].classList.add('log_move_row_7_right')
            }
          } else if (froggerRows.left.includes(row)) {
            if (log.truePositions[0] === pos) {
              froggerSquares[pos].classList.add('log_l')
            } else if (log.truePositions[1] === pos) {
              froggerSquares[pos].classList.add('log_r')
            }
          }
        } else {
          if (froggerRows.right.includes(row)) {
            froggerSquares[pos].classList.add('log_middle')
            if (log.truePositions[0] === pos) {
              froggerSquares[pos].classList.remove('log_middle')
              froggerSquares[pos].classList.add('log_r')
            } else if (log.truePositions[log.truePositions.length - 1] === pos) {
              froggerSquares[pos].classList.remove('log_middle')
              froggerSquares[pos].classList.add('log_l')
              
            }
          } else if (froggerRows.left.includes(row)) {
            froggerSquares[pos].classList.add('log_middle')
            if (log.truePositions[0] === pos) {
              froggerSquares[pos].classList.remove('log_middle')
              froggerSquares[pos].classList.add('log_l')
            } else if (log.truePositions[log.truePositions.length - 1] === pos) {
              froggerSquares[pos].classList.remove('log_middle')
              froggerSquares[pos].classList.add('log_r')
            }
          }
        }
      })
    }))
    // froggerRows.logRows.forEach(row => row.items.forEach(item => item.positions.forEach(pos => froggerSquares[pos].style.animation = '')))
    // row6.items.forEach(log => log.positions.forEach(pos => {
    //   froggerSquares[pos].style.animation = 'log_left 0.5s linear infinite'
    // }))
    // row7.items.forEach(log => log.positions.forEach(pos => {
    //   froggerSquares[pos].style.animation = 'car_right 0.25s linear infinite'
    // }))
    row1.items.forEach(car => car.positions.forEach(pos => froggerSquares[pos].classList.add('car_move_row_1')))
    row2.items.forEach(car => car.positions.forEach(pos => froggerSquares[pos].classList.add('car_move_row_2')))
    row3.items.forEach(car => car.positions.forEach(pos => froggerSquares[pos].classList.add('car_move_row_3')))
    row4.items.forEach(car => car.positions.forEach(pos => froggerSquares[pos].classList.add('car_move_row_4')))
    row5.items.forEach(car => car.positions.forEach(pos => froggerSquares[pos].classList.add('car_move_row_5')))
    // froggerRows.carRows.filter(carRow => froggerRows.right.includes(carRow)).forEach(row => row.items.forEach(car => {
    //   car.positions.forEach(pos => {
    //     froggerSquares[pos].classList.add('car1')
    //   })
    // }))
    // froggerRows.carRows.filter(carRow => froggerRows.left.includes(carRow)).forEach(row => row.items.forEach(car => {
    //   car.positions.forEach(pos => {
    //     froggerSquares[pos].classList.add('car2')
    //   })
    // }))
  }

  function createFrog() {
    activeFrog = new Frog(froggerStartingPos, true)
    frogs.push(activeFrog)
  }

  function createItem3(row) {
    const newItem = new Item(row.startingPosition, 3)
    newItem.populatePositions(row)
    newItem.trueToActive(row)
    row.items.push(newItem)
    froggerItemPaint()
  }

  function createItem1(row) {
    const newItem = new Item(row.startingPosition, 1)
    const newCar = document.createElement('div')
    newCar.classList.add('car_test')
    froggerGameContainer.insertBefore(newCar, froggerSquares[row.startingPosition])
    newItem.populatePositions(row)
    newItem.trueToActive(row)
    row.items.push(newItem)
    froggerItemPaint()
  }

  function createItem2(row) {
    const newItem = new Item(row.startingPosition, 2)
    newItem.populatePositions(row)
    newItem.trueToActive(row)
    row.items.push(newItem)
    froggerItemPaint()
  }
  
  function createItem4(row) {
    const newItem = new Item(row.startingPosition, 4)
    newItem.populatePositions(row)
    newItem.trueToActive(row)
    row.items.push(newItem)
    froggerItemPaint()
  }

  function froggerMoveObject(row) {
    row.move()
    row.edgeCollision()
    if (froggerCarCollisionCheck()) frogDead()
    froggerPaint()
    froggerItemPaint()
  }

  // BOARD CREATION

  function froggerGridCreate() {
    for (let i = 0; i < froggerHeight; i++) {
      for (let i = 0; i < froggerWidth; i++) {
        const square = document.createElement('div')
        square.classList.add('frogger_game_square')
        froggerGameContainer.appendChild(square)
        froggerSquares.push(square)
      }
    }
  }

  function froggerPavement() {
    pavementArray = froggerSquares.filter((square, index) => {
      return index >= (froggerWidth * froggerHeight) - froggerWidth ||
      (index >= (froggerHeight * froggerWidth / 2) - (froggerWidth / 2) && 
      index < (froggerHeight * froggerWidth / 2) + (froggerWidth / 2)
      )
    })
    pavementArray.forEach(square => square.classList.add('frogger_pavement'))
  }

  function froggerLilyPad() {
    lilyPadArray = froggerSquares.filter((square, index) => {
      return index < froggerWidth && 
      (index + 1) % 2 === 0
    })
    lilyPadArray.forEach(square => square.classList.add('frogger_pad'))
  }

  function froggerRoad() {
    roadArray = froggerSquares.filter((square, index) => {
      return index < (froggerWidth * froggerHeight) - froggerWidth &&
      index >= (froggerHeight * froggerWidth / 2) + (froggerWidth / 2)
    })
    roadArray.forEach(square => square.classList.add('frogger_road'))
  }
  
  function froggerWater() {
    waterArray = froggerSquares.filter((square, index) => {
      return index < (froggerHeight * froggerWidth / 2) - (froggerWidth / 2) &&
      index >= froggerWidth || 
      (index < froggerWidth &&
      (index + 1) % 2 !== 0)
    })
    waterArray.forEach(square => square.classList.add('frogger_water'))
  }

  function frogDead() {
    activeFrog.position = froggerStartingPos
    froggerLives--
    for (let i = 0; i < Math.abs(froggerLives - 3); i++) {
      froggerLifePoints[i].classList.remove('frogger_point_fill')
    }
    if (froggerLives === 0) {
      froggerMessage.innerHTML = 'Out of Lives'
      froggerSquares.forEach(square => square.style.animation = '')
      froggerLoseFunc()
    }
  }


  // TIMERS 

  // CARS

  function row1Timer() {
    createItem1(row1)
    row1.moveId = setInterval(function() {
      froggerMoveObject(row1)
    }, row1.speed)
    row1.createId = setInterval(function() {
      createItem1(row1)
    }, row1.time)
  }
  
  function row2Timer() {
    createItem1(row2)
    row2.moveId = setInterval(function() {
      froggerMoveObject(row2)
    }, row2.speed)
    row2.createId = setInterval(function() {
      createItem1(row2)
    }, row2.time)
  }

  function row3Timer() {
    createItem1(row3)
    row3.moveId = setInterval(function() {
      froggerMoveObject(row3)
    }, row3.speed)
    row3.createId = setInterval(function() {
      createItem1(row3)
    }, row3.time)
  }

  function row4Timer() {
    createItem1(row4)
    row4.moveId = setInterval(function() {
      froggerMoveObject(row4)
    }, row4.speed)
    row4.createId = setInterval(function() {
      createItem1(row4)
    }, row4.time)
  }

  function row5Timer() {
    createItem1(row5)
    row5.moveId = setInterval(function() {
      froggerMoveObject(row5)
    }, row5.speed)
    row5.createId = setInterval(function() {
      createItem1(row5)
    }, row5.time)
  }

  // LOGS

  function row6Timer() {
    createItem3(row6)
    row6.moveId = setInterval(function() {
      froggerMoveObject(row6)
    }, row6.speed)
    row6.createId = setInterval(function() {
      createItem3(row6)
    }, row6.time)
  }

  function row7Timer() {
    createItem2(row7)
    row7.moveId = setInterval(function() {
      froggerMoveObject(row7)
    }, row7.speed)
    row7.createId = setInterval(function() {
      createItem2(row7)
    }, row7.time)
  }

  function row8Timer() {
    createItem3(row8)
    row8.moveId = setInterval(function() {
      froggerMoveObject(row8)
    }, row8.speed)
    row8.createId = setInterval(function() {
      createItem3(row8)
    }, row8.time)
  }

  function row9Timer() {
    createItem4(row9)
    row9.moveId = setInterval(function() {
      froggerMoveObject(row9)
    }, row9.speed)
    row9.createId = setInterval(function() {
      createItem4(row9)
    }, row9.time)
  }

  function row10Timer() {
    createItem3(row10)
    row10.moveId = setInterval(function() {
      froggerMoveObject(row10)
    }, row10.speed)
    row10.createId = setInterval(function() {
      createItem3(row10)
    }, row10.time)
  }

  function froggerClockTick() {
    switch (froggerSeconds) {
      case 0:
        froggerSeconds = 59
        froggerMins--
        break
      default:
        froggerSeconds--
    }
    froggerDOMMins.innerHTML = froggerMins
    froggerSeconds === 0 ? froggerDOMSecs.innerHTML = '00' : froggerDOMSecs.innerHTML = froggerSeconds
    if (froggerSeconds < 10) froggerDOMSecs.innerHTML = '0' + froggerSeconds
    if (froggerSeconds === 0 && froggerMins === 0) {
      froggerMessage.innerHTML = 'Out of Time'
      froggerSquares.forEach(square => square.style.animation = '')
      froggerLoseFunc()
    }
  }

  // COLLISION CHECKERS

  function froggerCarCollisionCheck() {
    return froggerRows.carRows.some(row => row.items.some(car => car.positions.includes(activeFrog.position)))
  }

  function froggerBottomCheck() {
    return (activeFrog.position + froggerWidth) > (froggerWidth * froggerHeight) - 1 ? true : false
  }

  function froggerWaterCheck() {
    if (waterArray.some(square => froggerSquares.indexOf(square) === activeFrog.position)) {
      frogDead()
    }
  }

  function froggerLogCheck() {
    if (!froggerRows.logRows.some(row => row.items.some(log => log.positions.includes(activeFrog.position)))) froggerWaterCheck()
  }

  function froggerTopCheck() {
    return (activeFrog.position - froggerWidth) < 0 ? true : false
  }

  function froggerRightCheck() {
    return (activeFrog.position + 1) % froggerWidth === 0
  }

  function froggerLeftCheck() {
    return activeFrog.position % froggerWidth === 0
  }

  function winCheck() {
    if (lilyPadArray.some(lilypad => froggerSquares.indexOf(lilypad) === activeFrog.position)) {
      if (froggerWinSet.has(activeFrog.position)) {
        activeFrog.position += (froggerWidth)
      } else {
        froggerWinSet.add(activeFrog.position)
        froggerSquares[activeFrog.position].classList.add('frog_win')
        activeFrog.active = false
        for (let i = 0; i < froggerWinSet.size; i++) {
          froggerSaved[i].classList.add('frogger_point_fill')
        }
        if (froggerWinSet.size === 5) {
          froggerWinFunction()
        } else {
          createFrog()
        }
      }
    }
  }

  function froggerWinFunction() {
    froggerClearTimers()
    activeFrog.position = froggerStartingPos
    froggerMessage.innerHTML = 'YOU WIN!'
    froggerMessageDisplay()
    froggerPlaying = false
    froggerStart.innerHTML = 'Reset'
  }

  function froggerLoseFunc() {
    froggerClearTimers()
    froggerMessageDisplay()
    froggerPlaying = false
    froggerStart.innerHTML = 'Reset'
  }

  function froggerMessageDisplay() {
    froggerMessage.style.display = 'block'
  }

  function froggerMessageHide() {
    froggerMessage.style.display = 'none'
  }

  function froggerClearTimers() {
    froggerRows.all.forEach(row => {
      clearInterval(row.createId)
      clearInterval(row.moveId)
    })
    clearInterval(froggerGameTimerId)
  }

  function froggerClearBoard() {
    froggerRows.all.forEach(row => row.items = [])
    froggerItemPaint()
    froggerLifePoints.forEach(point => point.classList.add('frogger_point_fill'))
    froggerSaved.forEach(savedPoint => savedPoint.classList.remove('frogger_point_fill'))
    froggerWinSet.clear()
    froggerSquares.forEach(square => square.classList.remove('frog_win'))
    froggerSeconds = 0
    froggerDOMSecs.innerHTML =  '00'
    froggerMins = 3
    froggerDOMMins.innerHTML = froggerMins
    froggerLives = 3
    froggerMessageHide()
  }

  function froggerHardReset() {
    froggerClearTimers()
    froggerClearBoard()
    froggerPlaying = false
  }

  function setTimers() {
    froggerClearBoard()
    row1Timer()
    row2Timer()
    row3Timer()
    row4Timer()
    row5Timer()
    row6Timer()
    row7Timer()
    row8Timer()
    row9Timer()
    row10Timer()
  }

  function froggerMove() {
    if (!froggerPlaying) return 
    switch (event.key) {
      case 'ArrowUp':
        if (froggerTopCheck()) return
        activeFrog.position -= (froggerWidth)
        winCheck()
        break
      case 'ArrowDown':
        if (froggerBottomCheck()) return
        activeFrog.position += (froggerWidth)
        break
      case 'ArrowLeft':
        if (froggerLeftCheck()) return
        activeFrog.position -= 1
        break
      case 'ArrowRight':
        if (froggerRightCheck()) return
        activeFrog.position += 1
        break
    }
    froggerLogCheck()
    if (froggerCarCollisionCheck()) frogDead()
    froggerPaint()
  }

  function froggerStartFunc() {
    if (!froggerPlaying) {
      froggerPlaying = true
      froggerGameTimerId = setInterval(froggerClockTick, 1000)
      froggerStart.innerHTML = 'Play'
      setTimers()
    }
  }

  froggerGridCreate()
  froggerPavement()
  froggerLilyPad()
  froggerRoad()
  froggerWater()
  createFrog()
  froggerPaint()

  function displayFrogger() {
    selectorContainer.style.display = 'none'
    frogger.style.display = 'flex'
    back.style.display = 'block'
  }

  // EVENT LISTENERS

  froggerPlay.addEventListener('click', displayFrogger)
  window.addEventListener('keydown', froggerMove)
  froggerStart.addEventListener('click', froggerStartFunc)


  // FROGGER END


  function returnToMain() {
    resetFunc()
    froggerHardReset()
    tetrisDomPause.style.display = 'none'
    selectorContainer.style.display = 'flex'
    tetris.style.display = 'none'
    flTron.style.display = 'none'
    back.style.display = 'none'
    frogger.style.display = 'none'
  }
  
  back.addEventListener('click', returnToMain)
}

window.addEventListener('DOMContentLoaded', init)