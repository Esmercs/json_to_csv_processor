const fs = require('fs');
const archivo = '/Users/User/Documents/test.csv';//Route to save the csv file

class Vehiculos{
    _listado = {};

    constructor(){
        this._listado={};
    }

    processString(s) { // 
        return s.toLowerCase().replace(' ', '_').replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, ''); // string a minusculas, reemplaza espacios por guion bajo
    }

    escapeComma(s) {
        s = s?.replace(new RegExp('"', 'g'), ''); 
        return s ? '"' + s + '"' : null;
    }

    convertToCSV(objArray) {
        const header = Object.keys(objArray[0])
        const csv = [
          header.join(','), // header row first
          ...objArray.map(row => header.map(fieldName => row[fieldName] ? row[fieldName] : '').join(','))
        ].join('\r\n')
        fs.writeFileSync( archivo, csv );
    }

    
    getListadoArray(vehiculos) {
        const listado = [];
        const columns = [];
        Object.keys(vehiculos)
            .forEach((key) => vehiculos[key].specs
                .forEach((spec) => {
                    const prefix = ['spec_' + this.processString(spec.group.toLowerCase()) + '_'];
                    spec.specs
                        .forEach((innerSpec) => {
                            const columnName = prefix + this.processString(innerSpec.name);
                            if (columns.indexOf((c) => c.replace('_', '') === columnName.replace('_', '')) === -1) {
                                columns.push(columnName);
                            }
                        });
                }));
        Object.keys(vehiculos)
            .forEach((key) => {
                const tempVehiculo = {
                    id: key,
                    name: this.escapeComma(vehiculos[key].name),
                    desc: this.escapeComma(vehiculos[key].desc),
                };
                const tempSpecs = {};
                vehiculos[key].specs
                    .forEach((spec) => {
                        const prefix = ['spec_' + this.processString(spec.group.toLowerCase()) + '_'];
                        spec.specs
                            .forEach((innerSpec) => {
                                tempSpecs[prefix + this.processString(innerSpec.name)] = this.escapeComma(innerSpec.data);
                            });
                    });

                columns.forEach((column) => {
                    tempVehiculo[column] = tempSpecs[column] ? tempSpecs[column] : '';
                });
                
                listado.push(tempVehiculo);
            });
            this.convertToCSV(listado);
        return listado;
    }
}
module.exports = Vehiculos;

