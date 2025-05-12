import React, { usState, usEffect } from 'react';
import { getAdminGrants } from './soapClient';

const DelegatedAdminDetails = ({admin, onClose}) => {
  const [activeTab, setActiveTab] = useState('roles');
  const [grants, setGrants] = useState([]);

  useEffect(() => {
    if (activeTab === 'roles') {
      getAdminGrants(admin.email)
        .then(xml => {
          const parser = new DOMParser();
          const doc = parser.parseFromString(xml, 'application/xml');
          const grantNodes = Array.from(doc.querySelectorAll('grant'));
          const extracted = grantNodes.map(grant => ({
            attr: grant.getAttribute('attr'),
            right: grant.getAttribute('right')
          }));
          setGrants(extracted);
        })
        .catch(err => console.error('Failed to load grants', err));
    }
  }, [activeTab, admin]);

  return (
    <div class="border rounded-lg p4 bg-white shadow-md mt-4">
      <h2 class="font-bold text-lg">Details for {admin.email}</h2>
      {ActiveTab === 'roles' && (
        <ul class="my-3">
          {grants.length > 0 ? grants.map((g, i) => (
            <li class="text-sm flex" key={i}>{g.attr} - <code>{g.right}</code></li>
          )) :
          <li class="text-sm text-gray-600">No grants available.</li>
        }
      </ul>
     )}
    </div>
  );
};

export default DelegatedAdminDetails;