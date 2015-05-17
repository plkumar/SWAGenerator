/// <reference path="typings/jsdom/jsdom.d.ts" />
/// <reference path="typings/node/node.d.ts" />
/// <reference path="typings/underscore/underscore.d.ts" />
/// <reference path="typings/underscore.string/underscore.string.d.ts" />
var $_ = require("underscore");
//import ejs = require('ejs');
var fs = require('fs');
var path = require('path');
var SwaggerParser = (function () {
    function SwaggerParser(json, options) {
        this.swaggerOptions = options;
        this.appDir = path.dirname(require.main.filename);
        if (json != undefined && typeof json === "string") {
            this.swaggerMetadata = JSON.parse(json);
        }
        else if (json != undefined && typeof json === "object") {
            this.swaggerMetadata = json;
        }
        else {
            throw "Invalid input format!";
        }
    }
    SwaggerParser.prototype.camelize = function (str) {
        return str.replace(/\W+(.)/g, function (match, chr) {
            return chr.toUpperCase();
        });
    };
    SwaggerParser.prototype.renderViewTemplate = function (templateOptions) {
        var _template = fs.readFileSync(this.appDir + '/templates/' + this.swaggerOptions.templateType + '/views/' + templateOptions.name + '.html', 'utf8');
        var rslt = $_.template(_template);
        return rslt;
    };
    SwaggerParser.prototype.renderModelTemplate = function () {
        var _template = fs.readFileSync(this.appDir + '/templates/' + this.swaggerOptions.templateType + '/controllers/controller.ts', 'utf8');
        var rslt = $_.template(_template);
        return rslt;
    };
    SwaggerParser.prototype.generateHtmlView = function () {
        var self = this;
        Object.keys(this.swaggerMetadata.definitions).forEach(function (objectKey) {
            //console.log(objectDef);
            var objectDef = self.swaggerMetadata.definitions[objectKey];
            var renderModel = self.renderModelTemplate();
            console.log(renderModel({ name: objectKey, schema: objectDef }));
            console.log("\nObject :" + objectKey + "\n");
            Object.keys(objectDef.properties).forEach(function (propertyKey) {
                if (objectDef.type === "object") {
                    var propertyObj = objectDef.properties[propertyKey];
                    propertyObj.name = propertyKey;
                    var requiredFields = objectDef.required;
                    var htmlTemplate;
                    //set true if property is required
                    propertyObj.required = (requiredFields.indexOf(propertyKey) == -1 ? false : true);
                    //console.log("REQUIRED : " + propertyObj.required);
                    switch (true) {
                        case (propertyObj.type === "integer"
                            && propertyObj.format === "int32"
                            && propertyObj.enum == undefined):
                            htmlTemplate = self.renderViewTemplate({ name: 'input' });
                            break;
                        case (propertyObj.type === "integer"
                            && propertyObj.format === "int32"
                            && propertyObj.enum != undefined):
                            htmlTemplate = self.renderViewTemplate({ name: 'select' });
                            break;
                        case (propertyObj.type === "string"
                            && propertyObj.format == undefined):
                            // pure string type
                            //htmlTemplate = $_.template("<input type='text' ng-model='{{propertyObj.name}}' >");
                            htmlTemplate = self.renderViewTemplate({ name: 'input' });
                            break;
                        case (propertyObj.type === "string"
                            && propertyObj.format !== undefined
                            && propertyObj.format === "date-time"):
                            // date-time type
                            htmlTemplate = self.renderViewTemplate({ name: 'date-time' });
                            break;
                        case (propertyObj.type === "array"):
                            //console.log("\t--> Type: array ");
                            if (propertyObj.items.$ref !== undefined) {
                            }
                            break;
                        case (propertyObj.type === "boolean"):
                            //console.log("\t--> Type: boolean ");
                            htmlTemplate = self.renderViewTemplate({ name: 'checkbox' });
                            break;
                        case (propertyObj.type === "object"):
                            //console.log("\t--> Type: object ");
                            break;
                        default:
                    }
                    if (htmlTemplate != undefined) {
                        console.log(htmlTemplate({ 'propertyObj': propertyObj }));
                    }
                }
            });
        });
        return "";
    };
    return SwaggerParser;
})();
var json = {
    "swagger": "2.0",
    "info": {
        "version": "v1",
        "title": "AGS.Hyper.Web"
    },
    "host": "localhost:52997",
    "schemes": ["http"],
    "paths": {
        "/api/Contacts": {
            "get": {
                "tags": ["Contacts"],
                "operationId": "Contacts_Get",
                "consumes": [],
                "produces": ["application/json", "text/json", "application/xml", "text/xml"],
                "responses": {
                    "200": {
                        "description": "OK",
                        "schema": {
                            "type": "array",
                            "items": {
                                "$ref": "#/definitions/User"
                            }
                        }
                    }
                },
                "deprecated": false
            },
            "post": {
                "tags": ["Contacts"],
                "operationId": "Contacts_Add",
                "consumes": ["application/json", "text/json", "application/xml", "text/xml", "application/x-www-form-urlencoded"],
                "produces": ["application/json", "text/json", "application/xml", "text/xml"],
                "parameters": [{
                        "name": "user",
                        "in": "body",
                        "required": true,
                        "schema": {
                            "$ref": "#/definitions/User"
                        }
                    }],
                "responses": {
                    "200": {
                        "description": "OK",
                        "schema": {
                            "type": "boolean"
                        }
                    }
                },
                "deprecated": false
            }
        },
        "/api/Contacts/{id}": {
            "put": {
                "tags": ["Contacts"],
                "operationId": "Contacts_UpdateUSer",
                "consumes": ["application/json", "text/json", "application/xml", "text/xml", "application/x-www-form-urlencoded"],
                "produces": ["application/json", "text/json", "application/xml", "text/xml"],
                "parameters": [{
                        "name": "id",
                        "in": "path",
                        "required": true,
                        "type": "string"
                    }, {
                        "name": "user",
                        "in": "body",
                        "required": true,
                        "schema": {
                            "$ref": "#/definitions/User"
                        }
                    }],
                "responses": {
                    "200": {
                        "description": "OK",
                        "schema": {
                            "type": "boolean"
                        }
                    }
                },
                "deprecated": false
            },
            "delete": {
                "tags": ["Contacts"],
                "operationId": "Contacts_DeleteUser",
                "consumes": [],
                "produces": ["application/json", "text/json", "application/xml", "text/xml"],
                "parameters": [{
                        "name": "id",
                        "in": "path",
                        "required": true,
                        "type": "string"
                    }],
                "responses": {
                    "200": {
                        "description": "OK",
                        "schema": {
                            "type": "boolean"
                        }
                    }
                },
                "deprecated": false
            }
        }
    },
    "definitions": {
        "User": {
            "required": ["Name", "Email"],
            "type": "object",
            "properties": {
                "Id": {
                    "format": "int32",
                    "type": "integer"
                },
                "Name": {
                    "type": "string"
                },
                "Email": {
                    "type": "string"
                },
                "Age": {
                    "format": "int32",
                    "type": "integer"
                },
                "DateOfBirth": {
                    "format": "date-time",
                    "type": "string"
                },
                "Addresses": {
                    "type": "array",
                    "items": {
                        "$ref": "#/definitions/Address"
                    }
                },
                "Intrests": {
                    "type": "array",
                    "items": {
                        "type": "string"
                    }
                },
                "IsAlive": {
                    "type": "boolean"
                },
                "MaritalStatus": {
                    "format": "int32",
                    "enum": [0, 1, 2, 3],
                    "type": "integer"
                }
            }
        },
        "Address": {
            "required": ["AddressLine1", "City", "ZipCode"],
            "type": "object",
            "properties": {
                "Id": {
                    "format": "int32",
                    "type": "integer"
                },
                "AddressLine1": {
                    "type": "string"
                },
                "AddressLine2": {
                    "type": "string"
                },
                "City": {
                    "type": "string"
                },
                "ZipCode": {
                    "type": "string"
                }
            }
        }
    }
};
var test = new SwaggerParser(json, { templateType: 'angular' });
test.generateHtmlView();
//# sourceMappingURL=app.js.map