const display = document.getElementById('display');
const historyDisplay = document.getElementById('history');
const memoryIndicator = document.getElementById('memory-indicator');
const historyList = document.getElementById('history-list');
const historyLogPanel = document.getElementById('history-log');

let currentInput = '0';
let historyInput = '';
let shouldResetDisplay = false;

// New Storage Registries
let memoryValue = 0;
let calculationHistory = [];

function press(value) {
    if (currentInput === '0' && !isNaN(value) || shouldResetDisplay) {
        currentInput = value;
        shouldResetDisplay = false;
    } else {
        const lastChar = currentInput.slice(-1);
        if (['+', '-', '*', '/'].includes(lastChar) && ['+', '-', '*', '/'].includes(value)) {
            currentInput = currentInput.slice(0, -1) + value;
        } else {
            currentInput += value;
        }
    }
    updateDisplay();
}

function pressSci(func) {
    let currentNum = parseFloat(currentInput);
    if (isNaN(currentNum)) return;
    
    let oldInput = currentInput; // Keep track of the number before calculation
    
    switch(func) {
        case 'percent':
            historyInput = `${oldInput}%`;
            currentInput = (currentNum / 100).toString();
            break;
        case 'sin':
            historyInput = `sin(${oldInput})`;
            currentInput = Math.sin(currentNum * Math.PI / 180).toFixed(8);
            break;
        case 'cos':
            historyInput = `cos(${oldInput})`;
            currentInput = Math.cos(currentNum * Math.PI / 180).toFixed(8);
            break;
        case 'tan':
            historyInput = `tan(${oldInput})`;
            currentInput = Math.tan(currentNum * Math.PI / 180).toFixed(8);
            break;
        case 'log':
            historyInput = `log(${oldInput})`;
            currentInput = Math.log10(currentNum).toString();
            break;
        case 'ln':
            historyInput = `ln(${oldInput})`;
            currentInput = Math.log(currentNum).toString();
            break;
        case 'sqrt':
            historyInput = `√(${oldInput})`;
            currentInput = Math.sqrt(currentNum).toString();
            break;
        case 'pi':
            currentInput = Math.PI.toString();
            return; // Exit early since π doesn't transform a previous number
        case 'e':
            currentInput = Math.E.toString();
            return; // Exit early since e doesn't transform a previous number
        case 'pow':
            currentInput += '**';
            updateDisplay();
            return; // User still needs to type the exponent, don't log yet
        case 'exp':
            currentInput += '*10**';
            updateDisplay();
            return; // User still needs to type the exponent, don't log yet
        case 'fact':
            historyInput = `${oldInput}!`;
            currentInput = factorial(currentNum).toString();
            break;
    }
    
    // Clean trailing zeros from decimal conversions
    if(currentInput.includes('.')) {
        currentInput = parseFloat(currentInput).toString();
    }
    
    // 🔥 FIX: Log the instant scientific calculation into the history panel!
    addHistoryRecord(historyInput, currentInput);
    
    // Tell the calculator that the next number typed should clear the screen
    shouldResetDisplay = true; 
    
    updateDisplay();
}

// Memory Operations Engine
function pressMem(op) {
    let currentNum = parseFloat(currentInput);
    if (isNaN(currentNum)) currentNum = 0;

    switch(op) {
        case 'MC': // Memory Clear
            memoryValue = 0;
            break;
        case 'MR': // Memory Recall
            currentInput = memoryValue.toString();
            shouldResetDisplay = true;
            break;
        case 'M+': // Memory Add
            memoryValue += currentNum;
            shouldResetDisplay = true;
            break;
        case 'M-': // Memory Subtract
            memoryValue -= currentNum;
            shouldResetDisplay = true;
            break;
    }
    updateMemoryIndicator();
    updateDisplay();
}

function updateMemoryIndicator() {
    memoryIndicator.innerText = memoryValue !== 0 ? 'M' : '';
}

function factorial(n) {
    if (n < 0 || !Number.isInteger(n)) return 'Error';
    if (n === 0 || n === 1) return 1;
    let result = 1;
    for (let i = 2; i <= n; i++) result *= i;
    return result;
}

function calculate() {
    try {
        let expression = currentInput;
        let result = Function(`"use strict"; return (${expression})`)();
        
        if (result === Infinity || isNaN(result)) {
            currentInput = 'Error';
        } else {
            let finalizedResult = Number(result.toFixed(10)).toString();
            
            // Log output onto memory history ledger array
            addHistoryRecord(expression, finalizedResult);
            
            currentInput = finalizedResult;
            historyDisplay.innerText = expression + ' =';
        }
    } catch (error) {
        currentInput = 'Error';
    }
    shouldResetDisplay = true;
    updateDisplay();
}

// History Records Upkeep Management Functions
function addHistoryRecord(expr, res) {
    calculationHistory.unshift({ expression: expr, result: res });
    renderHistoryLog();
}

function renderHistoryLog() {
    if (calculationHistory.length === 0) {
        historyList.innerHTML = '<p class="empty-msg">No history yet</p>';
        return;
    }
    
    historyList.innerHTML = '';
    calculationHistory.forEach((item, index) => {
        const row = document.createElement('div');
        row.classList.add('history-item');
        row.onclick = () => loadHistoryItem(item.result);
        row.innerHTML = `
            <div class="history-item-exp">${item.expression} =</div>
            <div class="history-item-res">${item.result}</div>
        `;
        historyList.appendChild(row);
    });
}

function loadHistoryItem(value) {
    currentInput = value;
    shouldResetDisplay = false;
    updateDisplay();
    toggleHistoryLog(); // Closes screen view overlay automatically
}

function clearHistoryLog() {
    calculationHistory = [];
    renderHistoryLog();
}

function toggleHistoryLog() {
    historyLogPanel.classList.toggle('open');
}

function clearAll() {
    currentInput = '0';
    historyInput = '';
    historyDisplay.innerText = '';
    updateDisplay();
}

function clearEntry() {
    currentInput = '0';
    updateDisplay();
}

function backspace() {
    if (currentInput.length > 1) {
        currentInput = currentInput.slice(0, -1);
    } else {
        currentInput = '0';
    }
    updateDisplay();
}

function updateDisplay() {
    display.innerText = currentInput;
    if(historyInput && !shouldResetDisplay) {
        historyDisplay.innerText = historyInput;
        historyInput = '';
    }
}
