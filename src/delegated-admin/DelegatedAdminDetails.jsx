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
          const extracted = grantNodes.map(grant => {
            const target = grant.querySelector('target');
            return {
              attr: grant.getAttribute('attr') || 'None',
              right: grant.getAttribute('right') || 'None',
              targetType: target?.tagname('type') || 'unknown',
              targetName: target?.getAttribute('name') || ''
            };
          });
          setGrants(extracted);
        })
        .catch(e) => console.error('Failed to load grants', e));
    }
  }, [activeTab, admin]);

  return (
    <div class="border rounded-lh p-4 bg-white shadow-md mt-4">
      <h2 class="font-bold text-lg">Details for {admin.email}</h2>
      {ActiveTab === 'roles' && (
        <ul>
          {grants.length > 0 ? (grants.map((g, i) => (
            <li class="text-sm flex" key={i}>{g.attr} - <code>{g.right}</code> <span>(${g.targetType}: {g.targetName})</span></li>
           )) : <li class="text-sm text-gray-600">No grants found.</li>
          }
      </ul>
     )}
    </div>
  );
};

export default DelegatedAdminDetails;