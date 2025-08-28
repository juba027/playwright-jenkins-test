pipeline {
  agent { docker { image 'mcr.microsoft.com/playwright:v1.55.0-noble' } }

  stages {
    stage('Install') {
      steps {
        echo 'Installing dependencies...'
        sh 'npm ci'
        sh 'npm i -D allure-commandline allure-playwright'
      }
    }

    stage('Run Playwright Tests') {
      steps {
        sh 'npx playwright test --reporter=line,allure-playwright'
      }
    }

    stage('Allure (stash)') {
      steps {
        stash name: 'allure-results', includes: 'allure-results/**', allowEmpty: true
      }
    }

    stage('JUnit Resultat') {
      steps {
        junit 'test-results/e2e-junit-results.xml'
      }
    }

    stage('Generate Allure HTML') {
      steps {
        sh 'npx allure generate allure-results --clean -o allure-report || true'
      }
    }
  }

  post {
    always {
      unstash 'allure-results'
      allure includeProperties: false,
             jdk: '',
             results: [[path: 'allure-results']]

      archiveArtifacts artifacts: 'playwright-report/**,test-results/*.xml,allure-results/**,allure-report/**',
                       fingerprint: true,
                       allowEmptyArchive: true
    }
  }
}
