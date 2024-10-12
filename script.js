let currentInput = '';
let mode = 'RAD';

function append(value) {
  const display = document.getElementById('display');
  const cursorPosition = display.selectionStart;

  // Handle parentheses insertion with multiplication
  if (value === '(') {
    // Check the character before the cursor to determine if it should insert '*' first
    const charBeforeCursor = currentInput[cursorPosition - 1];
    if (charBeforeCursor && charBeforeCursor.match(/[0-9)]$/)) {
      currentInput = currentInput.slice(0, cursorPosition) + '*' + value + currentInput.slice(cursorPosition);
    } else {
      currentInput = currentInput.slice(0, cursorPosition) + value + currentInput.slice(cursorPosition);
    }
  } else {
    currentInput = currentInput.slice(0, cursorPosition) + value + currentInput.slice(cursorPosition);
  }

  updateDisplay();
  setCursorPosition(cursorPosition + value.length);
}

function toggleParentheses() {
  const openCount = (currentInput.match(/\(/g) || []).length;
  const closeCount = (currentInput.match(/\)/g) || []).length;
  if (openCount > closeCount) {
    append(')'); // If there are more open parentheses, add a closing one
  } else {
    append('('); // Otherwise, add an opening one
  }
}

function clearDisplay() {
  currentInput = '';
  updateDisplay();
  document.getElementById('result').innerText = '';
}

function backspace() {
  const display = document.getElementById('display');
  const cursorPosition = display.selectionStart;
  currentInput = currentInput.slice(0, cursorPosition - 1) + currentInput.slice(cursorPosition);
  updateDisplay();
  setCursorPosition(cursorPosition - 1);
}

function toggleInverse() {
  const inverseFunctions = {
    'Math.sin': 'Math.asin',
    'Math.cos': 'Math.acos',
    'Math.tan': 'Math.atan'
  };

  for (const key in inverseFunctions) {
    if (currentInput.includes(key)) {
      currentInput = currentInput.replace(key, inverseFunctions[key]);
      updateDisplay();
      return;
    }
  }
}

function setMode(newMode) {
  mode = newMode;
  updateDisplay();
}

function factorial(n) {
  return n ? n * factorial(n - 1) : 1;
}

function calculate() {
  try {
    let expression = currentInput.replace(/%/g, '/100');
    
    // Replace π with its value for evaluation
    expression = expression.replace(/π/g, Math.PI);
    
    // Evaluating factorial
    expression = expression.replace(/factorial\((\d+)\)/g, (match, p1) => factorial(parseInt(p1)));

    // Handling radians or degrees for trigonometric functions
    if (mode === 'RAD') {
      expression = expression.replace(/Math.sin\(([^)]+)\)/g, (_, angle) => `Math.sin(${angle})`);
      expression = expression.replace(/Math.cos\(([^)]+)\)/g, (_, angle) => `Math.cos(${angle})`);
      expression = expression.replace(/Math.tan\(([^)]+)\)/g, (_, angle) => `Math.tan(${angle})`);
    } else {
      expression = expression.replace(/Math.sin\(([^)]+)\)/g, (_, angle) => `Math.sin(${angle} * Math.PI / 180)`);
      expression = expression.replace(/Math.cos\(([^)]+)\)/g, (_, angle) => `Math.cos(${angle} * Math.PI / 180)`);
      expression = expression.replace(/Math.tan\(([^)]+)\)/g, (_, angle) => `Math.tan(${angle} * Math.PI / 180)`);
    }

    const result = eval(expression);
    currentInput = result.toString();
    updateDisplay(result);
    updateResult();
  } catch (error) {
    updateDisplay('Error');
    document.getElementById('result').innerText = '';
  }
}

function updateDisplay(result = '') {
  document.getElementById('display').value = currentInput || result;
  updateResult();
}

function updateResult() {
  try {
    const result = eval(currentInput.replace(/π/g, Math.PI)); // Evaluate with π value
    document.getElementById('result').innerText = result;
  } catch {
    document.getElementById('result').innerText = '';
  }
}

function handleKey(event) {
  if (event.key === "Enter") calculate();
}

function setCursorPosition(position) {
  const display = document.getElementById('display');
  display.focus();
  display.setSelectionRange(position, position);
}
