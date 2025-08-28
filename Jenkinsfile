pipeline {
  agent {
    docker {
      image 'mcr.microsoft.com/playwright:v1.55.0-noble'
      args '-u root' 
    }
  }

  environment {
    JAVA_HOME = '/usr/lib/jvm/java-17-openjdk-amd64'
    PATH = "${JAVA_HOME}/bin:${PATH}"
  }

  stages {
    stage('Install Java + Maven') {
      steps {
        sh '''
          set -e
          apt-get update
          apt-get install -y --no-install-recommends openjdk-17-jre maven
          java -version
          mvn -v || true
        '''
      }
    }

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

    stage('JUnit Résultats') {
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
      script {
        // Évite que le build entier tombe si Allure plugin échoue
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
