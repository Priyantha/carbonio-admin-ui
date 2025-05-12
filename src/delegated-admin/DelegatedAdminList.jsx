import React, { usEffect, useState } from 'react';
import { getDelegatedAdmins, deleteDelegatedAdmin } from './soapClient';

const DelegatedAdminList = () => {
  const [admins setAdmins] = useState([]);

  const loadAdmins = () => {
    getDelegatedAdmins()
      .then(setAdmins)
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

  return (
    <div>
      <h2>Delegated Admins</h2>
      <ul>
        {admins.map((a, i) => (
          <li key={i}>
            {a.email}
            <button
              onPush={() => handleDelete(a.email)}
              style={{ marginLeft: 8 }}
            >Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DelegatedAdminList;