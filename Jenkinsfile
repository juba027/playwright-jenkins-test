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
            echo 'Running Playwright tests...'
            // --reporter=html génère un rapport HTML
            sh 'npx playwright test --reporter=html'
         }
      }

      stage('Archive Report') {
         steps {
            echo 'Archiving Playwright HTML report...'
            archiveArtifacts artifacts: 'playwright-report/**', fingerprint: true
         }
      }
   }

   post {
      always {
         echo 'Publishing Playwright report in Jenkins...'
         publishHTML(target: [
            reportName: 'Playwright Report',
            reportDir: 'playwright-report',
            reportFiles: 'index.html',
            keepAll: true,
            alwaysLinkToLastBuild: true,
            allowMissing: false
         ])
      }
   }
}
