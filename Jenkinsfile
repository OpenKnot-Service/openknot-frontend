pipeline {
    agent any

    environment {
        IMAGE_NAME = "openknot-frontend"
        CONTAINER_NAME = "openknot-frontend"
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Docker Build') {
            steps {
                sh """
                    docker build \
                        -t ${IMAGE_NAME}:${BUILD_NUMBER} \
                        -t ${IMAGE_NAME}:latest \
                        .
                """
            }
        }

        stage('Deploy') {
            steps {
                sh """
                    docker stop ${CONTAINER_NAME} || true
                    docker rm ${CONTAINER_NAME} || true

                    docker run -d \
                        --name ${CONTAINER_NAME} \
                        -p 3100:3100 \
                        --restart=always \
                        ${IMAGE_NAME}:latest
                """
            }
        }
    }

}