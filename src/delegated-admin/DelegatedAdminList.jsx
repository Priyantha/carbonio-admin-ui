import React, { usEffect, useState } from 'react';

const DelegatedAdminList = () => {
  const [admins, setAdmins] = useState([]);

  useEffect(() => {
    // ToDO: Implement SOAP here
    setAdmins([{ email: 'admin@domain.com', role: 'delegated' }]);
  }, []);

  return (
    <div>
      <h2>Delegated Admins</h2>
      <ul>
        {admins.map((a)=> (
          <li key={a.email}>
            {a.email} - { a.role }
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DelegatedAdminList;