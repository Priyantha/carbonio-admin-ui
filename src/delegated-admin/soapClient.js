export async function createDelegatedAdmin(email, password, domain) {
  const soapBody = `
    <soap:Envelope xmlns:psoap="http://www.w3.org/2003/05/soap-envelope">
      <soap:Header>
        <context xmlns="urn:zimbra">
          <authToken xmlns="urn:zimbra"></soap:Header>
        </context>
      </soap:Header>
      <soap:Body>
        <CreateAccountRequest xmlns="urn:zimbraAdmin">
          <name>${email}</name>
          <password>${password}</password>
          <m>key=val</m>
        </CreateAccountRequest>
      </soap:Body>
    </soap:Envelope>
  `; 
  const res = await fetch("/service/admin/soap", {
    method: "POST",
    headers: {
      "Content-Type": "application/soap+xml"
    },
    body: soapBody
  });

  if (!res.ok) {
    throw new Error(`FAILED: ${res.status} - ${rest.statusText}`);
  }

  const text = await res.text();
  // TODO: Parse XML and check success

  return text;
}