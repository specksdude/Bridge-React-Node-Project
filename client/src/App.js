import React, { useState } from 'react';
import './App.css';
import Axio from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faCheck, faTimes , faPen } from '@fortawesome/free-solid-svg-icons';


function App() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState(0);
  const [phonebook, setPhonebook] = useState([]);
  const [showUpdate, setShowUpdate] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [updatedName, setUpdatedName] = useState('');
  const [updatedPhone, setUpdatedPhone] = useState('');

  const addNewNumber = () => {
    Axio.post('http://localhost:8080/add-phone', { name, phone })
      .then((response) => {
        setPhonebook(prevPhonebook => [...prevPhonebook, response.data.data.phoneNumber]);
        getNumbers();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getNumbers = () => {
    Axio.get('http://localhost:8080/get-phone')
      .then((response) => {
        console.log("dddddddd");
        setPhonebook(response.data.data.phoneNumbers);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  
  const updateNumber = (id) => {
    Axio.put('http://localhost:8080/update-phone', { id: id, name: updatedName, phone: updatedPhone })
      .then((response) => {
        setShowUpdate(false);
        getNumbers();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const deleteNumber = (entry) => {
    Axio.delete('http://localhost:8080/delete-phone', {
      data: { 
        id: entry._id
      }})
      .then((response) => {
        setPhonebook(prevPhonebook => prevPhonebook.filter(item => item !== entry));
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleUpdateClick = (entry) => {
    setSelectedEntry(entry);
    setShowUpdate(true);
    setUpdatedName(entry.name);
    setUpdatedPhone(entry.phone);
  };

  return (
    <div className="container">
      <h1>Phonebook</h1>

      <div className="form">
        <input type="text" onChange={(e) => setName(e.target.value)} placeholder="Name" />
        <input type="text" onChange={(e) => setPhone(e.target.value)} placeholder="Phone Number" />
        <button className="add-btn" onClick={addNewNumber}>Add</button>
      </div>

      <div className="actions">
        <button className="action-btn" onClick={getNumbers}>Get Numbers</button>
      </div>

      <ul className="phonebook">
        {phonebook.map((entry, i) => (
          <div>
            <li className='contact-tile' key={i}>
              <div className="entry-details">
                <div className="entry-name">{entry.name}</div>
                <div className="entry-phone">{entry.phone}</div>
              </div>
              <div className="entry-actions">
                <button className="delete-btn" onClick={() => deleteNumber(entry)}>
                  <FontAwesomeIcon icon={faTrash} color='white'/>
                </button>
                <button className="update-btn" onClick={() => handleUpdateClick(entry)}>
                  <FontAwesomeIcon icon={faPen} color='white'/>
                </button>
              </div>
              {showUpdate && selectedEntry._id === entry._id && (
                <div>
                  <div className="update-form">
                    <input type="text" value={updatedName} onChange={(e) => setUpdatedName(e.target.value)} placeholder="Name" />
                    <input type="text" value={updatedPhone} onChange={(e) => setUpdatedPhone(e.target.value)} placeholder="Phone Number" />
                    <div className="update-control-btns">
                      <button className="check-button" onClick={() => updateNumber(entry)}>
                        <FontAwesomeIcon  color='white' icon={faCheck} />
                      </button>
                      <button className="cross-button" onClick={() => setShowUpdate(false)}>
                        <FontAwesomeIcon  color='white' icon={faTimes} />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </li>
          </div>
        ))}
      </ul>
    </div>
  );
}

export default App;
