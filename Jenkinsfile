pipeline {
  agent { docker { image 'mcr.microsoft.com/playwright:v1.55.0-noble' } }

  stages {
    stage('Install') {
      steps {
        sh 'npm ci'
      }
    }

    stage('Run Playwright Tests') {
      steps {
        sh 'npx playwright test'
      }
      post {
        always {
          allure includeProperties: false,
                 jdk: '',
                 results: [[path: 'allure-results']]
        }
      }
    }

    stage('Publish JUnit') {
      steps {
        junit 'test-results/e2e-junit-results.xml'
      }
    }

    stage('Archive') {
      steps {
        archiveArtifacts artifacts: 'test-results/*.xml, allure-results/**', fingerprint: true
      }
    }
  }
}
