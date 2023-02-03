let province;
let timers = [];
let right = 0;
let wrong = 0;
let answeredCorrect = false;

let provinces = [
    {id: 'NL-DR', name: 'Drenthe'},
    {id: 'NL-FL', name: 'Flevoland'},
    {id: 'NL-FR', name: 'Friesland'},
    {id: 'NL-GE', name: 'Gelderland'},
    {id: 'NL-GR', name: 'Groningen'},
    {id: 'NL-LI', name: 'Limburg'},
    {id: 'NL-NB', name: 'Noord-Brabant'},
    {id: 'NL-NH', name: 'Noord-Holland'},
    {id: 'NL-OV', name: 'Overijssel'},
    {id: 'NL-UT', name: 'Utrecht'},
    {id: 'NL-ZE', name: 'Zeeland'},
    {id: 'NL-ZH', name: 'Zuid-Holland'},
];

function randomProvince() {
    province = provinces[Math.floor(Math.random() * provinces.length)];
    let questionEl = document.getElementById('question');
    questionEl.innerHTML = 'Klik op de provincie ' + province.name;
}

function clearElementClasses() {
    Array.from(document.querySelectorAll('.correct, .incorrect')).forEach(el => {
        el.classList.remove('correct');
        el.classList.remove('incorrect');
    });
}

function autoNext() {
    let counter = 3;
    let interval = 1000;
    document.getElementById('next').style.visibility = 'visible';

    for (let i = 0; i < counter; i++) {
        timers.push(
            setTimeout(function () {
                document.getElementById('auto-next').innerText = `Automatisch volgende over ${counter}`;
                counter--;
            }, i * interval),
        );
    }

    timers.push(
        setTimeout(function () {
            newQuestion();
        }, 3000),
    );
}

function endTimers() {
    timers.forEach(myTimer => {
        clearTimeout(myTimer);
    });

    document.getElementById('auto-next').innerText = ``;
    document.getElementById('next').style.visibility = 'hidden';
}

const paths = document.querySelectorAll('path');
paths.forEach(path => {
    path.addEventListener('click', e => {
        if (answeredCorrect === true) {
            return;
        }

        const id = e.target.getAttribute('id');
        const clickedProvince = provinces.find(province => province.id === id);

        if (clickedProvince === province) {
            answeredCorrect = true;
            let path = document.getElementById(id);
            path.classList.add('correct');
            right += 1;
            document.getElementById('right').textContent = `Goed: ${right}`;
            autoNext();
        } else {
            let path = document.getElementById(id);
            path.classList.add('incorrect');
            wrong += 1;
            document.getElementById('wrong').textContent = `Fout: ${wrong}`;
        }
    });
});

document.getElementById('next').addEventListener('click', newQuestion);

function newQuestion() {
    answeredCorrect = false;
    endTimers();
    clearElementClasses();
    randomProvince();
}

newQuestion();
