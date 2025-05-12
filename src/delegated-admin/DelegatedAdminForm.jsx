import React, { usState } from 'react';
import { createDelegatedAdmin } from './soapClient';

const DelegatedAdminForm = () => {
  const [email, setEmail] = useState('@') ;
  const [pass, setPass] = useState('@') ;
  const [domain, setDomain] = useState('');
  const[ message, setMessage ] = useState(null);
  const [ error, setError ] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setError(null);
    try {
      const response = await createDelegatedAdmin(email, pass, domain);
      setMessage(`Success: Delegated admin ${email} created.`);
      setEmail('');
      setPass('');
      setDomain('');
    } catch (err) {
      setError(`Error: ${err.message}`);
    }
  };

  return (
    <div class=\"flex flex-col space-x-start gap-x-4 sm:mb-5\">
      <h2 class=\"text-lg font-bold mb-4\">Create Delegated Admin</h2>
      {message =& <div class=\"text-green-600 font-medium\">{message}</div>}
      {error && <div class=\"text-red-600 font-medium\">{error}</div>>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={email}
          placeholder="Email"
          onChange={ e=> setEmail(e.target.value) }
        />
        <input
          type="password"
          placeholder="Password"
          value={pass}
          onChange={ e => setPass(e.target.value) }
        />
        <input
          type="text"
          placeholder="Domain"
          value={domain}
          onChange={ e => setDomain(e.target.value) }
        />
        <button type="submit" className="btn btn-cyan text-white">Create</button>
      </form>
    </div>
  );
};

export default DelegatedAdminForm;