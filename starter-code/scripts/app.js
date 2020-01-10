function init() {

  // DOM Variables

  const selectorContainer = document.querySelector('.selector_container')
  const back = document.querySelector('.back')
  const pageContainer = document.querySelector('.page_container')
  const controls = document.querySelector('.controls')
  const tetrisControls = document.querySelector('.tetris_controls')
  const flTronControls = document.querySelector('.fl_tron_controls')
  const froggerControls = document.querySelector('.frogger_controls')
  const highScoreSelect = document.querySelector('.high_scores_selector')
  const highScoreContainer = document.querySelector('.high_score_container')
  const tetrisHighScoresDomElements = document.querySelectorAll('.tetris_score')
  const froggerHighScoresDomElements = document.querySelectorAll('.frogger_score')

  // TETRIS

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

  // TETRIS variables

  let timerId = null
  const height = 24
  let width = 10
  const sideBarDiff = 6
  const squares = []
  const nextSquares = []
  const bankSquares = []
  let playing = false
  let paused = false
  let x // VARIABLE THAT DETERMINS BLOCK POSITIONS
  let storedTetrisScores = localStorage.getItem('storedTetrisScores') ? JSON.parse(localStorage.getItem('storedTetrisScores')) : [] // I use it later on so not sure why it has a linter
  // const tetrisData = JSON.parse(localStorage.getItem('storedTetrisScores'))

  // Block constructor object

  class Block {
    constructor() {
      this.initId = initGen() // has the id of the block (relates to tetrimino array)
      this.rotId = rotGen() // has the rotation id of the block (relates to tetrimino array)
      this.init = tetriminos[this.initId][this.rotId] //stores the function referenced by the rot and init porperties above
      this.colour = colourGen() // holds the colour 
      this.blocks = this.init() // runs the function stored in init to generate block positions
    }
  }

  // sidebar variables

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

  // long array of functions that contain the tetrimino position data for each block and rotation

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

  function initGen() { // random id used to reference tetriminos array
    return Math.floor(Math.random() * (tetriminos.length))
  }

  function rotGen() { // random rotation id used to reference blocks within tetriminos array
    return Math.floor(Math.random() * 4)
  }

  function colourGen() { // cycles and returns colours 
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


  function colourArraySwitch() { // adds the current block to the it's colour dependant array of static blocks
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

  function rotateBlock() { // function to rotate blocks, it changes the rotId of the current block to cycle through the tertiminos array
    if (current.rotId === tetriminos[current.initId].length - 1) { 
      current.rotId = 0
    } else {
      current.rotId++
    }
    current.init = tetriminos[current.initId][current.rotId] //res applys the new init function on current block
    current.blocks = current.init() // calls the init function to populate block positions
    if ((rightWallRotChecker() || leftWallRotChecker()) && (leftBlockRotChecker() || rightBlockRotChecker()) && !baseChecker()) { // big old collision checker
      removeAndRepaint()
    } else {
      if (current.rotId === 0) { // if there is a collision, change the id, init function and block posiotions back to previous before repainting
        current.rotId = tetriminos[current.initId].length - 1
      } else {
        current.rotId--
      }
      current.init = tetriminos[current.initId][current.rotId]
      current.blocks = current.init()
    }
    removeAndRepaint()
  }

  function blockPick() { // creates new block
    current = new Block()
  }

  function nextBlockPick() { //if there is a next block, make that block the current 
    if (next) {
      current = next
    }
    width = 4 // change all of the game stats so when the next block is painted in the mini-grid it doesnt use the large grid scale
    x = 6 // ""
    next = new Block
    nextBlockPaint()
    width = 10
  }

  function nextBlockPaint() { //remve and repaint the next block
    nextSquares.forEach(square => square.className = 'game_square')
    next.blocks.forEach(index => nextSquares[index].classList.add(next.colour))
    resetX()
  }

  function removeAndRepaint() { // remove and repaint the current block
    squares.forEach(square => square.classList.remove(colour1, colour2, colour3, colour4, colour5))
    current.blocks.forEach(index => squares[index].classList.add(current.colour))
    colour1Array.forEach(index => squares[index].classList.add(colour1))
    colour2Array.forEach(index => squares[index].classList.add(colour2))
    colour3Array.forEach(index => squares[index].classList.add(colour3))
    colour4Array.forEach(index => squares[index].classList.add(colour4))
    colour5Array.forEach(index => squares[index].classList.add(colour5))
  }

  function resetX() {
    x = 15 // resets original position
  }

  function baseCollision() { // base collision function 
    if ((baseChecker() || blockChecker()) && playing) { //if the current block hits the bottom or another block
      tetrisPop.play()
      active = active.concat(current.blocks) // move the indexes of current array to the active array(array of static blocks at the bottom)
      colourArraySwitch() // does the same as above but for individual colours
      gameOverFunc() // check for game over condition is met
      resetX() // reset block postions
      scoreFunc() // scoring
      nextBlockPick() // pick the next block
    }
  }

  function spliceFromEachColour(z) { // remove blocks from each active(static) colour array
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

  function moveDownEachColour(inc, z) { // shift everything  higher and left over from above down one
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

  function scoreFunc() { //scoring
    active.sort((a, b) => a - b) // sort the active array (array of static blocks at the bottom)
    let n = 0
    for (let i = 0; i < height * width; i += width) { // iterate on each row of the board
      const rowComplete = active.filter(item => item >= i && item < (i + width)) // filter the active array for all the indexes within the row
      if (rowComplete.length === width) { /// if that filtered row's length is equal to the width of the board (i.e it is a full row)
        n++
        for (let q = 0; q < rowComplete.length; q++) { // for each block
          const index = active.indexOf(rowComplete[q])
          active.splice(index, 1) // splice from active array
          spliceFromEachColour(rowComplete[q]) // do the same for coloured arrays
        }
        for (let q = 0; q < active.length; q++) {
          if (active[q] < rowComplete[0]) {
            active[q] += width  // for each block if it is higher than the first one of the row that was spliced, move down
            moveDownEachColour(q, rowComplete[0]) // do the same for coloured arrays
          }
        }
      }
    }
    score += (10 * (n * n)) // scoring
    tetrisDomScore.innerHTML = score
    speedUp() // speed function 
  }

  function gravityTimer() { // timout tick function
    baseCollision() // checks base collision
    x += width // updates root opsition
    current.blocks = current.init() // updates block positions
    removeAndRepaint() 
  }


  function speedUp() { // check score to speed up function
    if (score > levelUpScore) {
      speed -= 100
      clearInterval(timerId)
      timerId = setInterval(gravityTimer, speed)
      levelUpScore *= 2
    }
  }

  function bankFunc() { // bank function works similar to next, rotating the banked and current blocks
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

  // Collision detection Functions - all pretty much work the same way, check to see if current block positions are intersecting the walls or another block
  

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

  function startTimer() { // timer set function
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

  function startFunc() { // does what it says on the tin
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

  function resetFunc() { // as with above
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

  function stopGame() { // general gamestop function
    clearInterval(timerId)
    tryAgainPopUp()
    playing = false
    tetrisStart.innerHTML = 'Play'
    tetrisTheme.pause()
    tetrisTheme.currentTime = 0
  }

  function tetrisSetScores() { // record scores in local storage function
    storedTetrisScores.push(score)
    storedTetrisScores.sort((a,b) => b - a)
    localStorage.setItem('storedTetrisScores', JSON.stringify(storedTetrisScores))
  }

  function gameOverFunc(){
    if (active.some(item => item < width * 5)) {
      tetrisSetScores()
      stopGame()
    }
  }

  function tryAgainPopUp() {
    tetrisDomPause.style.display = 'block'
    tetrisDomPause.innerHTML = 'Bad Luck, Try Again!'
  }

  function keyDownEvents(e) { // keyEvents
    if (playing) {
      if (e.key === 'ArrowRight' && rightWallChecker() && rightBlockChecker()) {
        x++ // update position 
        current.blocks = current.init() // generate new block positions based on new x value
        removeAndRepaint()
      } else if (e.key === 'ArrowLeft' && leftWallChecker() && leftBlockChecker()) {
        x--
        current.blocks = current.init()
        removeAndRepaint()
      } else if (e.key === 'ArrowDown') { // increase the drop speed
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
      if (e.key === 'ArrowDown') { // reset drop speed
        clearInterval(timerId)
        gravityTimer()
        startTimer()
      }
    }
  }

  function displayTetris() { // tetris display function
    selectorContainer.style.display = 'none'
    tetris.style.display = 'flex'
    back.style.display = 'block'
    controls.style.display = 'block'
    tetrisControls.style.display = 'block'
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

  // stargin points for all potentional players

  const fl2PStart = ((flHeight * flWidth) / 2) + (flWidth / 4)
  const fl2PStart2 = ((flHeight * flWidth) / 2) + ((flWidth / 4) * 3)
  const fl3PStart = fl2PStart - ((flHeight * flWidth) / 4)
  const fl3PStart2 = fl2PStart2 - ((flHeight * flWidth) / 4)
  const fl3PStart3 = (((flHeight * flWidth) / 4) * 3) + (flWidth / 2)
  const fl4PStart3 = fl2PStart + ((flHeight * flWidth) / 4)
  const fl4PStart4 = fl2PStart2 + ((flHeight * flWidth) / 4)

  // player variables

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

  // player constructor 

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

  function tronGridCreate() { // grid create
    for (let i = 0; i < flHeight; i++) {
      for (let i = 0; i < flWidth; i++) {
        const square = document.createElement('div')
        square.classList.add('fl_game_square')
        flGameContainer.appendChild(square)
        flSquares.push(square)
      }
    }
  }

  function flPaint() { // paint players
    arrayOfFlPlayers.forEach(player => {
      player.active.forEach(index => {
        flSquares[index].classList.add(`${player.name}background`)
      })
    })
  }

  function flResetPaint() { // reset player paint
    arrayOfAllFlPlayers.forEach(player => {
      player.active.forEach(index => {
        flSquares[index].classList.add(`${player.name}background`)
      })
    })
  }

  function clearFlPaint() { // clear all paint 
    flSquares.forEach(index => index.classList.remove('flP1background', 'flP2background', 'flP3background', 'flP4background'))
  }

  function flPlayerCountCheck() { // see how many players are left alive
    if (arrayOfFlPlayers.length === 1) { // if its only one, do some stuff
      arrayOfFlPlayers[0].score++
      flUpdateScore()
      clearInterval(timerId)
      flResetScreen = true
      flPlaying = false
      flMessage()
      flWinMessage.style.display = 'inline'
    }
  }

  // input events

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
    controls.style.display = 'block'
    flTronControls.style.display = 'block'
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

  const frogger = document.querySelector('#frogger')
  const froggerGameContainer = document.querySelector('.frogger_game_container')
  const froggerOuterContainer = document.querySelector('.frogger_outer_container')
  const froggerLifePoints = document.querySelectorAll('.frogger_life')
  const froggerMessage = document.querySelector('#frogger_message')
  const froggerDOMTimer = document.querySelector('.frogger_timer')
  const froggerTimeContainer = document.querySelector('.frogger_time_container')
  const froggerDOMScore = document.querySelector('.frogger_score_container > div')
  const froggerYes = document.querySelector('#frogger_yes')
  const froggerNo = document.querySelector('#frogger_no')
  const froggerSelector = document.querySelector('.frogger_selector')
  const froggerStartText = document.querySelector('.frogger_start_text')

  // VARIABLES

  let froggerPlaying = false

  const froggerHeight = 13
  const froggerWidth = 26
  const froggerW = 14
  const froggerSquares = []
  const froggerDisplayedSquares = []
  const invisNum = 6
  const frogs = []
  let activeFrog = null
  const froggerStartingPos = Math.floor((froggerWidth * froggerHeight) - (froggerWidth / 2))
  let frogLives = 3
  let frogsSafe = 0
  let froggerResetState = false
  let froggerScore = 0
  let storedFroggerScores = localStorage.getItem('storedFroggerScores') ? JSON.parse(localStorage.getItem('storedFroggerScores')) : []
  // const froggerData = JSON.parse(localStorage.getItem('storedFroggerScores'))

  let pavementArray = null
  let waterArray = null
  let grassArray = null
  let safeArray = null

  class RowTraits {
    constructor(tickRate, row, spawnRate) {
      this.items = [],
      this.row = row
      this.tickRate = tickRate,
      this.spawnRate = spawnRate,
      this.spawnRateNum = 1,
      this.spawnNum = 0,
      this.spawn
      this.tickId = null,
      this.startingSquare,
      this.endingSquare
    }
  }

  class LeftRow extends RowTraits {
    constructor(tickRate, row, spawnRate) {
      super(tickRate, row, spawnRate)
      this.startingSquare = (froggerWidth * row) - invisNum
      this.endingSquare = ((froggerWidth * row) - froggerWidth) + invisNum
    }
    move() {
      if (
        this.items.some(item => item.positions.includes(activeFrog.position)) && 
        froggerRows.water.includes(this) &&
        activeFrog.position !== this.endingSquare &&
        !froggerResetState
      ) {
        activeFrog.position--
      }
      this.items.forEach(item => {
        for (let i = 0; i < item.positions.length; i++) {
          item.positions[i]--
        }
      })
      if (this.items[0].positions[this.items[0].positions.length - 1] < this.endingSquare) {
        this.items.shift()
      }
      if (!froggerResetState) froggerCarCollisionCheck()
      if (!froggerResetState)froggerLogCheck()
      froggerPaintFrog()
    }
  }

  class RightRow extends RowTraits {
    constructor(tickRate, row, spawnRate) {
      super(tickRate, row, spawnRate)
      this.startingSquare = (froggerWidth * row) - (froggerWidth - invisNum) - 1
      this.endingSquare = (froggerWidth * row) - invisNum - 1
    }
    move() {
      if (
        this.items.some(item => item.positions.includes(activeFrog.position)) && 
        froggerRows.water.includes(this) &&
        activeFrog.position !== this.endingSquare && 
        !froggerResetState
      ) {
        activeFrog.position++
      }
      this.items.forEach(item => {
        for (let i = 0; i < item.positions.length; i++) {
          item.positions[i]++
        }
      })
      if (this.items[0].positions[this.items[0].positions.length - 1] > this.endingSquare) {
        this.items.shift()
      }
      if (!froggerResetState) froggerCarCollisionCheck()
      if (!froggerResetState) froggerLogCheck()
      froggerPaintFrog()
    }
  }

  let row1 = new LeftRow(500, 12, [4])
  let row2 = new RightRow(500, 11, [3, 6])
  let row3 = new LeftRow(500, 10, [3, 3, 6])
  let row4 = new RightRow(500, 9, [13])
  let row5 = new LeftRow(400, 8, [4, 9])
  let row6 = new LeftRow(350, 6, [4])
  let row7 = new RightRow(600, 5, [5])
  let row8 = new RightRow(300, 4, [9])
  let row9 = new LeftRow(350, 3, [4, 4, 4, 6])
  let row10 = new RightRow(550, 2, [6])

  let froggerRows = null

  function setFroggerRows() {
    froggerRows = {
      all: [row1, row2, row3, row4, row5, row6, row7, row8, row9, row10],
      road: [row1, row2, row3, row4, row5],
      water: [row6, row7, row8, row9, row10],
      logs: [row7, row8, row10],
      turtles: [row6, row9],
      right: [row2, row4, row7, row8, row10], 
      left: [row1, row3, row5, row6, row9]
    }
  }

  setFroggerRows()

  class Frog {
    constructor(position, active) {
      this.position = position
      this.active = active
    }
  }

  class Item {
    constructor(position, len) {
      this.position = position,
      this.len = len
      this.positions = []
    }
    populatePositions(row) {
      for (let i = 0; i < this.len; i++) {
        if (froggerRows.left.includes(row)) {
          this.positions.push(this.position + i)
        } else if (froggerRows.right.includes(row)){
          this.positions.push(this.position - i)
        }
      }
    }
  }

  function createItem(row, length) {
    const newItem = new Item(row.startingSquare, length)
    newItem.populatePositions(row)
    row.items.push(newItem) 
  }

  function froggerPaintFrog() {
    froggerSquares.forEach(square => square.classList.remove('frog'))
    froggerSquares[activeFrog.position].classList.add('frog')
  }

  // function froggerBackgroundImageConstructor(row) {
  //   let bg = ''
  //   for (let i = 0; i < row.spawnRate.length; i++) {
  //     for (let s = 0; s < row.items[0].positions.length; s++) {
  //       if (i === row.items[0].positions.length - 1) {
  //         bg += 'url("../assets/log_right.png")'
  //       } else if (i === 0) {
  //         bg += 'url("../assets/log_left.png"),'
  //       } else {
  //         bg += 'url("../assets/log_middle.png"),'
  //       }
  //     }
  //   }
  //   return bg
  // }

  // function froggerBackgroundPositionConstructor(row) {
  //   let distance = '0 0,'
  //   for (let i = 1; i < row.items[0].positions.length; i++) {
  //     if (i !== row.items[0].positions.length - 1) {
  //       distance += (i * 40 + 'px ' + 0 + ',')
  //     } else {
  //       distance += (i * 40 + 'px ' + 0)
  //     }
  //   }
  //   return distance
  // }

  // function froggerRowHeightConstructor(row) {
  //   return `${(row.row - 1) * 40}px`
  // }

  // function froggerPseudoElementCreate(row) {
  //   document.documentElement.style.setProperty('--row_7_bg_images', froggerBackgroundImageConstructor(row7))
  //   document.documentElement.style.setProperty('--row_7_bg_pos', froggerBackgroundPositionConstructor(row7))
  //   document.documentElement.style.setProperty('--row_7_height', froggerRowHeightConstructor(row7))
  //   console.log(document.documentElement.style.getPropertyValue('--row_7_bg_images'))
  //   document.documentElement.style.setProperty('--row_7_width', (row7.items[0].positions.length) * (row7.items.length))
  //   froggerSquares[row.startingSquare - (froggerWidth * (row.row - 1)) + row7.items.length].classList.add('row_7_test')
  // }

  function froggerItemPaint() {
    froggerSquares.forEach(square => square.classList.remove(
      'log', 
      'row_1_car', 
      'row_2_car', 
      'row_3_car', 
      'row_4_car', 
      'row_5_car_back', 
      'row_5_car_front', 
      'log_right',
      'log_left',
      'log_middle',
      'turtle',
      'row_6_anim',
      'row_7_anim',
      'row_8_anim',
      'row_9_anim',
      'row_10_anim',
      'row_5_test'
    ))
    row1.items.forEach(item => item.positions.forEach(pos => froggerSquares[pos].classList.add('row_1_car')))
    row2.items.forEach(item => item.positions.forEach(pos => froggerSquares[pos].classList.add('row_2_car')))
    row3.items.forEach(item => item.positions.forEach(pos => froggerSquares[pos].classList.add('row_3_car')))
    row4.items.forEach(item => item.positions.forEach(pos => froggerSquares[pos].classList.add('row_4_car')))
    // row5.items.forEach(item => {
    //   froggerSquares[item.positions[0]].classList.add('row_5_car_front')
    //   froggerSquares[item.positions[1]].classList.add('row_5_car_back')
    // })
    row5.items.forEach(item => {
      froggerSquares[item.positions[0]].classList.add('row_5_test')
    })
    // document.documentElement.style.setProperty('--row_7_bg_images', froggerBackgroundImageConstructor())
    // document.documentElement.style.setProperty('--row_7_bg_pos', froggerBackgroundPositionConstructor())
    // document.documentElement.style.setProperty('--row_7_width', row7.items[0].positions.length)
    // console.log(document.documentElement.style.getPropertyValue('--row_7_bg_images'))
    // console.log(document.documentElement.style.getPropertyValue('--row_7_bg_pos'))
    // console.log(document.documentElement.style.getPropertyValue('--row_7_width'))
    // froggerRows.turtles.forEach(row => row.items.forEach(item => {
    //   froggerSquares[item.positions[0]].classList.add('row_6_test')
    // }))
    // froggerRows.turtles.forEach(row => row.items.forEach(item => item.positions.forEach(pos => {
    //   froggerSquares[pos].classList.add('turtle')
    // })))
    // froggerSquares[row7.startingSquare + 1].classList.add('row_7_test')

    // row7.items.forEach(item => item.positions.forEach(pos => {
    //   if (pos !== row7.startingSquare) {
    //     froggerSquares[pos].classList.add('row_7_anim')
    //   }
    // }))
    froggerRows.logs.forEach(row => row.items.forEach(item => item.positions.forEach(pos => {
      if (item.positions[0] === pos) {
        if (froggerRows.left.includes(row)) {
          froggerSquares[pos].classList.add('log_left')
        } else {
          froggerSquares[pos].classList.add('log_right')
        }
      } else if (item.positions[item.positions.length - 1] === pos) {
        if (froggerRows.left.includes(row)) {
          froggerSquares[pos].classList.add('log_right')
        } else {
          froggerSquares[pos].classList.add('log_left')
        }
      } else {
        froggerSquares[pos].classList.add('log_middle')
      }
    })))
    row6.items.forEach(item => item.positions.forEach(pos => froggerSquares[pos].classList.add('turtle')))
    row9.items.forEach(item => item.positions.forEach(pos => froggerSquares[pos].classList.add('turtle')))
    row6.items.forEach(item => item.positions.forEach(pos => froggerSquares[pos].classList.add('row_6_anim')))
    row7.items.forEach(item => item.positions.forEach(pos => froggerSquares[pos].classList.add('row_7_anim')))
    row8.items.forEach(item => item.positions.forEach(pos => froggerSquares[pos].classList.add('row_8_anim')))
    row9.items.forEach(item => item.positions.forEach(pos => froggerSquares[pos].classList.add('row_9_anim')))
    row10.items.forEach(item => item.positions.forEach(pos => froggerSquares[pos].classList.add('row_10_anim')))
  }

  function froggerCreateFrog() {
    activeFrog = new Frog(froggerStartingPos, true)
    frogs.push(activeFrog)
  }

  function frogDead() {
    activeFrog.position = froggerStartingPos
    froggerPaintFrog()
    froggerResetState = false
    for (let i = 0; i < Math.abs(frogLives - 3); i++) {
      froggerLifePoints[i].style.display = 'none'
    }
    if (frogLives === 0) {
      froggerSetScores()
      froggerLoseFunc()
    }
  }

  function froggerSetScores() {
    storedFroggerScores.push(froggerScore)
    storedFroggerScores.sort((a,b) => b - a)
    localStorage.setItem('storedFroggerScores', JSON.stringify(storedFroggerScores))
  } 

  function UpdateFroggerScore(number) {
    froggerScore += number
    const multiple = 6 - froggerScore.toString().length
    froggerDOMScore.innerHTML = '0'.repeat(multiple) + froggerScore
  }

  function froggerLoseFunc() {
    froggerMessage.style.display = 'block'
    froggerPlaying = false
    froggerDOMTimer.classList.remove('frogger_life_animation_class')
  }

  function removeSafeFrogs() {
    froggerSquares.forEach(square => square.classList.remove('safe_frog_right', 'safe_frog_left'))
  }

  function froggerSafeCondition() {
    if (safeArray.includes(froggerSquares[activeFrog.position])) {
      if (activeFrog.position % 2 === 0) {
        froggerSquares[activeFrog.position].classList.add('safe_frog_right')
      } else if (activeFrog.position % 2 !== 0) {
        froggerSquares[activeFrog.position].classList.add('safe_frog_left')
      }
      froggerTimeContainer.replaceChild(froggerDOMTimer, froggerDOMTimer)
      
      
      activeFrog.active = false
      frogsSafe++
      activeFrog = new Frog(froggerStartingPos, true)
      UpdateFroggerScore(50)
    }
    if (frogsSafe === 3) {
      UpdateFroggerScore(1000)
      setTimeout(removeSafeFrogs, 1000)
      frogsSafe = 0
      froggerLevel2Rows()
    }
  }


  function froggerTopCheck() {
    return (activeFrog.position - froggerWidth) < 0
  }

  function froggerBottomCheck() {
    return (activeFrog.position + froggerWidth) > (froggerWidth * froggerHeight)
  }

  function froggerRightCheck() {
    return ((activeFrog.position + 1) + invisNum) % froggerWidth === 0
  }

  function froggerLeftCheck() {
    return (activeFrog.position - invisNum)  % froggerWidth === 0
  }

  function froggerWaterCheck() {
    if (waterArray.some(square => froggerSquares.indexOf(square) === activeFrog.position)) {
      froggerSquares[activeFrog.position].classList.add('frogger_water_dead')
      froggerResetState = true
      frogLives--
      setTimeout(frogDead, 2000)
    }
  }

  function froggerLogCheck() {
    if (!froggerRows.water.some(row => row.items.some(log => log.positions.includes(activeFrog.position)))) froggerWaterCheck()
  }

  function froggerCarCollisionCheck() {
    if (froggerRows.road.some(row => row.items.some(item => item.positions.includes(activeFrog.position)))) {
      froggerSquares[activeFrog.position].classList.add('frogger_car_dead')
      froggerResetState = true
      frogLives--
      setTimeout(frogDead, 2000)
    }
  }

  function froggerAlreadySafeCheck() {
    return safeArray.includes(froggerSquares[activeFrog.position - froggerWidth]) &&
    (froggerSquares[activeFrog.position - froggerWidth].classList.contains('safe_frog_right') ||
    froggerSquares[activeFrog.position - froggerWidth].classList.contains('safe_frog_left')) ||
    (froggerSquares[activeFrog.position - froggerWidth + 1].classList.contains('safe_frog_right') ||
    froggerSquares[activeFrog.position - froggerWidth + 1].classList.contains('safe_frog_left')) ||
    (froggerSquares[activeFrog.position - froggerWidth - 1].classList.contains('safe_frog_right') ||
    froggerSquares[activeFrog.position - froggerWidth - 1].classList.contains('safe_frog_left'))
  }


  // BOARD CREATION

  function froggerGridCreate() {
    for (let i = 0; i < froggerHeight; i++) {
      for (let i = 0; i < froggerWidth; i++) {
        const square = document.createElement('div')
        square.classList.add('frogger_game_square')
        if (i < 6 || i >= 20) {
          square.classList.add('invis')
        } else {
          froggerDisplayedSquares.push(square)
        }
        froggerGameContainer.appendChild(square)
        froggerSquares.push(square)
      }
    }
  }

  function setAnimationSpeeds() {
    for (let i = 1; i <= froggerRows.all.length; i++) {
      document.documentElement.style.setProperty(`--row_${i}_speed`, (froggerRows.all[i - 1].tickRate / 1000) + 's')
    }
  }

  function froggerPavementCreate() {
    pavementArray = froggerDisplayedSquares.filter((square, index) => {
      return index >= (froggerW * froggerHeight) - froggerW ||
      (index >= (froggerHeight * froggerW / 2) - (froggerW / 2) && 
      index < (froggerHeight * froggerW / 2) + (froggerW / 2)
      )
    })
    pavementArray.forEach(square => square.classList.add('frogger_pavement'))
  }

  function froggerGrassCreate() {
    grassArray = froggerSquares.filter((square, index) => {
      return index === 6 || index === 7 || index === 10 || index === 11 || index === 14 || index === 15 || index === 18 || index === 19
    })
    grassArray.forEach(square => square.classList.add('frogger_grass'))
  }

  function froggerSafeCreate() {
    safeArray = froggerSquares.filter((square, index) => {
      return index === 8 || index === 9 || index === 12 || index === 13 || index === 16 || index === 17
    })
    safeArray.forEach((square, index) => {
      if (index % 2 === 0) {
        square.classList.add('frogger_safe_left')
      } else {
        square.classList.add('frogger_safe_right')
      }
    })
  }
  

  function froggerWaterCreate() {
    waterArray = froggerSquares.filter((square, index) => {
      return (index < (froggerHeight * froggerWidth / 2) - (froggerWidth / 2) && index >= froggerWidth) ||
      grassArray.includes(square)
    })
  }

  function spawnRateContainer(row, length) {
    if (row.spawnRateNum === 0) {
      createItem(row, length)
      // froggerPseudoElementCreate(row7)
      row.spawnRateNum++
      if (row.spawnNum === row.spawnRate.length - 1) {
        row.spawnNum = 0
      } else {
        row.spawnNum++
      }
    } else if (row.spawnRateNum === row.spawnRate[row.spawnNum]) {
      row.spawnRateNum = 0
    } else {
      row.spawnRateNum++
    }
  }

  function froggerHardReset() {
    froggerRows.all.forEach(row => {
      clearInterval(row.tickId)
      row.items = []
    })
    activeFrog = new Frog(froggerStartingPos, true)
    froggerSquares.forEach(square => square.classList.remove('safe_frog_right', 'safe_frog_left'))
    froggerPaintFrog()
    froggerItemPaint()
    froggerStartText.style.display = 'block'
    UpdateFroggerScore(-froggerScore)
    frogLives = 3
    frogsSafe = 0
    froggerPlaying = false
    froggerMessage.style.display = 'none'
    froggerLifePoints.forEach(life => life.style.display = 'block')
    froggerDOMTimer.classList.remove('frogger_life_animation_class')
  }

  function froggerLevel2Rows() {
    froggerRows.all.forEach(row => {
      clearInterval(row.tickId)
      row.items = []
    })
    froggerItemPaint()
    row1 = new LeftRow(500, 12, [4])
    row2 = new RightRow(500, 11, [3, 6])
    row3 = new LeftRow(500, 10, [3, 3, 6])
    row4 = new RightRow(200, 9, [3, 13])
    row5 = new LeftRow(500, 8, [5])
    row6 = new LeftRow(400, 6, [6, 6, 4])
    row7 = new RightRow(550, 5, [8, 5, 5])
    row8 = new RightRow(300, 4, [9])
    row9 = new LeftRow(350, 3, [3, 3, 4, 4])
    row10 = new RightRow(550, 2, [6])
    setFroggerRows()
    setAnimationSpeeds()
    createItem(row1, 1)
    createItem(row2, 1)
    createItem(row3, 1)
    createItem(row4, 1)
    createItem(row5, 2)
    createItem(row6, 3)
    createItem(row7, 3)
    createItem(row8, 6)
    createItem(row9, 2)
    createItem(row10, 4)
    row1.tickId = setInterval(function() {
      rowTimer(row1, 1)
    }, row1.tickRate)
    row2.tickId = setInterval(function() {
      rowTimer(row2, 1)
    }, row2.tickRate)
    row3.tickId = setInterval(function() {
      rowTimer(row3, 1)
    }, row3.tickRate)
    row4.tickId = setInterval(function() {
      rowTimer(row4, 1)
    }, row4.tickRate)
    row5.tickId = setInterval(function() {
      rowTimer(row5, 2)
    }, row5.tickRate)
    row6.tickId = setInterval(function() {
      rowTimer(row6, 3)
    }, row6.tickRate)
    row7.tickId = setInterval(function() {
      rowTimer(row7, 3)
    }, row7.tickRate)
    row8.tickId = setInterval(function() {
      rowTimer(row8, 6)
    }, row8.tickRate)
    row9.tickId = setInterval(function() {
      rowTimer(row9, 2)
    }, row9.tickRate)
    row10.tickId = setInterval(function() {
      rowTimer(row10, 4)
    }, row10.tickRate)
  }

  function rowTimer(row, itemLength) {
    row.move()
    spawnRateContainer(row, itemLength)
    froggerItemPaint()
  }
  
  // TIMERS


  function froggerMove() {
    if (!froggerPlaying) return
    if (froggerResetState) return
    switch (event.key) {
      case 'ArrowUp':
        if (froggerTopCheck()) return
        if (froggerAlreadySafeCheck()) return
        activeFrog.position -= froggerWidth
        document.documentElement.style.setProperty('--frog_rotate', '0deg')
        UpdateFroggerScore(10)
        froggerSafeCondition()
        break
      case 'ArrowRight':
        if (froggerRightCheck()) return
        document.documentElement.style.setProperty('--frog_rotate', '90deg')
        activeFrog.position++
        break
      case 'ArrowDown':
        if (froggerBottomCheck()) return
        activeFrog.position += froggerWidth
        document.documentElement.style.setProperty('--frog_rotate', '180deg')
        break
      case 'ArrowLeft':
        if (froggerLeftCheck()) return
        activeFrog.position--
        document.documentElement.style.setProperty('--frog_rotate', '270deg')
        break
    }
    froggerCarCollisionCheck()
    froggerLogCheck()
    document.documentElement.style.setProperty('--frog_jump', 'jump_animation 0.2s ease-out')
    froggerPaintFrog()
  }

  function animEndFunc() {
    switch (event.animationName){
      case 'jump_animation':
        document.documentElement.style.setProperty('--frog_jump', 'none')
        break
      case 'water_dead_animation':
        froggerSquares.forEach(square => square.classList.remove('frogger_water_dead'))
        break
      case 'car_dead_animation':
        froggerSquares.forEach(square => square.classList.remove('frogger_car_dead'))
        break
      case 'frogger_life_animation':
        froggerLoseFunc()
    }
  }

  function froggerStartTimers() {
    if (froggerPlaying || froggerStartText.style.display === 'none' || froggerOuterContainer.style.display === 'none') return
    froggerStartFunc()
    createItem(row1, 1)
    createItem(row2, 1)
    createItem(row3, 1)
    createItem(row4, 1)
    createItem(row5, 2)
    createItem(row6, 3)
    createItem(row7, 3)
    // froggerPseudoElementCreate(row7)
    createItem(row8, 6)
    createItem(row9, 2)
    createItem(row10, 4)
    row1.tickId = setInterval(function() {
      rowTimer(row1, 1)
    }, row1.tickRate)
    row2.tickId = setInterval(function() {
      rowTimer(row2, 1)
    }, row2.tickRate)
    row3.tickId = setInterval(function() {
      rowTimer(row3, 1)
    }, row3.tickRate)
    row4.tickId = setInterval(function() {
      rowTimer(row4, 1)
    }, row4.tickRate)
    row5.tickId = setInterval(function() {
      rowTimer(row5, 2)
    }, row5.tickRate)
    row6.tickId = setInterval(function() {
      rowTimer(row6, 3)
    }, row6.tickRate)
    row7.tickId = setInterval(function() {
      rowTimer(row7, 3)
    }, row7.tickRate)
    row8.tickId = setInterval(function() {
      rowTimer(row8, 6)
    }, row8.tickRate)
    row9.tickId = setInterval(function() {
      rowTimer(row9, 2)
    }, row9.tickRate)
    row10.tickId = setInterval(function() {
      rowTimer(row10, 4)
    }, row10.tickRate)
  }

  function froggerStartFunc() {
    activeFrog = null
    activeFrog = new Frog(froggerStartingPos, true)
    UpdateFroggerScore(-froggerScore)
    froggerSquares.forEach(square => square.classList.remove('safe_frog_right', 'safe_frog_left'))
    frogLives = 3
    frogsSafe = 0
    froggerStartText.style.display = 'none'
    froggerPlaying = true
    froggerMessage.style.display = 'none'
    froggerLifePoints.forEach(life => life.style.display = 'block')
    froggerDOMTimer.classList.add('frogger_life_animation_class')
  }

  function displayFrogger() {
    froggerOuterContainer.style.display = 'flex'
    selectorContainer.style.display = 'none'
    pageContainer.style.background = 'black'
    back.style.display = 'block'
    controls.style.display = 'block'
    controls.classList.add('frogger_style_controls')
    froggerControls.style.display = 'block'
  }

  froggerGridCreate()
  froggerPavementCreate()
  froggerGrassCreate()
  froggerWaterCreate()
  froggerSafeCreate()
  froggerCreateFrog()
  froggerPaintFrog()
  setAnimationSpeeds()

  // EVENT LISTENERS

  window.addEventListener('keydown', froggerMove)
  window.addEventListener('animationend', animEndFunc)
  froggerYes.addEventListener('click', froggerStartFunc)
  window.addEventListener('keydown', froggerStartTimers)
  froggerSelector.addEventListener('click', displayFrogger)
  froggerNo.addEventListener('click', froggerHardReset)


  // FROGGER END

  function controlsUnHover() {
    controls.style.animation = ''
    controls.style.animation = 'controls_anim_2 1s'
    // controls.style.animationFillMode = 'forwards'
  }

  function controlsHover() {
    controls.style.animation = ''
    controls.style.animation = 'controls_anim 1s'
    controls.style.animationFillMode = 'forwards'    
  }


  function returnToMain() {
    froggerHardReset()
    resetFunc()
    tetrisDomPause.style.display = 'none'
    selectorContainer.style.display = 'flex'
    tetris.style.display = 'none'
    flTron.style.display = 'none'
    back.style.display = 'none'
    controls.classList.remove('frogger_style_controls')
    controls.childNodes.forEach(element => {
      if (element.className) element.style.display = 'none'
    })
    frogger.style.display = 'none'
    controls.style.display = 'none'
    highScoreContainer.style.display = 'none'
    pageContainer.style.background = 'url("https://www.publicdomainpictures.net/pictures/320000/velka/abstrakt-wasserfarbe-hintergrund-1575395840syM.jpg")'
  }

  function populateHighScores() {
    tetrisHighScoresDomElements.forEach((score, index) => {
      const multiple = storedTetrisScores[index] ? 6 - storedTetrisScores[index].toString().length : 0
      !storedTetrisScores[index] ? score.innerHTML = '000000' : score.innerHTML = '0'.repeat(multiple) + storedTetrisScores[index]
    })
    froggerHighScoresDomElements.forEach((score, index) => {
      const multiple = storedFroggerScores[index] ? 6 - storedFroggerScores[index].toString().length : 0
      !storedFroggerScores[index] ? score.innerHTML = '000000' : score.innerHTML = '0'.repeat(multiple) + storedFroggerScores[index]
    })
  }

  function displayHighScore() {
    populateHighScores()
    highScoreContainer.style.display = 'flex'
    selectorContainer.style.display = 'none'
    back.style.display = 'block'
  }

  populateHighScores()
  
  back.addEventListener('click', returnToMain)
  controls.addEventListener('mouseout', controlsUnHover)
  controls.addEventListener('mouseover', controlsHover)
  highScoreSelect.addEventListener('click', displayHighScore)
}

window.addEventListener('DOMContentLoaded', init)