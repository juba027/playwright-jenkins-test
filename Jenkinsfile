pipeline {
  agent any {
   stages {
   agent{
    docker {
      image 'mcr.microsoft.com/playwright:v1.55.0-noble'
      args '--ipc=host' 
    }
  }
   
    stages{

    stage('Install') {
      steps {
        echo 'Installing dependencies...'
        sh 'npm ci'
        sh 'npm i -D allure-commandline'
      }
    }

    stage('Run Playwright Tests') {
      steps {
        sh 'npx playwright test --reporter=junit,allure-playwright'
      }
    }

    stage ('stash allure report'){
      steps{
            stashname: 'allure-results',includes: 'allure-results/*'
            stashname: 'junit-report',includes: 'playwright-report/*'

      }
    }

    stage('Generate Allure HTML') {
      steps {
        sh 'npx allure generate allure-results --clean -o allure-report || true'
      }
    }
  }
   }

  post {
    always {
      unstash 'allure-results'
      unstash 'junit-report'
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
}