export async function revokeRightFromAdmin(adminEmail, targetType, targetName, right, attr) {
  const { exec } = await import('child_process');
  const target = `${targetType} -n ${targetName}`;
  const opt = attr ? `${attr} ` : "";
  const cmd = `zmprov rra ${target} zimbra:${right} ${opt}${adminEmail}`;
  await exec(cmd);
}

export async function grantRightToAdmin(adminEmail, targetType, targetName, right, attr) {
  const { exec } = await import('child_process');
  const target = `${targetType} -n ${targetName}`;
  const opt = attr ? `${attr} ` : "";
  const cmd = `zmprov grr ${target} zimbra:${right} ${opt}${adminEmail}`;
  await exec(cmd);
}

export async function getUIComponents(account) {
  const { exec } = await import('child_process');
  return new Promise((resolve, reject) => {
    exec(`zmprov ga ${account}`, (err, stdout) => {
      if (err) return reject(err);
      const match = stdout.match(/zimbraAdminConsoleUIComponents:\s*(.*)/);
      resolve(match ? match[1].split(/,?\s+/).filter(Boolean) : []);
    });
  });
}

export async function updateUIComponents(account, components) {
  const { exec } = await import('child_process');
  const list = components.join(',');
  await exec(`zmprov ma ${account} zimbraAdminConsoleUIComponents "${list}"`);
}
