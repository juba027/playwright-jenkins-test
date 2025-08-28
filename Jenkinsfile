pipeline {
  agent any

  tools {
    maven 'Maven-3.9.9'
    jdk   'JDK17'
  }

  stages {
    stage('Check Maven/Java') {
      steps {
        sh 'mvn -v'
        sh 'java -version'
      }
    }

    stage('Run Playwright in Docker') {
      steps {
        script {
          docker.image('mcr.microsoft.com/playwright:v1.55.0-noble').inside {
            sh 'npm ci'
            sh 'npm i -D allure-commandline'
            sh 'npx playwright test'
          }
        }
      }
    }

    stage('JUnit Résultats') {
      steps {
        junit testResults: 'test-results/e2e-junit-results.xml', allowEmptyResults: true
      }
    }
  }

  post {
    always {
      // Ici le plugin Allure s’exécute sur l’agent Jenkins (où Java est dispo via Tools)
      allure includeProperties: false, jdk: '', results: [[path: 'allure-results']]

      archiveArtifacts artifacts: 'playwright-report/**,test-results/*.xml,allure-results/**,allure-report/**',
                       fingerprint: true, allowEmptyArchive: true
    }
  }
}
