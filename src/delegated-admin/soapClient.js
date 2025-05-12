export async function getAdminGrants(email) {
  const soapBody = `
    <soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope">
      <soap:Header>
        <context xmlns="urn:zimbra">
          <authToken xmlns="urn:zimbra"/>
        </context>
      </soap:Header>
      <soap:Body>
        <GetGrantsRequest xmlns="urn:zimbraAdmin">
          <target type="account" name="${email}" />
        </GetGrantsRequest>
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
  if (!res.ok) throw new Error(`Failed: ${res.status}`);

  const text = await res.text();
  return text;
}
