/// <reference path="typings/jsdom/jsdom.d.ts" />
/// <reference path="typings/node/node.d.ts" />
/// <reference path="typings/underscore/underscore.d.ts" />
/// <reference path="typings/underscore.string/underscore.string.d.ts" />

import $_ = require("underscore");
import jsdom = require("jsdom");
//import ejs = require('ejs');
import fs = require('fs');
import path = require('path');

interface Info {
    version: string;
    title: string;
}

interface ActionMetadata {
    tags: Array<string>;
    operationId: string;
    "consumes": Array<string>;
    "produces": Array<string>;
    "responses": any;
}

interface Parameter {
    name: string
    in: string;
    required: boolean;
    type: string;
}

interface Schema {
    type:string;
    $ref?:string;
}

interface Paths {
    [path:string]:ActionMetadata;
}

interface Items {
    $ref: string;
}

interface PropertyDef {
    format: string;
    type: string;
    items: { $ref: string, type: string }
    name: string;
    enum: number[];
    required?:boolean;
}

interface Property {
    [name: string]: PropertyDef;
}

interface SwaggerEntity {
    name?:string;
    required: string[];
    type: string;
    properties: Property;
}

interface SwaggerEntitySchema{
    name:string;
    entityDef:SwaggerEntity;
}

interface Definitions {
    [name: string]: SwaggerEntity;
}

interface SwaggerResponse {
    swagger: string;
    info: Info;
    host: string;
    schemes: string[];
    paths: Paths;
    definitions: Definitions;
}

interface TemplateOptions {
    name:string;
}

interface SwaggerOptions {
    application : string;
    templateType : string;
    json : any;
    classNamePrefix : string;
}

class SwaggerParser {

    swaggerMetadata: SwaggerResponse;
    swaggerOptions : SwaggerOptions;
    appDir : string;

    constructor( options:SwaggerOptions ) {
        this.swaggerOptions = options;
        this.appDir = path.dirname(require.main.filename);
        if (options.json != undefined && typeof options.json === "string") {
            this.swaggerMetadata = JSON.parse(options.json);
        } else if (options.json != undefined && typeof options.json === "object") {
            this.swaggerMetadata = options.json;
        } else {
            throw "Invalid input format!";
        }
    }

    camelize(str: string): string {
        return str.replace(/\W+(.)/g, function(match, chr) {
            return chr.toUpperCase();
        });
    }

    renderViewTemplate():any {
        var _template = fs.readFileSync(this.appDir+'/templates/' + this.swaggerOptions.templateType + '/views/form.html','utf8')
        var rslt = $_.template(_template);
        return rslt;
    }
  
    renderServiceTemplate () : any {
        var CodeGen = require('swagger-js-codegen').CodeGen;        
        var angularjsSourceCode = CodeGen.getAngularCode({ className: this.swaggerOptions.classNamePrefix + 'Service', swagger: this.swaggerMetadata });
        fs.writeFileSync("generated/generated." + this.swaggerOptions.classNamePrefix + 'Service' + ".js", angularjsSourceCode);
        return angularjsSourceCode;
    }
  
    renderModelTemplate():any {        
        var _template = fs.readFileSync(this.appDir+'/templates/' + this.swaggerOptions.templateType + '/controllers/controller.ts_','utf8')
        var rslt = $_.template(_template);
        return rslt;
    }
    
    scaffoldAngularCode(): String {
        var self = this;
        
        var generatedTypeScript:string ="";
        
        Object.keys(this.swaggerMetadata.definitions).forEach(function(objectKey) {
            
            var generatedHtml:string="";
            
            var objectDef = self.swaggerMetadata.definitions[objectKey];
            objectDef.name = objectKey;
            var renderModel = self.renderModelTemplate();

            generatedTypeScript = generatedTypeScript + "\r\n" + renderModel({ application:self.swaggerOptions.application,
                name:objectKey,
                schema:objectDef,
                paths:self.swaggerOptions.json.paths});
            //console.log(renderModel({name:objectKey, schema:objectDef}));

            generatedHtml = generatedHtml + "\r\n" +
            self.renderViewTemplate()({application:self.swaggerOptions.application,
                name:objectKey, schema:objectDef}); 
            //console.log(self.renderViewTemplate()({name:objectKey, schema:objectDef}))
            
            fs.writeFileSync("generated/generated." + objectDef.name + ".html", generatedHtml);

        });

        fs.writeFileSync("generated/generated.controllers.ts", generatedTypeScript);               
        return "";
    }
}

var swjson = {
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
                "consumes": <any[]>[],
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
                "consumes": <any[]>[],
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
}

var test = new SwaggerParser({templateType:'angular', application:'myapp', classNamePrefix:"Contacts", json: swjson });

console.log(test.renderServiceTemplate());

test.scaffoldAngularCode();