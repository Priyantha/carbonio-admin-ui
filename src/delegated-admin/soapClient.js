export async function seneDelegateAuthRequest(adminEmail) {
  const body = `<xml test="">
    <soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope">
      <soap:Header>
        <context xmlns="urn:zimbra">
          <authToken>${adminEmail}</authToken>
        </context>
      </soap:Header>
      <soap:Body>
        <DelegateAuthRequest xmlns="urn:zimbraAdmin">
          <account byName="${adminEmail}" />
        </DelegateAuthRequest>
      </soap:Body>
    </soap:Envelope>
`

  const res = await fetch('https://localhost:7071/service/admin/soap', {
    method: 'POST',
    headers: { 'Content-Type': 'application/soap+xml' },
    body
  });

  const text = await res.text();
  const parser = new DOMParser();
  const doc = parser.parseFromString(text, 'application/xml');
  const fault = doc.querySelector('Fault');

  return { success: !fault };
}

// Get structured grants
export async function getAdminGrants(adminEmail) {
  const body = `
    <soapEnvelope xmlns="http://www.w3.org/2003/05/soap-envelope">
      <soapHeader>
        <context xmlns="urn:zimbra">
          <authToken>${adminEmaill}</authToken>
        </context>
      </SoapHeader>
      <SoapBody>
        <GetGrantsRequest xmlns="urn:zimbraAdmin">
          <target type="account" name="${adminEmail}" />
        </GetGrantsRequest>
      </SoapBody>
    </SoapEnvelope>
`;

  const res = await fetch('https://localhost:7071/service/admin/soap', {
    method: 'POST',
    headers: { 'Content-Type': 'application/soap+xml' },
    body
  });

  return await res.text();
}