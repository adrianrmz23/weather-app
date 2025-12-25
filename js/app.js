const ciudad = document.getElementById("ciudad");
const btnConsultar = document.getElementById("consultar-clima");
const API_KEY = "9c08c0d5241ae234e789b73fcbd4e36b";
const nombreCiudad = document.getElementById("ciudadNombre");
const fecha = document.getElementById("fecha");
const temperatura = document.getElementById("temperatura");
const clima = document.getElementById("clima");
const tempMayor = document.getElementById("tempMayor");
const tempMenor = document.getElementById("tempMenor");
const wind = document.getElementById("wind");
const humidity = document.getElementById("humidity");
const visibility = document.getElementById("visibility");
const icono = document.getElementById("contenedorIcono");
const btnUbicacion = document.getElementById("btnUbicacion");
const pronostico = document.getElementById("pronostico-dias");

btnConsultar.addEventListener("click", function (e) {
    e.preventDefault();

    if (!ciudad.value) {
        console.log("El campo es obligatorio");
    } else {
        btnConsultar.innerHTML = "Consultando clima...⏳";
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${ciudad.value}&appid=${API_KEY}&units=metric`;
        fetch(url)
            .then(response => {
                return response.json();
            })
            .then(data => {
                mostrarDatosClima(data);
                obtenerPronostico(data.name);
            })
            .catch(error => {
                console.log("Hubo un error: ", error);
            })
            .finally(() => {
                btnConsultar.innerHTML = "Consultar";
            });
    }

});

btnUbicacion.addEventListener("click", function (e) {
    e.preventDefault();
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(posicion => {
            const latitud = posicion.coords.latitude;
            const longitud = posicion.coords.longitude;

            btnUbicacion.innerHTML = "Consultando clima...⏳";
            const urlCoords = `https://api.openweathermap.org/data/2.5/weather?lat=${latitud}&lon=${longitud}&appid=${API_KEY}&units=metric`;

            fetch(urlCoords)
                .then(response => {
                    return response.json();
                })
                .then(data => {
                    mostrarDatosClima(data);
                    obtenerPronostico(data.name);
                })
                .catch(error => {
                    console.log("Hubo un error: ", error);
                })
                .finally(() => {
                    btnUbicacion.innerHTML = "📍 Mi ubicación";
                });

        });
    } else {
        console.log("El navegador no soporta la geolocalización");
    }
});

function mostrarDatosClima(data) {
    console.log(data);

    if (data.cod == "404") {
        alert("Ciudad no encontrada");
        nombreCiudad.innerHTML = "-";
        fecha.innerHTML = "-";
        temperatura.innerHTML = "-";
        clima.innerHTML = "-";
        tempMayor.innerHTML = "-";
        tempMenor.innerHTML = "-";
        wind.innerHTML = "-";
        humidity.innerHTML = "-";
        visibility.innerHTML = "-";
        return;
    }

    cambiarFondo(data.weather[0].main);
    const visibilityKm = data.visibility / 1000;
    const fechaData = new Date();
    icono.innerHTML = `<img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png">`;
    nombreCiudad.innerHTML = data.name;
    fecha.innerHTML = `${fechaData.getDate()} / ${fechaData.getMonth() + 1} / ${fechaData.getFullYear()}`
    temperatura.innerHTML = `${data.main.temp}°`;
    clima.innerHTML = data.weather[0].main;
    tempMayor.innerHTML = `${data.main.temp_max}°C`;
    tempMenor.innerHTML = `${data.main.temp_min}°C`;
    wind.innerHTML = `${data.wind.speed}km/h`;
    humidity.innerHTML = `${data.main.humidity}%`;
    visibility.innerHTML = `${visibilityKm}km`;
}

ciudad.addEventListener("keyup", function (e) {
    if (e.key == "Enter") {
        btnConsultar.click();
    }
});

function cambiarFondo(clima) {
    switch (clima) {
        case 'Clear':
            document.body.style.backgroundImage = "url('img/clear.jpg')";
            break;
        case 'Clouds':
            document.body.style.backgroundImage = "url('img/clouds.jpg')";
            break;
        case 'Rain':
            document.body.style.backgroundImage = "url('img/rain.jpg')";
            break;
        case 'Thunderstorm':
            document.body.style.backgroundImage = "url('img/thunderstorm.jpg')";
            break;
        case 'Snow':
            document.body.style.backgroundImage = "url('img/snow.jpg')";
            break;
        case 'Drizzle':
            document.body.style.backgroundImage = "url('img/rain.jpg')";
            break;
        case 'Mist':
            document.body.style.backgroundImage = "url('img/mist.jpg')";
            break;
        default:
            document.body.style.background = "white";
    }
}

function obtenerPronostico(ciudad) {
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${ciudad}&appid=${API_KEY}&units=metric`;
    fetch(url)
        .then(response => {
            return response.json();
        })
        .then(data => {
            const dias = data.list.filter(item => item.dt_txt.includes("12:00:00"));
            console.log(dias);
            pronostico.innerHTML = "";
            dias.forEach(dia => {
                console.log(dia);
                const fecha = new Date(dia.dt_txt).toLocaleDateString('es-ES', { weekday: 'short' });
                pronostico.innerHTML += `
                <div class="flex flex-col items-center text-center">
                    <img src="https://openweathermap.org/img/wn/${dia.weather[0].icon}@2x.png">
                    <strong>${fecha.toUpperCase()}</strong>
                    ${dia.main.temp}°
                </div>
                `;
            });
        })
        .catch(error => {
            console.log("Hubo un error: ", error);
        });
}