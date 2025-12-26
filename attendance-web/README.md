# 🖥️ Attendance Web (Front-End)

React.js로 개발된 LMS 웹 애플리케이션입니다. 교수자와 학생 모드를 지원하며 JCloud 배포를 기준으로 제작되었습니다.

## 1. 개발 환경 실행 (Local Development)

```bash
# 1. 의존성 패키지 설치
npm install

# 2. 로컬 서버 실행 (http://localhost:3000)
npm start
2. JCloud 배포용 빌드 (Production Build)
JCloud(public_html)에 업로드하기 위한 정적 파일을 생성하는 방법입니다.

Bash

# 빌드 실행
npm run build
명령어가 완료되면 build 폴더가 생성됩니다.

build 폴더 안의 모든 파일을 JCloud 서버에 업로드하면 배포가 완료됩니다.

3. 기술 스택
Framework: React.js

Backend: Firebase (Firestore, Auth, Storage)

Design: Styled-components / CSS Modules