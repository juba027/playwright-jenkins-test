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

    stage('JUnit Resultat') {
      steps {
        junit testResults: 'test-results/e2e-junit-results.xml', allowEmptyResults: true
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
      publishHTML(target: [
        allowMissing: true,
        alwaysLinkToLastBuild: true,
        keepAll: true,
        reportDir: 'allure-report',
        reportFiles: 'index.html',
        reportName: 'Allure Report'
      ])

      archiveArtifacts artifacts: 'playwright-report/**,test-results/*.xml,allure-results/**,allure-report/**',
                       fingerprint: true,
                       allowEmptyArchive: true
    }
  }
}
