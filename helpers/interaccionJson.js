const fs = require('fs');

const leerDB= () =>{
    const archivo = './db/specs_clean.json';//ROUTE TO TAKE THE json file
    const info = fs.readFileSync(archivo, {encoding: 'utf-8'});
    const data = JSON.parse(info);
    
    // console.log(data);
    return data;
}

module.exports={
    leerDB
}