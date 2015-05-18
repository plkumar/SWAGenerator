/// <reference path="typings/jsdom/jsdom.d.ts" />
/// <reference path="typings/node/node.d.ts" />
/// <reference path="typings/underscore/underscore.d.ts" />
/// <reference path="typings/underscore.string/underscore.string.d.ts" />
var $_ = require("underscore");
//import ejs = require('ejs');
var fs = require('fs');
var path = require('path');
var SwaggerParser = (function () {
    function SwaggerParser(options) {
        this.swaggerOptions = options;
        this.appDir = path.dirname(require.main.filename);
        if (options.json != undefined && typeof options.json === "string") {
            this.swaggerMetadata = JSON.parse(options.json);
        }
        else if (options.json != undefined && typeof options.json === "object") {
            this.swaggerMetadata = options.json;
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
    SwaggerParser.prototype.renderViewTemplate = function () {
        var _template = fs.readFileSync(this.appDir + '/templates/' + this.swaggerOptions.templateType + '/views/form.html', 'utf8');
        var rslt = $_.template(_template);
        return rslt;
    };
    SwaggerParser.prototype.renderServiceTemplate = function () {
        var CodeGen = require('swagger-js-codegen').CodeGen;
        //var angularjsSourceCode = CodeGen.getAngularCode({ moduleName:'myapp', className: this.swaggerOptions.classNamePrefix + 'Service', swagger: this.swaggerMetadata });
        var angularjsSourceCode = CodeGen.getCustomCode({
            moduleName: 'myapp',
            className: this.swaggerOptions.classNamePrefix + 'Service',
            swagger: this.swaggerMetadata,
            template: {
                class: fs.readFileSync('swagger_templates/angular-class.mustache', 'utf-8'),
                method: fs.readFileSync('swagger_templates/method.mustache', 'utf-8'),
                request: fs.readFileSync('swagger_templates/angular-request.mustache', 'utf-8')
            }
        });
        fs.writeFileSync("generated/generated." + this.swaggerOptions.classNamePrefix + 'Service' + ".js", angularjsSourceCode);
        return angularjsSourceCode;
    };
    SwaggerParser.prototype.renderModelTemplate = function () {
        var _template = fs.readFileSync(this.appDir + '/templates/' + this.swaggerOptions.templateType + '/controllers/controller.ts_', 'utf8');
        var rslt = $_.template(_template);
        return rslt;
    };
    SwaggerParser.prototype.scaffoldAngularCode = function () {
        var self = this;
        self.renderServiceTemplate();
        var generatedTypeScript = "";
        Object.keys(this.swaggerMetadata.definitions).forEach(function (objectKey) {
            var generatedHtml = "";
            var objectDef = self.swaggerMetadata.definitions[objectKey];
            objectDef.name = objectKey;
            var renderModel = self.renderModelTemplate();
            generatedTypeScript = generatedTypeScript + "\r\n" + renderModel({ application: self.swaggerOptions.application,
                name: objectKey,
                schema: objectDef,
                paths: self.swaggerOptions.json.paths });
            //console.log(renderModel({name:objectKey, schema:objectDef}));
            generatedHtml = generatedHtml + "\r\n" +
                self.renderViewTemplate()({ application: self.swaggerOptions.application,
                    name: objectKey, schema: objectDef });
            //console.log(self.renderViewTemplate()({name:objectKey, schema:objectDef}))
            fs.writeFileSync("generated/generated." + objectDef.name + ".html", generatedHtml);
        });
        fs.writeFileSync("generated/generated.controllers.ts", generatedTypeScript);
        return "";
    };
    return SwaggerParser;
})();
var swjson = fs.readFileSync("sample.json").toString();
var test = new SwaggerParser({ templateType: 'angular', application: 'myapp', classNamePrefix: "Contacts", json: swjson });
test.scaffoldAngularCode();
//# sourceMappingURL=app.js.map