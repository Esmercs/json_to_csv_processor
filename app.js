const { leerDB } = require("./helpers/interaccionJson");
const Vehiculos = require("./models/vehiculos");

const vehiculos = new Vehiculos
const main = async()=>{
    const jsonLeer  = leerDB();
    vehiculos.getListadoArray(jsonLeer);
}


main();