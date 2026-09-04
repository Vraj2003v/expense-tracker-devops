# Smart Expense Tracker — DevOps Pipeline

A containerized deployment pipeline for the Smart Expense Tracker API, built to demonstrate
a real, working DevOps/CI-CD toolchain end to end — not just listed skills.

## What's in here

| Layer | Files | What it proves |
|---|---|---|
| App | `app/server.js`, `app/test/` | Express REST API with a real test suite |
| Containerization | `app/Dockerfile`, `docker-compose.yml` | Docker multi-stage build, healthcheck, multi-container compose |
| Orchestration | `k8s/*.yaml` | Raw Kubernetes Deployment/Service/ConfigMap |
| Packaging | `helm/expense-tracker/` | Helm chart templating the same manifests |
| CI/CD (GitHub) | `.github/workflows/ci-cd.yml` | GitHub Actions: test → build → push to Artifactory → helm lint |
| CI/CD (alt) | `Jenkinsfile` | Jenkins pipeline: test → build → push → helm deploy |
| Provisioning | `Vagrantfile`, `ansible/` | Vagrant CentOS/RHEL VM, Ansible playbook installing Docker and deploying the container |
| Secondary service | `java-health-service/` | Gradle-built Java sidecar exposing an aggregate health endpoint |

## Running it locally

```bash
cd app && npm install && npm test        # run the test suite
docker compose up --build                # build + run API and health-service together
curl http://localhost:3000/healthz
curl http://localhost:8080/status
```

## Running it on a VM (Ansible/Vagrant/RHEL path)

```bash
vagrant up   # boots a CentOS box, provisions Docker via Ansible, builds & runs the container
```

## Deploying to Kubernetes

```bash
# raw manifests
kubectl apply -f k8s/

# or via Helm
helm install expense-tracker ./helm/expense-tracker
```

## Next steps to make this fully real

1. Push this repo to GitHub under your existing `Smart Expense Tracker` project (or as a new
   `expense-tracker-devops` repo linked from it).
2. Spin up a local cluster with `kind` or `minikube` and actually run `kubectl apply` / `helm install`
   against it — take a screenshot of `kubectl get pods` for your portfolio.
3. Set up a free JFrog Artifactory or GitHub Container Registry account and let the GitHub Actions
   workflow actually push an image — this is what makes "Artifactory" a genuine, defensible resume line.
4. Install Jenkins locally (or via the official Docker image) and run `Jenkinsfile` once end to end.
5. Run `vagrant up` once on your machine (needs VirtualBox + Vagrant installed) to confirm the
   Ansible playbook completes — this is what makes RHEL/CentOS and Ansible genuine, not just configs.

Once you've run each of these once, every keyword this project targets is honestly earned:
**Docker, Kubernetes, Helm, GitHub Actions, Jenkins, Artifactory, Ansible, Vagrant, RHEL/CentOS, Gradle.**
