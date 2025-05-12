import React, { useState, useEffect } from 'react';
import { revokeRightFromAdmin, grantRightToAdmin, getUIComponents, updateUIComponents } from './cliWrapper';

const RightManagementTab = ({ rawGrants }) => {
  const [form, setForm] = useState({
    targetType: '',
    targetName: '',
    right: '',
    attr: ''
  });

  const [uiAccount, setUiAccount] = useState('');
  const [uiComponents, setUiComponents] = useState([]);
  const [newComponent, setNewComponent] = useState('');

  const fetchUIComponents = async () => {
    const data = await getUIComponents(uiAccount);
    setUiComponents(data);
  };

  const saveUIComponents = async () => {
    await updateUIComponents(uiAccount, uiComponents);
    alert('Updated UI Components!');
  };

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

      <div className="space-y-2 border-t pt-4">
        <h3 className="font-semibold">UI Components Configuration</h3>
        <input
          value={uiAccount}
          onChange={(e) => setUiAccount(e.target.value)}
          placeholder="admin@example.com"
          className="border px-2 py-1"
        />
        <button onClick={fetchUIComponents} className="ml-2 text-sm border px-3 py-1">
          Load Components
        </button>
        <ul>
          {uiComponents.map((comp, idx) => (
            <li key={idx} className="flex gap-2 items-center">
              <span>{comp}</span>
              <button
                className="text-red-600 text-xs"
                onClick={() => setUiComponents(uiComponents.filter((c) => c !== comp))}
              >
                remove
              </button>
            </li>
          ))}
        </ul>
        <div className="flex gap-2 items-center">
          <input
            value={newComponent}
            onChange={(e) => setNewComponent(e.target.value)}
            placeholder="New Component"
            className="border px-2 py-1"
          />
          <button
            onClick={() => {
              if (newComponent && !uiComponents.includes(newComponent)) {
                setUiComponents([...uiComponents, newComponent]);
                setNewComponent('');
              }
            }}
            className="text-xs border px-2"
          >
            add
          </button>
        </div>
        <button
          onClick={saveUIComponents}
          className="text-sm mt-2 border bg-green-500 text-white px-4 py-1"
        >
          Save Changes
        </button>
      </div>

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
