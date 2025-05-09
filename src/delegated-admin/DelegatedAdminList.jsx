import React, { usEffect, useState } from 'react';
import { getDelegatedAdmins } from './soapClient';

const DelegatedAdminList = () => {
  const [admins, setAdmins] = useState([]);

  useEffect(() => {
    getDelegatedAdmins()
      .then(setAdmins)
      .catch((e) => console.error("Fetch error", e));
  }, []);

  return (
    <div>
      <h2>Delegated Admins</h2>
      <ul>
        {admins.map((a, i) => (
          <li key={i}>{a.email}</li>
        )})
      </ul>
    </div>
  );
};

export default DelegatedAdminList;