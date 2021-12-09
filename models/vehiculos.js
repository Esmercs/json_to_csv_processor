const fs = require('fs');
const archivo = '/Users/User/Documents/test.csv';//Route to save the csv file

class Vehiculos{
    _listado = {};

    constructor(){
        this._listado={};
    }

    processString(s) { //
        return s.toLowerCase().replace(/[&\/\\#,+()$~%.'":*?<>{}-]/g, '').replace(/\s+/g, '_'); // string a minusculas, reemplaza espacios por guion bajo
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
        const repeatedColumns = [];
        Object.keys(vehiculos)
            .forEach((key) => vehiculos[key].specs
                .forEach((spec) => {
                    const prefix = ['spec_' + this.processString(spec.group.toLowerCase()) + '_'];
                    spec.specs
                        .forEach((innerSpec) => {
                            const columnName = prefix + this.processString(innerSpec.name);
                            const i = columns.findIndex((c) => c.replace(/_/g, '') === columnName.replace(/_/g, ''));
                            if (i === -1) {
                                columns.push(columnName);
                            } else {
                                repeatedColumns.push({name: columnName, pointsTo: i});
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

                repeatedColumns.forEach((rColumn) => {
                    if (tempSpecs[rColumn.name]) {
                        tempVehiculo[columns[rColumn.pointsTo]] = tempSpecs[rColumn.name];
                    }
                });
                
                listado.push(tempVehiculo);
            });
            this.convertToCSV(listado);
        return listado;
    }
}
module.exports = Vehiculos;

