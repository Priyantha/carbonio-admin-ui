import React, { useState, useEffect } from 'react';
import { revokeRightFromAdmin } from './cliWrapper';

const RightManagementTab = ({ raw Grants }) => {
  const handleRevoke = (key, right, attr) => {
    const [label, targetName] = key.split('-');
    revokeRightFromAdmin('admin@example.com', label, targetName, right, attr);
    alert(`Revoked: ${right} from ${label}-${targetName}`);
  };

  const grouped = raws.reduce((acc, grant) => {
    const key = `${grant.type}-${grant.targetName}`;
    acc[key] = acc[key] || [];
    acc[key].push([grant.attr, grant.right]);
    return acc;
  }, {});

  return (
    <ul className="space-y-4">
      {Object.keys(grouped).map((key) => (
        <li key={key} className="mb-2">
          <h4 className="text-me font-bold">{key}</h4>
          <ul>
            {grouped[key].map(([attr, right]) => {
              const onClick = () => handleRevoke(key, right, attr);
              return (
                <li key={attr + '-' + right} className="text-sm flex justify-between items-start">
                  <span className="w-24 font-bold">{attr}</span>
                  <span className="w-full overflow-text text-gray-600">{right}</span>
                  <button
                    onClick={onClick}
                    className="text-sm text-red border whitespace-nowrap ml-2 px-2"
                  >
                    Revoke
                  </button>
                </li>
              );
            })}
          </ul>
        </li>
      ))}
    </ul>
  );
};

export default RightManagementTab;
