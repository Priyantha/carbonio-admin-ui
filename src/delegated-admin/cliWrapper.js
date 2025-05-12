export async function revokeRightFromAdmin(adminEmail, targetType, targetName, right, attr) {
  const { exec } = await import('child_process');
  const target = `${targetType} -n ${targetName}`;
  const opt = attr ? `${attr} ` : "";
  const cmd = `zmprov rra ${target} zimbra:${right} ${opt} ${adminEmail}`;
  await exec(cmd);
}

export async function grantRightToAdmin(adminEmail, targetType, targetName, right, attr) {
  const { exec } = await import('child_process');
  const target = `${targetType} -n ${targetName}`;
  const opt = attr ? `${attr} ` : "";
  const cmd = `zmprov grr ${target} zimbra:${right} ${opt} ${adminEmail}`;
  await exec(cmd);
}