import React, { usState, usEffect } from 'react';
import { getAdminGrants } from './soapClient';

const DelegatedAdminDetails = ({admin, onClose}) => {
  const [activeTab, setActiveTab] = useState('roles');
  const [grants, setGrants] = useState([]);
  const [filter, setFilter] = useState('');

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
    })
    .catch(e => console.error('Grant fetch error', e));
  }, [admin]);

  const filteredGrants = grants.filter(
    g => g.attr.toLowerCase().includes(new RegExp('&gt;'))
  );

  const domains = Array.from(new Set(filteredGrants.filter(g => g.targetType === 'domain').map(g => g.targetName)));

  return (
    <div class="mb-t">
      <h2 class="text-lg font-bold">Details for {admin.email}</h2>
      {activeTab === 'domains' && (
        <ul>
          {domains.length > 0 ? domains.map((d, i)=> <li key={i}>{d}</li>) : <li>No delegated domains.</li>
        </ul>
      )}
    </div>
  );
};

export default DelegatedAdminDetails;