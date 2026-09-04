# -*- mode: ruby -*-
Vagrant.configure("2") do |config|
  config.vm.box = "generic/centos9s"  # RHEL-family box
  config.vm.hostname = "expense-tracker-host"

  config.vm.network "forwarded_port", guest: 3000, host: 3000

  config.vm.provider "virtualbox" do |vb|
    vb.memory = "2048"
    vb.cpus = 2
  end

  config.vm.provision "ansible" do |ansible|
    ansible.playbook = "ansible/playbook.yml"
  end
end
