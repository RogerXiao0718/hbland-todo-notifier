module.exports = {
  apps : [{
    name   : "hbland-todo-notifier",
    exec_mode: "cluster",
    instances: '3',
    script: 'node_modules/next/dist/bin/next',
    args: 'start -p 9080',
    max_memory_restart: '400M',
    env_local: {
      APP_ENV: 'local'
    },
    env_dev: {
      APP_ENV: 'dev'
    },
    env_prod: {
      APP_ENV: 'prod'
    }
  }]
}
