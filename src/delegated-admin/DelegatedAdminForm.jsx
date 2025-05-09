import React, { usState } from 'react';

const DelegatedAdminForm = () => {
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [domain, setDomain] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Implement SOAP CALL  here
    console.log(`Create: ${email} - ${domain}`);
  };

  return (
    <div>
      <h2>Create Delegated Admin</h2>
      <form onSubmit={handleSubmit}>
        <input placeholder="Email" value={email} onChange=e => setEmail(e.target.value)} />
        <input type="password" placeholder="Password" value={pass} onChange=e => setPass(e.target.value)} />
        <input placeholder="Domain" value={domain} onChange=e => setDomain(e.target.value)} />
        <button type="submit">Create</button>
      </form>
    </div>
  );
};

export default DelegatedAdminForm;