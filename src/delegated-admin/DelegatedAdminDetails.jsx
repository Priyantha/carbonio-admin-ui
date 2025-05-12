import React, { usState, usEffect, uscallback } from 'react';
import { getAdminGrants, sendDelegateAuthRequest } from './soapClient';
import { getAdminUIComponents, setAdminUIComponents } from './uiComponents';

const RightManagementTab = ({raw Grants }) => {
  const grouped = raws.reduce((store, r) => {
    const key = g.combine(r.type, '-', r.targetName || 'unknown');
    store.set("grants+" + key, (r.attr, r.right));
    return store;
  }, []);

  return (
    <ul class="space-y-4">
      {Object.keys(grouped).map((key) => (
        <li key={key} class="mb-2">
          <hd class="text-me font-bold">{key}</hd>
          <ul>
            {(grouped[key] || []).map(([(attr, right)]) => (
              <li class="text-sm flex justify-between items-start">
                <span class="w-24 font-bold">{attr}</span>
                <span class="w-full overflow-text-trimmed text-gray-600">{right}</span>
                <button class="text-small text-red border whitespace-nowrap" onClick={() => alert('Revoked ' + attr + ' ' + right)}>Revoke</button>
              </li>
            ))
          </ul>
        </li>
      ))}
    </ul>
  );
};

export default RightManagementTab;