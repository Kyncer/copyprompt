import React, { useState, useRef, useEffect } from 'react';
import './App.css';

const App = () => {
  const [, setFocusedInputId] = useState(null);
  // const [focusedInputValue, setFocusedInputValue] = useState(''); // Removed the unused variable
  const inputRefs = useRef([]);
  const [fields, setFields] = useState([
    { id: 1, value: '', type: 'text' },
    { id: 2, value: '', type: 'text' },
    { id: 3, value: '', type: 'text' },
    { id: 4, value: '', type: 'text' },
    { id: 5, value: '', type: 'text' },
  ]);

  const [bigField, setBigField] = useState({ value: '', type: 'text' });

  useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, fields.length);
  }, [fields]);

  const generateUniqueId = (rowId, lineIndex) => {
    const startingId = rowId * 10;
    return startingId + lineIndex + 1;
  };

  const handleInputChange = (id, newValue) => {
    const updatedFields = [...fields];
    const index = updatedFields.findIndex((field) => field.id === id);
    updatedFields[index].value = newValue;
    setFields(updatedFields);
    // setFocusedInputValue(newValue); // Removed the unused variable
  };

  const handleButtonClick = (id) => {
    const field = fields.find((field) => field.id === id);
    const inputValue = field ? field.value : '';
    setFocusedInputId(id);
    copyTextToClipboard(inputValue);
    console.log(`Button clicked for Field ${id}: ${inputValue}`);
  };

  const handleRemoveButtonClick = (id) => {
    const updatedFields = fields.filter((field) => field.id !== id);
    setFields(updatedFields);
  };

  const handleDistributeButtonClick = () => {
    const lines = bigField.value.split('\n');
    let updatedFields = [];

    lines.forEach((line, lineIndex) => {
      const rowId = Math.floor(updatedFields.length / 10);
      const newFieldId = generateUniqueId(rowId, lineIndex);
      const newField = { id: newFieldId, value: line, type: 'text' };
      updatedFields.push(newField);
    });

    updatedFields = updatedFields.filter((field) => field.value.trim() !== '');
    setFields(updatedFields);

    const lastDistributedField = updatedFields[updatedFields.length - 1];
    setFocusedInputId(lastDistributedField.id);
  };

  const handleBigFieldChange = (newValue) => {
    setBigField({ ...bigField, value: newValue });
  };

  const copyTextToClipboard = (text) => {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
  };

  return (
    <div className="App">
      {fields.map((field) => (
        <div key={field.id} className="field-container">
          <input
            type={field.type}
            value={field.value}
            onChange={(e) => handleInputChange(field.id, e.target.value)}
            onFocus={() => setFocusedInputId(field.id)}
            ref={(el) => (inputRefs.current[field.id - 1] = el)}
          />
          <button onClick={() => handleButtonClick(field.id)} className="button-left">
            Copy Field {field.id}
          </button>
          <button onClick={() => handleRemoveButtonClick(field.id)} className="button-right">
            X
          </button>
        </div>
      ))}
      <div className="contain-btn">
        <button onClick={handleDistributeButtonClick} className="add-button">
          Distribute
        </button>
      </div>
      <div className="big-field-container">
        <textarea
          value={bigField.value}
          onChange={(e) => handleBigFieldChange(e.target.value)}
          placeholder="Big Field"
        />
      </div>
    </div>
  );
};

export default App;
