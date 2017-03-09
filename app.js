'use strict'
var http = require('http');
var fs = require('fs');
var pgStructure = require('pg-structure');
var init = require('./init/init');
var object = {}
var outputString = '';

function format(source, params) {
    for (var i=0; i< params.length; i++) {
        source = source.replace(new RegExp("\\{" + i + "\\}", "g"), params[i]);
    }
    return source;
}

http.createServer(function (req, res) {
    pgStructure({ database: init.database, user: init.username, password: init.password, host: init.host, port: init.port }, [init.schema, 'other_schema'])
        .then((db) => {
            
            var functionExportString = '';
            var tables = db.schemas.get(init.schema).tables;  // Map of Table objects.
            let tableName;

            outputString += init.includes;
            outputString += '\r\n\r\n\r\n';

            // List of table names
            for (let table of tables.values()) {

                object.tableName = '';
                object.fieldsArray = '';
                object.fieldsString = '';
                object.insertString='';
                object.updateString='';
                object.updateStringValue= '';

                    //GET TABLE NAME
                    object.tablename = table.name;
                    
                    //GET PRIMARY KEY - WE ASSUME FOR NOW THERE IS ONLY ONE
                    let pkColumns  = Array.from(table.primaryKeyColumns.values());  // As an array
                    for (let column of pkColumns) {
                        object.primaryKey = column.name;
                    }

                    //GET ALL COLUMNS
                    object.fieldsArray  = table.columns.values();  // [ id {}, name {}, color_id {} ... ]
                    
                    var counter = 0;
                    for (let column of table.columns.values()) {
                       
                        if(column != undefined)
                            {
                                //console.log(column.name);
                                object.fieldsString += column.name + ',';
                                object.insertString += '${' + column.name + '},'
                                object.updateString += column.name + '= $' + counter + ',';
                                object.updateStringValue += 'req.body.' + column.name + ',';
                            }
                            counter++;
                    }

                    //REPLACE ALL PLACEHOLDERS WITH SCHEMA INFORMATION FROM THE TABLE    
                    outputString += format(init.selectSingleStatement,[object.tablename,object.fieldsString.slice(0,-1),object.primaryKey]);
                    outputString += '\r\n\r\n';
                    outputString += format(init.selectManyStatement,[object.tablename,object.fieldsString.slice(0,-1)]);
                    outputString += '\r\n\r\n';
                    outputString += format(init.createStatement,[object.tablename,object.fieldsString.slice(0,-1),object.insertString.slice(0,-1)]);
                    outputString += '\r\n\r\n';
                    outputString += format(init.updateStatement,[object.tablename,object.updateString.slice(0,-1),object.primaryKey,object.updateStringValue.slice(0,-1)]);
                    outputString += '\r\n\r\n';
                    outputString += format(init.deleteStatement,[object.tablename,object.primaryKey]);
                    outputString += '\r\n\r\n';

                    functionExportString += 'selectSingle' + table.name + ': selectSingle' + table.name + ',';
                    functionExportString += '\r\n';
                    functionExportString += 'selectMany' + table.name + ': selectMany' + table.name + ',';
                    functionExportString += '\r\n';
                    functionExportString += 'create' + table.name + ': create' + table.name + ',';
                    functionExportString += '\r\n';
                    functionExportString += 'update' + table.name + ': update' + table.name + ',';
                    functionExportString += '\r\n';
                    functionExportString += 'delete' + table.name + ': delete' + table.name + ',';
                    functionExportString += '\r\n';
            }

            outputString += format(init.exports,[functionExportString.slice(0,-1)]); 
            
            //CREATE DATABASE FILE
            fs.writeFile(init.dbFileName,outputString, function (err) {
                if (err) {
                    return console.log(err);
                }
                
                res.writeHead(200, { 'Content-Type': 'text/plain' });
                res.end('File(s) created\n');

            });
        })
        .catch(err => console.log(err.stack));


}).listen(8080);

console.log('Server running on port 8080.');