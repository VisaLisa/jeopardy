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
    const catData = {
        title: cat[0].category.title,
        clues: [],
    };

    clues.map((arr)=>{
        let cluesArr = {
			question: arr.question,
			answer: arr.answer,
			showing: null
		};
		catData.clues.push(cluesArr);
    });
    console.log(catData);
   
}

/** Fill the HTML table#jeopardy with the categories & cells for questions.
 *
 * - The <thead> should be filled w/a <tr>, and a <td> for each category
 * - The <tbody> should be filled w/NUM_QUESTIONS_PER_CAT <tr>s,
 *   each with a question for each category in a <td>
 *   (initally, just show a "?" where the question/answer would go.)
 */

function fillTable() {
    const $thead = $('<thead></thead>');
    const $theadRow = $('<tr></tr>');
    const $tbody = $('<tbody></tbody>');
}

/** Handle clicking on a clue: show the question or answer.
 *
 * Uses .showing property on clue to determine what to show:
 * - if currently null, show question & set .showing to "question"
 * - if currently "question", show answer & set .showing to "answer"
 * - if currently "answer", ignore click
 * */

function handleClick(evt) {
}

/** Wipe the current Jeopardy board, show the loading spinner,
 * and update the button used to fetch data.
 */

function showLoadingView() {

}

/** Remove the loading spinner and update the button used to fetch data. */

function hideLoadingView() {
}

/** Start game:
 *
 * - get random category Ids
 * - get data for each category
 * - create HTML table
 * */

async function setupAndStart() {
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
   


}

/** On click of start / restart button, set up game. */

// TODO

/** On page load, add event handler for clicking clues */

// TODO