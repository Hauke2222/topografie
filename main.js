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
const containerElement = document.getElementById('zoom');

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
            svgElement.setAttribute('id', 'main-img');
            document.getElementById('zoom').appendChild(svgElement);

            const divElement = document.createElement('div');
            divElement.setAttribute('id', 'large-img');
            svgElement.parentNode.appendChild(divElement);


            document.getElementById("zoom").addEventListener(
                "mousemove",
                function (e) {
                    let original = document.getElementById("main-img"),
                        magnified = document.getElementById("large-img"),
                        style = magnified.style,
                        x = e.pageX - this.offsetLeft,
                        y = e.pageY - this.offsetTop,
                        imgWidth = original.width,
                        imgHeight = original.height,
                        xperc = (x / imgWidth) * 100,
                        yperc = (y / imgHeight) * 100;


                    // Add some margin for right edge
                    if (x > 0.01 * imgWidth) {
                        xperc += 0.15 * xperc;
                    }

                    // Add some margin for bottom edge
                    if (y >= 0.01 * imgHeight) {
                        yperc += 0.15 * yperc;
                    }

                    // Set the background of the magnified image horizontal
                    style.backgroundPositionX = xperc - 9 + "%";
                    // Set the background of the magnified image vertical
                    style.backgroundPositionY = yperc - 9 + "%";

                    // Move the magnifying glass with the mouse movement.
                    style.left = x - 50 + "px";
                    style.top = y - 50 + "px";
                },
                false
            );


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