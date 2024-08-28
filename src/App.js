import React, { useState, useEffect, useMemo } from 'react';
import './App.css';

const App = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  useEffect(() => {
    fetch('https://dummyjson.com/users')
      .then(response => response.json())
      .then(data => setUsers(data.users));
  }, []);

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  const sortedUsers = useMemo(() => {
    let sortableUsers = [...users];
    if (sortConfig.key) {
      sortableUsers.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableUsers;
  }, [users, sortConfig]);

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const filteredUsers = sortedUsers.filter(user =>
    Object.values(user).some(value =>
      value.toString().toLowerCase().includes(search.toLowerCase())
    )
  );

  return (
    <div className="container">
      <input
        type="text"
        placeholder="Поиск"
        value={search}
        onChange={handleSearch}
        className="search-input"
      />
      <table className="user-table">
        <thead>
          <tr>
            <th onClick={() => handleSort('name')}>ФИО</th>
            <th onClick={() => handleSort('age')}>Возраст</th>
            <th onClick={() => handleSort('gender')}>Пол</th>
            <th onClick={() => handleSort('phone')}>Номер телефона</th>
            <th onClick={() => handleSort('address')}>Адрес</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map(user => (
            <tr key={user.id}>
              <td>{`${user.firstName} ${user.lastName}`}</td>
              <td>{user.age}</td>
              <td>{user.gender}</td>
              <td>{user.phone}</td>
              <td>{`${user.address.city}, ${user.address.street}`}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default App;

