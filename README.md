# Smart Expense Tracker — DevOps Pipeline

Extension of my Smart Expense Tracker project. Added a full deployment pipeline around
the existing API to actually learn Docker/K8s/Helm/CI-CD/Ansible instead of just reading
about them.

## What's in here

- `app/` — Express API + test suite (already existed)
- `Dockerfile` + `docker-compose.yml` — Docker build for the API and a small Java sidecar
- `k8s/` — plain Kubernetes manifests (Deployment, Service, ConfigMap)
- `helm/expense-tracker/` — same thing as a Helm chart
- `.github/workflows/ci-cd.yml` — GitHub Actions: run tests, build image, push to GHCR
- `Jenkinsfile` — same tests, run through a local Jenkins instance instead
- `Vagrantfile` + `ansible/` — spins up a CentOS VM and installs Docker + runs the container on it
- `java-health-service/` — small Gradle-built Java service, just returns a health status

## Running it

```bash
cd app && npm install && npm test
docker compose up --build
curl http://localhost:3000/healthz
curl http://localhost:8080/status
```

Kubernetes:
```bash
kubectl apply -f k8s/
# or
helm install expense-tracker ./helm/expense-tracker
```

VM path:
```bash
vagrant up
```

## What I actually ran (not just wrote)

I went through all five pieces of this by hand on my own machine, not just committed the config files. Notes on what actually happened, including the stuff that broke:

**Docker** — tests passed, `docker compose up --build` worked, both healthchecks came back 200.

**Kubernetes + Helm** — deployed the raw manifests first, hit an `ImagePullBackOff` because the image tag wasn't in any registry, fixed it by pointing at the local image directly. Then installed the Helm chart as a second release next to it — Helm refused at first because it saw a resource with the same name already existed and wasn't created by Helm, fixed by giving the release a different name. Ended up with both deployments running side by side.

**GitHub Actions + GHCR** — switched the workflow from Artifactory to GHCR since it doesn't need extra secrets. First run failed because GHCR rejects image names with uppercase letters (my GitHub username has one) — fixed by lowercasing it before tagging. After that, all three jobs passed.

**Jenkins** — ran Jenkins itself in Docker, pointed it at this repo. First build failed because there's no Node.js inside a stock Jenkins container — installed the NodeJS plugin and configured it as a build tool. Second failure was a missing `libatomic.so.1` library that Node needed — installed it with apt inside the Jenkins container. After both fixes, the pipeline ran the test suite successfully.

**Vagrant + Ansible + RHEL/CentOS** — this one took the most debugging. Ansible doesn't run on Windows, so I switched Vagrant to run Ansible inside the VM itself instead of from the host. Then the default shared folder wasn't mounting (guest additions version mismatch with VirtualBox), so I switched to uploading the files directly instead of relying on the shared folder. Then the playbook couldn't find any hosts to run against because of an inventory mismatch — fixed by targeting all hosts instead of a named group. Then the Ansible Docker module itself broke because of a version conflict between two Python libraries it depends on — replaced it with a plain `docker run` shell command instead. After all of that, the playbook finished clean, Docker was running inside the CentOS VM, and the container responded on port 3000.