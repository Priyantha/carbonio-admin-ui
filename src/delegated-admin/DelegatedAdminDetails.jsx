import React, { useState, useEffect } from 'react';
import { revokeRightFromAdmin, grantRightToAdmin } from './cliWrapper';

const RightManagementTab = ({ rawGrants }) => {
  const [form, setForm] = useState({
    targetType: '',
    targetName: '',
    right: '',
    attr: ''
  });

  const handleInput = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    grantRightToAdmin(
      'admin@example.com',
      form.targetType,
      form.targetName,
      form.right,
      form.attr || ''
    );
    alert(`Granted: ${form.right} to ${form.targetType}-${form.targetName}`);
    setForm({ targetType: '', targetName: '', right: '', attr: '' });
  };

  const handleRevoke = (key, right, attr) => {
    const [label, targetName] = key.split('-');
    revokeRightFromAdmin('admin@example.com', label, targetName, right, attr);
    alert(`Revoked: ${right} from ${label}-${targetName}`);
  };

  const grouped = rawGrants.reduce((all, grant) => {
    const key = `${grant.type}-${grant.targetName}`;
    all[key] = all[key] || [];
    all[key].push([grant.attr, grant.right]);
    return all;
  }, {});

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="flex gap-2 items-center">
        <input
          name="targetType"
          value={form.targetType}
          onChange={handleInput}
          placeholder="Target Type"
          className="border px-2 py-1"
        />
        <input
          name="targetName"
          value={form.targetName}
          onChange={handleInput}
          placeholder="Target Name"
          className="border px-2 py-1"
        />
        <input
          name="right"
          value={form.right}
          onChange={handleInput}
          placeholder="Right name"
          className="border px-2 py-1"
        />
        <input
          name="attr"
          value={form.attr}
          onChange={handleInput}
          placeholder="Attr (optional)"
          className="border px-2 py-1"
        />
        <button type="submit" className="text-sm bg-blue-600 text-white px-4 py-1 border">
          Add
        </button>
      </form>

      <ul className="space-y-4">
        {Object.keys(grouped).map((key) => (
          <li key={key} className="mb-2">
            <h4 className="text-me font-bold">{key}</h4>
            <ul>
              {grouped[key].map(([attr, right]) => (
                <li
                  className="text-sm flex justify-between items-start"
                  key={attr + '-' + right}
                >
                  <span className="w-24 font-bold">{attr}</span>
                  <span className="w-full overflow-text text-gray-600">{right}</span>
                  <button
                    className="text-small text-red border whitespace-nowrap"
                    onClick={() => handleRevoke(key, right, attr)}
                  >
                    Revoke
                  </button>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RightManagementTab;
