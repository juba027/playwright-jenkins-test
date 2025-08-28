pipeline {
  agent any

  stages {
    stage('Install') {
      agent {
        docker {
          image 'mcr.microsoft.com/playwright:v1.55.0-noble'
          args '--ipc=host'
        }
      }
      steps {
        echo 'Installing dependencies...'
        sh 'npm ci'
        sh 'npm i -D allure-commandline'
      }
    }

    stage('Run Playwright Tests') {
      agent {
        docker {
          image 'mcr.microsoft.com/playwright:v1.55.0-noble'
          args '--ipc=host'
        }
      }
      steps {
        sh 'npx playwright test --reporter=junit,allure-playwright'
      }
    }

    stage('stash allure report') {
      steps {
        stash name: 'allure-results', includes: 'allure-results/**', allowEmpty: true
        stash name: 'allure-report',  includes: 'allure-report/**',  allowEmpty: true
        stash name: 'junit-report',      includes: 'test-results/*.xml',   allowEmpty: true

      }
    }

    stage('Generate Allure HTML') {
      agent {
        docker {
          image 'mcr.microsoft.com/playwright:v1.55.0-noble'
          args '--ipc=host -u 1000:1000'

        }
      }
      steps {
        sh 'npx allure generate allure-results --clean -o allure-report || true'
         stash name: 'allure-report', includes: 'allure-report/**', allowEmpty: true

      }
    }
  }

  post {
    always {
      sh 'rm -rf allure-results allure-report playwright-report test-results || true'

      unstash 'allure-results'
      unstash 'allure-report'
      unstash 'junit-report'
      unstash 'playwright-report'
      script {
        catchError(buildResult: 'UNSTABLE', stageResult: 'FAILURE') {
          allure includeProperties: false,
                 jdk: '',
                 results: [[path: 'allure-results']]
        }
      }

      archiveArtifacts artifacts: 'playwright-report/**,test-results/*.xml,allure-results/**,allure-report/**',
                       fingerprint: true, allowEmptyArchive: true
    }
  }
}
