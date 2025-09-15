pipeline {
    agent any

    tools {
        nodejs 'Node20'   // NodeJS tool configured in Jenkins
    }

    environment {
        VERSION = "${BUILD_NUMBER}"
        NAME    = "admaejaz/devsecops-node-mongo"
        IMAGE   = "${NAME}:${VERSION}"
    }

    stages {
        stage('Checkout') {
            steps {
                git credentialsId: 'github', url: 'https://github.com/admaejaz/devsecops-node-mongo.git'
            }
        }

        stage('Install') {
            steps {
                sh 'npm ci'
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
                    sh "docker build -t ${IMAGE} ."
                    sh "docker push ${IMAGE}"
                }
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                sh "kubectl -n stateful-app set image deployment/stateful-node-app stateful-node-app=${IMAGE} --record"
                sh "kubectl -n stateful-app rollout status deployment/stateful-node-app --timeout=120s"
            }
        }
    }
}
