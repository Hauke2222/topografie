import * as continents from './continents.js';

let country;
let previousCountry;
let timers = [];
let answeredCorrect = false;
let continent;

function randomCountry() {
    do {
        country = continent[Math.floor(Math.random() * continent.length)];
    } while (country === previousCountry);

    let questionEl = document.getElementById('question');
    questionEl.innerHTML = 'Click on ' + country.name;
}

function clearElementClasses() {
    Array.from(document.querySelectorAll('.correct, .incorrect')).forEach(el => {
        el.classList.remove('correct');
        el.classList.remove('incorrect');
    });
}

function autoNext() {
    let counter = 2;
    let interval = 1000;
    document.getElementById('next').style.visibility = 'visible';

    for (let i = 0; i < counter; i++) {
        timers.push(
            setTimeout(function () {
                document.getElementById('auto-next').textContent = `Automatisch volgende over ${counter}`;
                counter--;
            }, i * interval),
        );
    }

    timers.push(
        setTimeout(function () {
            newQuestion();
        }, 2000),
    );
}

function endTimers() {
    timers.forEach(myTimer => {
        clearTimeout(myTimer);
    });

    document.getElementById('auto-next').textContent = ``;
    document.getElementById('next').style.visibility = 'hidden';
}

const selectElement = document.getElementById('svgSelect');
const containerElement = document.getElementById('svgContainer');

selectElement.addEventListener('change', function () {
    const selectedOption = selectElement.value;
    containerElement.innerHTML = '';
    loadMap(selectedOption);
    newQuestion();
});

function loadMap(map) {
    continent = map.slice(0, -4);
    continent = continents[continent];
    fetch(`maps/${map}`)
        .then(response => response.text())
        .then(svgData => {
            const svgElement = new DOMParser().parseFromString(svgData, 'image/svg+xml').documentElement;
            document.getElementById('svgContainer').appendChild(svgElement);

            const paths = document.querySelectorAll('path');
            paths.forEach(path => {
                path.addEventListener('click', e => {
                    if (answeredCorrect === true) {
                        return;
                    }

                    const id = e.target.getAttribute('id');
                    const clickedCountry = continent.find(country => country.id === id);

                    if (clickedCountry === country) {
                        answeredCorrect = true;
                        let path = document.getElementById(id);
                        path.classList.add('correct');
                        autoNext();
                    } else {
                        let path = document.getElementById(id);
                        path.classList.add('incorrect');
                    }
                });
            });

        })
        .catch(error => {
            console.error('Error loading SVG:', error);
        });
}

loadMap('africa.svg');
newQuestion();

document.getElementById('next').addEventListener('click', newQuestion);

function newQuestion() {
    endTimers();
    clearElementClasses();
    timers = [];
    answeredCorrect = false;
    randomCountry();
    previousCountry = country;
}