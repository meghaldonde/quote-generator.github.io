const quoteContainer = document.getElementById('quote-container');
const quoteText = document.getElementById('quote');
const authorText = document.getElementById('author');
const twitterBtn = document.getElementById('twitter');
const newQuoteBtn = document.getElementById('new-quote');
const simpsonsQuoteBtn = document.getElementById('simpson-quote');
const imgSimpsonCharacter = document.getElementById('simpson-character');

//custom server to avoid  CORS issue
const proxyUrl = 'https://dry-cove-58467.herokuapp.com/';
const apiUrl =
    'http://api.forismatic.com/api/1.0/?method=getQuote&lang=en&format=json';
const simpsonsQuoteUrl = 'https://thesimpsonsquoteapi.glitch.me/quotes';


const loader = document.getElementById('loader');
var errorTimeOut = 0;

function showLoadingSpinner() {
    loader.hidden = false;
    quoteContainer.hidden = true;
}

function removeLoadingSpinner() {
    if (!loader.hidden) {
        quoteContainer.hidden = false;
        loader.hidden = true;
    } else {

    }
}

function showCharacterImage(imageUrl) {
    if (imageUrl) {
        imgSimpsonCharacter.hidden = false;
        imgSimpsonCharacter.src = imageUrl;
    } else {
        imgSimpsonCharacter.hidden = true;
    }
}

function hideCharacterImage() {
    imgSimpsonCharacter.hidden = true;
}
async function getQuote(quoteType) {

    showLoadingSpinner();
    hideCharacterImage();

    try {

        console.log(quoteType);
        let url = proxyUrl + apiUrl;
        if (quoteType === 'simpsons quote') {
            url = simpsonsQuoteUrl;


        }

        const response = await fetch(url);
        const data = await response.json();

        //check if simpsons quote requested
        if (quoteType === 'simpsons quote') {
            authorText.innerText = data[0].character;
            quoteText.innerText = data[0].quote;
            showCharacterImage(data[0].image);

        } else { //default quote API
            //If response has no author , reset to 'unknown'
            if (data.quoteAuthor === '') {
                data.quoteAuthor = 'Unknown';
            } else {
                authorText.innerText = data.quoteAuthor;

            }

            //Dynamically Reduce quote font size for long quote
            if (data.quoteText.length > 120) {
                quoteText.classList.add('long-quote');
            } else {
                quoteText.classList.remove('long-quote');
            }

            quoteText.innerText = data.quoteText;
        }


        removeLoadingSpinner();


    } catch (error) {
        //counter to avoid infinite recursive function call threshhold set to 30
        const errorThreshhold = 50;
        if (errorTimeOut <= errorThreshhold) {
            getQuote();

        } else {
            quoteText.innerText = "Oops...Sorry. There was an error. Please try again later."
        }
        errorTimeOut += 1;

        console.log(" Error fetching quote: " + error);
    }
}


function tweetQuote() {
    const quote = quoteText.innerText;
    const author = authorText.innerText;
    const twitterUrl = `https://twitter.com/intent/tweet?text=${quote} - ${author}`;
    window.open(twitterUrl, '_blank');

}

//Add Event Listeners to New Quote and Tweet buttons
newQuoteBtn.addEventListener('click', () => {
    getQuote('new quote')
});
simpsonsQuoteBtn.addEventListener('click', () => {
    getQuote('simpsons quote')
});
twitterBtn.addEventListener('click', tweetQuote);

//call onLoad
getQuote('new quote');