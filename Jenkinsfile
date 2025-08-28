pipeline {
   agent { docker { image 'mcr.microsoft.com/playwright:v1.55.0-noble' } }

   stages {
      stage('Install') {
         steps {
            echo 'Installing dependencies...'
            sh 'npm ci'
            sh 'npm i -D allure-commandline'
         }
      }

      stage('Run Playwright Tests') {
         steps {
            sh 'npx playwright test'
            
         }
      }

      stage('JUnit Resultat'){
         steps{
            junit 'test-results/e2e-junit-results.xml'
         }
      }
      stage('Install Java for Allure') {
         steps {
         sh 'apt-get update && apt-get install -y openjdk-17-jre'
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
      allure includeProperties: false,
             jdk: '',
             results: [[path: 'allure-results']]

      archiveArtifacts artifacts: 'playwright-report/**,test-results/*.xml,allure-results/**,allure-report/**',
                       fingerprint: true,
                       allowEmptyArchive: true
    }
  }

}


