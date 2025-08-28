pipeline {
  agent any   // global: utilise l'agent Jenkins

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
        sh 'npm i -D allure-commandline allure-playwright'
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

    stage('stash reports') {
      steps {
        stash name: 'allure-results',   includes: 'allure-results/**',   allowEmpty: true
        stash name: 'allure-report',    includes: 'allure-report/**',    allowEmpty: true
        stash name: 'junit-report',     includes: 'test-results/*.xml',  allowEmpty: true
        stash name: 'playwright-report',includes: 'playwright-report/**',allowEmpty: true
      }
    }

    stage('Generate Allure HTML') {
      agent {
        docker {
          image 'mcr.microsoft.com/playwright:v1.55.0-noble'
          args '--ipc=host'
        }
      }
      steps {
        sh 'npx allure generate allure-results --clean -o allure-report || true'
      }
    }
  }

  post {
    always {
      // Récupère les fichiers
      unstash 'allure-results'
      unstash 'allure-report'
      unstash 'junit-report'
      unstash 'playwright-report'

      // Publie le JUnit (tests)
      junit testResults: 'test-results/*.xml', allowEmptyResults: true

      // Publie Allure
      script {
        catchError(buildResult: 'UNSTABLE', stageResult: 'FAILURE') {
          allure includeProperties: false,
                 jdk: '',
                 results: [[path: 'allure-results']]
        }
      }

      // Archive tout
      archiveArtifacts artifacts: 'playwright-report/**,test-results/*.xml,allure-results/**,allure-report/**',
                       fingerprint: true, allowEmptyArchive: true
    }
  }
}
