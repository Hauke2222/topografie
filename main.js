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

            let svg = svgElement;
            let reset = document.querySelector("#reset");

            let point = svg.createSVGPoint();
            let viewBox = svg.viewBox.baseVal;

            let cachedViewBox = {
                x: viewBox.x,
                y: viewBox.y,
                width: viewBox.width,
                height: viewBox.height
            };

            reset.addEventListener("click", resetView);
            window.addEventListener("wheel", onWheel);

            function onWheel(event) {

                event.preventDefault();

                let normalized;
                let delta = event.wheelDelta;

                if (delta) {
                    normalized = (delta % 120) == 0 ? delta / 120 : delta / 12;
                } else {
                    delta = event.deltaY || event.detail || 0;
                    normalized = -(delta % 3 ? delta * 10 : delta / 3);
                }

                let scaleFactor = 1.2;
                let scaleDelta = normalized > 0 ? 1 / scaleFactor : scaleFactor;

                point.x = event.clientX;
                point.y = event.clientY;

                let startPoint = point.matrixTransform(svg.getScreenCTM().inverse());

                let fromVars = {
                    x: viewBox.x,
                    y: viewBox.y,
                    width: viewBox.width,
                    height: viewBox.height,
                    ease: Power2.easeOut
                };

                viewBox.x -= (startPoint.x - viewBox.x) * (scaleDelta - 1);
                viewBox.y -= (startPoint.y - viewBox.y) * (scaleDelta - 1);
                viewBox.width *= scaleDelta;
                viewBox.height *= scaleDelta;

                gsap.from(viewBox, {
                    duration: 0.5,
                    ...fromVars
                });
            }

            function resetView() {

                gsap.to(viewBox, {
                    duration: 0.4,
                    x: cachedViewBox.x,
                    y: cachedViewBox.y,
                    width: cachedViewBox.width,
                    height: cachedViewBox.height,
                });
            }


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