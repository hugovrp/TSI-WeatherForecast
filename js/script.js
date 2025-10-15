let search_inp = document.getElementById('search-input');
let search_btn = document.getElementById('search-btn');
let weather_area = document.getElementById('weather-area');
let main_area = document.getElementById('main');
let history_section = document.getElementById('history-section');
let history_cards = document.getElementById('history-cards');

localStorage.removeItem('weather_search_history');
let search_history = JSON.parse(localStorage.getItem('weather_search_history')) || [];

if (search_history.length > 0) {
    history_section.style.display = 'block';
    renderHistory();
}

search_inp.addEventListener('keydown', (event) => {
    if(event.key === 'Enter') {
        search_btn.click();
    }
});

search_btn.addEventListener('click', () => {
    let city = search_inp.value;
    if(!city) {
        alert('O campo está vazio.')
    }

    main_area.style.display = 'block';
    main_area.classList.add('animate__animated', 'animate__fadeInUp');
    weather_area.innerHTML = '<p class="loading">Buscando...</p>';

    check_weather(city).then(result => {
        if(typeof result === 'string' && result.startsWith("Erro")) {
            weather_area.innerHTML = `<p style="color:red;">${result}</p>`;
        }
        else {
            addToHistory(city);
            show_weather_info(result);
            search_inp.value = "";
        }

        setTimeout(() => {
            main_area.classList.remove('animate__animated', 'animate__fadeInUp');
        }, 1000);
    });
});

function addToHistory(city) {
    search_history = search_history.filter(item => item.toLowerCase() !== city.toLowerCase());
    
    search_history.unshift(city);
    
    if (search_history.length > 8) {
        search_history = search_history.slice(0, 8);
    }
    
    localStorage.setItem('weather_search_history', JSON.stringify(search_history));
    
    history_section.style.display = 'block';
    renderHistory();
}

function renderHistory() {
    history_cards.innerHTML = '';
    
    search_history.forEach(city => {
        const col = document.createElement('div');
        col.className = 'col-12 col-sm-6 col-md-4 col-lg-3';
        
        col.innerHTML = `
            <div class="history-card card h-100" data-city="${city}">
                <div class="card-body d-flex align-items-center justify-content-center">
                    <i class="bi bi-geo-alt me-2"></i>
                    <span class="city-name">${city}</span>
                </div>
            </div>
        `;
        
        history_cards.appendChild(col);
    });
    
    document.querySelectorAll('.history-card').forEach(card => {
        card.addEventListener('click', function() {
            const city = this.getAttribute('data-city');
            search_inp.value = city;
            search_btn.click();
        });
    });
}

function check_weather(city) {
    const api_key = '';
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${api_key}`;

    return fetch(url) 
        .then(response => {
            if (!response.ok) {
                throw new Error(`Erro HTTP: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            return data;
        })
        .catch(erro => {
            return 'Erro ao buscar clima da cidade ' + city + ': ' + erro.message;        });
}

function show_weather_info(result) {
    const today = new Date();
    const days_of_week = ["Domingo", "Segunda-Feira", "Terça-Feira", "Quarta-Feira", "Quinta-Feira", "Sexta-Feira", "Sábado"];
    const months = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

    let temp = kelvin_to_celsius(result.main.temp);
    let max_temp = kelvin_to_celsius(result.main.temp_max);
    let min_temp = kelvin_to_celsius(result.main.temp_min);

    const wind_speed = (result.wind.speed * 3.6).toFixed(1);

    let sunrise = convert_timestamp(result.sys.sunrise);
    let sunset = convert_timestamp(result.sys.sunset);

    weather_area.innerHTML = `
        <div>
            <div class="weather-info">
                <div class="left-content">
                    <div>
                        <span class="bi bi-geo-alt local-icon"></span>
                        <span class="day-info">${days_of_week[today.getDay()]}, ${today.getDate()} de ${months[today.getMonth()]} de ${today.getFullYear()}</span>
                    </div>
                    <h1 class="title">${result.name}</h1>
                    <h1 class="weather-temp">${temp} °C</h1>
                    <p class="weather-min-max">Max: ${max_temp} °C, Min: ${min_temp} °C</p>
                </div>
                <div class="right-content">
                    <img src="https://openweathermap.org/img/wn/${result.weather[0].icon}@2x.png" width="160" height="160" class="weather-icon" alt="${result.weather[0].description}">
                    <p class="weather-description">${result.weather[0].description}</p>
                </div>
            </div>

            <article class="add-info">
                <div>
                    <i class="bi bi-moisture icons"></i>
                    <p>${result.main.humidity} %</p>
                </div>

                <div>
                    <i class="bi bi-wind icons"></i>
                    <p>${wind_speed} km/h</p> 
                </div>

                <div>
                    <i class="bi bi-sunrise-fill icons"></i>
                    <p>${sunrise}</p>
                </div>

                <div>
                    <i class="bi bi-sunset-fill icons"></i>
                    <p>${sunset}</p>
                </div>
            </article>
        </div>
    `;
}

function convert_timestamp(timestamp) {
    const date = new Date(timestamp * 1000);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
}

function kelvin_to_celsius(kelvin) {
    let temp = (kelvin - 273.15).toFixed(1)

    if (temp <= 15) {
        body.style.background = "linear-gradient(135deg, #6fb1fc, #4364f7, #8058e8)";
    } else if (temp >= 26) {
        body.style.background = "linear-gradient(135deg, #ff9a44, #ff5f6d, #e53935)";
    } else {
        body.style.background = "linear-gradient(135deg, rgba(135, 206, 250, 0.8), rgba(70, 130, 180, 0.5))";
    }
    return temp;
}