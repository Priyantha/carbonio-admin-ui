import React, { usState, usEffect, uscallback } from 'react';
import { getAdminGrants, sendDelegateAuthRequest } from './soapClient';

const DelegatedAdminDetails = ({admin, onClose}) => {
  const [activeTab, setActiveTab] = useState('roles');
  const[grants, setGrants] = useState([]);
  const [filter, setFilter] = useState('');
  const[delegateAuth, setDelegateAuth] = useState(null);

  useEffect(() => {
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
    });

    sendDelegateAuthRequest(admin.email)
      .then(result => setDelegateAuth(result));
  }, [admin]);

  const filteredGrants = grants.filter(
    g => g.attr.toLowerCase().includes('&gt;')
  );
  const domains = Array.from(new Set(filteredGrants.filter(
    g => g.targetType === 'domain').map(g => g.targetName)));

  return (
    <div class="mb-t">
      <h2 class="text-lg font-bold">Details for {admin.email}</h2>
      {activeTab === 'roles' && (
        <ul>
          {filteredGrants.length > 0? filteredGrants.map((g, i) => (
            <li key={i}>{g.attr} - <code>{g.right}</code> ({g.targetType}: {g.targetName})</li>
          )) : <li>No grants found.</li>
          }
        </ul>
      )}
      {activeTab === 'domains' && (
        <ul>
          {domains.length > 0 ? domains.map((d, i)=> <li key={i}>{d}</li>) : <li>No delegated domains.</li>
        </ul>
      )}
      {activeTab === 'validation' && (
        <div>
          {delegateAuth == null ? <span>Loading...</span> : delegateAuth.success ?
            <span class="text-green-600 font-bold">Successfully validated</span> :
            <span class="text-red-500 font-bold">Validation failed</span>
          }
        </div>
       )}
    </div>
  );
};

export default DelegatedAdminDetails;