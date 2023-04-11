grammar CScript;

program: line* EOF;
pcomp: 'pcomp' line;

line: comment
    | statement
    | ifStatement
    | dowhileStatement
    | whileStatement
    | repeatStatement
    | block
    | functionDeclaration
    | lang
    | runStatement
    | foreverStatemnet
    ;

COMMENTSINGLE: '//'  ~[\r\n]* '\r'? '\n' -> skip;
COMMENTMULTY: '/*'  ~[\r\n]* '\r'? '\n' -> skip;
comment: COMMENTSINGLE | (COMMENTMULTY '*/');

lang: 'lang' IDENTIFIER LANGBLOCK;
LANGBLOCK: ':''{' ~ '}'';';

runStatement: RUN '<'expresion'>' #runScript;
RUN: 'run' | 'runt';

statement: (declration | assignment | declration | passStatement | functionCall)';';

passStatement: PASS expresion ;
PASS: 'pass';

ifStatement: IF '(' expresion ')' line('else' blockElseIf)?;
IF: 'if';

repeatStatement: REPEAT '(' ('['list']' | expresion) (':' IDENTIFIER ('=' expresion (';' expresion)?)? )?')' line;
exp: expresion;
list: exp(','exp)*;
REPEAT: 'repeat';

foreverStatemnet: FOREVER '('expresion')' line('else' blockElseIf)?;
FOREVER: 'forever';

blockElseIf: line| ifStatement;

whileStatement: WHILE '(' expresion ')'  line('else' blockElseIf)?;

WHILE: 'while' | 'until';

dowhileStatement: DOWHILE '(' expresion ')' line('else' blockElseIf)?;

DOWHILE: 'dowhile' | 'dountil';

assignment: IDENTIFIER '=' expresion #VariableAssignment |  IDENTIFIER'['expresion']' '=' expresion #MultyAssignment | IDENTIFIER '='  line #codeAssignment;

declration: 'def' IDENTIFIER(':'var)? ('=' expresion)?                                                  #VariableDeclaration
          | 'def' IDENTIFIER(':'var)?'['expresion']'  ('=' expresion(','expresion)* )?                  #ArrayDeclaration
          | 'def' IDENTIFIER(':'var)?'[]' ('=' expresion(','expresion)* )?                              #ListDeclaration
          | 'def' IDENTIFIER':' 'dictionary''['var']'                                                   #DictionaryDeclaration
          | 'def' IDENTIFIER':' 'code' ('=' line)?                                                      #codeDeclaration
          ;

functionDeclaration: 'func' IDENTIFIER '(' (IDENTIFIER':' var SQRTBRAKETS? (','IDENTIFIER':' var SQRTBRAKETS?)*)? ')'(':'returnType)? block;

SQRTBRAKETS: '[]' | '[ ]';

var: ('int' | 'string' | 'float' | 'bool' | 'var')(POINTER)?;

returnType: var | 'void';
POINTER: '*';
functionCall: IDENTIFIER '(' (expresion (',' expresion)*)? ')';

expresion: const     						#constExpresion
         | multy                            #MultyExpresion
         | IDENTIFIER	                    #identifierExpresion
         | functionCall						#functionCallExpresion
         | '(' expresion ')'				#parenthesizeExpresion
         | '!' expresion					#notExpresion
         | expresion multOp expresion		#multiplicationExpresion
         | expresion addOp expresion		#additionExpresion
         | expresion comperaOp expresion	#comparisonExpresion
         | expresion boolOp expresion		#boolExpresion
         | path                             #pathExpresion
         ;

multOp: '*' | '/' | '%';
addOp: '+' | '-';
comperaOp: '==' | '!=' | '>' | '<' | '>=' | '<=';
boolOp: '&&' | '||';

const:  BOOL | STRING | FLOAT | INTIGER | NULL;
multy: IDENTIFIER'['expresion']';
code: '%'IDENTIFIER;

INTIGER: '-'?[0-9]+;
FLOAT: '-'?[0-9]+ '.' [0-9]+;
STRING: ('"' ~'"'* '"') | ('\'' ~'\''* '\'');
BOOL: 'true' | 'false';
NULL: 'null';

block: '{' ((line* returnStatement?) | code)'}' ;
returnStatement: 'return' expresion ';';

WS: [ \t\r\n]+ -> skip;
IDENTIFIER: [a-zA-Z_][a-zA-Z0-9_]*;
path:(. | '.' | '\\')*?;