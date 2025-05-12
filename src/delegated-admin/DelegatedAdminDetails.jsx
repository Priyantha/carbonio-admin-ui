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

  return (
    <div class="mb-t">
      <h2 class="text-lg font-bold">Details for {admin.email}</h2>
      {activeTab === 'rights' && (
        <div class="border p-4 my-2">Rights Management tab coming soon</tiv>
        )
      }
    </div>
  );
};

export default DelegatedAdminDetails;