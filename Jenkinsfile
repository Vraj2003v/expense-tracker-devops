pipeline {
    agent any

    environment {
        IMAGE_NAME = "expense-tracker-api"
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
    }
}