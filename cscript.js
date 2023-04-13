"use strict";
// Lexer
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.evaluate = void 0;
var lexerRules = [
    ['stringliteral', /('.*')/g],
    ['def', /def/g],
    ['def', /int/g],
    ['def', /string/g],
    ['def', /float/g],
    ['def', /any/g],
    ['def', /object/g],
    ['def', /list/g],
    ['if', /if/g],
    ['break', /break/g],
    ['continue', /continue/g],
    ['else', /else/g],
    ['while', /while/g],
    ['dowhile', /dowhile/g],
    ['htmlStart', /{{/g],
    ['htmlEnd', /}}/g],
    ['dowhile', /dowhile/g],
    ['element', /element/g],
    ['when', /when/g],
    ['+=', /\+=/g],
    ['-=', /-=/g],
    ['/=', /\/=/g],
    ['*=', /\*=/g],
    ['%=', /%=/g],
    ['!=', /!=/g],
    ['==', /==/g],
    ['=', /=/g],
    ['>', />/g],
    ['<', /</g],
    ['>=', />=/g],
    ['<=', /<=/g],
    ['sub', /-/g],
    ['repeat', /repeat/g],
    ['return', /return/g],
    ['func', /func/g],
    ['class', /class/g],
    ['pass', /pass/g],
    ['void', /void/g],
    ['element', /element/g],
    ['pre-processor', /@.+;/g],
    ['{', /\{/g],
    ['}', /}/g],
    ['[', /\[/g],
    [']', /]/g],
    [')', /\)/g],
    ['(', /\(/g],
    [',', /,/g],
    [':', /:/g],
    ['identifier', /[a-zA-Z_][a-zA-Z0-9_]*/g],
    ['floatliteral', /-?([0-9]+)\.([0-9])+/g],
    ['integer', /-?[0-9]+/g],
    ['sqrtbrakets', /\[]/g],
    ['.', /\./g],
];
function readTextFile(file) {
    var rawFile = new XMLHttpRequest();
    var allText;
    rawFile.open('GET', file, false);
    rawFile.onreadystatechange = function () {
        if (rawFile.readyState == 4) {
            if (rawFile.status == 200 || rawFile.status == 0) {
                allText = rawFile.responseText;
            }
        }
    };
    rawFile.send(null);
    return allText;
}
function decodeHTML(text) {
    return text
        .replace("&amp;", "&")
        .replace("&lt;", "<")
        .replace("&gt;", ">")
        .replace("&quot;", '"')
        .replace("#039;", "'");
}
function lex(code) {
    var tokens = [];
    var currentToken = '';
    var inHTML = false;
    var inPreprocessor = false;
    for (var i = 0; i < code.length; i++) {
        var character = code[i];
        character.replace('\t', '');
        character.replace('\n', '');
        if (character == ';'
            || character == ','
            || character == '('
            || character == ')'
            || character == '{'
            || character == '}'
            || character == '['
            || character == ']'
            || character == '\n'
            || character == '\t'
            || character == ' '
            || character == '='
            || character == '!'
            || character == '>'
            || character == '<'
            || character == ':'
            || character == '.'
            || character == "'"
            || character == '@') {
            if (character == '.') {
                if (currentToken.match(/-?([0-9]+)/g)) {
                    currentToken += character;
                    continue;
                }
            }
            else if (character == '{' && code[i + 1] == '{') {
                tokens.push('{{');
                i++;
                continue;
            }
            else if (character == '}' && code[i + 1] == '}') {
                tokens.push('}}');
                i++;
                continue;
            }
            else if (character == '=' && code[i + 1] == '=') {
                tokens.push('==');
                i++;
                continue;
            }
            else if (character == '!' && code[i + 1] == '=') {
                tokens.push('!=');
                i++;
                continue;
            }
            else if (character == '>' && code[i + 1] == '=') {
                tokens.push('>=');
                i++;
                continue;
            }
            else if (character == '<' && code[i + 1] == '=') {
                tokens.push('<=');
                i++;
                continue;
            }
            else if (character == '@' && !inPreprocessor) {
                inPreprocessor = true;
            }
            else if (character == ';' && inPreprocessor) {
                tokens.push(currentToken + ';');
                currentToken = '';
                inPreprocessor = false;
                continue;
            }
            if (inPreprocessor) {
                currentToken += character;
                continue;
            }
            tokens.push(currentToken);
            tokens.push(character);
            currentToken = '';
        }
        else {
            currentToken += character;
        }
        if (i == code.length - 1) {
            tokens.push(currentToken);
        }
    }
    var inQuotes = false;
    var quoteString = '';
    tokens = tokens.filter(function (e) { return e; });
    for (var i = 0; i < tokens.length; i++) {
        if (tokens[i].includes("'") && !inQuotes) {
            inQuotes = true;
        }
        else if (tokens[i].includes("'") && inQuotes) {
            inQuotes = false;
            if (quoteString != '') {
                tokens[i] = quoteString + tokens[i];
                quoteString = '';
            }
        }
        if (inQuotes) {
            quoteString += tokens[i];
            tokens[i] = undefined;
        }
    }
    tokens = tokens.filter(function (e) { return e; });
    for (var i = 0; i < tokens.length; i++) {
        if (tokens[i].includes('{{') && !inHTML) {
            inHTML = true;
        }
        else if (tokens[i].includes('}}') && inHTML) {
            inHTML = false;
        }
        if (inHTML && tokens[i].includes(' ')) {
            tokens[i] = tokens[i].replace(' ', '%20%$space');
        }
    }
    tokens = tokens.filter(function (e) { return e != '' && e != ' ' && e != '\n' && e != '\t' && e && e != '\r' && e != ''; });
    var returnValue = new Array();
    //lexer part
    for (var i = 0; i < tokens.length; i++) {
        var token = tokens[i];
        var lexer = token;
        for (var j = 0; j < lexerRules.length; j++) {
            if (token.match(lexerRules[j][1])) {
                lexer = lexerRules[j][0].toString().toUpperCase();
                break;
            }
        }
        if (lexer == 'STRINGLITERAL')
            tokens[i] = tokens[i].trim().slice(0, -1).slice(1);
        returnValue.push({ lexer: lexer, value: tokens[i].trim() });
    }
    returnValue.push({ lexer: 'EOF', value: 'EOF' });
    return returnValue;
}
function preProcessor(lexer) {
    var preProcessors = [];
    lexer.forEach(function (value, i) {
        if (value.lexer == 'PRE-PROCESSOR') {
            preProcessors.push(value.value);
            lexer[i] = undefined;
        }
    });
    lexer = lexer.filter(function (e) { return e; });
    for (var _i = 0, preProcessors_1 = preProcessors; _i < preProcessors_1.length; _i++) {
        var process_1 = preProcessors_1[_i];
        var tokens = process_1.split(/[ @;]/g).filter(function (e) { return e && e != ''; });
        var name_1 = tokens[0];
        tokens = tokens.slice(1);
        switch (name_1) {
        }
    }
    return lexer;
}
var isControl = ['ifStatement', 'repeatStatement', 'functionDeclaration', 'classDeclaration', 'htmlStatement', 'elseIfStatement', 'whenStatement', "identifier"];
//Parser
var Parser = /** @class */ (function () {
    function Parser() {
        this.tokens = [];
    }
    Parser.prototype.notEOF = function () {
        if (this.tokens[0])
            return this.tokens[0].lexer != 'EOF';
        return false;
    };
    Parser.prototype.createAST = function (sourceCode) {
        this.tokens = lex(sourceCode);
        this.tokens = preProcessor(this.tokens);
        var program = {
            kind: 'program',
            body: []
        };
        while (this.notEOF()) {
            var statement = this.parseStatement();
            program.body.push(statement);
            if (!isControl.includes(statement.kind))
                this.expect(';', "Expected ';' but got ".concat(this.at().value));
        }
        return program;
    };
    Parser.prototype.at = function () {
        return this.tokens[0];
    };
    Parser.prototype.eat = function () {
        return this.tokens.shift();
    };
    Parser.prototype.expect = function (expected, err) {
        var prev = this.eat();
        if (prev.lexer != expected || !prev)
            throw (err);
        return prev;
    };
    Parser.prototype.parseStatement = function () {
        switch (this.at().lexer) {
            case 'DEF':
                return this.parseVariableDeclaration();
            case 'FUNC':
                return this.parseFunctionDeclaration();
            case 'RETURN':
                return this.parseReturnStatement();
            case 'CLASS':
                return this.parseClassDeclaration();
            case 'HTMLSTART':
                return this.parseHTMLStart();
            case 'ELEMENT':
                return this.parseElementDeclaration();
            case 'REPEAT':
                return this.parseRepeatStatement();
            case 'IF':
                return this.parseIfStatement();
            case 'BREAK':
                return this.parseBreakStatement();
            case 'CONTINUE':
                return this.parseContinueStatement();
            case 'WHILE':
                return this.parseWhile();
            case 'DOWHILE':
                return this.parseDowhile();
            case 'WHEN':
                return this.parseWhenStatement();
            default:
                return this.parseExpression();
        }
    };
    Parser.prototype.parseExpression = function () {
        return this.parseAssignmentExpression();
    };
    Parser.prototype.parseConstant = function () {
        var tk = this.at().lexer;
        switch (tk) {
            case 'IDENTIFIER':
                return { kind: 'identifier', symbol: this.eat().value };
            case 'INTEGER':
                return { kind: 'integer', value: parseInt(this.eat().value) };
            case 'FLOATLITERAL':
                return { kind: 'floatLiteral', value: parseFloat(this.eat().value) };
            case 'BOOL':
                return { kind: 'boolLiteral', value: this.eat().value == 'true' };
            case 'STRINGLITERAL':
                return { kind: 'stringLiteral', value: this.eat().value };
            case '(':
                this.eat();
                var value = this.parseExpression();
                this.expect(')', "Unexpected token: ".concat(this.at().value, ". Expected ')'"));
                return value;
            default:
                throw ("Unexpected token: ".concat(this.at().value, " of lexer ").concat(this.at().lexer));
        }
    };
    Parser.prototype.parseAdditiveExpression = function () {
        var left = this.parseMultiplicativeExpression();
        while (this.at().value == '+' || this.at().value == '-') {
            var operator = this.eat().value;
            var right = this.parseMultiplicativeExpression();
            left = {
                kind: 'binaryExpression',
                left: left,
                right: right,
                operator: operator
            };
        }
        return left;
    };
    Parser.prototype.parseMultiplicativeExpression = function () {
        var left = this.parseCallMemberExpression();
        while (this.at().value == '/' || this.at().value == '*' || this.at().value == '%') {
            var operator = this.eat().value;
            var right = this.parseCallMemberExpression();
            left = {
                kind: 'binaryExpression',
                left: left,
                right: right,
                operator: operator
            };
        }
        return left;
    };
    // ((int)|(float)|(any)|(bool)|(string))|(def (:(int)|(float)|(any)|(bool)|(string))?) identifier(=expression)?;
    Parser.prototype.parseVariableDeclaration = function () {
        var kw = this.eat();
        var type = null;
        var identifier;
        var value = 'null';
        if (kw.value == 'def') {
            var secondToken = this.eat().value;
            if (secondToken == ':') {
                if (this.at().value != 'int') {
                    type = this.eat().value;
                }
                else {
                    type = 'integer';
                    this.eat();
                }
                identifier = this.eat().value;
            }
            else
                identifier = secondToken;
        }
        else {
            if (kw.value != 'int')
                type = kw.value;
            else
                type = 'integer';
            identifier = this.eat().value;
        }
        var operator = this.at();
        if (type) {
            switch (type) {
                case 'integer':
                    value = MK_INT();
                    value.kind = value.type;
                    break;
                case 'float':
                    value = MK_FLOAT();
                    value.kind = value.type;
                    break;
                case 'string':
                    value = MK_STRING();
                    value.kind = value.type;
                    break;
                case 'bool':
                    value = MK_BOOL();
                    value.kind = value.type;
                    break;
                case 'object':
                    value = MK_OBJECT();
                    value.kind = value.type;
                    break;
                case "list":
                    value = MK_LIST();
                    value.kind = value.type;
                    break;
            }
            if (this.at().lexer == '=') {
                this.eat();
                value = this.parseStatement();
                value.type = value.kind;
            }
        }
        else if (operator.lexer == '=') {
            this.eat();
            value = this.parseStatement();
            switch (value.kind) {
                case 'integer':
                    type = 'integer';
                    break;
                case 'stringLiteral':
                    type = 'string';
                    break;
                case 'boolLiteral':
                    type = 'bool';
                    break;
                case 'floatLiteral':
                    type = 'float';
                    break;
                case 'objectLiteral':
                    type = 'object';
                    break;
                case "listLiteral":
                    type = 'list';
                    break;
                default:
                    type = 'null';
            }
            value.type = value.kind;
        }
        else {
            this.tokens[0] = operator;
        }
        if (value.type == 'string' || value.type == 'float' || value.type == 'bool') {
            value.type += 'Literal';
            value.kind = value.type;
        }
        return {
            kind: 'variableDeclaration',
            isNull: type == null,
            identifier: identifier,
            value: value == 'null' ? null : value,
            type: type,
        };
    };
    Parser.prototype.parseAssignmentExpression = function () {
        var left = this.parseListExpression();
        var operator = this.at();
        if (operator.lexer == '='
            || operator.lexer == '+='
            || operator.lexer == '-='
            || operator.lexer == '*='
            || operator.lexer == '/='
            || operator.lexer == '%=') {
            this.eat();
            var right = this.parseAssignmentExpression();
            return { left: left, right: right, operator: operator.lexer, kind: 'assignmentExpression' };
        }
        return left;
    };
    Parser.prototype.parseObjectExpression = function () {
        if (this.at().lexer != '{') {
            return this.parseAdditiveExpression();
        }
        this.eat();
        var properties = new Array();
        while (this.notEOF() && this.at().lexer != '}') {
            var type = this.expect('DEF', "Expected type, but got '".concat(this.at(), "'")).value;
            var key = this.expect('IDENTIFIER', 'Expected key of type IDENTIFIER').value;
            if (type == 'int')
                type = 'integer';
            if (this.at().lexer == ',') {
                this.eat();
                properties.push({ key: key, kind: 'property', type: type });
                continue;
            }
            else if (this.at().lexer == '}') {
                properties.push({ key: key, kind: 'property', type: type });
                continue;
            }
            else if (this.at().lexer == ':') {
                this.eat();
                properties.push({ key: key, value: this.parseExpression(), kind: 'property', type: type });
                if (this.at().lexer != '}') {
                    this.expect(',', "Expected ','");
                }
                continue;
            }
            var value = this.parseExpression();
            properties.push({ kind: 'property', value: value, key: key, type: type });
            if (this.at().lexer != '}') {
                this.expect(',', "Expected ','");
            }
        }
        this.expect('}', "Expected '}'");
        return { kind: 'objectLiteral', properties: properties };
    };
    Parser.prototype.parseCallMemberExpression = function () {
        var member = this.parseMemberExpression();
        if (this.at().lexer == '(') {
            return this.parseCallExpression(member);
        }
        return member;
    };
    Parser.prototype.parseArgs = function () {
        this.expect('(', "Expected '('");
        var args = this.at().lexer == ')'
            ? []
            : this.parseArgsList();
        this.expect(')', "Expected ')' after function call");
        return args;
    };
    Parser.prototype.parseArgsList = function () {
        var args = [this.parseExpression()];
        while (this.at().lexer == ',' && this.eat()) {
            args.push(this.parseExpression());
        }
        return args;
    };
    Parser.prototype.parseCallExpression = function (caller) {
        var callExpression = {
            kind: 'callExpression',
            caller: caller,
            args: this.parseArgs()
        };
        if (this.at().lexer == '(') {
            callExpression = this.parseCallExpression(callExpression);
        }
        return callExpression;
    };
    Parser.prototype.parseMemberExpression = function () {
        var object = this.parseConstant();
        while (this.at().lexer == '.' || this.at().lexer == '[') {
            var operator = this.eat();
            var property = void 0;
            var computed = void 0;
            if (operator.lexer == '.') {
                computed = false;
                property = this.parseConstant();
                if (property.kind != 'identifier') {
                    throw "Expected Identifier after dot operator. Instead got ".concat(property);
                }
            }
            else {
                computed = true;
                property = this.parseExpression();
                this.expect(']', "Expected ']'");
            }
            object = {
                kind: 'memberExpression',
                object: object,
                property: property,
                computed: computed
            };
        }
        return object;
    };
    Parser.prototype.parseBlock = function () {
        var body = [];
        this.expect('{', "Expected '{'");
        while (this.at().lexer != '}') {
            var statement = this.parseStatement();
            body.push(statement);
            if (!isControl.includes(statement.kind)) {
                this.expect(';', "Expected ';' but got ".concat(this.at().value));
            }
        }
        this.expect('}', "Expected '}'");
        return body;
    };
    Parser.prototype.parseFunctionDeclaration = function () {
        this.eat();
        var secondToken = this.eat();
        var name = '';
        var type = 'any';
        var params = [];
        if (secondToken.lexer == 'IDENTIFIER') {
            name = secondToken.value;
        }
        else if (secondToken.lexer == ':') {
            type = this.eat().value;
            name = this.eat().value;
        }
        this.expect('(', "Expected '(' after function name or type");
        if (this.at().lexer != ')') {
            do {
                var currentParamType = this.expect('DEF', "Expected parameter type, but got ".concat(this.at())).value;
                var currentParamName = this.expect('IDENTIFIER', "Expected parameter name , but got ".concat(this.at())).value;
                if (currentParamType == 'int')
                    currentParamType = 'integer';
                params.push({ type: currentParamType, name: currentParamName });
            } while (this.at().lexer == ',' && this.eat());
        }
        this.expect(')', "Expected ')' after function name or type");
        var body = this.parseBlock();
        var returnStatement = body[body.length - 1];
        body[body.length - 1] = undefined;
        return {
            kind: 'functionDeclaration',
            params: params,
            name: name,
            returnType: type,
            body: body,
            returnStatement: returnStatement
        };
    };
    Parser.prototype.parseReturnStatement = function () {
        this.eat();
        return { kind: "returnStatement", returnValue: this.parseStatement() };
    };
    Parser.prototype.parseClassDeclaration = function () {
        this.eat();
        var name = this.eat().value;
        var body = new Array();
        this.expect('{', "Expected '{' in class declaration");
        while (this.at().lexer != '}') {
            body.push(this.parseClassBody());
        }
        this.expect('}', "Expected '}' at the end of class declaration");
        return { kind: 'classDeclaration', body: body, name: name };
    };
    Parser.prototype.parseClassBody = function () {
        switch (this.at().lexer) {
            case 'DEF':
                var value = this.parseVariableDeclaration();
                this.expect(';', "Expected ';' but got ".concat(this.at()));
                return value;
            case 'FUNC':
                return this.parseFunctionDeclaration();
            default:
                throw "Unknown token ".concat(this.at().value, " of type ").concat(this.at().lexer);
        }
    };
    Parser.prototype.parseHTMLStart = function () {
        var body = '';
        this.eat();
        while (this.at().lexer != 'HTMLEND') {
            body += this.eat().value;
        }
        this.eat();
        return { kind: 'htmlStatement', body: body };
    };
    Parser.prototype.parseElementDeclaration = function () {
        this.eat();
        var name = this.eat().value;
        var properties = [];
        var body = [];
        this.expect('(', "Expected '('");
        while (this.at().lexer != ')') {
            properties.push(this.eat().value);
            if (this.at().lexer != ')')
                this.expect(',', "Expected ','");
        }
        this.eat();
        this.expect('HTMLSTART', "Expected '{'");
        while (this.at().lexer != 'HTMLEND') {
            body.push(this.eat().value);
        }
        this.eat();
        return { kind: "elementDeclaration", name: name, properties: properties, body: body.join(' ') };
    };
    //repeat(10)/repeat(10: i)/repeat(10: i = 0)/repeat(10: i = 0; 1)/repeat([1, 2, 3])/repeat([1, 2, 3]: i)
    Parser.prototype.parseRepeatStatement = function () {
        this.eat();
        this.expect('(', "Expected '(' after repeat");
        var values = [];
        var name = '';
        var end;
        var start;
        var inc;
        if (this.at().lexer == '[') {
            this.eat();
            while (this.at().lexer != ']') {
                values.push(this.parseExpression());
                if (this.at().lexer != ']') {
                    this.expect(',', "Expected ',' between values");
                }
            }
            this.eat();
            if (this.at().lexer == ':') {
                this.eat();
                name = this.eat().value;
            }
        }
        else {
            end = this.parseExpression();
            if (this.at().lexer == ':') {
                this.eat();
                name = this.eat().value;
                if (this.at().lexer == '=') {
                    this.eat();
                    start = this.parseExpression();
                }
            }
            if (this.at().lexer == ';') {
                this.eat();
                inc = this.parseExpression();
            }
        }
        this.expect(')', "Expected ')' after repeat");
        var body = this.parseBlock();
        return { kind: "repeatStatement", variableName: name, end: end, start: start, inc: inc, values: values, body: body };
    };
    Parser.prototype.parseComparisonExpression = function () {
        var left = this.parseObjectExpression();
        var operator = this.at().lexer;
        if (operator == '==' || operator == '!=' || operator == '>' || operator == '<' || operator == '>=' || operator == '<=') {
            this.eat();
            var right = this.parseObjectExpression();
            return { kind: "comparisonExpression", left: left, right: right, operator: operator };
        }
        return left;
    };
    Parser.prototype.parseIfStatement = function () {
        this.eat();
        this.expect('(', "expected '(' after if");
        var elseIf;
        var condition = this.parseExpression();
        this.expect(')', "expected ')' after if");
        var body = this.parseBlock();
        if (this.at().lexer == 'ELSE') {
            elseIf = this.parseElseIfStatement();
        }
        return { kind: "ifStatement", body: body, condition: condition, elseIfBlock: elseIf };
    };
    Parser.prototype.parseBreakStatement = function () {
        this.eat();
        return { kind: "breakStatement" };
    };
    Parser.prototype.parseContinueStatement = function () {
        this.eat();
        return { kind: "continueStatement" };
    };
    Parser.prototype.parseElseIfStatement = function () {
        this.eat();
        var ifBlock;
        var body = [];
        if (this.at().lexer == 'IF') {
            ifBlock = this.parseIfStatement();
        }
        else {
            this.expect('{', "Expected '{' after else block");
            while (this.at().lexer != '}') {
                body.push(this.parseStatement());
            }
            this.eat();
        }
        return { kind: "elseIfStatement", body: body, ifBlock: ifBlock };
    };
    Parser.prototype.parseWhile = function () {
        this.eat();
        this.expect('(', "expected '(' after if");
        var condition = this.parseExpression();
        this.expect(')', "expected ')' after if");
        var body = this.parseBlock();
        return { kind: "whileStatement", body: body, condition: condition };
    };
    Parser.prototype.parseDowhile = function () {
        this.eat();
        this.expect('(', "expected '(' after if");
        var condition = this.parseExpression();
        this.expect(')', "expected ')' after if");
        var body = this.parseBlock();
        return { kind: "dowhileStatement", body: body, condition: condition };
    };
    Parser.prototype.parseWhenStatement = function () {
        this.eat();
        var triggers = [];
        this.expect('(', "Expected '(' after when statement");
        while (this.at().lexer != ')') {
            triggers.push(this.parseStatement());
            if (this.at().lexer != ')') {
                this.expect(',', "Expected ',' between values");
            }
        }
        this.expect(')', "Expected ')' after when statement");
        var body = this.parseBlock();
        return { kind: "whenStatement", triggers: triggers, body: body };
    };
    Parser.prototype.parseListExpression = function () {
        if (this.at().lexer == '[') {
            this.eat();
            var values = [];
            while (this.at().lexer != ']') {
                values.push(this.parseExpression());
                if (this.at().lexer != ']') {
                    this.expect(',', "Expected ',' between values");
                }
            }
            this.eat();
            return { kind: "listLiteral", values: values };
        }
        else {
            return this.parseComparisonExpression();
        }
    };
    return Parser;
}());
function MK_FLOAT(n) {
    if (n === void 0) { n = 0.0; }
    return { type: 'float', value: n };
}
function MK_INT(n) {
    if (n === void 0) { n = 0; }
    return { type: 'integer', value: n };
}
function MK_STRING(s) {
    if (s === void 0) { s = ''; }
    return { type: 'string', value: s };
}
function MK_BOOL(n) {
    if (n === void 0) { n = false; }
    return { type: 'bool', value: n };
}
function MK_OBJECT(properties) {
    if (properties === void 0) { properties = new Map(); }
    return { type: 'object', properties: properties };
}
function MK_NATIVE_FUNCTION(call, returnType) {
    return { type: 'nativeFunction', call: call, returnType: returnType };
}
function MK_NULL() {
    return { type: 'null', value: null };
}
function MK_ANY(value) {
    return { type: 'any', value: value.value };
}
function MK_ANY_PURE(value) {
    return { type: 'any', value: value };
}
function MK_LIST(value) {
    if (value === void 0) { value = []; }
    return { type: 'list', value: value };
}
//interpreter
function VisitVariableDeclaration(context, env) {
    var value = context.value
        ? Visit(context.value, env)
        : MK_NULL();
    if (context.type != 'integer'
        && context.type != 'float'
        && context.type != 'string'
        && context.type != 'bool'
        && context.type != 'object'
        && context.type != 'null'
        && context.type != 'list') {
        if (env.lookupClass(context.type)) {
            var className = env.lookupClass(context.type);
            var map = new Map();
            for (var _i = 0, _a = className.body; _i < _a.length; _i++) {
                var statement = _a[_i];
                if (statement.kind == 'variableDeclaration') {
                    map.set(statement.identifier, { value: Visit(statement.value, env), type: statement.type });
                }
                else if (statement.kind == 'functionDeclaration') {
                    map.set(statement.name, { value: {
                            body: statement.body,
                            params: statement.params,
                            returnStatement: statement.returnStatement,
                            returnType: statement.returnType,
                            type: 'userDefinedFunction'
                        },
                        type: 'userDefinedFunction' });
                }
            }
            value = MK_OBJECT(map);
        }
        else
            throw "Unknown type '".concat(context.type, "'");
    }
    else if (value.type != context.type && context.type != 'null')
        throw "Can not assign value of type ".concat(value.type, " to ").concat(context.type);
    //@ts-ignore
    return env.declareVariable(context.identifier, value, context.type, false);
}
function VisitAssignmentExpression(context, env) {
    if (context.left.kind != 'identifier' && context.left.kind != 'memberExpression')
        throw "Invalid left value type in ".concat(JSON.stringify(context.left));
    if (context.left.kind != 'memberExpression') {
        var name_2 = context.left.symbol;
        var value = Visit(context.right, env);
        if (env.lookUpVariable(name_2).type == null) {
            env.assignVariableType(name_2, value.type);
        }
        else if (env.lookUpVariable(name_2).type != value.type)
            throw "Cannot assign type ".concat(value.type, " to type ").concat(env.lookUpVariable(name_2)[1]);
        if (context.operator == '=')
            return env.assignVariable(name_2, value);
        var currentValue = env.lookUpVariable(name_2).value;
        if (currentValue.type == 'integer') {
            if (context.operator == '+=')
                return env.assignVariable(name_2, {
                    type: value.type,
                    value: value.value + currentValue.value
                });
            else if (context.operator == '-=')
                return env.assignVariable(name_2, {
                    type: value.type,
                    value: value.value - currentValue.value
                });
            else if (context.operator == '*=')
                return env.assignVariable(name_2, {
                    type: value.type,
                    value: value.value * currentValue.value
                });
            else if (context.operator == '/=')
                return env.assignVariable(name_2, {
                    type: value.type,
                    value: value.value / currentValue.value
                });
            else if (context.operator == '%=')
                return env.assignVariable(name_2, {
                    type: value.type,
                    value: value.value % currentValue.value
                });
        }
        else if (currentValue.type == 'float') {
            if (context.operator == '+=')
                return env.assignVariable(name_2, {
                    type: value.type,
                    value: value.value + currentValue.value
                });
            else if (context.operator == '-=')
                return env.assignVariable(name_2, {
                    type: value.type,
                    value: value.value - currentValue.value
                });
            else if (context.operator == '*=')
                return env.assignVariable(name_2, {
                    type: value.type,
                    value: value.value * currentValue.value
                });
            else if (context.operator == '/=')
                return env.assignVariable(name_2, {
                    type: value.type,
                    value: value.value / currentValue.value
                });
            else if (context.operator == '%=')
                return env.assignVariable(name_2, {
                    type: value.type,
                    value: value.value % currentValue.value
                });
        }
        else if (currentValue.type == 'string') {
            if (context.operator == '+=')
                return env.assignVariable(name_2, {
                    type: value.type,
                    value: value.value + currentValue.value
                });
        }
    }
    else if (!context.left.computed) {
        var name_3 = context.left.object.symbol;
        var properties = env.lookUpVariable(name_3).value.properties;
        var property = context.left.property.symbol;
        var value = Visit(context.right, env);
        if (context.operator == '=') {
            properties.set(property, { type: value.type, value: value });
        }
        return env.assignVariable(name_3, { type: 'object', properties: properties });
    }
    else {
        var name_4 = context.left.object.symbol;
        // @ts-ignore
        var property = Visit(context.left.property, env).value;
        var value = Visit(context.right, env);
        var variable = env.lookUpVariable(name_4).value;
        if (context.operator == '=') {
            variable.value[property] = value;
        }
        return env.assignVariable(name_4, { type: 'list', value: variable.value });
    }
}
function VisitFunctionDeclaration(context, env) {
    env.declareUserDefinedFunction(context.name, context.body, context.returnType, context.params, context.returnStatement);
    return env.lookupUserDefinedValue(context.name).value;
}
function VisitClassDeclaration(context, env) {
    env.declareClass(context.name, { body: context.body });
    return MK_NULL();
}
function VisitMemberExpression(context, env) {
    var object = env.lookUpVariable(context.object.symbol).value;
    if (!context.computed) {
        return object.properties.get(context.property.symbol);
    }
    else {
        // @ts-ignore
        return object.value[Visit(context.property, env).value];
    }
}
function VisitHTMLStatement(context, env) {
    // @ts-ignore
    var text = context.body.replaceAll('%20%$space', ' ');
    var _loop_1 = function (i) {
        var currentVarName = '';
        if (text[i] == '{') {
            text = text.split('');
            text[i] = '';
            i++;
            while (text[i] != '}') {
                currentVarName += text[i];
                text[i] = '';
                i++;
            }
            if (currentVarName.trim()[0] == '<') {
                var elementName = '';
                var tokens = currentVarName.trim().split(/[ "]/g);
                var properties = new Map();
                elementName = tokens[0].slice(1);
                for (var j = 1; j < tokens.length; j++) {
                    if (tokens[j] == '>')
                        break;
                    else if (!tokens[j])
                        continue;
                    var name_5 = tokens[j].slice(0, -1);
                    var value = tokens[++j];
                    if (value.trim()[0] == '(' && value.trim()[value.trim().length - 1] == ')') {
                        // @ts-ignore
                        value = evaluate(value.slice(0, -1).slice(1), env).value.value;
                    }
                    properties.set(name_5, value);
                }
                var element = env.lookupElement(elementName);
                if (properties.size < element.properties.size) {
                    throw "Too few properties were given";
                }
                else if (properties.size > element.properties.size) {
                    throw "Too many properties were given";
                }
                // @ts-ignore
                var body_1 = element.body.replaceAll(' ', '');
                // @ts-ignore
                body_1 = body_1.replaceAll('%20%$space', ' ');
                properties.forEach(function (value, key) {
                    // @ts-ignore
                    body_1 = body_1.replaceAll(eval("/{ *".concat(key, " *}/g")), value);
                });
                text[i] = "<div class=\"".concat(elementName, "_element\"> ").concat(body_1, " </div>");
                text = text.join('');
            }
            else {
                // @ts-ignore
                text[i] = "<span class=\"".concat(currentVarName.trim(), "_value\"> ").concat(evaluate(currentVarName.trim(), env).value, " </span>");
                text = text.join('');
                if (!env.hasHandler(currentVarName.trim()) && env.isVariable(currentVarName.trim())) {
                    env.createHandler(currentVarName.trim(), function () {
                        var elements = document.getElementsByClassName("".concat(currentVarName.trim(), "_value"));
                        for (var i_1 = 0; i_1 < elements.length; i_1++) {
                            // @ts-ignore
                            elements[i_1].innerHTML = env.lookUpVariable(currentVarName.trim()).value.value;
                        }
                    });
                }
            }
        }
        out_i_1 = i;
    };
    var out_i_1;
    for (var i = 0; i < text.length; i++) {
        _loop_1(i);
        i = out_i_1;
    }
    document.getElementsByTagName('display')[0].innerHTML += text;
    return MK_STRING(context.body);
}
function VisitElementDeclaration(context, env) {
    var properties = new Map;
    for (var _i = 0, _a = context.properties; _i < _a.length; _i++) {
        var key = _a[_i];
        properties.set(key, '');
    }
    env.declareElement(context.name, { type: "element", body: context.body, properties: properties });
    return undefined;
}
function VisitRepeatStatement(context, env) {
    var variableName;
    variableName = context.variableName ? context.variableName : 'i';
    if (context.end) {
        var start = context.start ? Visit(context.start, env) : MK_INT();
        var inc = context.inc ? Visit(context.inc, env) : MK_INT(1);
        var end = Visit(context.end, env);
        if (end.type == 'list') {
            // @ts-ignore
            for (var _i = 0, _a = end.value; _i < _a.length; _i++) {
                var i = _a[_i];
                var newEnv = new Environment(env);
                newEnv.declareVariable(variableName, MK_ANY(i), 'any');
                for (var _b = 0, _c = context.body; _b < _c.length; _b++) {
                    var statement = _c[_b];
                    Visit(statement, newEnv);
                }
            }
        }
        else {
            //@ts-ignore
            for (var i = start.value; i < end.value; i += inc.value) {
                var newEnv = new Environment(env);
                newEnv.declareVariable(variableName, MK_INT(i), 'integer');
                for (var _d = 0, _e = context.body; _d < _e.length; _d++) {
                    var statement = _e[_d];
                    if (statement.kind == 'breakStatement') {
                        //@ts-ignore
                        i = end.value;
                        break;
                    }
                    if (statement.kind == 'returnStatement') {
                        //@ts-ignore
                        i += inc.value;
                        break;
                    }
                    Visit(statement, newEnv);
                }
            }
        }
    }
    else {
        for (var _f = 0, _g = context.values; _f < _g.length; _f++) {
            var i = _g[_f];
            var newEnv = new Environment(env);
            newEnv.declareVariable(variableName, MK_ANY(Visit(i, newEnv)), 'any');
            for (var _h = 0, _j = context.body; _h < _j.length; _h++) {
                var statement = _j[_h];
                Visit(statement, newEnv);
            }
        }
    }
    return MK_NULL();
}
function VisitComparisonExpression(context, env) {
    var returnValue = false;
    var left = Visit(context.left, env);
    var right = Visit(context.right, env);
    switch (context.operator) {
        case '==':
            //@ts-ignore
            returnValue = left.value == right.value;
            break;
        case '!=':
            //@ts-ignore
            returnValue = left.value != right.value;
            break;
        case '>=':
            //@ts-ignore
            returnValue = left.value >= right.value;
            break;
        case '<=':
            //@ts-ignore
            returnValue = left.value <= right.value;
            break;
        case '>':
            //@ts-ignore
            returnValue = left.value > right.value;
            break;
        case '<':
            //@ts-ignore
            returnValue = left.value < right.value;
            break;
    }
    return MK_BOOL(returnValue);
}
function VisitIfStatement(context, env) {
    // @ts-ignore
    var willExecute = Visit(context.condition, env).value == true;
    if (willExecute) {
        var newEnv = new Environment(env);
        for (var _i = 0, _a = context.body; _i < _a.length; _i++) {
            var expression = _a[_i];
            if (expression.kind == 'breakStatement') {
                break;
            }
            Visit(expression, newEnv);
        }
        return MK_NULL();
    }
    else if (context.condition.kind == 'identifier') {
        //@ts-ignore
        if (Visit(context.condition, env).value != MK_NULL()) {
            var newEnv = new Environment(env);
            for (var _b = 0, _c = context.body; _b < _c.length; _b++) {
                var expression = _c[_b];
                if (expression.kind == 'breakStatement') {
                    break;
                }
                Visit(expression, newEnv);
            }
            return MK_NULL();
        }
    }
    if (context.elseIfBlock) {
        if (context.elseIfBlock.ifBlock) {
            VisitIfStatement(context.elseIfBlock.ifBlock, env);
        }
        else if (!willExecute) {
            var newEnv = new Environment(env);
            for (var _d = 0, _e = context.elseIfBlock.body; _d < _e.length; _d++) {
                var expression = _e[_d];
                if (expression.kind == 'breakStatement') {
                    break;
                }
                Visit(expression, newEnv);
            }
        }
    }
    return MK_NULL();
}
function VisitWhileStatement(context, env) {
    // @ts-ignore
    var willExecute = Visit(context.condition, env).value == true;
    while (willExecute) {
        var newEnv = new Environment(env);
        for (var _i = 0, _a = context.body; _i < _a.length; _i++) {
            var expression = _a[_i];
            if (expression.kind == 'breakStatement') {
                break;
            }
            Visit(expression, newEnv);
        }
    }
    return MK_NULL();
}
function VisitDowhileStatement(context, env) {
    // @ts-ignore
    var willExecute = Visit(context.condition, env).value == true;
    do {
        var newEnv = new Environment(env);
        for (var _i = 0, _a = context.body; _i < _a.length; _i++) {
            var expression = _a[_i];
            if (expression.kind == 'breakStatement') {
                break;
            }
            Visit(expression, newEnv);
        }
    } while (willExecute);
    return MK_NULL();
}
function VisitWhenStatement(context, env) {
    for (var _i = 0, _a = context.triggers; _i < _a.length; _i++) {
        var trigger = _a[_i];
        env.createHandler(trigger.symbol, function () {
            var newEnv = new Environment(env);
            for (var _i = 0, _a = context.body; _i < _a.length; _i++) {
                var expression = _a[_i];
                Visit(expression, newEnv);
            }
        });
    }
    return MK_NULL();
}
function VisitListLiteral(context, env) {
    var values = [];
    context.values.forEach(function (i) {
        values.push(Visit(i, env));
    });
    return { type: "list", value: values };
}
function Visit(context, env) {
    switch (context.kind) {
        case 'integer':
            return {
                value: context.value,
                type: 'integer'
            };
        case 'floatLiteral':
            return {
                value: context.value,
                type: 'float'
            };
        case 'stringLiteral':
            return {
                value: context.value,
                type: 'string'
            };
        case 'boolLiteral':
            return {
                value: context.value,
                type: 'bool'
            };
        case 'null':
            return MK_NULL();
        case 'identifier':
            return VisitIdentifier(context, env);
        case 'objectLiteral':
            return VisitObjectExpression(context, env);
        case 'callExpression':
            return VisitCallExpression(context, env);
        case 'binaryExpression':
            return VisitBinaryExpression(context, env);
        case 'program':
            return VisitProgram(context, env);
        case 'variableDeclaration':
            return VisitVariableDeclaration(context, env);
        case 'assignmentExpression':
            return VisitAssignmentExpression(context, env);
        case 'functionDeclaration':
            return VisitFunctionDeclaration(context, env);
        case 'classDeclaration':
            return VisitClassDeclaration(context, env);
        case 'memberExpression':
            return VisitMemberExpression(context, env);
        case 'htmlStatement':
            return VisitHTMLStatement(context, env);
        case "elementDeclaration":
            return VisitElementDeclaration(context, env);
        case "repeatStatement":
            return VisitRepeatStatement(context, env);
        case "comparisonExpression":
            return VisitComparisonExpression(context, env);
        case "ifStatement":
            return VisitIfStatement(context, env);
        case "whileStatement":
            return VisitWhileStatement(context, env);
        case "dowhileStatement":
            return VisitDowhileStatement(context, env);
        case "whenStatement":
            return VisitWhenStatement(context, env);
        case "listLiteral":
            return VisitListLiteral(context, env);
        default:
            throw ("Unknown token: ".concat(context, " of type ").concat(context.kind));
    }
}
function VisitBinaryExpression(context, env) {
    var left = Visit(context.left, env);
    var right = Visit(context.right, env);
    if (left.type == 'integer') {
        if (right.type == 'integer')
            return VisitNumericBinaryExpression(left, right, context.operator);
        if (right.type == 'float')
            return VisitNumericBinaryExpression(left, right, context.operator);
    }
    else if (left.type == 'float') {
        if (right.type == 'integer')
            return VisitNumericBinaryExpression(left, right, context.operator);
        if (right.type == 'float')
            return VisitNumericBinaryExpression(left, right, context.operator);
    }
    return MK_NULL();
}
function VisitNumericBinaryExpression(left, right, operator) {
    var result = 0;
    switch (operator) {
        case '+':
            result = left.value + right.value;
            break;
        case '*':
            result = left.value * right.value;
            break;
        case '/':
            if (right.value == 0)
                throw ("Syntax error: Can not divide ".concat(left.value, " by 0"));
            result = left.value / right.value;
            break;
        case '-':
            result = left.value - right.value;
            break;
        case '%':
            result = left.value % right.value;
            break;
    }
    if (left.type == 'float' || right.type == 'float') {
        return { type: 'float', value: result };
    }
    return { type: 'integer', value: result };
}
function VisitProgram(context, env) {
    var lastEvaluated = MK_NULL();
    for (var _i = 0, _a = context.body; _i < _a.length; _i++) {
        var statement = _a[_i];
        lastEvaluated = Visit(statement, env);
    }
    return lastEvaluated;
}
function VisitIdentifier(context, env) {
    return env.lookUpVariable(context.symbol).value;
}
function VisitObjectExpression(obj, env) {
    var objects = { type: 'object', properties: new Map() };
    for (var _i = 0, _a = obj.properties; _i < _a.length; _i++) {
        var property = _a[_i];
        var key = property.key;
        var value = property.value;
        var type = property.type;
        var runtimeVal = (value == undefined) ? env.lookUpVariable(key) : Visit(value, env);
        //@ts-ignore
        objects.properties.set(key, { value: runtimeVal.value, type: type });
    }
    return objects;
}
function VisitFunctionCall(call, env) {
    var func;
    if (call.caller.kind != 'memberExpression') {
        func = env.lookupUserDefinedValue(call.caller.symbol);
    }
    else {
        func = env.lookUpVariable(call.caller.object.symbol).value.properties.get(call.caller.property.symbol);
        func.returnType = func.value.returnType;
    }
    for (var i = 0; i < func.value.params.length; i++) {
        var param = func.value.params[i];
        var arg = Visit(call.args[i], env);
        if (arg.type != param.type)
            throw "Cannot assign variable of type '".concat(arg.type, "' to '").concat(param.type, "'");
        env.declareVariable(param.name, arg, param.type);
    }
    for (var _i = 0, _a = func.value.body; _i < _a.length; _i++) {
        var expression = _a[_i];
        if (expression)
            Visit(expression, env);
    }
    var returnValue = Visit(func.value.returnStatement.returnValue, env);
    if (returnValue.type != func.returnType)
        if (func.returnType != 'any')
            throw "Cannot return type ".concat(returnValue.type, " as ").concat(func.returnType);
    return returnValue;
}
function VisitCallExpression(call, env) {
    var args = call.args.map(function (arg) { return Visit(arg, env); });
    var func = Visit(call.caller, env);
    if (func.type == 'userDefinedFunction') {
        return VisitFunctionCall(call, new Environment(env));
    }
    if (func.type != 'nativeFunction') {
        throw "'".concat(func, "' is not a function");
    }
    // @ts-ignore
    if (func.value) {
        // @ts-ignore
        func = func.value;
    }
    return func.call(args, env);
}
var Environment = /** @class */ (function () {
    function Environment(parentENV) {
        var isGlobal = !parentENV;
        this.parent = parentENV;
        this.variables = new Map();
        this.constants = new Map();
        this.functions = new Map();
        this.classes = new Map();
        this.userDefinedFunctions = new Map();
        this.handlers = new Map();
        this.elements = new Map();
        if (isGlobal)
            setupScope(this);
    }
    Environment.prototype.declareVariable = function (name, value, type, isConstant) {
        if (isConstant === void 0) { isConstant = false; }
        if (this.variables.has(name) || this.constants.has(name)) {
            throw "Variable ".concat(name, " is already declared");
        }
        if (!isConstant)
            this.variables.set(name, { value: value, type: type });
        else
            this.constants.set(name, { value: value, type: type });
        return value;
    };
    Environment.prototype.lookUpVariable = function (name) {
        var env = this.resolve(name);
        if (env.variables.has(name))
            return env.variables.get(name);
        else if (env.constants.has(name))
            return env.constants.get(name);
        if (env.functions.has(name))
            return { value: env.lookupFunction(name).value, type: env.lookupFunction(name).returnType };
        return { value: this.lookupUserDefinedValue(name).value, type: this.lookupUserDefinedValue(name).returnType };
    };
    Environment.prototype.assignVariable = function (name, value) {
        var env = this.resolve(name);
        if (env.variables.has(name))
            env.variables.set(name, { value: value, type: env.variables.get(name).type });
        else
            throw ("Variable '".concat(name, "' can not be reassigned"));
        if (env.handlers.has(name))
            env.handlers.get(name)();
        return value;
    };
    Environment.prototype.assignVariableType = function (name, type) {
        var env = this.resolve(name);
        if (env.variables.has(name))
            env.variables.set(name, { value: env.variables.get(name).value, type: type });
        else
            throw ("Variable '".concat(name, "' can not be reassigned"));
        return type;
    };
    Environment.prototype.createHandler = function (name, value) {
        if (this.handlers.has(name)) {
            throw "".concat(name, " already has a handler");
        }
        this.handlers.set(name, value);
        return value;
    };
    Environment.prototype.hasHandler = function (name) {
        return this.handlers.has(name);
    };
    Environment.prototype.isVariable = function (name) {
        if (this.variables.has(name))
            return true;
        else if (this.parent == undefined)
            return false;
        return this.parent.isVariable((name));
    };
    Environment.prototype.resolve = function (name) {
        if (this.variables.has(name)
            || this.constants.has(name)
            || this.functions.has(name)
            || this.userDefinedFunctions.has(name)
            || this.classes.has(name)
            || this.elements.has(name))
            return this;
        if (this.parent == undefined)
            throw ("'".concat(name, "' is undefined"));
        return this.parent.resolve(name);
    };
    Environment.prototype.declareFunction = function (name, value) {
        if (this.functions.has(name) || this.userDefinedFunctions.has(name)) {
            throw "Function '".concat(name, "' is already declared");
        }
        var returnType = value.returnType;
        this.functions.set(name, { value: value, returnType: returnType });
        return value;
    };
    Environment.prototype.declareUserDefinedFunction = function (name, body, returnType, params, returnStatement) {
        if (this.functions.has(name) || this.userDefinedFunctions.has(name)) {
            throw "Function '".concat(name, "' is already declared");
        }
        this.userDefinedFunctions.set(name, { value: { body: body, returnType: returnType, type: 'userDefinedFunction', params: params, returnStatement: returnStatement }, returnType: returnType });
        return MK_NULL();
    };
    Environment.prototype.lookupFunction = function (name) {
        var env = this.resolve(name);
        if (env.functions.has(name))
            return env.functions.get(name);
        throw "'".concat(name, "' is not a function");
    };
    Environment.prototype.lookupUserDefinedValue = function (name) {
        var env = this.resolve(name);
        if (env.userDefinedFunctions.has(name))
            return env.userDefinedFunctions.get(name);
        throw "'".concat(name, "' is not a function");
    };
    Environment.prototype.declareClass = function (name, value) {
        if (this.classes.has(name))
            throw "Class '".concat(name, "' is already declared");
        this.classes.set(name, value);
        return value;
    };
    Environment.prototype.lookupClass = function (name) {
        var env = this.resolve(name);
        if (env.classes.has(name))
            return env.classes.get(name);
        return undefined;
    };
    Environment.prototype.lookupElement = function (name) {
        var env = this.resolve(name);
        if (env.elements.has(name))
            return env.elements.get(name);
        return undefined;
    };
    Environment.prototype.declareElement = function (name, value) {
        if (this.elements.has(name))
            throw "Element '".concat(name, "' is already declared");
        this.elements.set(name, value);
        return value;
    };
    return Environment;
}());
function setupScope(env) {
    env.declareVariable('PI', MK_FLOAT(3.1415926535897932384626433832795028841971693993751058209749445923078164062862089986280348253421170679), 'float', true);
    env.declareVariable('null', MK_NULL(), 'null', true);
    env.declareVariable('true', MK_BOOL(true), 'bool', true);
    env.declareVariable('false', MK_BOOL(false), 'bool', true);
    function log(_args, _env) {
        _args.forEach(function (value) {
            if (value.type == 'object')
                // @ts-ignore
                console.log(value.properties);
            // @ts-ignore
            console.log(value.value);
        });
        return MK_NULL();
    }
    function run(_args, _env) {
        return __awaiter(this, void 0, void 0, function () {
            var fileName, code;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!_args[0])
                            throw "Expected 1 argument";
                        fileName = _args[0].value;
                        return [4 /*yield*/, readTextFile(fileName)];
                    case 1:
                        code = _a.sent();
                        return [2 /*return*/, evaluate(code)];
                }
            });
        });
    }
    function getTime(_args, _env) {
        return MK_INT(Date.now());
    }
    function range(_args, _env) {
        var values = [];
        // @ts-ignore
        var start = _args[1] ? _args[1].value : 0;
        // @ts-ignore
        var end = _args[0].value;
        // @ts-ignore
        var inc = _args[2] ? _args[2].value : 1;
        for (var i = start; i < end; i += inc) {
            values.push({ value: i, type: 'integer' });
        }
        return { type: 'list', value: values };
    }
    function js(_args, _env) {
        var fileName = _args[0].value;
        var code = readTextFile(fileName);
        eval("(async () => {" + code + "})()");
        return MK_NULL();
    }
    function on(_args, _env) {
        var select = _args[0].value;
        var event = _args[1].value;
        var handler = _args[2];
        // @ts-ignore
        if (handler.value)
            // @ts-ignore
            handler = handler.value;
        document.querySelector(select).addEventListener(event, function () {
            handler.body = handler.body.filter(function (e) { return e; });
            for (var _i = 0, _a = handler.body; _i < _a.length; _i++) {
                var expression = _a[_i];
                if (expression)
                    Visit(expression, env);
            }
            var returnValue = Visit(handler.returnStatement.returnValue, env);
            if (returnValue.type != handler.returnType)
                if (handler.returnType != 'any')
                    throw "Cannot return type ".concat(returnValue.type, " as ").concat(handler.returnType);
            return returnValue;
        });
        return MK_NULL();
    }
    function sizeOf(_args, _env) {
        return MK_INT(_args[0].value.length);
    }
    function getElement(_args, _env) {
        var element = document.querySelector(_args[0].value);
        var returnValue = new Map;
        // @ts-ignore
        // returnValue.set('value', { type: 'string', value: MK_STRING(element.value.toString()) });
        // returnValue.set('innerHTML', { type: 'string', value: MK_STRING(element.innerHTML) });
        // returnValue.set('id', { type: 'string', value: MK_STRING(element.id) });
        // returnValue.set('id', { type: 'string', value: MK_STRING(element.id) });
        for (var key_1 in element) {
            var val = element[key_1];
            if (typeof val == 'function')
                continue;
            returnValue.set(key_1, { type: 'any', value: MK_ANY_PURE(val) });
        }
        return MK_OBJECT(returnValue);
    }
    // @ts-ignore
    env.declareFunction('run', MK_NATIVE_FUNCTION(run, 'null'));
    env.declareFunction('log', MK_NATIVE_FUNCTION(log, 'null'));
    env.declareFunction('getTime', MK_NATIVE_FUNCTION(getTime, 'integer'));
    env.declareFunction('range', MK_NATIVE_FUNCTION(range, 'list'));
    env.declareFunction('js', MK_NATIVE_FUNCTION(js, 'any'));
    env.declareFunction('on', MK_NATIVE_FUNCTION(on, 'bool'));
    env.declareFunction('sizeOf', MK_NATIVE_FUNCTION(sizeOf, 'integer'));
    env.declareFunction('getElement', MK_NATIVE_FUNCTION(getElement, 'object'));
    var storage = new Map;
    function setItem(_args, _env) {
        localStorage.setItem(_args[0].value, _args[1].value);
        storage.set('length', { type: 'integer', value: MK_INT(localStorage.length) });
        return MK_NULL();
    }
    function getItem(_args, _env) {
        return MK_STRING(localStorage.getItem(_args[0].value));
    }
    function removeItem(_args, _env) {
        localStorage.removeItem(_args[0].value);
        storage.set('length', { type: 'integer', value: MK_INT(localStorage.length) });
        return MK_NULL();
    }
    function clear(_args, _env) {
        localStorage.clear();
        storage.set('length', { type: 'integer', value: MK_INT(localStorage.length) });
        return MK_NULL();
    }
    function key(_args, _env) {
        // @ts-ignore
        return MK_STRING(localStorage.key(_args[0].value));
    }
    storage.set('set', { type: 'nativeFunction', value: MK_NATIVE_FUNCTION(setItem, 'null') });
    storage.set('get', { type: 'nativeFunction', value: MK_NATIVE_FUNCTION(getItem, 'string') });
    storage.set('remove', { type: 'nativeFunction', value: MK_NATIVE_FUNCTION(removeItem, 'null') });
    storage.set('clear', { type: 'nativeFunction', value: MK_NATIVE_FUNCTION(clear, 'null') });
    storage.set('key', { type: 'nativeFunction', value: MK_NATIVE_FUNCTION(clear, 'string') });
    storage.set('length', { type: 'integer', value: MK_INT(localStorage.length) });
    env.declareVariable('localStorage', MK_OBJECT(storage), 'object', true);
}
//Main
var globalEnv = new Environment();
function evaluate(input, env) {
    if (env === void 0) { env = globalEnv; }
    var parser = new Parser();
    var program = parser.createAST(input);
    return Visit(program, env);
    //def george = {name: 'George', age: 30, child:{name:'Anna',age:14}};
}
exports.evaluate = evaluate;
var userAgent = navigator.userAgent;
var browserName;
if (userAgent.match(/chrome|chromium|crios/i)) {
    browserName = "chrome";
}
else if (userAgent.match(/firefox|fxios/i)) {
    browserName = "firefox";
}
else if (userAgent.match(/safari/i)) {
    browserName = "safari";
}
else if (userAgent.match(/opr\//i)) {
    browserName = "opera";
}
else if (userAgent.match(/edg/i)) {
    browserName = "edge";
}
else {
    browserName = "none";
}
if (browserName != 'none') {
    var cstags = document.getElementsByTagName('cscript');
    for (var i = 0; i < cstags.length; i++) {
        var tag = cstags[i];
        var code = '';
        tag.setAttribute('style', 'display: none');
        if (tag.getAttribute('src'))
            code = readTextFile("".concat(tag.getAttribute('src')));
        else {
            code = tag.innerHTML;
            code = decodeHTML(code);
        }
        console.time('Time');
        evaluate(code);
        console.timeEnd('Time');
    }
}
else {
    // while(true){
    //     const input = prompt('> ');
    //     if(input == 'exit')
    //         break;
    //
    //     runInstance(input);
    // }
    // @ts-ignore
    // const input = await Deno.readTextFile("./index.cp");
    //
    // runInstance(input);
}
