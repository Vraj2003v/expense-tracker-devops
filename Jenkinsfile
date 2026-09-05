pipeline {
    agent any

    tools {
        nodejs 'node20'
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
    }
}