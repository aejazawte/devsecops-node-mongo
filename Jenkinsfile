pipeline {
    agent any

    tools {
        nodejs 'Node20'   // NodeJS tool configured in Jenkins
    }

    environment {
        Build_Number = "${BUILD_NUMBER}"
    }

    stages {
        stage('Clean Workspace') {
            steps {
                cleanWs()
            }
        }

        stage('Checkout') {
            steps {
                git branch: 'master',
                    url: 'https://github.com/aejazawte/devsecops-node-mongo',
                    credentialsId: 'github'
            }
        }

        stage('Install') {
            steps {
                sh 'npm install'
            }
        }

        stage('Build') {
            steps {
                sh 'npm run build'
            }
        }

        stage('Docker Build & Push') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'dockerhub', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                    sh 'echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin'
                    sh "docker build -t admaejaz/devsecops-node-mongo:${Build_Number} ."
                    sh "docker push admaejaz/devsecops-node-mongo:${Build_Number}"
                }
            }
        }

        stage("Update Image Tag in Kubernetes Manifest") {
            steps {
                sh "sed -i 's|Build_Tag|admaejaz/devsecops-node-mongo:${Build_Number}|g' k8s/app-deployment.yaml"
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                sh "kubectl apply -f k8s/app-deployment.yaml"
                sh "kubectl -n stateful-app rollout status deployment/stateful-node-app --timeout=120s"
            }
        }
    }
}
