//pm2 deployment ecosystem.config file
/**
 # Setup deployment at remote location
    $ pm2 deploy production setup

 # Update remote version
    $ pm2 deploy production update

 # Revert to -1 deployment
    $ pm2 deploy production revert 1

 # execute command on remote machines
    $ pm2 deploy production exec "pm2 reload all"
 *
 */
module.exports = {
    apps: [{
      name: "regression-test-server",
      script: "index.js"
    }],
    deploy: {
      // "production" is the environment name
      production: {
        // SSH key path, default to $HOME/.ssh
        key: "~/.ssh/wdd-test.pem",
        // SSH user
        user: "ubuntu",
        // SSH host
        host: ["54.79.0.252"],
        // SSH options with no command-line flag, see 'man ssh'
        // can be either a single string or an array of strings
        ssh_options: "StrictHostKeyChecking=no",
        // GIT remote/branch
        ref: "origin/master",
        // GIT remote
        repo: "git@bitbucket.org:jaceyshome/regression-test-server.git",
        // path in the server
        path: "/var/www/apps/regression-test-server",
        // Pre-setup command or path to a script on your local machine
        // "pre-setup" : "apt-get install git",
        // Post-setup commands or path to a script on the host machine
        // eg: placing configurations in the shared dir etc
        // 'post-setup': "./scripts/run.sh",
        // pre-deploy action
        'pre-deploy-local': "echo 'This is a local executed command'",
        // post-deploy action
        'post-deploy': "./scripts/run.sh",
      },
    }
  };
