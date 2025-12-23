function add(a, b) {
  return a + b;
}

function subtract(a, b) {
  return a - b;
}

function multiply(a, b) {
  return a * b;
}

function divide(a, b) {
  return a / b;
}

function operate(op, a, b) {
  switch (op) {
    case "+":
      return add(a, b);
    case "-":
      return subtract(a, b);
    case "*":
      return multiply(a, b);
    case "/":
      return divide(a, b);
  }
}

let firstNum = "";
let secondNum = "";
let operator = null;
let waitingForOperand = false;
let justCalculated = false;
const buttons = document.querySelectorAll("button");
const display = document.querySelector(".display");

buttons.forEach((button) => {
  button.addEventListener("click", () => populate(button.innerText));
});

function populate(input) {
  if ((input >= "0" && input <= "9") || input === ".") {
    // If we just showed a result, start fresh
    if (justCalculated) {
      firstNum = "";
      secondNum = "";
      operator = null;
      justCalculated = false;
      waitingForOperand = false;
    }

    // Prevent multiple decimal points
    if (input === ".") {
      if (!operator && firstNum.includes(".")) return;
      if (operator && secondNum.includes(".")) return;
    }

    if (!operator) {
      firstNum += input;
      display.innerText = firstNum || "0";
    } else {
      secondNum += input;
      display.innerText = secondNum;
      waitingForOperand = false;
    }
    return;
  }

  if (["+", "-", "*", "/"].includes(input)) {
    // If we already have a complete operation and aren't waiting for an operand, evaluate it first
    if (firstNum && operator && secondNum && !waitingForOperand) {
      const result = calculate();
      if (result === null) return; // Error occurred (like division by zero)

      firstNum = result.toString();
      secondNum = "";
      display.innerText = formatResult(result);
    }

    // Don't set operator if we don't have a first number
    if (!firstNum) return;

    operator = input;
    waitingForOperand = true;
    justCalculated = false;
    return;
  }

  if (input === "=") {
    if (firstNum && operator && secondNum && !waitingForOperand) {
      const result = calculate();
      if (result === null) return;

      display.innerText = formatResult(result);
      firstNum = result.toString();
      secondNum = "";
      operator = null;
      justCalculated = true;
      waitingForOperand = false;
    }
    return;
  }

  if (input === "⌫") {
    if (justCalculated) {
      firstNum = "";
      secondNum = "";
      operator = null;
      justCalculated = false;
      waitingForOperand = false;
      display.innerText = "0";
    } else if (!operator) {
      firstNum = firstNum.slice(0, -1);
      display.innerText = firstNum || "0";
    } else if (secondNum !== "") {
      secondNum = secondNum.slice(0, -1);
      display.innerText = secondNum || "0";
    }
    return;
  }

  if (input === "AC") {
    firstNum = "";
    secondNum = "";
    operator = null;
    waitingForOperand = false;
    justCalculated = false;
    display.innerText = "0";
    return;
  }
}

function calculate() {
  const a = Number(firstNum);
  const b = Number(secondNum);

  // Check for division by zero
  if (operator === "/" && b === 0) {
    display.innerText = "Nice try, genius! 🤓";
    return null;
  }

  let result = operate(operator, a, b);

  return result;
}

function formatResult(result) {
  let resultStr = result.toString();

  // If the result is too long, use exponential notation or truncate
  if (resultStr.length > 10) {
    if (Math.abs(result) >= 1000000000 || Math.abs(result) < 0.000001) {
      // Use exponential notation for very large or small numbers
      return result.toExponential(5);
    } else {
      // Truncate decimal places for regular numbers
      return parseFloat(result.toPrecision(8)).toString();
    }
  }

  return resultStr;
}
