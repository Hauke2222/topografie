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

    for (let i = 0; i < counter; i++) {
        timers.push(
            setTimeout(function () {
                document.getElementById('auto-next').textContent = `Next in ${counter}`;
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
}

const selectElement = document.getElementById('svgSelect');
selectElement.addEventListener('change', function () {
    const selectedOption = selectElement.value;
    const map = document.getElementById('map');
    map.remove();

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
            svgElement.setAttribute('id', 'map');
            document.getElementById('container').append(svgElement);

            zoom(svgElement);

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

function zoom(svg) {
    const zoom = (direction) => {
        const { scale, x, y } = getTransformParameters(svg);
        let dScale = 0.1;
        if (direction == "out") dScale *= -1;
        if (scale == 0.1 && direction == "out") dScale = 0;
        svg.style.transform = getTransformString(scale + dScale, x, y);
    };

    const getTransformParameters = (element) => {
        const transform = element.style.transform;
        let scale = 1,
            x = 0,
            y = 0;
        if (transform.includes("scale"))
            scale = parseFloat(transform.slice(transform.indexOf("scale") + 6));
        if (transform.includes("translateX"))
            x = parseInt(transform.slice(transform.indexOf("translateX") + 11));
        if (transform.includes("translateY"))
            y = parseInt(transform.slice(transform.indexOf("translateY") + 11));
        return { scale, x, y };
    };

    const getTransformString = (scale, x, y) =>
        "scale(" + scale + ") " + "translateX(" + x + "%) translateY(" + y + "%)";


    const pan = (direction) => {
        const { scale, x, y } = getTransformParameters(svg);
        let dx = 0,
            dy = 0;
        switch (direction) {
            case "left":
                dx = -3;
                break;
            case "right":
                dx = 3;
                break;
            case "up":
                dy = -3;
                break;
            case "down":
                dy = 3;
                break;
        }
        svg.style.transform = getTransformString(scale, x + dx, y + dy);
    };

    document.getElementById("left-button").onclick = () => pan("left");
    document.getElementById("right-button").onclick = () => pan("right");
    document.getElementById("up-button").onclick = () => pan("up");
    document.getElementById("down-button").onclick = () => pan("down");
    document.getElementById("zoom-in-button").onclick = () => zoom("in");
    document.getElementById("zoom-out-button").onclick = () => zoom("out");
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