'use strict';

function isAlreadyBraced(expression, start, end){
  const isBraced = start - 1 > -1 && end + 1 < expression.length && expression[start-1] === '(' && expression[end+1] === ')';
  return isBraced;
}

function binarycomparison(expression, token, index){
  if(!isAlreadyBraced(expression, index-1, index+1)){
    expression.splice(index+2 > expression.length ? expression.length : index +2 ,0,')');
    expression.splice(index-1 > -1 ? index - 1 : 0,0,'(');
  }

  return index + 3;
}

function beetween(expression, token, index){
  let start = index-1, end = index+4;
  if(expression[index-1] === 'not'){
    start -= 1;
  }

  if(!isAlreadyBraced(expression, start, end)){
    expression.splice(end > expression.length ? expression.length : end ,0,')');
    expression.splice(start > -1 ? start : 0,0,'(');
  }

  return index + 4;
}

function like(expression, token, index){
  let start = index-1, end = index+2;
  if(expression[index-1] === 'not'){
    start -= 1;
  }

  if(!isAlreadyBraced(expression, start, end)){
    expression.splice(end > expression.length ? expression.length : end ,0,')');
    expression.splice(start > -1 ? start : 0,0,'(');
  }

  return index + 3;
}

const bracers = {
  '=' : binarycomparison,
  '>' : binarycomparison,
  '<' : binarycomparison,
  '>=': binarycomparison,
  '<=': binarycomparison,
  '!=': binarycomparison,
  'between': beetween,
  'like': like
}

function braceExpression(expr){
  for(let i = 0; i < expr.length; i++){
    const token = expr[i];
    if(token && token.xpr){
      token.xpr = braceExpression(token.xpr);
    }
    if(bracers[token]){
      i = bracers[token](expr, token, i);
    }
  }

  return expr;
}
module.exports = braceExpression;
