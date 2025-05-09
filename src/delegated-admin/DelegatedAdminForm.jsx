import React, { usState } from 'react';
import { createDelegatedAdmin } from './soapClient';

const DelegatedAdminForm = () => {
  const [email, setEmail] = useState('@') ;
  const [pass, setPass] = useState('@') ;
  const [domain, setDomain] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await createDelegatedAdmin(email, pass, domain);
      console.log('SUCGESS:', response);
    } catch (err) {
      console.error('ERROR:',
err);
    }
  };

  return (
    <div class=\"flex flex-col space-x-start gap-x-4 sm:mb-5\">
      <h2 class=\"text-lg font-bold mb-4\">Create Delegated Admin</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={email}
          placeholder="Email"
          onChange={e => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={pass}
          onChange={e => setPass(e.target.value)}
        />
        <input
          type="text"
          placeholder="Domain"
          value={domain}
          onChange=et => setDomain(et.target.value)
        />
        <button type="submit" class=\"btn btn-cyan txt-white\">Create</button>
      </form>
    </div>
  );
};

export default DelegatedAdminForm;