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
  var confirmRefresh = confirm("Are you sure you want to refresh? This will clear all fields.");
  if (confirmRefresh) {
    refreshFields();
  }
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

function saveFields() {
  var fileName = prompt("Enter a name for the saved file (without extension):");

  if (!fileName) {
    alert("File name cannot be empty. Please try again.");
    return;
  }

  var savedData = {
    copyFields: [],
    bigField: document.getElementById("bigField").value
  };

  var copyFieldContainers = document.querySelectorAll('.copyFieldContainer');

  copyFieldContainers.forEach(function (container, index) {
    var copyField = container.querySelector('.copyField');
    savedData.copyFields.push({
      fieldNumber: index + 1,
      value: copyField.value
    });
  });

  var jsonData = JSON.stringify(savedData);
  var blob = new Blob([jsonData], { type: 'application/json' });
  var a = document.createElement('a');

  // Updated the download attribute with the user-specified file name
  a.download = fileName + '.json';

  a.href = URL.createObjectURL(blob);
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

function triggerFileInput() {
  document.getElementById('loadFileInput').click();
}

function loadFile() {
  var input = document.getElementById('loadFileInput');
  var file = input.files[0];

  if (file) {
    var reader = new FileReader();
    reader.onload = function (e) {
      var jsonData = JSON.parse(e.target.result);
      loadFields(jsonData);
    };
    reader.readAsText(file);
  }

  // Clear the input field to allow loading the same file again
  input.value = '';
}

function loadFields(data) {
  // Remove existing blank fields
  removeEmptyFields();

  // Add fields based on the loaded data
  addFieldsFromData(data.copyFields.length);

  // Load data into copy fields
  var copyFieldContainers = document.querySelectorAll('.copyFieldContainer');

  data.copyFields.forEach(function (fieldData, index) {
    var container = copyFieldContainers[index];
    var copyField = container.querySelector('.copyField');
    copyField.value = fieldData.value;
  });

  // Load data into big field
  var bigField = document.getElementById('bigField');
  bigField.value = data.bigField;
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
  var inputField = document.getElementById("inputText");
  inputField.value = inputField.value.toUpperCase();
  updateCharCount();
}

function convertToLowercase() {
  var inputField = document.getElementById("inputText");
  inputField.value = inputField.value.toLowerCase();
  updateCharCount();
}

function convertToCapitalizeCase() {
  var inputField = document.getElementById("inputText");
  var words = inputField.value.split(' ');
  for (var i = 0; i < words.length; i++) {
      words[i] = words[i].charAt(0).toUpperCase() + words[i].slice(1).toLowerCase();
  }
  inputField.value = words.join(' ');
  updateCharCount();
}

function clearText() {
  var inputField = document.getElementById("inputText");
  inputField.value = "";
  updateCharCount();
}

function copyText() {
  var inputField = document.getElementById("inputText");
  inputField.select();
  document.execCommand("copy");
}

function updateCharCount() {
  var inputField = document.getElementById("inputText");
  var charCounter = document.getElementById("charCounter");
  charCounter.textContent = "Characters: " + inputField.value.length;
}

function removeNumbered() {
  var inputField = document.getElementById("inputText");
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
  var textarea = document.getElementById("inputText");
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