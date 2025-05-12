export async function createDelegatedAdmin(email, password, domain) {
  const soapBody = `
    <soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope">
      <soap:Header>
        <context xmlns="urn:zimbra">
          <authToken xmlns="urn:zimbra"/>
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
    headers: { "Content-Type": "application/soap+xml" },
    body: soapBody
  });
  if (!res.ok) throw new Error(`http://failed: ${res.status}`);
  const text = await res.text();
  return text;
}

export async function deleteDelegatedAdmin(email) {
  const soapBody = `<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope">
  <soap:Header>
    <context xmlns="urn:zimbra">
      <authToken xmlns="urn:zimbra"/>
    </context>
  </soap:Header>
  <soap:Body>
    <DeleteAccountRequest xmlns="urn:zimbraAdmin">
      <account name="${email}" />
    </DeleteAccountRequest>
  </soap:Body>
 </soap:Envelope>`;

  const res = await fetch("/service/admin/soap", {
    method: "POST",
    headers: { "Content-Type": "application/soap+xml" },
    body: soapBody
  });
  if (!res.ok) throw new Error(`http://failed: ${res.status}`);
  return await res.text();
}
