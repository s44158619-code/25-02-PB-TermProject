# 2025-2학기 초급프로젝트 Term Project - JBNU LMS (Clone)

## 1. 프로젝트 개요
본 프로젝트는 **전북대학교 학습관리 시스템(LMS)**의 핵심 기능을 웹(Web)과 앱(App)으로 구현한 결과물입니다.  
Firebase를 백엔드로 사용하여, **웹에서 생성한 데이터가 모바일 앱에 실시간으로 반영**되도록 구현하였습니다.

* **과목명:** 초급프로젝트
* **개발자:** 컴퓨터인공지능학부 성윤오
* **개발 기간:** 2025.10 ~ 2025.12

---

## 2. 폴더 구조 (Project Structure)
이 저장소는 두 개의 독립적인 프로젝트로 구성되어 있습니다.

* **📂 attendance-web/** : React.js 기반의 웹 애플리케이션 (교수자/학생용)
* **📂 attendance-app/** : React Native (Expo) 기반의 모바일 애플리케이션 (학생 출석용)

---

## 3. 주요 기능 (Key Features)
* **Firebase 연동:** Authentication(로그인), Firestore(DB), Storage(파일) 공통 사용
* **Web (Front-End):**
    * 교수자 모드: 출석 세션 생성(번호 생성), 강의 자료 업로드, 과제 확인
    * 학생 모드: 과제 제출, 강의 자료 다운로드
* **App (Mobile):**
    * 학생 전용 대시보드
    * 실시간 출석 인증 (인증번호 입력)
    * 나의 출석 이력 조회

---

## 4. 실행 가이드 (How to Run)
각 폴더(`attendance-web`, `attendance-app`) 내부에 있는 **README.md** 파일을 참고하여 실행해 주세요.