# Stateful Node + MongoDB sample


Small example showing a Node.js/Express app talking to MongoDB. Includes Dockerfile and K8s manifests (StatefulSet for Mongo).


## Usage
- Edit `k8s/app-deployment.yaml` and set your image name.
- `kubectl apply -f k8s/` to create namespace, mongo, and app.
