pipeline {
    agent any

    environment {
        IMAGE_NAME = "expense-tracker-api"
        ARTIFACTORY_URL = credentials('artifactory-url')
        ARTIFACTORY_CREDS = credentials('artifactory-creds')
    }

    stages {
        stage('Install & Test') {
            steps {
                dir('app') {
                    sh 'npm install'
                    sh 'npm test'
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                sh "docker build -t ${IMAGE_NAME}:${BUILD_NUMBER} ./app"
            }
        }

        stage('Push to Artifactory') {
            steps {
                sh """
                    echo $ARTIFACTORY_CREDS_PSW | docker login $ARTIFACTORY_URL -u $ARTIFACTORY_CREDS_USR --password-stdin
                    docker tag ${IMAGE_NAME}:${BUILD_NUMBER} $ARTIFACTORY_URL/${IMAGE_NAME}:${BUILD_NUMBER}
                    docker push $ARTIFACTORY_URL/${IMAGE_NAME}:${BUILD_NUMBER}
                """
            }
        }

        stage('Helm Lint & Package') {
            steps {
                sh 'helm lint ./helm/expense-tracker'
                sh 'helm package ./helm/expense-tracker'
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                sh "helm upgrade --install expense-tracker ./helm/expense-tracker --set image.tag=${BUILD_NUMBER}"
            }
        }
    }
}
