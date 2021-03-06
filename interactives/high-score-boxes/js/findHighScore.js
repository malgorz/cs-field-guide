//onload make array of 5 random ints
this.randomInts = [];
this.largest = 0;
this.numberOfBoxes = 15
this.boxes = []
this.gameStarted = false;
this.secondsTaken = 0;
this.timerVar;

//this.arrayForMargins = ["top", "bottom", "right", "left"]

$(document).ready(function(){
	generateRandomNumbers();
	createBoxObjects();
	createBoxElements();

	$("#restartButton").click(function() {
		$("#box_holder_div").empty();
		secondsTaken = 0;
		gameStarted = false;

		if (typeof timerVar !== 'undefined') {
			clearTimeout(timerVar);
		}	
		
		generateRandomNumbers();
		createBoxObjects();
		createBoxElements();
		$("#restartButton").hide();
		$("#completionMessage").html("");
		$("#answerTextForm").val('');

	})
})

$(document).on('click','.box', function() {
	$(".box").stop(true, true);
	$(".box").show();
	for (var i = 0; i < (boxes.length); i++) { 
		if (document.getElementById('box' + i) ==  event.target) {
			$(this).fadeOut(1000);
			$(this).fadeIn(1000);
			boxes[i].revealed_times += 1;
		}
	}
	//to start timer only if it hasn't started yet
	if (!gameStarted) {
		for (var i = boxes.length - 1; i >= 0; i--) {
			if (boxes[i].revealed_times == 1) {
				gameStarted = true;
				timerVar = setInterval(myTimer, 1000); //executes myTimer every second

			}
		}
	}

})

function myTimer() {
	secondsTaken += 1;
}

function generateRandomNumbers() {
		for (var i = 0; i < (numberOfBoxes); i++) {
		var currentInt = getRandomInt(300, 800);
		randomInts[i] = currentInt;
	}
	largest = Math.max.apply(Math, randomInts);
}

function createBoxElements() {
	for (var i = 0; i < (numberOfBoxes); i++) {
		var boxObject; //JS object that will hold the id, int and both elements
		var currentBox = boxes[i]

		//"container" div
		var iContainer = document.createElement('div');
		iContainer.id = ('boxContainer' + i);
		iContainer.className = 'boxContainer';
		document.getElementById('box_holder_div').appendChild(iContainer);

		//clearing a random direction's margin for the messy look
		randomIntForMargin = getRandomInt(0, 2)

		if (randomIntForMargin == 0) {
			document.getElementById('boxContainer' + i).style.marginTop = "0px"
		} else if (randomIntForMargin == 1) {
			document.getElementById('boxContainer' + i).style.marginBottom = "0px"
		} else if (randomIntForMargin == 2) {
			document.getElementById('boxContainer' + i).style.marginLeft = "0px"
		} else if (randomIntForMargin == 3) {
			document.getElementById('boxContainer' + i).style.marginRight = "0px"
		}
		

		//"box (covering the div holding number"
		var boxDiv = document.createElement('div');
		boxDiv.id = ('box' + i);
		boxDiv.className = 'box';
		boxDiv.setAttribute("width", "100");


		//set background image of div to the funky box
		boxDiv.style.backgroundImage = 'url(./img/square' + getRandomInt(1, 9) + '.png)';

		currentBox.divElement = boxDiv;
		iContainer.appendChild(boxDiv);

		//divs that hold the numbers
		var intHoldingDiv = document.createElement('div');
		intHoldingDiv.id = ('intHoldingDiv' + i);
		intHoldingDiv.className = 'intHoldingDiv';
		intHoldingDiv.innerHTML = currentBox.boxInt;
		currentBox.intHoldingDivElement = intHoldingDiv;
		iContainer.appendChild(intHoldingDiv);
	}
}	

//creates the JS objects with just the id and the random int, leaving space for the HTML elements
function createBoxObjects() {
	for (var i = 0; i < numberOfBoxes; i++) {
		var boxObject = {
			boxNumber: i,
			divElement: null,
			boxInt: randomInts[i],
			intHoldingDivElement: null,
			revealed_times: 0
		}
		boxes[i] = boxObject;
	}
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

//form validation
function validateForm() {
    var x = document.forms["myForm"]["submittedInt"].value;
	var box_revealed_more_than_once = false;
	var box_revealed_no_times = false;


    //if form value is a number
	if (!(isNaN(x))) 
	{
		if (parseInt(x) == largest) { // correct answer
			for (var i = 0; i < (boxes.length); i++) {
				if (boxes[i].revealed_times > 1) {
					box_revealed_more_than_once = true;
				} else if (boxes[i].revealed_times == 0) {
					box_revealed_no_times = true;
				}
			}

			//after checking how many times each box has been revealed...
			if (box_revealed_no_times) {
				$("#completionMessage").html(("Correct! But you missed a box... Got lucky this time!"));
				$("#restartButton").show();
			} else if (box_revealed_more_than_once) {
				$("#completionMessage").html(("Correct! But you could've been more efficient..."));
				$("#restartButton").show();
			} else {
				$("#completionMessage").html(("Correct! You've found how to complete this challenge the most efficient way!\nYour time was "
					+ secondsTaken + " seconds."));
				$("#restartButton").show();
			}

			return false; //will use alerts for now to sort out logic	 
		} else {
			$("#completionMessage").html("Incorrect!");
			$("#restartButton").show();
			return false;
		}
	}
	//must not be a number if we're here
	$("#completionMessage").html(("Must input numbers"));
	return false;
}

