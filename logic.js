// Variables are storage of values
let board;
let score = 0;
let rows = 4;
let columns = 4;

let is2048Exist = false;
let is4096Exist = false;
let is8192Exist = false;

//declaring variables used for touch input
let startX = 0;
let startY = 0;

//functionss are callable programmed tasks

//function to set the game board
function setGame(){

	//initializes the 4x4 game board with all tiles set to 0
	//backend board -> board[4][4]
	board = [
		[32, 8, 4, 0],
        [4, 128, 64, 256],
        [8, 32, 16, 2],
        [16, 2, 256, 1024]
	]

	// board = [
	// 	[0, 0, 0, 0],
 //        [0, 0, 0, 0],
 //        [0, 0, 0, 0],
 //        [0, 0, 0, 0]
	// ]

	// board = [
	// 	[2, 4, 8, 16],
 //        [32, 64, 128, 256],
 //        [512, 1024, 2048, 4096],
 //        [8192, 0, 0, 0]
	// ]

	for(let r=0; r<rows; r++){
		for(let c=0; c<columns; c++){

			//To create a tile through creating div elements
			//initialize a tile to create a div element
			let tile = document.createElement("div");
			
			//Each tile will have an id based on its row position and column position
			//Imagine students in a room who are given an id, but their id number is based on their seat row and column
			//give each tile an id based on its position
			//tile.id = row 1, column 1
			tile.id = r.toString() + "-" + c.toString();

			//Get the number of a tile from backend board
			
			let num = board[r][c];

			//Use the number to update the tile's appearance through UpdateFile() function
			updateTile(tile, num);

			//Add the created tile with id to the frontend game board container.
			document.getElementById("board").append(tile);
		}
	}
	
	setTwo();
	setTwo();
}

//This function is to update the appearance of the tile based on its number
function updateTile(tile, num){
	tile.innerText="";
	tile.classList.value="";

	tile.classList.add("tile");


	if(num > 0) {
        // This will display the number of the tile 
        tile.innerText = num.toString();
           
        if (num <= 4096){
            tile.classList.add("x"+num.toString());
        } else {
            // Then if the num value is greater than 4096, it will use class x8192 to color the tile
            tile.classList.add("x8192");
        }
    }
}

window.onload = function(){
	setGame();
}

document.addEventListener("keydown", handleSlide);

function handleSlide(e){
	console.log(e.code);	//prints the key (.code) being pressed in the webpage

	if(["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(e.code)){

		if(e.code == "ArrowLeft"){
			slideLeft();
			setTwo();
		}else if(e.code == "ArrowRight"){
			slideRight();
			setTwo();
		}else if(e.code == "ArrowUp"){
			slideUp();
			setTwo();
		}else if(e.code == "ArrowDown"){
			slideDown();
			setTwo();
		}
	}

	document.getElementById("score").innerText = score;

	//delay for alert (prevents showing congrats before 2048 even shows)
	setTimeout(() => {
		checkWin();
	}, 250);

	if(haslost()){
		setTimeout(() => {
			alert("Game Over! You have lost the game. The game will restart");
			restartGame();
			alert("Click any arrow to restart");
		}, 100)
		//setTimeout is used to delay the execution of the code inside the arrow function
	}
}

//removes the zeroes from the row / col
function filterZero(row){

	return row.filter(num => num !=0);
}

//slide function is the one merging the adjacent tiles
function slide(row){

	//[0,2,0,2]
	row = filterZero(row);	//[2, 2]

	for(let i =0; i<row.length -1; i++){
		if(row[i] == row[i+1]){	//checks if a tile is equal to its adjacent tile
			row[i] *= 2;	//merge - doubles the first tile to merge
							//[4, 2]
			row[i + 1] = 0;	//[4,0]

			score += row[i];
		}
	}

	row = filterZero(row);

	// Add zeroes on the back after merging
	while(row.length < columns){
		row.push(0);	//[4, 0, 0, 0]
	}

	return row;	//submits the updated row/col
}

function slideLeft(){
    for(let r = 0; r < rows; r++){
        let row = board[r];

        // line for animation
        let originalRow = row.slice();	//documented the original row

        row = slide(row);	//we used the slide function, so that the slide function will merge the adjacent tiles.
        board[r] = row;
        
        //after merging the position and the value of tiles might change, thus it follows that the id, num, color of the tile must be changed
        for(let c = 0; c < columns; c++){
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];

            //line for animation
            //compares the documented to current row
            if(originalRow[c] !== num && num != 0){		

            	//applies animation
            	tile.style.animation = "slide-from-right 0.3s"

            	//removes the animation class after the animation is complete; allows the animation to repeat kasi minsan once lang gumagana raw 
            	setTimeout(() =>{
            		tile.style.animation = "";
            	}, 300);
            }

            updateTile(tile, num);
        }
    }
}

function slideRight(){
	for(let r = 0; r < rows; r++){
        let row = board[r];
        let originalRow = row.slice();

        //[0,2,0,2]
        row.reverse();	///reverse tiles [2,0,2,0]
        row = slide(row);	//[4,0,0,0]
        row.reverse();	//returns to original [0,0,0,4]

        board[r] = row;
        
        for(let c = 0; c < columns; c++){
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];

            if(originalRow[c] !== num && num != 0){		
            	tile.style.animation = "slide-from-left 0.3s"

            	setTimeout(() =>{
            		tile.style.animation = "";
            	}, 300);
            }


            updateTile(tile, num);
        }
    }
}

function slideUp(){
	for(let c = 0; c < columns; c++){
        let col = [board[0][c], board[1][c], board[2][c], board[3][c]];
        
        //line for animation
        let originalCol = col.slice();

        col = slide(col);

        let changedIndices = []; //this will record the current position of the tiles that have changed
        for(let r=0; r<rows; r++){
        	if(originalCol[r] !== col[r]){
        		changedIndices.push(r);
        	}
        }

        for(let r = 0; r < rows; r++){
        	board[r][c] = col[r];
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];

            //line for animation
            if(changedIndices.includes(r) && num !== 0){		
            	tile.style.animation = "slide-from-bottom 0.3s"

            	setTimeout(() =>{
            		tile.style.animation = "";
            	}, 300);
            }

            updateTile(tile, num);
        }
    }
}

function slideDown(){
	for(let c = 0; c < columns; c++){
        let col = [board[0][c], board[1][c], board[2][c], board[3][c]];
        
        //line for animation
        let originalCol = col.slice();

        col.reverse();
        col = slide(col);
        col.reverse();

        let changedIndices = []; //this will record the current position of the tiles that have changed
        for(let r=0; r<rows; r++){
        	if(originalCol[r] !== col[r]){
        		changedIndices.push(r);
        	}
        }

        for(let r = 0; r < rows; r++){
        	board[r][c] = col[r];
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];

            //line for animation
            if(changedIndices.includes(r) && num !== 0){		
            	tile.style.animation = "slide-from-top 0.3s"

            	setTimeout(() =>{
            		tile.style.animation = "";
            	}, 300);
            }

            updateTile(tile, num);
        }
    }
}

//checks the board if there is an empty tile
function hasEmptyTile(){
	for(let r=0; r<rows; r++){
		for(let c=0; c<columns; c++){
			if(board[r][c] == 0){
				return true;
			}
		}
	}

	return false;	//returns no 0 in the board
}

function setTwo(){

	if(hasEmptyTile() == false){
		return;
	}

	//neext codes if for generating the random 2
	let found = false;

	while(found == false){
		//generates a random coordinate and checks if it is empty
		let r = Math.floor(Math.random() * rows);
		let c = Math.floor(Math.random() * columns);

		if(board[r][c] == 0){
			//Generate a new tile
			board[r][c] = 2;
			let tile = document.getElementById(r.toString() + "-" + c.toString());
			tile.innerText = "2";
			tile.classList.add("x2");
			found = true;
		}
	}
}

// checkWin function checks if we already have 2048, 4096, or 8192 in our tiles, and to congratulate us in this accomplishment.
function checkWin(){
	for(let r=0; r<rows; r++){
		for(let c=0; c<columns; c++){
			if(board[r][c] == 2048 && is2048Exist == false){
				alert("You win! You got the 2048");
				is2048Exist = true;
			}else if(board[r][c] == 4096 && is4096Exist == false){
				alert("You already won! Why you aiming for 4096");
				//You are unstoppable at 4096!
				is4096Exist = true;
			}else if(board[r][c] == 8192 && is8192Exist == false){
				alert("Stop it. You now have 8192 in the board");
				//Victory! You have reached 8192! You are incredibly awesome x 8192!
				is8192Exist = true;
			}
		}
	}
}

//will check if there is still an empty tile (meaning, there is still a possible move) and it will also check if there is a same tile value adjacent(beside/side by side)
function haslost(){
	// if(hasEmptyTile() == false){
	// 	alert()
	// }

	for(let r=0; r<rows; r++){
		for(let c=0; c<columns; c++){

			//check if there is a tile that equal to zero (meaning, empty tile)
			if(board[r][c] == 0){
				return false;
			}

			const currentTile = board[r][c];

			//check if there are two adjacent tiles
			if(
				r > 0 && board[r-1][c] === currentTile ||
				r < rows - 1 && board[r+1][c] === currentTile ||

				c > 0 && board[r][c-1] === currentTile ||
				c < columns - 1 && board[r][c+1] === currentTile
			){
				// if we found a adjacent tile with the same value as the current tile, false, the use has not lost
				return false;
			}
		}
	}

	//returns 
	return true;
}

function restartGame(){
	for(let r=0; r<rows; r++){
		for(let c=0; c<columns; c++){
			board[r][c] = 0;
		}
	}

	score = 0;

	setTwo();
}

//This code will listen when we touch a screen and assign the coordinates of that touch/event.
document.addEventListener('touchstart', (e) => {
	startX = e.touches[0].clientX;
	startY = e.touches[0].clientY;
});


document.addEventListener('touchmove', (e) => {
	//do nothing if tile is not touch
	if(!e.target.className.includes("tile")) {
		return
	}

	//to disable scrolling feature.
	e.preventDefault();
}, {passive: false});		//use passive property to make sure that the preventiveDefault() will work.

document.addEventListener('touchend', (e) => {
	if(!e.target.className.includes("tile")) {
		return
	}

	let diffX = startX - e.changedTouches[0].clientX;
	let diffY = startY - e.changedTouches[0].clientY;

	// Check if the horizontal swipe is greater in magnitude than the vertical swipe
    if (Math.abs(diffX) > Math.abs(diffY)) {
        // Horizontal swipe
        if (diffX > 0) {
            slideLeft(); // Call a function for sliding left
            setTwo(); // Call a function named "setTwo"
        } else {
            slideRight(); // Call a function for sliding right
            setTwo(); // Call a function named "setTwo"
        }
    } else {
	    // Vertical swipe
	    if (diffY > 0) {
	        slideUp(); // Call a function for sliding up
	        setTwo(); // Call a function named "setTwo"
	    } else {
	        slideDown(); // Call a function for sliding down
	        setTwo(); // Call a function named "setTwo"
	    }
	}

	document.getElementById("score").innerText = score;

    checkWin();

    // Call hasLost() to check for game over conditions
    if (haslost()) {
        // Use setTimeout to delay the alert
        setTimeout(() => {
        alert("Game Over! You have lost the game. Game will restart");
        restartGame();
        alert("Click any key to restart");
        // You may want to reset the game or perform other actions when the user loses.
        }, 100); // Adjust the delay time
    }
});