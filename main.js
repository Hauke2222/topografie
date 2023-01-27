let province;
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

const paths = document.querySelectorAll('path');
paths.forEach(path => {
    path.addEventListener('click', e => {
        const id = e.target.getAttribute('id');
        const clickedProvince = provinces.find(province => province.id === id);

        if (clickedProvince === province) {
            let path = document.getElementById(id);
            path.classList.add('correct');
        } else {
            let path = document.getElementById(id);
            path.classList.add('incorrect');
        }
    });
});

randomProvince();
