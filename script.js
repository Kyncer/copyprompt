function toggleVisibility() {
  var bigField = document.getElementById('bigField');
  bigField.style.display = (bigField.style.display === 'none' || bigField.style.display === '') ? 'block' : 'none';
}

var lastClickedButton = null;

function addCopyField() {
  var container = document.getElementById("copyFieldsContainer");
  var div = document.createElement("div");
  var input = document.createElement("input");
  var copyButton = document.createElement("button");
  var goButton = document.createElement("button"); // New button for "Go"
  var fieldNumber = container.children.length + 1;

  div.className = "copyFieldContainer";

  var numberSpan = document.createElement("span");
  numberSpan.className = "fieldNumber";
  numberSpan.textContent = fieldNumber + ".";

  input.type = "text";
  input.className = "copyField";
  input.size = "100";
  input.maxlength = "350";

  copyButton.className = "copyButton";
  copyButton.textContent = "COPY";

  goButton.className = "copyButton"; // Use the same style as the copy button
  goButton.textContent = "GO";
  goButton.onclick = function () {
    goToDestination(fieldNumber);
  };

  copyButton.onclick = function () {
    copyToClipboard(fieldNumber, copyButton);
  };

  div.appendChild(numberSpan);
  div.appendChild(input);
  div.appendChild(copyButton);
  div.appendChild(goButton); // Append the new "Go" button
  container.appendChild(div);
}

function goToDestination(fieldNumber) {
  var copyFieldContainer = document.querySelector('.copyFieldContainer:nth-child(' + fieldNumber + ')');
  var copyField = copyFieldContainer.querySelector('.copyField');
  var url = copyField.value.trim();

  if (url !== "") {
    // Check if the URL contains a period before opening a new tab
    if (url.includes(".")) {
      if (!url.startsWith("http://") && !url.startsWith("https://")) {
        url = "http://" + url;
      }

      // Open the specified URL in a new tab
      var newTab = window.open(url, '_blank');

      // Apply the existing green highlight class similar to the copy button
      copyFieldContainer.classList.add('highlight2');
      button.classList.add('highlight2');
      setTimeout(function () {
        button.classList.remove('highlight2');
      }, 300);

      copyFieldContainer.classList.add('greenBackground');
    } else {

    }
  } else {

  }
}

function copyToClipboard(fieldNumber, button) {
  var copyFieldContainer = document.querySelector('.copyFieldContainer:nth-child(' + fieldNumber + ')');
  var copyField = copyFieldContainer.querySelector('.copyField');
  var dummy = document.createElement("textarea");
  document.body.appendChild(dummy);
  dummy.value = copyField.value;
  dummy.select();
  document.execCommand("copy");
  document.body.removeChild(dummy);

  var copiedNote = document.createElement("span");
  copiedNote.className = "copiedNote";
  copiedNote.textContent = "Copied";
  copiedNote.style.fontSize = "50%";
  copiedNote.style.color = getRandomColor();

  var counter = button.querySelector('.counter') || document.createElement("span");
  counter.className = "counter";
  var count = parseInt(counter.textContent) || 0;

  if (button !== lastClickedButton) {
    count += 1;
  }

  counter.textContent = "+" + count;
  counter.style.marginLeft = "5px";

  var existingNote = copyFieldContainer.querySelector('.copiedNote');

  if (existingNote) {
    existingNote.remove();
  }

  copyFieldContainer.insertBefore(copiedNote, copyFieldContainer.firstChild);
  button.appendChild(counter);

  button.classList.add('highlight');
  setTimeout(function () {
    button.classList.remove('highlight');
  }, 300);

  copyFieldContainer.classList.add('greenBackground');

  var allCopyFieldContainers = document.querySelectorAll('.copyFieldContainer');
  Array.from(allCopyFieldContainers).forEach(function (container) {
    if (container !== copyFieldContainer) {
      container.classList.remove('greenBackground');
    }
  });

  lastClickedButton = button;
}

function showReplaceDialog() {
  var findText = prompt("Enter text to find:");
  if (findText === null) {
    return;
  }

  var replaceText = prompt("Enter text to replace with:");
  if (replaceText === null) {
    return;
  }

  replaceTextInFields(findText, replaceText);
}

function replaceTextInFields(findText, replaceText) {
  var container = document.getElementById("copyFieldsContainer");

  Array.from(container.children).forEach(function (fieldContainer, index) {
    var copyField = fieldContainer.querySelector('.copyField');
    copyField.value = copyField.value.replace(new RegExp(findText, 'g'), replaceText);
  });
}

function distributeText() {
  var bigField = document.getElementById("bigField");
  var lines = bigField.value.split('\n').filter(function (line) {
    return line.trim() !== "";
  });

  Array.from(document.querySelectorAll('.copyFieldContainer')).forEach(function (fieldContainer, index) {
    var copyField = fieldContainer.querySelector('.copyField');
    if (lines[index] !== undefined) {
      var trimmedLine = lines[index].trim();
      copyField.value = trimmedLine;
    } else {
      fieldContainer.remove();
    }
  });

  removeEmptyFields();

  for (var i = document.querySelectorAll('.copyFieldContainer').length + 1; i <= lines.length; i++) {
    addCopyField();
    var newField = document.querySelector('.copyFieldContainer:nth-child(' + i + ') .copyField');
    if (lines[i - 1] !== undefined) {
      var trimmedLine = lines[i - 1].trim();
      newField.value = trimmedLine;
    }
  }
}

function removeEmptyFields() {
  var container = document.getElementById("copyFieldsContainer");

  Array.from(container.children).forEach(function (fieldContainer) {
    var copyField = fieldContainer.querySelector('.copyField');
    var value = copyField.value;

    if (/^\s*$/.test(value)) {
      fieldContainer.remove();
    }
  });
}

function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

function showRefreshConfirmation() {
  refreshFields();
}

function refreshFields() {
  var container = document.getElementById("copyFieldsContainer");
  container.innerHTML = "";

  for (var i = 1; i <= 5; i++) {
    addCopyField();
  }

  var bigField = document.getElementById("bigField");
  bigField.value = "";

  lastClickedButton = null;
}

function decrementCounter() {
  if (lastClickedButton) {
    var counter = lastClickedButton.querySelector('.counter');
    var count = parseInt(counter.textContent) || 0;

    if (count > 0) {
      count -= 1;
      counter.textContent = "+" + count;
    }
  }
}

function resetAllCounters() {
  var allCounters = document.querySelectorAll('.counter');

  allCounters.forEach(function (counter) {
    counter.textContent = "";
  });
}

function addFieldsFromData(count) {
  for (var i = 1; i <= count; i++) {
    addCopyField();
  }
}

function copyAllFields() {
  var copyFields = document.querySelectorAll('.copyField');
  var copiedText = '';

  copyFields.forEach(function (copyField) {
    copiedText += copyField.value + '\n';
  });

  var dummy = document.createElement("textarea");
  document.body.appendChild(dummy);
  dummy.value = copiedText.trim();
  dummy.select();
  document.execCommand("copy");
  document.body.removeChild(dummy);
}

//for case convert app

function updateAndConvertToUppercase() {
  var inputField = document.getElementById("bigField");
  inputField.value = inputField.value.toUpperCase();
  updateCharCount();
}

function convertToLowercase() {
  var inputField = document.getElementById("bigField");
  inputField.value = inputField.value.toLowerCase();
  updateCharCount();
}

function convertToCapitalizeCase() {
  var inputField = document.getElementById("bigField");
  var words = inputField.value.split(' ');
  for (var i = 0; i < words.length; i++) {
    words[i] = words[i].charAt(0).toUpperCase() + words[i].slice(1).toLowerCase();
  }
  inputField.value = words.join(' ');
  updateCharCount();
}

function copyText() {
  var inputField = document.getElementById("bigField");
  inputField.select();
  document.execCommand("copy");
}

function updateCharCount() {
  var inputField = document.getElementById("bigField");
  var charCounter = document.getElementById("charCounter");
  charCounter.textContent = "Characters: " + inputField.value.length;
}

function removeNumbered() {
  var inputField = document.getElementById("bigField");
  var lines = inputField.value.split('\n');

  for (var i = 0; i < lines.length; i++) {
    // Remove numbers or number lists (with or without a closing parenthesis) from the start of each line
    lines[i] = lines[i].replace(/^\d+(\.|\))?\s*/, '');
  }

  inputField.value = lines.join('\n');
  updateCharCount();
}



function toggleDarkMode() {
  var body = document.body;
  var textarea = document.getElementById("bigField");
  var darkModeButton = document.getElementById("darkModeButton");

  body.classList.toggle("dark-mode");
  textarea.classList.toggle("dark-mode");
  darkModeButton.classList.toggle("dark-mode");

  var isDarkMode = body.classList.contains("dark-mode");

  if (isDarkMode) {
    darkModeButton.textContent = "Light Mode";
    darkModeButton.style.backgroundColor = "#333";
    darkModeButton.style.color = "#fff";
  } else {
    darkModeButton.textContent = "Dark Mode";
    darkModeButton.style.backgroundColor = "#fff";
    darkModeButton.style.color = "#333";
  }
}

//break commas
function breakComma() {
  // Get the text from the bigField textarea
  var inputField = document.getElementById("bigField");
  var inputValue = inputField.value;

  // Split the text based on commas and trim any extra whitespace
  var textArray = inputValue.split(',').map(function (item) {
    return item.trim();
  });

  // Join the array elements with line breaks
  var newText = textArray.join('\n');

  // Update the value of the bigField textarea
  inputField.value = newText;

  // Update the character count
  updateCharCount();
}


//remove extra space from start line
function whiteSpace() {
  var inputField = document.getElementById("bigField");
  var inputValue = inputField.value;

  // Split the text into lines
  var lines = inputValue.split('\n');

  // Remove extra spaces from the start of each line
  for (var i = 0; i < lines.length; i++) {
    lines[i] = lines[i].replace(/^\s+/, '');
  }

  // Join the modified lines back into a string
  var newText = lines.join('\n');

  // Update the value of the bigField textarea
  inputField.value = newText;

  // Update the character count
  updateCharCount();
}

//turn commas
function turnComma() {
  // Get the text from the bigField textarea
  var text = document.getElementById("bigField").value;

  // Remove existing line breaks and replace with a comma and space
  var newText = text.replace(/\n/g, ", ");

  // Set the modified text back to the bigField textarea
  document.getElementById("bigField").value = newText;

  // Optionally, you can also update the character count after modifying the text
  updateCharCount();
}

//copy all bigfield
function copyallBig() {
  // Get the text from the bigField textarea
  var bigField = document.getElementById("bigField");
  bigField.select();
  document.execCommand("copy");

  // Optionally, you can provide some visual feedback to the user
  alert("Text copied to clipboard!");
}

//OPEN LINKS
function openLinks() {
  var textFields = document.querySelectorAll('.copyField');

  textFields.forEach(function (textField) {
    var url = textField.value.trim();

    if (url !== "") {
      // Check if the URL contains a period before opening a new tab
      if (url.includes(".")) {
        if (!url.startsWith("http://") && !url.startsWith("https://")) {
          url = "http://" + url;
        }

        // Open the specified URL in a new tab
        window.open(url, '_blank');
      }
    }
  });
}

//SIMPLE SAVE & LOAD
function saveCopyFields() {
  var copyFields = [];

  document.querySelectorAll('.copyField').forEach(function (copyField) {
    copyFields.push(copyField.value);
  });

  var copyFieldsCount = document.querySelectorAll('.copyFieldContainer').length;

  var dataToSave = {
    copyFields: copyFields,
    copyFieldsCount: copyFieldsCount
  };

  localStorage.setItem('copyFieldsData', JSON.stringify(dataToSave));
}

// Function to load copyField inputs and count from Local Storage
function loadCopyFields() {
  // Clear existing fields
  document.querySelectorAll('.copyField').forEach(function (copyField) {
    copyField.value = '';
  });

  var savedData = localStorage.getItem('copyFieldsData');

  if (savedData) {
    savedData = JSON.parse(savedData);

    // Add or remove copyFieldContainers based on the saved count
    var currentCount = document.querySelectorAll('.copyFieldContainer').length;
    var difference = savedData.copyFieldsCount - currentCount;

    if (difference > 0) {
      // Add new copyFieldContainers
      for (var i = 0; i < difference; i++) {
        addCopyField();
      }
    } else if (difference < 0) {
      // Remove extra copyFieldContainers
      var containersToRemove = document.querySelectorAll('.copyFieldContainer').slice(difference);
      containersToRemove.forEach(function (container) {
        container.remove();
      });
    }

    // Load data after updating the DOM
    document.querySelectorAll('.copyField').forEach(function (copyField, index) {
      if (savedData.copyFields[index] !== undefined) {
        copyField.value = savedData.copyFields[index];
      }
    });
  }
}

//OPEN NEW WINDOW

function openSeparateWindow() {
  // Specify the URL of the HTML page
  var pageUrl = '/CopyPrompt.html';

  // Open a new window with the specified URL
  var newWindow = window.open(pageUrl, 'SeparateWindow', 'width=665,height=658');
}