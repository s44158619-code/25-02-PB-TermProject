# 📱 Attendance App (Mobile)

React Native (Expo)로 개발된 학생용 출석 체크 애플리케이션입니다.

## 1. 설치 및 실행 (Setup)

```bash
# 1. 의존성 패키지 설치
npm install

# 2. Expo 서버 실행
npx expo start
2. 모바일 테스트 방법 (Testing)
스마트폰에 Expo Go 애플리케이션을 설치합니다. (Play Store / App Store)

npx expo start 실행 후 나타나는 QR 코드를 스캔합니다.

Android: Expo Go 앱 내 'Scan QR Code' 사용

iOS: 기본 카메라 앱으로 QR 스캔

(연결 문제 발생 시) 같은 와이파이를 사용하거나, npx expo start --tunnel 명령어를 사용하세요.

3. 기술 스택
Framework: React Native, Expo

Navigation: Expo Router / React Navigation

Backend: Firebase SDK