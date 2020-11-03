// categories is the main data structure for the app; it looks like this:

//  [
//    { title: "Math",
//      clues: [
//        {question: "2+2", answer: 4, showing: null},
//        {question: "1+1", answer: 2, showing: null}
//        ...
//      ],
//    },
//    { title: "Literature",
//      clues: [
//        {question: "Hamlet Author", answer: "Shakespeare", showing: null},
//        {question: "Bell Jar Author", answer: "Plath", showing: null},
//        ...
//      ],
//    },
//    ...
//  ]

let categories = [];
const NUM_CATEGORIES = 6;
const NUM_QUESTIONS_PER_CAT = 5;
const game = $("#game");



/** Get NUM_CATEGORIES random category from API.
 *
 * Returns array of category ids
 */

function getCategoryIds(catIds) {
    //limt to 6 category
    let randomIds = _.sampleSize(catIds.data, NUM_CATEGORIES);
    let categoryIds = [];

    // array of category ids
    for (cat of randomIds) {
		categoryIds.push(cat.id);
	}
	return categoryIds;
}

/** Return object with data about a category:
 *
 *  Returns { title: "Math", clues: clue-array }
 *
 * Where clue-array is:
 *   [
 *      {question: "Hamlet Author", answer: "Shakespeare", showing: null},
 *      {question: "Bell Jar Author", answer: "Plath", showing: null},
 *      ...
 *   ]
 */



function getCategory(catId) {
    const cat = catId.data;
    //show only 5 clues
    const clues = _.sampleSize(catId.data, NUM_QUESTIONS_PER_CAT);

    //Return object with data about a category:
    const catData = {
        title: cat[0].category.title,
        clues: [],
    };

    //Clue array
    clues.map((arr)=>{
        let cluesArr = {
			question: arr.question,
			answer: arr.answer,
			showing: null
		};
		catData.clues.push(cluesArr);
    });
    categories.push(catData);
    //console.log(categories);
    
}

/** Fill the HTML table#jeopardy with the categories & cells for questions.
 *
 * - The <thead> should be filled w/a <tr>, and a <td> for each category
 * - The <tbody> should be filled w/NUM_QUESTIONS_PER_CAT <tr>s,
 *   each with a question for each category in a <td>
 *   (initally, just show a "?" where the question/answer would go.)
 */

function fillTable(categories) {
    let titles = categories.map((title) => {
		return title.title;
    });
    
    //create title/headers
    $("thead").add("tr");
	for (let i = 0; i < NUM_CATEGORIES; i++) {
		const catHeader = document.createElement("th");
		catHeader.innerText = titles[i];
		$("thead").append(catHeader);
    }
    //create clues
    for (let y = 0; y < NUM_QUESTIONS_PER_CAT; y++) {
		const row = document.createElement("tr");
		for (let x = 0; x < NUM_CATEGORIES; x++) {
			const box = document.createElement("td");
			box.innerHTML = `<div id=${x}-${y}>?</div>`;
			row.append(box);
		}
        game.append(row);
        game.on("click", "td", handleClick);
	}
}

/** Handle clicking on a clue: show the question or answer.
 *
 * Uses .showing property on clue to determine what to show:
 * - if currently null, show question & set .showing to "question"
 * - if currently "question", show answer & set .showing to "answer"
 * - if currently "answer", ignore click
 * */

function handleClick(evt) {
//   x will show* - if currently null, show question & set .showing to "question"
//  y will show* - if currently "question", show answer & set .showing to "answer"
//  z will show* - if currently "answer", ignore click
const $clickedClue = evt.target;
const x = $clickedClue.id[0];
const y = $clickedClue.id[2];

 // if question is clicked, switch to answer
if ($clickedClue.classList.contains("question")){
    $clickedClue.innerText = categories[x].clues[y].answer;
    $clickedClue.classList.remove("question");
    $clickedClue.classList.add("answer");
} else  // if null is clicked, switch to question
{
    $clickedClue.innerText = categories[x].clues[y].question;
    $clickedClue.classList.add("question");
}

// display answer - does not click through
if ($clickedClue.classList.contains("answer")){
    return;
}
     
}

/** Wipe the current Jeopardy board, show the loading spinner,
 * and update the button used to fetch data.
 */

function showLoadingView() {
//remove table and reset categories
    $('body').append('<div style="" id="loadingDiv"><div class="loader">Loading...</div></div>');
    $(window).on('load', function(){
    setTimeout(hideLoadingView, 2000); //wait for page load PLUS two seconds.
    });
}

/** Remove the loading spinner and update the button used to fetch data. */

function hideLoadingView() {
    $('#loadingDiv').remove();
}

/** Start game:
 *
 * - get random category Ids
 * - get data for each category
 * - create HTML table
 * */

async function setupAndStart() {
    
    showLoadingView();
    //get 100 categories from API
    const response = await axios.get('http://jservice.io/api/categories',{
        params: {
			count: 100
		}
    });
    
    //get the catids
    let catIds = getCategoryIds(response);

    //checkpoint: see which catId pulled - console.log(catIds);

    //pull array from id
    for (let id of catIds){
        const clueCard = await axios.get("http://jservice.io/api/clues", {
			params: {
                category: id
			}
        });

         //checkpoint: see which clues pulled - console.log(clueCard);
        //Use catId to get data from clueCard 
        getCategory(clueCard);
    }
    fillTable(categories);
    hideLoadingView();

}

/** On click of start / restart button, set up game. */

$('#restart').on('click', function(){
    location.reload();
    setupAndStart();    
    event.preventDefault();
});

/** On page load, add event handler for clicking clues */
$(document).ready(function() {
	setupAndStart();
});
