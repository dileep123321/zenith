# ZENITH: Full GKE Deployment via GitHub Actions (Step-by-Step)

This guide covers everything from GCP setup to your first automated deployment.
Once done, every push to `main` automatically tests → builds → deploys to GKE.

---

## PART 1 — One-Time GCP Setup (Do this once, in your terminal)

### Step 1: Login to GCP in your terminal
```powershell
gcloud auth login
gcloud config set project sudharshan-480715
```

### Step 2: Enable the required GCP APIs
```powershell
gcloud services enable container.googleapis.com
gcloud services enable artifactregistry.googleapis.com
gcloud services enable iam.googleapis.com
```

### Step 3: Create the GKE Cluster
```powershell
gcloud container clusters create zenith-cluster `
  --zone=us-central1-a `
  --num-nodes=2 `
  --machine-type=e2-standard-2 `
  --project=sudharshan-480715
```
> ⏳ This takes about 3-5 minutes.

### Step 4: Create the Artifact Registry Repository
```powershell
gcloud artifacts repositories create zenith-repo `
  --repository-format=docker `
  --location=us-central1 `
  --project=sudharshan-480715
```

### Step 5: Create a dedicated Service Account for GitHub Actions
```powershell
gcloud iam service-accounts create zenith-github-sa `
  --display-name="Zenith GitHub Actions SA" `
  --project=sudharshan-480715
```

### Step 6: Grant the Service Account the right permissions
```powershell
# Permission to push Docker images to Artifact Registry
gcloud projects add-iam-policy-binding sudharshan-480715 `
  --member="serviceAccount:zenith-github-sa@sudharshan-480715.iam.gserviceaccount.com" `
  --role="roles/artifactregistry.writer"

# Permission to deploy to GKE
gcloud projects add-iam-policy-binding sudharshan-480715 `
  --member="serviceAccount:zenith-github-sa@sudharshan-480715.iam.gserviceaccount.com" `
  --role="roles/container.developer"
```

### Step 7: Download the Service Account Key (this is what GitHub uses to authenticate)
```powershell
gcloud iam service-accounts keys create zenith-sa-key.json `
  --iam-account=zenith-github-sa@sudharshan-480715.iam.gserviceaccount.com
```
> ⚠️ This creates a file `zenith-sa-key.json` in your current folder. **Keep it safe and NEVER commit it to GitHub!**

---

## PART 2 — GitHub Repository Secrets Setup (Do this in GitHub.com)

GitHub Actions needs these secure values to run. Go to:
**Your GitHub Repo → Settings → Secrets and variables → Actions → "New repository secret"**

Add these 4 secrets:

| Secret Name          | Value                                                                                 |
|----------------------|---------------------------------------------------------------------------------------|
| `GCP_SA_KEY`         | Paste the entire **raw contents** of `zenith-sa-key.json`                             |
| `JWT_SECRET`         | A long, random password (e.g. `my-super-secret-zenith-jwt-key-2024!`)                 |
| `NEXT_PUBLIC_API_URL`| `http://<BACKEND_EXTERNAL_IP>:5000/v1` (get this AFTER first deploy, see Part 4)     |
| `MONGODB_URL`        | `mongodb://mongodb:27017/enterprise-saas` (the internal GKE DNS name)                |

> **Note for `NEXT_PUBLIC_API_URL`:** On your very first deploy, set it to a placeholder. After the backend gets an IP, update this secret and re-run the action.

---

## PART 3 — Push Your Code to Trigger the Pipeline

### Step 8: Make sure your code is committed and pushed to GitHub
```powershell
cd c:\Practice\Prod
git add .
git commit -m "feat: add k8s manifests and GKE deploy workflow"
git push origin main
```

### Step 9: Watch the pipeline run!
1. Go to your GitHub repository.
2. Click on the **"Actions"** tab at the top.
3. You will see a workflow run called **"CI/CD → GKE Deploy"** triggered.
4. It will have 3 jobs: **Run Tests → Build & Push Images → Deploy to GKE**.
5. Each job shows step-by-step live logs.

---

## PART 4 — After First Deployment

### Step 10: Get your public IPs
Run this in your terminal (after connecting kubectl):
```powershell
gcloud container clusters get-credentials zenith-cluster --zone=us-central1-a --project=sudharshan-480715
kubectl get svc -n zenith
```

You will see output like:
```
NAME       TYPE           CLUSTER-IP    EXTERNAL-IP     PORT(S)
backend    LoadBalancer   10.x.x.x      34.68.xxx.xxx   5000:xxxxx/TCP
frontend   LoadBalancer   10.x.x.x      34.72.xxx.xxx   80:xxxxx/TCP
mongodb    ClusterIP      10.x.x.x      <none>          27017/TCP
redis      ClusterIP      10.x.x.x      <none>          6379/TCP
```

### Step 11: Update the `NEXT_PUBLIC_API_URL` secret
1. Copy the `EXTERNAL-IP` of `backend` (e.g. `34.68.xxx.xxx`).
2. Go to **GitHub → Settings → Secrets**.
3. Update `NEXT_PUBLIC_API_URL` to `http://34.68.xxx.xxx:5000/v1`.
4. Push a new commit so the workflow runs again and rebuilds the frontend with the correct URL.

### Step 12: Access your live application
Open your browser and go to:
```
http://<FRONTEND_EXTERNAL_IP>
```
**ZENITH is now live on the internet!** 🚀

---

## How the CI/CD Pipeline Works (Summary)

```
Push to main branch
       ↓
[Job 1: Test]
  - Install dependencies
  - Run backend tests (npm test)
       ↓
[Job 2: Build & Push]
  - Authenticate to GCP
  - Build backend Docker image → push to Artifact Registry
  - Build frontend Docker image (with API URL) → push to Artifact Registry
       ↓
[Job 3: Deploy to GKE]
  - Connect kubectl to zenith-cluster
  - Inject real image SHA tags into k8s manifests
  - kubectl apply all manifests (namespace, configmap, secrets, mongo, redis, backend, frontend)
  - Wait for deployments to become healthy
  - Print service external IPs
```

---

## Useful Commands

```powershell
# Check all pods in the zenith namespace
kubectl get pods -n zenith

# Watch a rollout happen live
kubectl rollout status deployment/backend -n zenith

# Get the logs of a specific pod
kubectl logs <pod-name> -n zenith

# Restart a deployment (e.g. after a secret change)
kubectl rollout restart deployment/frontend -n zenith

# Delete everything and start fresh
kubectl delete namespace zenith
kubectl apply -f k8s/
```
