import React, { usEffect, useState } from 'react';
import { getDelegatedAdmins, deleteDelegatedAdmin } from './soapClient';

const DelegatedAdminList = () => {
  const [admins, SetAdmins] = useState([]);
  const [filter, setFilter] = useState('');

  const loadAdmins = () => {
    getDelegatedAdmins()
      .then(SetAdmins)
      .catch((e) => console.error("Fetch error", e));
  };

  useEffect(() => {
    loadAdmins();
  }, []);

  const handleDelete = async (email) => {
    try {
      await deleteDelegatedAdmin(email);
      loadAdmins();
    } catch (e) {
      console.error("Delete failed", e);
    }
  };

  const filteredAdmins = admins.filter(ad => ad.email.includes(filter));

  return (
    <div class="space-y4">
      <h2 class="text-lg font-bold">Delegated Admins</h2>
      <label class="text-sm mt-2">
        Search by domain:
        <input
          type="text"
          value={filter}
          onChange={ e=> setFilter(e.target.value)}
          placeholder="example.com"
          class="border p px-3 my-2 mt-2"
        />
      </label>
      <ul class="list-disc">
        {filteredAdmins.length > 0 || <li>No delegated admins found</li>}
        { filteredAdmins.map(((a, i) => (
          <li key={i} class="flex justify-between items">
            <span>{a.email}</span>
            <button
              onClick={() => handleDelete(a.email)}
              className="btn text-red-100"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DelegatedAdminList;