const input = document.getElementById('search')
const searchBtn = document.querySelector('.search-svg')
const searchedWord = document.querySelector('.word')
const playBtn = document.querySelector('.play-btn')
const transcription = document.querySelectorAll('.transcription')
const partOfSpeech = document.querySelectorAll('.part-of-speech')
const defBox = document.querySelectorAll('.def')
const defText = document.querySelectorAll('.main-text')
const example = document.querySelectorAll('.example')
const synonyms = document.querySelectorAll('.syn');
const homePage = document.querySelector('.home')
const container = document.querySelector('.container')
const sound = document.getElementById("myAudio")
const wrongWordText = document.querySelector(".wrong-word-paragraph")
const wrongWord = document.querySelector(".wrong-word")
const backBtn = document.getElementById("back-btn")


const overlay = document.querySelector('.overlay')

function clickSearchBtn() {
    if (!input.value) return;
    overlay.style.display = 'block';
    searchedWord.innerHTML = input.value;
    callData();

    // logic to save last 5 words
    if (lastWords.length < 6) {
        lastWords.push(input.value)
    } else {
        lastWords.shift();
    }
    console.log(lastWords)
    input.value = '';
};

searchBtn.addEventListener('click', clickSearchBtn);

playBtn.addEventListener('click', playAudio);

backBtn.addEventListener('click', ()=> {
    wrongWord.style.display = 'none';
    overlay.style.display = 'none';
    searchedWord.innerHTML = 'Word';
})


document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') clickSearchBtn();
})

function callData() {
    fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${input.value.toLowerCase()}`)
    .then(response => response.json())
    .then(data => {
        if (data.message) {
            wrongWord.style.display = 'block';
            wrongWordText.textContent = data.message;
        } else {
            overlay.style.display = 'none';
            homePage.style.display = 'none';
            container.style.display = 'block';
            getDefinitions(data)
        }
    
    })
    .catch(error => {
        console.log(error)
    })
}

let src;

//play audio
function playAudio() {
    sound.src = src;
    sound.play(); 
}

let lastWords = [];

function getDefinitions(data) {
    let meanings = data[0].meanings;
    let dataSynonym = meanings[0].synonyms;

    src = data[0].phonetics[0].audio;

    //Add synonyms
    for (let j = 0; j < 5; j++) {
        if (dataSynonym.length < j + 1) {
            synonyms[j].style.display = 'none'
        } else {
            synonyms[j].style.display = 'block'
        }
        synonyms[j].textContent = dataSynonym[j];
    }

    for (let i = 0; i<3; i++) {
        //remove definition if it isn't contained in the API
        if (meanings.length < i + 1) {
            defBox[i].style.display = 'none';
            continue;
        }else {
            defBox[i].style.display = 'block';
        }
        
        partOfSpeech[i].innerHTML = data[0].meanings[i].partOfSpeech;
        defText[i].innerText = meanings[i].definitions[0].definition;
        
        if (!meanings[i].definitions[0].example) {
            example[i].innerText = "There's no example for this word 🥲"
        } else {
            example[i].innerText = meanings[i].definitions[0].example;
        }
        
        transcription[i].textContent = data[0].phonetics[1].text;
        console.log(data[0].phonetic)
    }

}
