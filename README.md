# General Assembly Project 1 - Games Portal

[Deployed Project Link](https://josbogan.github.io/sei-project-1/)

This games portal was my first at General Assembly, developed in Vanilla JavaScript using heavy DOM manipulation. I worked alone for this project over seventeen days.

## Task Brief

* **Build a browser based game**
* **The game must be grid based** - No canvas
* **Use Vanilla JavaScript and DOM manipulation**
* **Deploy the game online**

## Technologies Used

* Vanilla JavaScript (ES6)
* HTML5
* CSS3
* Git
* GitHub
* Flexbox
* Google Fonts

## Installation

* Clone or download the repo
* Open the `index.html` in a browser of your choice

## Overview

This project was the first of my time at General Assembly, being set only three weeks in and two after the start of our Javascript module. Due to the Christmas holidays I had an extended deadline for this project so I decided to create a portal hub for a couple of different games. I ended up finishing three games: Tetris, FL-Tron and Frogger. They all live on a single home page with a leaderboard using local storage to store the scores.

Tetris is a puzzle game where blocks of varying shapes fall from the top of the board and it is the player's goal to direct and place them in such a way as to create complete rows of blocks. Tetris is a one player game where the game speeds up as certain score thresholds and the aim is simply to last as long and rack up as many points as possible.

FL-Tron is a multiplayer snake variant where the goal is to defeat your enemies by causing them to run into your own snake body or run into a wall. Unlike traditional snake, the grid divisions are far smaller and the trail of the player is left behind instead of following.

Frogger is another classic arcade game where you play as a frog attempting to cross the road and river to reach a lilypad. The challenge comes from trying to avoid the various cars and dangerous flow of the river that stand in your way.

# Walkthrough

## Portal Page
![Home Page](assets/readme/home_screen.png)

## Tetris core functionality
![Tetris](assets/readme/tetris_core.gif)

### FL-Tron core functionality
![FL-Tron](assets/readme/fl_core.gif)

### Frogger core functionality
![Frogger](assets/readme/frogger_core.gif)

### Scoreboard
![Frogger](assets/readme/scoreboard.png)

## Extra Functionality
Tetris:
For tetris there are lots of small things that add towards making the game feel complete. Firstly, the last moment shift that tetris allows for blocks to move sideways for a moment after they have touched the base or another block. The ability to speed up the game speed so blocks fall at a faster speed. I also included the small container that shows the next upcoming block as well as a non-traditional 'bank' that allows you to store a block and swap it in and out when needed.

FL-Tron:
Whilst a relatively simple game in theory, there are many features that give the game some depth and improve the experience. I added the ability to choose how many players to start with, which change starting positions depending on the number of players. This alongside the ability for players to choose their own colour make it easier to visually differentiate the players. Each match of FL-Tron is first to three rounds, so as to increase competitiveness.

Frogger:
I tried to be as faithful to the classic arcade frogger as I could, visually and mechanically, so I made sure to include a timer in the bottom right, and lives in the bottom left. I also used the same assets used in the original arcade game. Despite being a grid based game I also tried to emulate motion with transforms.

## Process

In accordance with the brief, as all of the games were supposed to be grid-based games, I started each game with calculating the grid and what kinds of motion on the grid that I would need. For tetris I needed a perpetual downwards force and the user input of right and left along with the ability to rotate. Motion wise FL-Tron and frogger both required more simple up, down, left and right motion.

After planning out the grids and each game's motion I then moved on to collision, as each game had wall collision, and each one having their own unique collision conditions, tetris being other blocks, FL-Tron being any player and frogger being the water, cars and lilypads.

Once I had the collisions in place I went on other features such as to win conditions and scoring etc.

# Reflections

## Featured Code

One aspect of Tetris that I thought was going to be very difficult, but I am very happy with the solution I came up with, was the wall and other block collisions. Below are two examples for the rotation collision check, to make sure that when you rotate a block next to another one as it is falling, the user's block does not clip into the static block. `current` is the user block object, and `current.blocks` is an array of the grid blocks that are currently occupied by `current`. `active` is an array of every single block that is on the field. I managed to condense almost all of my collision checks, rotation or movement, into simple one liners like this. 

```javascript
  function leftBlockRotChecker() {
    return !current.blocks.some(index => active.includes(index))
  }

  function rightBlockRotChecker() {
    return !current.blocks.some(index => active.includes(index))
  }
```

Below is my scoring system for tetris, at first I was quite stumped on how to tackle the row complete detection and scoring, which was made more difficult by the fact that I had separate arrays for each colour of block. I found a way to successfully perform the function however  looking back on it with a more discerning eye, the algorithm is extremely inefficient, at least O(N^2) complexity.

```javascript
function scoreFunc() { //scoring
    active.sort((a, b) => a - b) // sort the active array (array of non user blocks on the board)
    let n = 0
    for (let i = 0; i < height * width; i += width) { // iterate on each row of the board
      const rowComplete = active.filter(item => item >= i && item < (i + width)) // filter the active array for all the indexes within the row
      if (rowComplete.length === width) { // if that filtered row's length is equal to the width of the board (i.e it is a full row)
        n++
        for (let q = 0; q < rowComplete.length; q++) { // for each block
          const index = active.indexOf(rowComplete[q])
          active.splice(index, 1) // splice from active array
          spliceFromEachColour(rowComplete[q]) // do the same for coloured arrays
        }
        for (let q = 0; q < active.length; q++) {
          if (active[q] < rowComplete[0]) {
            active[q] += width  // for each block if it is higher than the first one of the row that was spliced, move down
            // moveDownEachColour(q, rowComplete[0]) // do the same for coloured arrays
          }
        }
        moveDownEachColour(rowComplete[0])
      }
    }
    score += (10 * (n * n)) // scoring
    tetrisDomScore.innerHTML = score
    speedUp() // speed function 
  }
```

## Wins
In the end I was very happy with how all of the games came out. In tetris, getting the next up and bank sections working was tricky as it involved essentially setting up a mini-board for each one, however due to the dynamic nature of my block positions it worked well once set up.

The biggest win for me in FL-Tron was the introduction of CSS variables. I discovered CSS variables whilst doing FL-Tron and it allowed me to cut out a huge amount of code in replacement for just a couple of lines of more readable and simple code.

```javascript
  function colourChange() { // changes the css variable for the player colours
    const flColour = event.target.value
    document.documentElement.style.setProperty(`--${this.dataset.name}`, flColour)
    flPaint()
  }
```

Setting out to recreate arcade frogger turned out to be a lot more difficult than I anticipated, so the fact that visually I managed to come close, despite roadblocks such as the final safe zone for the frogs in original frogger being wider than one square on the grid.

## Challenges
Each game had their own set of challenges, but these were some of the most difficult things to overcome. In tetris I originally built the game all in a single colour for simplicity's sake. Towards the end however I decided to pivot to the pastel colours currently in the game. This shift was a lot more challenging than I anticipated as the array that then represented the entire field of blocks had to be divided into arrays by colour. This in turn affected much of the game's functionality.

The other main roadblock that I came across in this project was the animation in frogger. In my quest to be as faithful to the arcade game as possible I wanted to include animation so that the obstacles were not not staggering across the screen. I lost at least a day and a half to two days trying to figure out the best method of doing it. I went through various iterations, using pseudo-elements, transforming the entire row etc. However I settled on simply translating each grid square based on the speed of the row using CSS variables set in the javascript. Even with this solution I am not 100% satisfied the method has some inherent jutter that I could not get rid of.

## What Next
Whilst I am relatively happy with the current state of the games, there are some things that I would do to go further and improve each of them.

All:
* Refactor heavily.
* Clean up code.

Tetris:
* Add a block shadow that indicates the user blocks position at the base.
* Add functionality for a second player/competition mode.

FL-Tron:
* Force the players into a starting direction (currently uses direction last used in the previous round).
* Add power ups to make the game a bit more engaging and exciting.
* Size up the board for more playing space.

Frogger:
* Fix jitteriness/animation (potentially shift the whole game to canvas).
* Add more levels and features such as crocodiles and submerging turtles.

## Key Learnings

This project was a fantastic exercise in DOM manipulation, interactivity and basic logic. Due to the more abstract goals and functionality in video games I feel like this project really helped my understanding of how to get from a to b in code and achieve a goal. Then translating this into the heavy DOM manipulation required for the games to function game me plenty of practice in website interactivity.
