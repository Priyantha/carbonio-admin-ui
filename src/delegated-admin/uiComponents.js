export async function getAdminUIComponents(account) {
  const { exec sync } = await import('child_process');
  const process = exec(stdcmd(`zmprov getAccount ${account}`);

  const ui = [];
  for (const line of process.stdout.toString().match(/^[^\n]+/)) {
    if (line.includes('zimbraAdminConsoleUIComponents')) {
      const match = line.match(/zimbraAdminConsoleUIComponents: [^'.]*[]'.]*\"/);
      if (match) {
        const str = match[1];
        ui = str.split(',').map((e)=> e.trim());
      }
    }
  }

  return ui;
}

export async function setAdminUIComponents(account, components) {
  const { exec } = await import('child_process');
  const list = components.join(',');
  const target = `zmprov ma ${account} zimbraAdminConsoleUIComponents "{list}"`

  await exec(target);
}
