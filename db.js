
import {
    getDatabase,
    ref,
    push,
    onValue
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-database.js";

import {
    initializeApp
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js";


// CONEXION CON FIREBASE

const firebaseConfig = {
    apiKey: "AIzaSyCasHc-lwvT2n-lKZHltimNmciZq5nQMBY",
    authDomain: "proyecto-vivero-27f64.firebaseapp.com",
    databaseURL: "https://proyecto-vivero-27f64-default-rtdb.firebaseio.com",
    projectId: "proyecto-vivero-27f64",
    storageBucket: "proyecto-vivero-27f64.firebasestorage.app",
    messagingSenderId: "104713254601",
    appId: "1:104713254601:web:65b4cee2ee67881b0fff18"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);


// ELEMENTOS DEL HTML

let inputNombre = document.querySelector("#nombre");
let inputPrecio = document.querySelector("#precio");
let inputDimension = document.querySelector("#dimension");
let inputStock = document.querySelector("#stock");

let btnAgregar = document.querySelector("#agregar");

let tabla = document.querySelector("#listaPlantas");

let inputBuscar = document.querySelector("#buscar");
let btnLimpiarBusqueda = document.querySelector("#limpiarBusqueda");

let mensaje = document.querySelector("#mensaje");


// REFERENCIA A FIREBASE

let PlantasRef = ref(db, "Plantas");


// VARIABLE PARA GUARDAR LAS PLANTAS

let plantas = {};


// ETAPA 1 Y 3: AGREGAR PLANTAS CON ID AUTOMATICO

btnAgregar.onclick = function () {

    let nombre = inputNombre.value;
    let precio = inputPrecio.value;
    let dimension = inputDimension.value;
    let stock = inputStock.value;

    if (nombre === "" || precio === "" ||
        dimension === "" || stock === "") {

        alert("Completa todos los campos");
        return;
    }

    push(PlantasRef, {

        nombre: nombre,
        precio: Number(precio),
        dimension: dimension,
        stock: Number(stock)

    })

    .then(() => {

        alert("Planta registrada correctamente");

        inputNombre.value = "";
        inputPrecio.value = "";
        inputDimension.value = "";
        inputStock.value = "";

    })

    .catch((error) => {

        alert("Error al registrar: " + error.message);

    });

};


// ETAPA 2: CONSULTAR Y MOSTRAR PLANTAS

onValue(PlantasRef, (datos) => {

    plantas = datos.val() || {};

    mostrarPlantas();

});


// ETAPA 4: BUSCAR PLANTAS POR NOMBRE

inputBuscar.addEventListener("input", function () {

    mostrarPlantas();

});


// BOTON PARA LIMPIAR LA BUSQUEDA

btnLimpiarBusqueda.onclick = function () {

    inputBuscar.value = "";

    mostrarPlantas();

};


// FUNCION PARA MOSTRAR LAS PLANTAS

function mostrarPlantas() {

    let busqueda = inputBuscar.value.toLowerCase();

    tabla.innerHTML = "";

    let cantidad = 0;

    for (let ID in plantas) {

        let nombre = plantas[ID].nombre.toLowerCase();

        if (nombre.includes(busqueda)) {

            tabla.innerHTML += `
                <tr>
                    <td>${ID}</td>
                    <td>${plantas[ID].nombre}</td>
                    <td>${plantas[ID].precio}</td>
                    <td>${plantas[ID].dimension}</td>
                    <td>${plantas[ID].stock}</td>
                </tr>
            `;

            cantidad++;

        }

    }

    if (cantidad === 0) {

        if (busqueda === "") {
            mensaje.textContent = "No hay plantas registradas";
        } else {
            mensaje.textContent = "No se encontraron plantas";
        }

    } else {

        mensaje.textContent = "Plantas encontradas: " + cantidad;

    }

}
