pipeline {
   agent { docker { image 'mcr.microsoft.com/playwright:v1.55.0-noble' } }

   stages {
      stage('Install') {
         steps {
            echo 'Installing dependencies...'
            sh 'npm ci'
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
      stage('Allure Report'){
         steps{
            allure([
               includeProperties:false,
               jdk: '',
               results: [[path: 'allure-results']]
            ])
         }
      }
   }

}
