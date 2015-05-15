/// <reference path="typings/tsd.d.ts" />
var SwaggerParser = (function () {
    function SwaggerParser(json) {
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
    SwaggerParser.prototype.generateHtmlView = function () {
        var self = this;
        Object.keys(this.swaggerMetadata.definitions).forEach(function (objectKey) {
            //console.log(objectDef);
            var objectDef = self.swaggerMetadata.definitions[objectKey];
            console.log("\nObject :" + objectKey + "\n");
            Object.keys(objectDef.properties).forEach(function (propertyKey) {
                if (objectDef.type === "object") {
                    var properyObject = objectDef.properties[propertyKey];
                    properyObject.name = propertyKey;
                    var requiredFields = objectDef.required;
                    console.log("Field : " + propertyKey + (requiredFields.indexOf(propertyKey) == -1 ? "" : "[REQUIRED]"));
                    switch (true) {
                        case (properyObject.type === "integer"
                            && properyObject.format === "int32"
                            && properyObject.enum == undefined):
                            console.log("\t--> Type: integer ");
                            break;
                        case (properyObject.type === "integer"
                            && properyObject.format === "int32"
                            && properyObject.enum != undefined):
                            console.log("\t--> Type: Enum [" + properyObject.enum + "]");
                            break;
                        case (properyObject.type === "string"
                            && properyObject.format == undefined):
                            // pure string type
                            console.log("\t--> Type: string ");
                            break;
                        case (properyObject.type === "string"
                            && properyObject.format !== undefined
                            && properyObject.format === "date-time"):
                            // date-time type
                            console.log("\t--> Type: date-time ");
                            break;
                        case (properyObject.type === "barray"):
                            console.log("\t--> Type: array ");
                            break;
                        case (properyObject.type === "boolean"):
                            console.log("\t--> Type: boolean ");
                            break;
                        case (properyObject.type === "object"):
                            console.log("\t--> Type: object ");
                            break;
                        default:
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
            }
        }
    },
    "definitions": {
        "User": {
            "required": ["Name"],
            "type": "object",
            "properties": {
                "Id": {
                    "format": "int32",
                    "type": "integer"
                },
                "Name": {
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
var test = new SwaggerParser(json);
test.generateHtmlView();
//# sourceMappingURL=app.js.map