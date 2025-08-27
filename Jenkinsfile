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
      stage('Generate Allure HTML') {
         steps {
            sh 'npx allure generate allure-results --clean -o allure-report || true'
         }
    }
      stage('Publish Allure Report') {
         steps {
        publishHTML(target: [
          reportName: 'Allure',
          reportDir: 'allure-report',
          reportFiles: 'index.html',
          keepAll: true,
          alwaysLinkToLastBuild: true,
          allowMissing: true
        ])
        archiveArtifacts artifacts: 'test-results/*.xml, allure-report/**', fingerprint: true
      }
   }

}
}

