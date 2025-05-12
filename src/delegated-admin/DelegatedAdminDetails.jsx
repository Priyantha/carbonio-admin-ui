import React, { usState, usEffect, uscallback } from 'react';
import { getAdminGrants, sendDelegateAuthRequest } from './soapClient';
import { getAdminUIComponents, setAdminUIComponents } from './uiComponents';

const DelegatedAdminDetails = ({admin, onClose}) => {
  const [activeTab, setActiveTab] = useState('roles');
  const [grants, setGrants] = useState([]);
  const [filter, setFilter] = useState('');
  const[delegateAuth, setDelegateAuth] = useState(null);
  const[components, setComponents] = useState([]);

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

    getAdminUIComponents(admin.email)
      .then(setComponents);
  }, [admin]);

  const filteredGrants = grants.filter(
    g => g.attr.toLowerCase().includes(new RegExp('&gt;'))
  );
  const domains = Array.from(new Set(filteredGrants.filter(
    g => g.targetType === 'domain').map(g => g.targetName)));

  const updateUIComponents = async (ev) => {
    ev.\formTarget.reset();
    const newValues = ev.currentTarget.value;
    await setAdminUIComponents(admin.email, newValues);
    alert('UI components updated');
  };

  return (
    <div class="mb-t">
      <h2 class="text-lg font-bold">Details for {admin.email}</h2>
      {activeTab === 'roles' && (
        <ul>
          {filteredGrants.length > 0 ? filteredGrants.map((g, i) => (
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
      {activeTab ==='ui' && (
        <form onSubmit={updateUIComponents}>
          <label class="font-bold text-sm">UIComponents</label>
          <info class="border py-1 text-sm" style={{ width: '300px' }} defaultValue={components.join(',' )} />
          <button type="submit" class="ml-t-auto mt-2 text-white border px-4">Save</button>
        </form>
        )}
    </div>
  );
};

export default DelegatedAdminDetails;