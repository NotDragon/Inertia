// Lexer

const lexerRules = [
	['stringliteral', /('.*')/g],
    ['def', /def/g],
    ['def', /int/g],
    ['def', /string/g],
    ['def', /float/g],
    ['def', /any/g],
    ['def', /object/g],
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

interface Token{
    lexer: string;
    value: string;
}

function readTextFile(file) {
    let rawFile = new XMLHttpRequest();
    let allText;
    rawFile.open('GET', file, false);
    rawFile.onreadystatechange = function ()
    {
        if(rawFile.readyState == 4)
        {
            if(rawFile.status == 200 || rawFile.status == 0)
            {
                allText = rawFile.responseText;
            }
        }
    }

    rawFile.send(null);
    return allText;
}
function decodeHTML(text) {
    return text
        .replace("&amp;", "&")
        .replace("&lt;", "<")
        .replace("&gt;", ">")
        .replace("&quot;", '"')
        .replace("#039;", "'")
    ;
}
function lex(code) {
    let tokens = [];
	
    let currentToken:string = '';

    let inHTML = false;
	let inPreprocessor = false;

    for (let i = 0; i < code.length; i++){
        let character = code[i];

        character.replace('\t', '');
        character.replace('\n', '');
		
        if (character == ';'
            ||character == ','
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
			|| character == '@'
        ){
            if(character == '.'){
                if(currentToken.match(/-?([0-9]+)/g)){
                    currentToken += character;
                    continue;
                }
            }
			else if(character == '{' && code[i + 1] == '{'){
				tokens.push('{{');
				i++;
				continue;
			}
			else if(character == '}' && code[i + 1] == '}'){
				tokens.push('}}');
				i++;
				continue;
			}
			else if(character == '=' && code[i + 1] == '='){
				tokens.push('==');
				i++;
				continue;
			}
			else if(character == '!' && code[i + 1] == '='){
				tokens.push('!=');
				i++;
				continue;
			}
			else if(character == '>' && code[i + 1] == '='){
				tokens.push('>=');
				i++;
				continue;
			}
			else if(character == '<' && code[i + 1] == '='){
				tokens.push('<=');
				i++;
				continue;
			}
			else if(character == '@' && !inPreprocessor){
				inPreprocessor = true;
			}
			else if(character == ';' && inPreprocessor){
				tokens.push(currentToken + ';');
				currentToken = '';
				inPreprocessor = false;
				continue;
			}
			
			if(inPreprocessor){
				currentToken += character;
				continue;
			}
			
            tokens.push(currentToken);
            tokens.push(character);
            currentToken = '';
        }else{
            currentToken += character;
        }

        if(i == code.length - 1){
            tokens.push(currentToken);
        }
    }
	
    let inQuotes = false;
    let quoteString = '';

    tokens = tokens.filter(e => e);
	
	for(let i = 0; i < tokens.length; i++){
		if(tokens[i].includes("'") && !inQuotes) {
			inQuotes = true;
		}else if(tokens[i].includes("'") && inQuotes){
			inQuotes = false;
			if(quoteString != ''){
				tokens[i] = quoteString + tokens[i];
				quoteString = '';
			}
		}
		
		if(inQuotes) {
			quoteString += tokens[i];
			tokens[i] = undefined;
		}
	}
	
	tokens = tokens.filter(e => e);
    for(let i = 0; i < tokens.length; i++){
        if(tokens[i].includes('{{') && !inHTML) {
            inHTML = true;
        }else if(tokens[i].includes('}}') && inHTML){
            inHTML = false;
        }

        if(inHTML && tokens[i].includes(' ')) {
            tokens[i] = tokens[i].replace(' ', '%20%$space');
        }
    }

    tokens = tokens.filter(e => e != '' && e != ' ' && e != '\n' && e != '\t' && e && e != '\r' && e != '');
	
    const returnValue = new Array<Token>();
	
    //lexer part
    for(let i = 0; i < tokens.length; i++) {
        let token = tokens[i];
        let lexer = token;

        for(let j = 0; j < lexerRules.length; j++) {
            if(token.match(lexerRules[j][1])) {
                lexer = lexerRules[j][0].toString().toUpperCase();
                break;
            }
        }

		if(lexer == 'STRINGLITERAL')
			tokens[i] = tokens[i].trim().slice(0, -1).slice(1);
		
        returnValue.push({ lexer, value: tokens[i].trim() });
    }
	
    returnValue.push({lexer: 'EOF', value: 'EOF'});
	
    return returnValue;
}

function preProcessor(lexer: Token[]){
	let preProcessors = [];
	lexer.forEach((value, i) => {
		if(value.lexer == 'PRE-PROCESSOR'){
			preProcessors.push(value.value);
			lexer[i] = undefined;
		}
	});
	
	lexer = lexer.filter(e => e);
	
	function processRunPreProcessor(args) {
		eval(readTextFile(args[0]));
	}

	
	for(const process of preProcessors){
		let tokens = process.split(/[ @;]/g).filter(e => e && e != '');
		let name = tokens[0];
		tokens = tokens.slice(1);
		
		switch(name){
			case 'run':
				processRunPreProcessor(tokens);
				break;
		}
	}
	
	
	
	return lexer;
}
//AST
type NodeType =
    // statements
    | 'program'
    | 'variableDeclaration'
    | 'functionDeclaration'
    | 'returnStatement'
    | 'classDeclaration'
    | 'htmlStatement'
	| 'elementDeclaration'
	| 'repeatStatement'
	| 'ifStatement'
	| 'breakStatement'
	| 'continueStatement'
	| 'elseIfStatement'
	| 'whileStatement'
	| 'dowhileStatement'
	| 'whenStatement'
	
	// expressions
    | 'constant'
    | 'identifier'
    | 'binaryExpression'
    | 'assignmentExpression'
    | 'memberExpression'
    | 'callExpression'
	| 'comparisonExpression'

    //literals
    | 'property'
    | 'objectLiteral'
    | 'integer'
    | 'floatLiteral'
    | 'boolLiteral'
    | 'stringLiteral'
    | 'null'
    ;

let isControl: NodeType[] = ['ifStatement', 'repeatStatement', 'functionDeclaration', 'classDeclaration', 'htmlStatement', 'elseIfStatement', 'whenStatement', "identifier"];
interface Statement {
    kind: NodeType;
}

interface Expression extends Statement{}

interface Program extends Statement{
	kind: 'program';
	body: Statement[];
}

interface Element extends Statement{
	kind: 'elementDeclaration';
	body: string;
	properties: string[];
	
	name: string;
}

interface VariableDeclaration extends Statement{
    kind: 'variableDeclaration';

    isNull: boolean;
    identifier: string;
    value?: Expression;
    type?: ValueType;
}

interface FunctionDeclaration extends Statement{
    kind: 'functionDeclaration';
    params: {type: ValueType, name: string}[];
    name: string;
    body: Statement[];
    returnType: ValueType;

    returnStatement: Statement;
}
interface ReturnStatement extends Statement{
    kind: 'returnStatement';
    returnValue: Expression;
}
interface HtmlStatement extends Statement{
    kind: 'htmlStatement';
    body: string;
}
interface RepeatStatement extends Statement{
	kind: 'repeatStatement';
	variableName: string;
	values: any[];
	body: Statement[];
	
	start: Expression,
	end: Expression,
	inc: Expression,
}

interface ClassDeclaration extends Statement{
    kind: 'classDeclaration';
    name: string;
    body: Statement[];
    init: Statement;
}
interface BinaryExpression extends Expression{
    kind: 'binaryExpression';
    left: Expression;
    right: Expression;
    operator: string;
}

interface CallExpression extends Expression{
    kind: 'callExpression';
    args?: Expression[];
    caller: Expression;
}

interface MemberExpression extends Expression{
    kind: 'memberExpression';
    object: Expression;
    property: Expression;
    computed: boolean;
}

interface AssignmentExpression extends Expression{
    kind: 'assignmentExpression';
    left: Expression;
    right: Expression;
    operator: '=' | '*=' | '/=' | '+=' | '-=' | '%=';
}

interface Identifier extends Expression{
    kind: 'identifier';
    symbol: string;
}

interface Integer extends Expression{
    kind: 'integer';
    value: number;
}

interface Float extends Expression{
    kind: 'floatLiteral';
    value: number;
}

interface Bool extends Expression{
    kind: 'boolLiteral';
    value: boolean;
}

interface StringLiteral extends Expression{
    kind: 'stringLiteral';
    value: string;
}

interface Property extends Expression{
    kind: 'property';
    key: string;
    type: ValueType;
    value?: Expression;
}

interface ObjectLiteral extends Expression{
    kind: 'objectLiteral';
    properties: Property[];
}

interface ComparisonExpression extends Expression{
	kind: 'comparisonExpression'
	operator: string;
	left: Expression;
	right: Expression;
}

interface ElseIfStatement extends Statement{
	kind: "elseIfStatement";
	ifBlock?: Statement;
	body: Statement[];
}

interface IfStatement extends Statement{
	kind: 'ifStatement';
	condition: Expression;
	body: Statement[];
	elseIfBlock?: ElseIfStatement;
}

interface WhileStatement extends Statement{
	kind: 'whileStatement';
	condition: Expression;
	body: Statement[];
}

interface DowhileStatement extends Statement{
	kind: 'dowhileStatement';
	condition: Expression;
	body: Statement[];
}
interface WhenStatement extends Statement{
	kind: 'whenStatement';
	triggers: Expression[];
	body: Statement[];
}

//Parser
class Parser{

    private tokens: Token[] = [];

    private notEOF(): boolean{
        if(this.tokens[0])
            return this.tokens[0].lexer != 'EOF';
        return false;
    }

    public createAST(sourceCode: string): Program{
        this.tokens = lex(sourceCode);
		this.tokens = preProcessor(this.tokens);

        const program: Program = {
            kind: 'program',
            body: []
        };

        while(this.notEOF()){
			let statement = this.parseStatement();
            program.body.push(statement);
			
			if(!isControl.includes(statement.kind))
				this.expect(';', `Expected ';' but got ${this.at().value}`);
        }
	
        return program;
    }

    private at(): Token {
        return this.tokens[0];
    }

    private eat(){
        return this.tokens.shift();
    }

    private expect(expected: string, err: any){
        let prev = this.eat();
        if(prev.lexer != expected || !prev)
            throw (err);

        return prev;
    }

    private parseStatement(): Statement{
        switch(this.at().lexer){
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
                return this.parseExpression()
        }
    }
    private parseExpression(): Expression{
        return this.parseAssignmentExpression();
    }

    private parseConstant(): Expression{
        const tk = this.at().lexer;
        switch(tk){
            case 'IDENTIFIER':
                return  { kind: 'identifier', symbol: this.eat().value } as Identifier;
            case 'INTEGER':
                return  { kind: 'integer', value: parseInt(this.eat().value) } as Integer;
            case 'FLOATLITERAL':
                return  { kind: 'floatLiteral', value: parseFloat(this.eat().value) } as Float;
            case 'BOOL':
                return  { kind: 'boolLiteral', value: this.eat().value == 'true' } as Bool;
            case 'STRINGLITERAL':
                return  { kind: 'stringLiteral', value: this.eat().value } as StringLiteral;
            case '(':
                this.eat();
                const value = this.parseExpression();
                this.expect(')', `Unexpected token: ${this.at().value}. Expected ')'`);
                return value;
            default:
                throw (`Unexpected token: ${this.at().value} of lexer ${this.at().lexer}`);
        }
    }

    private parseAdditiveExpression(): Expression{
        let left = this.parseMultiplicativeExpression();

        while(this.at().value == '+' || this.at().value == '-'){
            const operator = this.eat().value;
            const right = this.parseMultiplicativeExpression();

            left = {
                kind: 'binaryExpression',
                left,
                right,
                operator
            } as BinaryExpression
        }

        return left;
    }

    private parseMultiplicativeExpression(): Expression{
        let left = this.parseCallMemberExpression();

        while(this.at().value == '/' || this.at().value == '*' || this.at().value == '%'){
            const operator = this.eat().value;
            const right = this.parseCallMemberExpression();

            left = {
                kind: 'binaryExpression',
                left,
                right,
                operator
            } as BinaryExpression
        }

        return left;
    }

    // ((int)|(float)|(any)|(bool)|(string))|(def (:(int)|(float)|(any)|(bool)|(string))?) identifier(=expression)?;
    private parseVariableDeclaration(): Statement {
        let kw = this.eat();

        let type: ValueType = null;
        let identifier: string;
        let value: any = 'null';

        if(kw.value == 'def') {
            const secondToken = this.eat().value;

            if (secondToken == ':') {
                if(this.at().value != 'int') {
                    type = this.eat().value as ValueType;
                }
                else {
                    type = 'integer';
                    this.eat();
                }

                identifier = this.eat().value;
            } else
                identifier = secondToken;
        }else{
            if(kw.value != 'int')
                type = kw.value as ValueType;
            else
                type = 'integer';
            identifier = this.eat().value;
        }

        const operator = this.at();

        if(type){
            switch (type){
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
            }

            if(this.at().lexer == '='){
                this.eat();
                value = this.parseStatement();

                value.type = value.kind;

            }
        }else if(operator.lexer == '=') {
            this.eat();
            value = this.parseStatement();

            switch(value.kind){
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
                default:
                    type = 'null';
            }

            value.type = value.kind;
        }else{
            this.tokens[0] = operator;
        }
		
        if(value.type == 'string' || value.type == 'float' || value.type == 'bool'){
            value.type += 'Literal';
            value.kind = value.type;
        }
	
		return {
                kind: 'variableDeclaration',
                isNull: type == null,
                identifier: identifier,
                value: value == 'null'? null : value,
                type,
            } as VariableDeclaration;
        
    }

    private parseAssignmentExpression(): Statement {
        const left = this.parseComparisonExpression();
        const operator = this.at();

        if(operator.lexer == '='
            || operator.lexer == '+='
            || operator.lexer == '-='
            || operator.lexer == '*='
            || operator.lexer == '/='
            || operator.lexer == '%='){
            this.eat();
            const right = this.parseAssignmentExpression();

            return  { left, right, operator: operator.lexer, kind: 'assignmentExpression' } as AssignmentExpression;
        }

        return left;
    }

    private parseObjectExpression(): Statement {
        if(this.at().lexer != '{')
            return this.parseAdditiveExpression()

        this.eat();

        const properties = new Array<Property>();

        while(this.notEOF() && this.at().lexer != '}'){
            let type = this.expect('DEF', `Expected type, but got '${this.at()}'`).value;
            const key = this.expect('IDENTIFIER', 'Expected key of type IDENTIFIER').value;

            if(type == 'int')
                type = 'integer';

            if(this.at().lexer == ','){
                this.eat();
                properties.push({ key, kind: 'property', type } as Property);
                continue;
            } else if(this.at().lexer == '}'){
                properties.push({ key, kind: 'property', type } as Property);
                continue;
            } else if(this.at().lexer == ':'){
                this.eat();
                properties.push({ key, value: this.parseExpression(), kind: 'property', type } as Property);
                if(this.at().lexer != '}'){
                    this.expect(',', `Expected ','`);
                }
                continue;
            }

            const value = this.parseExpression();

            properties.push({ kind: 'property', value, key, type } as Property)

            if(this.at().lexer != '}'){
                this.expect(',', `Expected ','`);
            }
        }

        this.expect('}', `Expected '}'`);


        return { kind: 'objectLiteral', properties } as ObjectLiteral;
    }

    private parseCallMemberExpression(): Expression {
        const member = this.parseMemberExpression();
		
        if(this.at().lexer == '('){
            return this.parseCallExpression(member);
        }

        return member;
    }
    private parseArgs(): Expression[] {
        this.expect('(', `Expected '('`);
        const args = this.at().lexer == ')'
            ? []
            : this.parseArgsList();
		
        this.expect(')', `Expected ')' after function call`);

        return args;
    }
    private parseArgsList(): Expression[] {
        const args = [this.parseExpression()];

        while(this.at().lexer == ',' && this.eat()){
            args.push(this.parseAssignmentExpression());
        }

        return args;
    }
    private parseCallExpression(caller: Expression): Expression {
        let callExpression: Expression = {
            kind: 'callExpression',
            caller,
            args: this.parseArgs()
        }as CallExpression
		
        if(this.at().lexer == '('){
            callExpression = this.parseCallExpression(callExpression);
        }

        return callExpression;
    }
    private parseMemberExpression(): Expression{
        let object = this.parseConstant();

        while(this.at().lexer == '.' || this.at().lexer == '['){
            const operator = this.eat();
            let property: Expression;
            let computed: boolean;

            if(operator.lexer == '.'){
                computed = false;
                property = this.parseConstant();

                if(property.kind != 'identifier'){
                    throw  `Expected Identifier after dot operator. Instead got ${property}`;
                }
            }else{
                computed = true;
                property = this.parseExpression();
                this.expect(']', `Expected ']'`);
            }

            object = {
                kind: 'memberExpression',
                object,
                property,
                computed
            } as MemberExpression;
        }

        return object;
    }
	private parseBlock(): Statement[]{
		let body = []
		
		this.expect('{', `Expected '{'`);
		while(this.at().lexer != '}'){
			let statement = this.parseStatement()
			body.push(statement);
			if(!isControl.includes(statement.kind)){
				this.expect(';', `Expected ';' but got ${this.at().value}`);
			}
		}
		this.expect('}', `Expected '}'`);
		
		return body;
	}
    private parseFunctionDeclaration(): Statement {
        this.eat();
        let secondToken = this.eat();
        let name = '';
        let type: ValueType = 'any';
        let params: {type: ValueType, name: string}[] = [];

        if(secondToken.lexer == 'IDENTIFIER'){
            name = secondToken.value;
        }else if(secondToken.lexer == ':'){
            type = this.eat().value as ValueType;
            name = this.eat().value;
        }

        this.expect('(', `Expected '(' after function name or type`);

        if(this.at().lexer != ')') {
            do{
                let currentParamType = this.expect('DEF', `Expected parameter type, but got ${this.at()}`).value;
                const currentParamName = this.expect('IDENTIFIER', `Expected parameter name , but got ${this.at()}`).value;

                if(currentParamType == 'int')
                    currentParamType = 'integer';
                params.push({type: currentParamType as ValueType, name: currentParamName});
            }
            while (this.at().lexer == ',' && this.eat());
        }

        this.expect(')', `Expected ')' after function name or type`);
		
		let body = this.parseBlock();

        let returnStatement: Expression = body[body.length - 1];
        body[body.length - 1] = undefined;

        return {
            kind: 'functionDeclaration',
            params,
            name,
            returnType: type,
            body,
            returnStatement
        } as FunctionDeclaration;
    }

    private parseReturnStatement(): Statement {
        this.eat();
        return { kind: "returnStatement", returnValue: this.parseStatement() } as ReturnStatement;
    }

    private parseClassDeclaration(): Statement {
        this.eat();
        const name = this.eat().value;
        let body = new Array<Statement>()
        this.expect('{', `Expected '{' in class declaration`);

        while(this.at().lexer != '}'){
            body.push(this.parseClassBody());
        }

        this.expect('}', `Expected '}' at the end of class declaration`);

        return {kind: 'classDeclaration', body, name} as ClassDeclaration;
    }

    private parseClassBody() {
        switch(this.at().lexer){
            case 'DEF':
                return this.parseVariableDeclaration();
            case 'FUNC':
                return this.parseFunctionDeclaration();
            default:
               throw `Unknown token ${this.at().value} of type ${this.at().lexer}`;
        }
    }

    private parseHTMLStart(): Statement {
        let body: string = '';
        
        this.eat();
        while(this.at().lexer != 'HTMLEND'){
            body += this.eat().value;
        }
        this.eat();
        
        return {kind: 'htmlStatement', body} as HtmlStatement;
    }
	
	private parseElementDeclaration(): Statement {
		this.eat();
		
		let name = this.eat().value;
		let properties = [];
		let body = [];
		
		this.expect('(', `Expected '('`);
		
		while(this.at().lexer != ')'){
			properties.push(this.eat().value);
			
			if(this.at().lexer != ')')
				this.expect(',', `Expected ','`)
		}
		this.eat();
		
		this.expect('HTMLSTART', `Expected '{'`)
		
		while(this.at().lexer != 'HTMLEND'){
			body.push(this.eat().value);
		}
		this.eat();
		
		return { kind: "elementDeclaration", name, properties, body: body.join(' ') } as Element;
	}


	//repeat(10)/repeat(10: i)/repeat(10: i = 0)/repeat(10: i = 0; 1)/repeat([1, 2, 3])/repeat([1, 2, 3]: i)
	private parseRepeatStatement(): Statement {
		this.eat();
		this.expect('(', `Expected '(' after repeat`);
		let values = [];
		let name = '';
		let end;
		let start;
		let inc;
		
		if(this.at().lexer == '['){
			this.eat();
			while(this.at().lexer != ']'){
				values.push(this.parseExpression());
				
				if(this.at().lexer != ']'){
					this.expect(',', `Expected ',' between values`);
				}
			}
			this.eat();
			
			if(this.at().lexer == ':'){
				this.eat();
				name = this.eat().value;
			}
		}else{
			end = this.parseExpression();
			if(this.at().lexer == ':'){
				this.eat();
				name = this.eat().value;
				if(this.at().lexer == '='){
					this.eat();
					start = this.parseExpression();
				}
			}
			
			if(this.at().lexer == ';'){
				this.eat();
				inc = this.parseExpression();
			}
		}
		
		this.expect(')', `Expected ')' after repeat`);
		
		let body = this.parseBlock();
		
		return {kind: "repeatStatement", variableName: name, end, start, inc, values, body} as RepeatStatement;
	}
	
	private parseComparisonExpression(): Expression {
		let left = this.parseObjectExpression();
		
		let operator = this.at().lexer;
		
		if(operator == '==' || operator == '!=' || operator == '>' || operator == '<' || operator == '>=' || operator == '<='){
			this.eat();
			let right = this.parseObjectExpression();
			return { kind: "comparisonExpression", left, right, operator } as ComparisonExpression;
		}
		
		return left;
	}
	
	private parseIfStatement() : Statement{
		this.eat();
		this.expect('(', `expected '(' after if`);
		let elseIf: Statement;
		
		let condition = this.parseExpression();
		
		
		this.expect(')', `expected ')' after if`);
		
		let body = this.parseBlock();
		
		if(this.at().lexer == 'ELSE') {
			elseIf = this.parseElseIfStatement();
		}
		
		return { kind: "ifStatement", body, condition, elseIfBlock: elseIf } as IfStatement;
	}
	
	private parseBreakStatement(): Statement {
		this.eat();
		
		return { kind: "breakStatement" }
	}
	
	private parseContinueStatement(): Statement {
		this.eat();
		
		return { kind: "continueStatement" }
	}
	
	private parseElseIfStatement(): Statement {
		this.eat();
		let ifBlock: IfStatement;
		let body: Statement[] = [];
		
		if(this.at().lexer == 'IF'){
			ifBlock = this.parseIfStatement() as IfStatement;
		}else{
			this.expect('{', `Expected '{' after else block`);
			while(this.at().lexer != '}'){
				body.push(this.parseStatement());
			}
			this.eat();
		}
		
		return { kind: "elseIfStatement", body, ifBlock } as ElseIfStatement;
	}
	
	private parseWhile(): Statement {
		this.eat();
		this.expect('(', `expected '(' after if`);
		let elseIf: Statement;
		
		let condition = this.parseExpression();
		
		
		this.expect(')', `expected ')' after if`);
		
		let body = this.parseBlock();
		
		return { kind: "whileStatement", body, condition } as WhileStatement;
	}
	
	private parseDowhile() {
		this.eat();
		this.expect('(', `expected '(' after if`);
		let elseIf: Statement;
		
		let condition = this.parseExpression();
		
		
		this.expect(')', `expected ')' after if`);
		
		let body = this.parseBlock();
		
		return { kind: "dowhileStatement", body, condition } as DowhileStatement;
	}
	
	private parseWhenStatement(): Statement {
		this.eat();
		let triggers = [];
		
		this.expect('(', `Expected '(' after when statement`);
		
		while(this.at().lexer != ')'){
			triggers.push(this.parseStatement());
			
			if(this.at().lexer != ')'){
				this.expect(',', `Expected ',' between values`);
			}
		}
		
		this.expect(')', `Expected ')' after when statement`);
		
		let body = this.parseBlock();
		
		return { kind: "whenStatement", triggers, body } as WhenStatement;
	}
}

//values
type ValueType = 'null' | 'integer' | 'float' | 'string' | 'bool' | 'any' | 'object' | 'nativeFunction' | 'userDefinedFunction' | 'class' | 'element';

interface RuntimeValue{
    type: ValueType
}

interface NullValue extends RuntimeValue{
    type: 'null';
    value: null;
}

interface IntegerValue extends RuntimeValue{
    type: 'integer';
    value: number;
}

interface ObjectValue extends RuntimeValue{
    type: 'object';
    properties: Map<string, { type: ValueType, value: RuntimeValue }>;
}

interface FloatValue extends RuntimeValue{
    type: 'float';
    value: number;
}

interface StringValue extends RuntimeValue{
    type: 'string';
    value: string;
}

interface BoolValue extends RuntimeValue{
    type: 'bool';
    value: boolean;
}
interface AnyValue extends RuntimeValue{
	type: 'any';
	value: any;
}


type FunctionCall = (args: RuntimeValue[], env: Environment) => RuntimeValue;
interface NativeFunctionValue extends RuntimeValue{
    type: 'nativeFunction';
    call: FunctionCall;
    returnType: ValueType;
}

interface UserDefinedFunctionValue extends RuntimeValue{
    type: 'userDefinedFunction';
    body: Expression[];
    params: {type: ValueType, name: string}[];
    returnType: ValueType;
    returnStatement: Statement;
}

interface ClassValue extends RuntimeValue{
    type: 'class';
    body: Statement[];
    init: Statement;
}

interface ElementValue extends RuntimeValue{
	type: 'element';
	body: string;
	properties: Map<string, string>;
}

function MK_FLOAT(n: number = 0.0): RuntimeValue{
    return { type: 'float', value: n } as FloatValue;
}
function MK_INT(n: number = 0): RuntimeValue{
    return { type: 'integer', value: n } as IntegerValue;
}
function MK_STRING(s: string = ''): RuntimeValue{
    return { type: 'string', value: s } as StringValue;
}
function MK_BOOL(n: boolean = false): RuntimeValue{
    return { type: 'bool', value: n} as BoolValue;
}
function MK_OBJECT(properties: Map<string, { type: ValueType, value: RuntimeValue }> = new Map<string, { type: ValueType, value: RuntimeValue }>()): RuntimeValue{
    return { type: 'object', properties } as ObjectValue;
}
function MK_NATIVE_FUNCTION(call: (args, scope) => RuntimeValue, returnType: ValueType): NativeFunctionValue{
    return { type: 'nativeFunction', call, returnType } as NativeFunctionValue;
}
function MK_NULL(): RuntimeValue{
    return { type: 'null', value: null } as NullValue;
}
function MK_ANY(value: any): RuntimeValue{
	return { type: 'any', value: value.value } as AnyValue;
}


//interpreter
function VisitVariableDeclaration(context: VariableDeclaration, env: Environment): RuntimeValue {
    let value = context.value
        ? Visit(context.value, env)
        : MK_NULL();

    if(
        context.type != 'integer'
        && context.type != 'float'
        && context.type != 'string'
        && context.type != 'bool'
        && context.type != 'object'
        && context.type != 'null'){
        if(env.lookupClass(context.type)){
            const className = env.lookupClass(context.type);

            let map = new Map<string, {type: ValueType, value: RuntimeValue}>();

            for(let statement of className.body){
                if(statement.kind == 'variableDeclaration'){
                    map.set((statement as VariableDeclaration).identifier, {value: Visit((statement as VariableDeclaration).value, env), type: (statement as VariableDeclaration).type})
                }else if(statement.kind == 'functionDeclaration'){
                    map.set(
                        (statement as FunctionDeclaration).name,
                        {value: {
                            body: (statement as FunctionDeclaration).body,
                            params: (statement as FunctionDeclaration).params,
                            returnStatement: (statement as FunctionDeclaration).returnStatement,
                            returnType: (statement as FunctionDeclaration).returnType,
                            type: 'userDefinedFunction'} as UserDefinedFunctionValue,
                        type: (statement as VariableDeclaration).type})
                }
            }
            value = MK_OBJECT(map);
        }else
            throw `Unknown type '${context.type}'`;
    }else if(value.type != context.type && context.type != 'null')
        throw `Can not assign value of type ${value.type} to ${context.type}`

	//@ts-ignore
    return env.declareVariable(context.identifier, value, context.type,  false);
}

function VisitAssignmentExpression(context: AssignmentExpression, env: Environment): RuntimeValue {
    if(context.left.kind != 'identifier' && context.left.kind != 'memberExpression')
        throw `Invalid left value type in ${JSON.stringify(context.left)}`;

    if(context.left.kind != 'memberExpression') {
        const name = (context.left as Identifier).symbol;
        const value = Visit(context.right, env);

        if (env.lookUpVariable(name).type == null) {
            env.assignVariableType(name, value.type);
        } else if (env.lookUpVariable(name).type != value.type)
            throw `Cannot assign type ${value.type} to type ${env.lookUpVariable(name)[1]}`

        if (context.operator == '=')
            return env.assignVariable(name, value);
        const currentValue = env.lookUpVariable(name).value;
        if (currentValue.type == 'integer') {
            if (context.operator == '+=')
                return env.assignVariable(name, {
                    type: value.type,
                    value: (value as IntegerValue).value + (currentValue as FloatValue).value
                } as IntegerValue);
            else if (context.operator == '-=')
                return env.assignVariable(name, {
                    type: value.type,
                    value: (value as IntegerValue).value - (currentValue as FloatValue).value
                } as IntegerValue);
            else if (context.operator == '*=')
                return env.assignVariable(name, {
                    type: value.type,
                    value: (value as IntegerValue).value * (currentValue as FloatValue).value
                } as IntegerValue);
            else if (context.operator == '/=')
                return env.assignVariable(name, {
                    type: value.type,
                    value: (value as IntegerValue).value / (currentValue as FloatValue).value
                } as IntegerValue);
            else if (context.operator == '%=')
                return env.assignVariable(name, {
                    type: value.type,
                    value: (value as IntegerValue).value % (currentValue as FloatValue).value
                } as IntegerValue);
        } else {
            if (context.operator == '+=')
                return env.assignVariable(name, {
                    type: value.type,
                    value: (value as FloatValue).value + (currentValue as FloatValue).value
                } as FloatValue);
            else if (context.operator == '-=')
                return env.assignVariable(name, {
                    type: value.type,
                    value: (value as FloatValue).value - (currentValue as FloatValue).value
                } as FloatValue);
            else if (context.operator == '*=')
                return env.assignVariable(name, {
                    type: value.type,
                    value: (value as FloatValue).value * (currentValue as FloatValue).value
                } as FloatValue);
            else if (context.operator == '/=')
                return env.assignVariable(name, {
                    type: value.type,
                    value: (value as FloatValue).value / (currentValue as FloatValue).value
                } as FloatValue);
            else if (context.operator == '%=')
                return env.assignVariable(name, {
                    type: value.type,
                    value: (value as FloatValue).value % (currentValue as FloatValue).value
                } as FloatValue);
        }
    }else {
        const name = ((context.left as MemberExpression).object as Identifier).symbol

        const properties = (env.lookUpVariable(name).value as ObjectValue).properties;
        const property = ((context.left as MemberExpression).property as Identifier).symbol;
        const value = Visit(context.right, env);

        if(context.operator == '='){
            properties.set(property, {type: value.type, value: value});
        }

        return env.assignVariable(name, {type: 'object', properties} as ObjectValue);
    }
}

function VisitFunctionDeclaration(context: FunctionDeclaration, env: Environment): RuntimeValue {
    env.declareUserDefinedFunction(context.name, context.body, context.returnType, context.params, context.returnStatement);

    return env.lookupUserDefinedValue(context.name).value as UserDefinedFunctionValue;
}

function VisitClassDeclaration(context: ClassDeclaration, env: Environment): RuntimeValue {
    env.declareClass(context.name, { body: context.body } as ClassValue);

    return MK_NULL();
}

function VisitMemberExpression(context: MemberExpression, env: Environment): RuntimeValue {
    let object: ObjectValue = env.lookUpVariable((context.object as Identifier).symbol).value as ObjectValue;

    return object.properties.get((context.property as Identifier).symbol);
}

function VisitHTMLStatement(context: HtmlStatement, env: Environment): RuntimeValue {
	// @ts-ignore
    let text = context.body.replaceAll('%20%$space', ' ');
	
	for(let i = 0; i < text.length; i++){
		let currentVarName = '';
		if(text[i] == '{'){
			text = text.split('');
			text[i] = '';
			i++;
			while(text[i] != '}'){
				currentVarName += text[i];
				text[i] = '';
				i++;
			}
			
			if(currentVarName.trim()[0] == '<'){
				let elementName = '';
				let tokens  = currentVarName.trim().split(/ |"/g);
				let properties = new Map<string, string>();
				
				elementName = tokens[0].slice(1);
				
				for(let j = 1; j < tokens.length; j++){
					if(tokens[j] == '>')
						break;
					else if(!tokens[j])
						continue;
					
					let name = tokens[j].slice(0, -1);
					let value = tokens[++j];
					
					if(value.trim()[0] == '(' && value.trim()[value.trim().length - 1] == ')'){
						// @ts-ignore
						value = evaluate(value.slice(0, -1).slice(1), env).value.value;
					}
					
					properties.set(name, value);
				}
				
				let element = env.lookupElement(elementName);
				
				if(properties.size < element.properties.size){
					throw `Too few properties were given`;
				}else if(properties.size > element.properties.size){
					throw `Too many properties were given`;
				}
				
				// @ts-ignore
				let body = element.body.replaceAll(' ', '');
				// @ts-ignore
				body = body.replaceAll('%20%$space', ' ');
				
				properties.forEach((value: string, key: string) => {
					// @ts-ignore
					body = body.replaceAll(eval(`/{ *${key} *}/g`), value);
				});
				
				text[i] = `<div class="${elementName}_element"> ${body} </div>`;
				text = text.join('');
				
			}else {
				// @ts-ignore
				text[i] = `<span class="${currentVarName.trim()}_value"> ${evaluate(currentVarName.trim(), env).value} </span>`;
				text = text.join('');
				
				if (!env.hasHandler(currentVarName.trim()) && env.isVariable(currentVarName.trim())) {
					
					env.createHandler(currentVarName.trim(), () => {
						let elements = document.getElementsByClassName(`${currentVarName.trim()}_value`);
						
						for (let i = 0; i < elements.length; i++) {
							// @ts-ignore
							elements[i].innerHTML = env.lookUpVariable(currentVarName.trim()).value.value;
						}
					});
				}
			}
		}
	}
	
    document.getElementsByTagName('display')[0].innerHTML += text

    return MK_STRING(context.body);
}

function VisitElementDeclaration(context: Element, env: Environment): RuntimeValue {
	let properties = new Map<string, string>;
	for(let key of context.properties){
		properties.set(key, '');
	}
	
	env.declareElement(context.name,
		{type: "element", body: context.body, properties} as ElementValue
	)
	
	return undefined;
}

function VisitRepeatStatement(context: RepeatStatement, env: Environment): RuntimeValue {
	let variableName: string;
	
	variableName = context.variableName? context.variableName: 'i';
	
	if(context.end){
		let start = context.start? Visit(context.start, env): MK_INT();
		let inc = context.inc? Visit(context.inc, env): MK_INT(1);
		let end = Visit(context.end, env);
		
		//@ts-ignore
		for(let i = start.value; i < end.value; i += inc.value){
			let newEnv = new Environment(env);
			newEnv.declareVariable(variableName, MK_INT(i), 'integer');
			
			for(let statement of context.body){
				if(statement.kind == 'breakStatement') {
					//@ts-ignore
					i = end.value;
					break;
				}
				if(statement.kind == 'returnStatement'){
					//@ts-ignore
					i += inc.value;
					break;
				}
				Visit(statement, newEnv);
			}
		}
	}else{
		for(let i of context.values){
			let newEnv = new Environment(env);
			newEnv.declareVariable(variableName, MK_ANY(Visit(i, newEnv)), 'any');
			
			for(let statement of context.body){
				Visit(statement, newEnv);
			}
		}
	}
	
	return MK_NULL();
}

function VisitComparisonExpression(context: ComparisonExpression, env: Environment): RuntimeValue {
	let returnValue = false;
	let left = Visit(context.left, env);
	let right = Visit(context.right, env);
	switch (context.operator){
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

function VisitIfStatement(context: IfStatement, env: Environment): RuntimeValue {
	// @ts-ignore
	let willExecute = Visit(context.condition, env).value == true;
	
	if(willExecute){
		let newEnv = new Environment(env)
		for(let expression of context.body){
			if(expression.kind == 'breakStatement'){
				break;
			}
			Visit(expression, newEnv);
		}
		return MK_NULL();
	}
	else if(context.condition.kind == 'identifier'){
		//@ts-ignore
		if(Visit(context.condition, env).value != MK_NULL()){
			let newEnv = new Environment(env)
			for(let expression of context.body){
				if(expression.kind == 'breakStatement'){
					break;
				}
				Visit(expression, newEnv);
			}
			return MK_NULL();
		}
	}
	
	if(context.elseIfBlock){
		if(context.elseIfBlock.ifBlock){
			VisitIfStatement(context.elseIfBlock.ifBlock as IfStatement, env);
		}else if(!willExecute){
			
			let newEnv = new Environment(env)
			for(let expression of context.elseIfBlock.body){
				if(expression.kind == 'breakStatement'){
					break;
				}
				Visit(expression, newEnv);
			}
		}
	}
	
	return MK_NULL();
}

function VisitWhileStatement(context: WhileStatement, env: Environment): RuntimeValue {
	// @ts-ignore
	let willExecute = Visit(context.condition, env).value == true;
	
	while(willExecute){
		let newEnv = new Environment(env)
		for(let expression of context.body){
			if(expression.kind == 'breakStatement'){
				break;
			}
			Visit(expression, newEnv);
		}
	}
	
	return MK_NULL();
}

function VisitDowhileStatement(context: WhileStatement, env: Environment): RuntimeValue {
	// @ts-ignore
	let willExecute = Visit(context.condition, env).value == true;
	
	do{
		let newEnv = new Environment(env)
		for(let expression of context.body){
			if(expression.kind == 'breakStatement'){
				break;
			}
			Visit(expression, newEnv);
		}
	}
	while(willExecute);
	
	
	return MK_NULL();
}

function VisitWhenStatement(context: WhenStatement, env: Environment): RuntimeValue {
	for(const trigger of context.triggers){
		env.createHandler((trigger as Identifier).symbol, () => {
			let newEnv = new Environment(env)
			for(const expression of context.body){
				Visit(expression, newEnv);
			}
		});
	}
	
	return MK_NULL();
}

function Visit(context: Statement, env: Environment): RuntimeValue {
    switch (context.kind){
        case 'integer':
            return {
                value: (context as Integer).value,
                type: 'integer'
            } as IntegerValue;

        case 'floatLiteral':
            return {
                value: (context as Float).value,
                type: 'float'
            } as FloatValue;

        case 'stringLiteral':
            return {
                value: (context as StringLiteral).value,
                type: 'string'
            } as StringValue;

        case 'boolLiteral':
            return {
                value: (context as Bool).value,
                type: 'bool'
            } as BoolValue;

        case 'null':
            return MK_NULL();

        case 'identifier':
            return VisitIdentifier(context as Identifier, env);

        case 'objectLiteral':
            return VisitObjectExpression(context as ObjectLiteral, env);

        case 'callExpression':
            return VisitCallExpression(context as CallExpression, env);

        case 'binaryExpression':
            return VisitBinaryExpression(context as BinaryExpression, env);

        case 'program':
            return VisitProgram(context as Program, env);

        case 'variableDeclaration':
            return VisitVariableDeclaration(context as VariableDeclaration, env);

        case 'assignmentExpression':
            return VisitAssignmentExpression(context as AssignmentExpression, env);

        case 'functionDeclaration':
            return VisitFunctionDeclaration(context as FunctionDeclaration, env);

        case 'classDeclaration':
            return VisitClassDeclaration(context as ClassDeclaration, env);

        case 'memberExpression':
            return VisitMemberExpression(context as MemberExpression, env);

        case 'htmlStatement':
            return VisitHTMLStatement(context as HtmlStatement, env);
	
		case "elementDeclaration":
			return VisitElementDeclaration(context as Element, env);
	
		case "repeatStatement":
			return VisitRepeatStatement(context as RepeatStatement, env);
			
		case "comparisonExpression":
			return VisitComparisonExpression(context as ComparisonExpression, env);
	
		case "ifStatement":
			return VisitIfStatement(context as IfStatement, env);
	
		case "whileStatement":
			return VisitWhileStatement(context as WhileStatement, env);
			
		case "dowhileStatement":
			return VisitDowhileStatement(context as WhileStatement, env);
	
		case "whenStatement":
			return VisitWhenStatement(context as WhenStatement, env);
	
		default:
            throw (`Unknown token: ${context} of type ${context.kind}`);
    }
}

function VisitBinaryExpression(context: BinaryExpression, env: Environment): RuntimeValue {
    const left = Visit(context.left, env) as RuntimeValue;
    const right = Visit(context.right, env) as RuntimeValue;

    if(left.type == 'integer') {
        if (right.type == 'integer')
            return VisitNumericBinaryExpression(left as IntegerValue, right as IntegerValue, context.operator);
        if (right.type == 'float')
            return VisitNumericBinaryExpression(left as IntegerValue, right as FloatValue, context.operator);
    }
    else if(left.type == 'float') {
        if (right.type == 'integer')
            return VisitNumericBinaryExpression(left as FloatValue, right as IntegerValue, context.operator);
        if (right.type == 'float')
            return VisitNumericBinaryExpression(left as FloatValue, right as FloatValue, context.operator);
    }


    return MK_NULL();
}
function VisitNumericBinaryExpression(left: IntegerValue | FloatValue, right: IntegerValue | FloatValue, operator: string): IntegerValue | FloatValue{
    let result = 0;

    switch (operator){
        case '+':
            result = left.value + right.value;
            break;
        case '*':
            result = left.value * right.value;
            break;
        case '/':
            if(right.value == 0)
                throw (`Syntax error: Can not divide ${left.value} by 0`);
            result = left.value / right.value;
            break;
        case '-':
            result = left.value - right.value;
            break;
        case '%':
            result = left.value % right.value;
            break;
    }

    if(left.type == 'float' || right.type == 'float'){
        return { type: 'float', value: result } as FloatValue;
    }

    return { type: 'integer', value: result } as IntegerValue;
}
function VisitProgram(context: Program, env: Environment): RuntimeValue{
    let lastEvaluated: RuntimeValue = MK_NULL();

    for(const statement of context.body){
        lastEvaluated = Visit(statement, env);
    }

    return lastEvaluated;
}
function VisitIdentifier(context: Identifier, env: Environment): RuntimeValue{
    return  env.lookUpVariable(context.symbol).value;
}

function VisitObjectExpression(obj: ObjectLiteral, env: Environment): RuntimeValue{
    const objects = { type: 'object', properties: new Map() } as ObjectValue;

    for(const property of obj.properties){
        const key = property.key;
        const  value = property.value;
        const  type = property.type;
        const runtimeVal = (value == undefined) ? env.lookUpVariable(key) : Visit(value, env);

        objects.properties.set(key, {value: runtimeVal, type});
    }

    return objects;
}

function VisitFunctionCall(call: CallExpression, env: Environment): RuntimeValue {
    const func = env.lookupUserDefinedValue((call.caller as Identifier).symbol) as UserDefinedFunctionType;

    for(let i = 0; i < func.value.params.length; i++) {
        let param = func.value.params[i];
        let arg = Visit(call.args[i], env);

        if(arg.type != param.type)
            throw `Cannot assign variable of type '${arg.type}' to '${param.type}'`

        env.declareVariable(param.name, arg, param.type);
    }

    for(const expression of func.value.body) {
        if(expression)
            Visit(expression, env);
    }
	
    let returnValue = Visit((func.value.returnStatement as ReturnStatement).returnValue, env)

    if(returnValue.type != func.returnType)
        if(func.returnType != 'any')
            throw `Cannot return type ${returnValue.type} as ${func.returnType}`;

    return returnValue;
}

function VisitCallExpression(call: CallExpression, env: Environment): RuntimeValue{
    const args = call.args.map((arg) => Visit(arg, env));
    const func = Visit(call.caller, env);

    if(func.type == 'userDefinedFunction'){
        return VisitFunctionCall(call, new Environment(env));
    }

    if(func.type != 'nativeFunction'){
        throw `'${func}' is not a function`;
    }

    let result = (func as NativeFunctionValue).call(args, env);
    
    return result;
}


//Environment
interface Variable{
    value: RuntimeValue;
    type: ValueType;
}

interface FunctionType{
    value: NativeFunctionValue;
    returnType: ValueType;
}
interface UserDefinedFunctionType{
	value: UserDefinedFunctionValue;
	returnType: ValueType;
}

class Environment {
    private readonly parent?: Environment;

    private variables: Map<string, Variable>;
    private constants: Map<string, Variable>;

    private functions: Map<string, FunctionType>;
    private userDefinedFunctions: Map<string, UserDefinedFunctionType>;

	private handlers: Map<string, Function>;
	
    private classes: Map<string, ClassValue>;
	
	private elements: Map<string, ElementValue>;
    constructor(parentENV?: Environment) {
        const isGlobal = !parentENV;
        this.parent = parentENV;
        this.variables = new Map();
        this.constants = new Map();
        this.functions = new Map();
        this.classes = new Map();
		this.userDefinedFunctions = new Map();
		this.handlers = new Map();
		this.elements = new Map();

        if(isGlobal)
            setupScope(this);
    }

    public declareVariable(name: string, value: RuntimeValue, type: ValueType, isConstant: boolean = false): RuntimeValue{
        if(this.variables.has(name) || this.constants.has(name)){
            throw `Variable ${name} is already declared`;
        }

        if(!isConstant)
            this.variables.set(name, { value, type });
        else
            this.constants.set(name, { value, type });

        return value;
    }

    public lookUpVariable(name: string): Variable{
        const env = this.resolve(name);

        if(env.variables.has(name))
            return env.variables.get(name);
        else if(env.constants.has(name))
            return env.constants.get(name);


        if(env.functions.has(name))
            return { value: env.lookupFunction(name).value, type: env.lookupFunction(name).returnType };

        return { value: this.lookupUserDefinedValue(name).value, type: this.lookupUserDefinedValue(name).returnType };
    }

    public assignVariable(name: string, value: RuntimeValue): RuntimeValue{
        const env = this.resolve(name);

        if(env.variables.has(name))
            env.variables.set(name, { value, type: env.variables.get(name).type} );
        else
            throw (`Variable '${name}' can not be reassigned`);
		
		if(env.handlers.has(name))
			env.handlers.get(name)();
		
        return value;
    }

    public assignVariableType(name: string, type: ValueType): ValueType{
        const env = this.resolve(name);

        if(env.variables.has(name))
            env.variables.set(name, { value: env.variables.get(name).value, type });
        else
            throw (`Variable '${name}' can not be reassigned`);
		
        return type;
    }
	
	public createHandler(name: string, value: Function): Function{
		if(this.handlers.has(name)){
			throw `${name} already has a handler`
		}
		
		this.handlers.set(name, value);
		
		return value;
	}
	public hasHandler(name: string){
		return this.handlers.has(name);
	}
	
	public isVariable(name: string){
		if(this.variables.has(name))
			return true;
		else if(this.parent == undefined)
			return false;
		
		return this.parent.isVariable((name));
	}
	
    public resolve(name: string): Environment{
        if(
			this.variables.has(name)
			|| this.constants.has(name)
			|| this.functions.has(name)
			|| this.userDefinedFunctions.has(name)
			|| this.classes.has(name)
			|| this.elements.has(name)
		)
            return this;
        if(this.parent == undefined)
            throw (`'${name}' is undefined`);

        return this.parent.resolve(name);
    }


    public declareFunction(name: string, value: NativeFunctionValue): RuntimeValue {
        if (this.functions.has(name) || this.userDefinedFunctions.has(name)) {
            throw `Function '${name}' is already declared`;
        }

        const returnType = value.returnType;

        this.functions.set(name, {value, returnType});

        return value;
    }

    public declareUserDefinedFunction(name: string, body: Expression[], returnType: ValueType, params: {type: ValueType, name: string}[], returnStatement: Statement): RuntimeValue{
        if (this.functions.has(name) || this.userDefinedFunctions.has(name)) {
            throw `Function '${name}' is already declared`;
        }

        this.userDefinedFunctions.set(name, {value: {body, returnType, type: 'userDefinedFunction', params, returnStatement}, returnType});

        return MK_NULL();
    }

    public lookupFunction(name: string): FunctionType{
        const env = this.resolve(name);

        if(env.functions.has(name))
            return env.functions.get(name);
        throw `'${name}' is not a function`;
    }

    public lookupUserDefinedValue(name: string): UserDefinedFunctionType{
        const env = this.resolve(name);

        if(env.userDefinedFunctions.has(name))
            return env.userDefinedFunctions.get(name);
        throw `'${name}' is not a function`;
    }

    public declareClass(name: string, value: ClassValue): RuntimeValue{

        if(this.classes.has(name))
            throw `Class '${name}' is already declared`;

        this.classes.set(name, value);
        return value;
    }
    public lookupClass(name: string): ClassValue{
        const env = this.resolve(name);

        if(env.classes.has(name))
            return env.classes.get(name);
        return undefined;
    }
	
	public lookupElement(name: string): ElementValue{
		const env = this.resolve(name);
		
		if(env.elements.has(name))
			return env.elements.get(name);
		return undefined;
	}
	
	public declareElement(name: string, value: ElementValue): RuntimeValue{
		
		if(this.elements.has(name))
			throw `Element '${name}' is already declared`;
		
		this.elements.set(name, value);
		return value;
	}
}

function setupScope(env: Environment){
    env.declareVariable('PI', MK_FLOAT(3.141592653589793238462643383279),'float' , true);

    env.declareVariable('null', MK_NULL(), 'null', true);
    env.declareVariable('true', MK_BOOL(true), 'bool', true);
    env.declareVariable('false', MK_BOOL(false), 'bool', true);

    function log(_args: RuntimeValue[], _env: Environment): RuntimeValue{
        _args.forEach((value) => {
			// @ts-ignore
			console.log(value.value);
		})

        return MK_NULL();
    }

    async function run(_args: RuntimeValue[], _env: Environment): Promise<RuntimeValue>{
        if(!_args[0])
            throw `Expected argument`;
        const fileName = (_args[0] as StringValue).value.slice(1,-1);
        // @ts-ignore
        const code = browserName == 'none'? await Deno.readTextFile(fileName): readTextFile(fileName);

        evaluate(code);

        return MK_NULL();
    }

    function getTime(_args: RuntimeValue[], _env: Environment): RuntimeValue{

        return MK_INT(Date.now());
    }
	
    // @ts-ignore
    env.declareFunction('run', MK_NATIVE_FUNCTION(run, 'null'));
    env.declareFunction('log', MK_NATIVE_FUNCTION(log, 'null'));
	env.declareFunction('getTime', MK_NATIVE_FUNCTION(getTime, 'integer'));
}

//Main
let globalEnv: Environment = new Environment();
export function evaluate(input: string, env: Environment = globalEnv){
    const parser = new Parser();
    const program = parser.createAST(input);
	
    return Visit(program, env);

    //def george = {name: 'George', age: 30, child:{name:'Anna',age:14}};
}

let userAgent = navigator.userAgent;
let browserName;

if(userAgent.match(/chrome|chromium|crios/i)){
    browserName = "chrome";
}else if(userAgent.match(/firefox|fxios/i)){
    browserName = "firefox";
}  else if(userAgent.match(/safari/i)){
    browserName = "safari";
}else if(userAgent.match(/opr\//i)){
    browserName = "opera";
} else if(userAgent.match(/edg/i)){
    browserName = "edge";
}else{
    browserName="none";
}

if(browserName != 'none') {
    let cstags = document.getElementsByTagName('cscript');

    for (let i = 0; i < cstags.length; i++) {
        let tag = cstags[i];
        let code = '';

        tag.setAttribute('style', 'display: none');

        if (tag.getAttribute('src'))
            code = readTextFile(`${tag.getAttribute('src')}`);
        else {
            code = tag.innerHTML;
            code = decodeHTML(code);
        }

		console.time('Time');
        evaluate(code);
		console.timeEnd('Time');
    }
}else{
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