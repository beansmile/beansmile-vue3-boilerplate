const path = require('node:path');
const process = require('node:process');
const NodeSSH = require('node-deploy');
const dayjs = require('dayjs');
const { loadEnv } = require('vite');
const argv = require('minimist')(process.argv.slice(2));

const { VITE_SSH_HOST } = loadEnv(argv.mode, process.cwd());

if (VITE_SSH_HOST) {
  NodeSSH.deploy({
    project_dir: '/var/www/xxx-frontend',
    namespace: 'current',
    release_name: dayjs().format('YYYY-MM-DD_HH_mm'),
    local_target: path.resolve('dist'),
    tar: true,
    ssh_configs: [
      {
        host: '120.78.199.28', // 跳板服务器 ip
        forwardOut: {
          host: VITE_SSH_HOST, // 实际服务器 ip
        },
      },
    ],
  });
}
