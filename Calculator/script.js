let runningTotal = 0;
let buffer = "0";
let previousOperator = null;

const screen = document.querySelector(".screen");

function buttonClick(value) {
    if (isNaN(value) && value !== ".") {
        handleSymbol(value);
    } else {
        handleNumber(value);
    }
    updateScreen();
}

function updateScreen() {
    screen.innerText = buffer.length > 12 ? parseFloat(buffer).toExponential(6) : buffer;
}

function handleSymbol(symbol) {
    switch (symbol) {
        case "C":
            buffer = "0";
            runningTotal = 0;
            previousOperator = null;
            break;
        case "←":
            if (buffer.length === 1 || (buffer.length === 2 && buffer.startsWith("-"))) {
                buffer = "0";
            } else {
                buffer = buffer.slice(0, -1);
            }
            break;
        case "=":
            if (previousOperator && buffer !== "-") {
                flushOperation(parseFloat(buffer));
                buffer = runningTotal.toString();
                runningTotal = 0;
                previousOperator = null;
            }
            break;
        case ".":
            if (!buffer.includes(".")) {
                buffer += ".";
            }
            break;
        case "+":
        case "−": // HTML minus entity becomes this character
        case "×":
        case "÷":
            handleMath(symbol);
            break;
    }
}

function handleMath(symbol) {
    // Convert HTML minus symbol to regular minus for consistency
    if (symbol === "−") symbol = "-";
    
    // Allow negative number at the beginning or after '='
    if (buffer === "0" && symbol === "-" && previousOperator === null && runningTotal === 0) {
        buffer = "-";
        return;
    }

    // Allow negative number after an operator like +, ×, ÷
    if ((buffer === "0" || buffer === "") && symbol === "-") {
        buffer = "-";
        return;
    }

    // Prevent operation on incomplete negative input
    if (buffer === "-") return;

    const intBuffer = parseFloat(buffer);

    if (!isNaN(intBuffer)) {
        if (runningTotal === 0) {
            runningTotal = intBuffer;
        } else if (previousOperator) {
            flushOperation(intBuffer);
        }
    }
    previousOperator = symbol;
    buffer = "0";
}

function flushOperation(intBuffer) {
    switch (previousOperator) {
        case "+":
            runningTotal += intBuffer;
            break;
        case "-":
        case "−": // Handle both minus characters
            runningTotal -= intBuffer;
            break;
        case "×":
            runningTotal *= intBuffer;
            break;
        case "÷":
            if (intBuffer === 0) {
                buffer = "Error";
                runningTotal = 0;
                previousOperator = null;
                return;
            }
            runningTotal /= intBuffer;
            break;
    }
}

function handleNumber(numberString) {
    if (
        buffer === "0" ||
        buffer === "-0"
    ) {
        buffer = buffer.startsWith("-") ? "-" + numberString : numberString;
    } else if (buffer === "-") {
        buffer = "-" + numberString;
    } else {
        buffer += numberString;
    }
}

function init() {
    const calcButtons = document.querySelector(".calc-buttons");
    if (calcButtons) {
        calcButtons.addEventListener("click", function(event) {
            if (event.target.tagName === "BUTTON") {
                buttonClick(event.target.innerText);
            }
        });
    }
}

init();