pipeline {
  agent any

  stages {
    stage('Fix perms') {
      agent { docker { image 'mcr.microsoft.com/playwright:v1.55.0-noble'; args '-u 0:0' } }
      steps { sh 'chown -R 1000:1000 . || true' }
    }

    stage('Install') {
      agent { docker { image 'mcr.microsoft.com/playwright:v1.55.0-noble'; args '-u 1000:1000' } }
      steps {
        echo 'Installing dependencies...'
        sh 'rm -rf node_modules package-lock.json || true'
        sh 'npm ci'
        sh 'npm i -D allure-commandline allure-playwright'
      }
    }

    stage('Run Playwright Tests') {
      agent { docker { image 'mcr.microsoft.com/playwright:v1.55.0-noble'; args '-u 1000:1000' } }
      steps { sh 'npx playwright test --reporter=line,allure-playwright' }
    }

    stage('Generate Allure HTML') {
      agent { docker { image 'mcr.microsoft.com/playwright:v1.55.0-noble'; args '-u 1000:1000' } }
      steps { sh 'npx allure generate allure-results --clean -o allure-report || true' }
    }

    stage('Allure (stash)') {
      steps {
        stash name: 'allure-results', includes: 'allure-results/**', allowEmpty: true
        stash name: 'allure-report',  includes: 'allure-report/**',  allowEmpty: true
      }
    }

    stage('JUnit Resultat') {
      steps { junit testResults: 'test-results/e2e-junit-results.xml', allowEmptyResults: true }
    }
  }

  post {
    always {
      script {
        ['allure-results','allure-report'].each { s ->
          try { unstash s } catch (e) { echo "No stash: ${s}" }
        }
      }
      publishHTML(target: [
        allowMissing: true, alwaysLinkToLastBuild: true, keepAll: true,
        reportDir: 'allure-report', reportFiles: 'index.html', reportName: 'Allure Report'
      ])
      archiveArtifacts artifacts: 'playwright-report/**,test-results/*.xml,allure-results/**,allure-report/**',
                       fingerprint: true, allowEmptyArchive: true
    }
  }
}
