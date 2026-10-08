# SDU — QR코드와 URL단축

링크를 QR코드로 만들거나 짧은 URL로 바꾸는 웹앱입니다. 노란 URL2QR 로고에 어울리는 밝은 그라데이션이 마우스 위치에 따라 부드럽게 바뀝니다.

## 사용하기

메인에서 **QR코드** 또는 **URL단축**을 선택합니다.

- QR코드: URL을 입력하고 확인 또는 Enter를 누릅니다. 중앙의 QR을 클릭하면 1024 × 1024 JPG로 저장합니다.
- URL단축: URL을 입력하고 단축하기를 누릅니다. 결과는 읽기 전용 상자에 표시되며, 복사를 누르면 클립보드에 복사하고 ‘복사하였습니다’ 알림을 표시합니다.
- 입력이 비어 있으면 단축하기가 비활성화됩니다. 요청 중에는 중복 실행을 막고 실패 시 이유를 안내합니다.

QR은 브라우저 안에서 생성합니다. URL 단축은 [da.gd 공개 API](https://da.gd/help)를 사용하며 입력한 URL이 해당 서비스로 전송됩니다. 인터넷 연결이 필요합니다. API 키는 필요하지 않습니다.

## 프로젝트 문서

- [프로젝트 개요](PROJECT_OVERVIEW.md)
- [기능명세서](FUNCTIONAL_SPEC.md)
- [구현 계획](implementation_plan.md)
- [작업 목록](task.md)
- [워크스루와 검증 결과](walkthrough.md)

## 실행

저장소 루트에서 Node.js로 `npm start`를 실행한 뒤 [http://localhost:4173/](http://localhost:4173/)을 엽니다. 추가 npm 패키지 설치는 필요하지 않습니다. HTTPS 또는 localhost에서 복사 기능을 사용할 수 있습니다.

## 파일 구성

| 경로 | 역할 |
| --- | --- |
| `index.html` | 메인 도구 선택 화면 |
| `url2qr/index.html`, `url2qr/app.js` | QR 화면, 생성과 JPG 다운로드 |
| `urlShort/index.html`, `urlShort/app.js`, `urlShort/styles.css` | URL 단축 화면, API 요청과 복사 |
| `styles.css`, `gradient.js` | 공통 테마, 반응형 배치, 커서 반응 배경 |
| `img/logo.png` | 제공된 원본 로고 |
| `vendor/qrcodegen.js` | Project Nayuki MIT 라이선스 QR 생성 라이브러리 |
| `server.mjs`, `scripts/build.mjs` | 로컬 정적 서버와 배포 빌드 |

## 배포

공개 주소: [SDU 웹앱](https://happypod.github.io/sdu/).

`npm run build`는 공개할 파일만 `dist/`에 생성합니다. main 브랜치에 사이트 소스를 푸시하면 [GitHub Actions](https://github.com/happypod/sdu/actions)가 GitHub Pages에 자동 배포합니다. 루트 홈페이지는 `index.html`입니다.

QR 생성 라이브러리: [Project Nayuki](https://github.com/nayuki/QR-Code-generator). 원본의 MIT 라이선스 고지를 보존했습니다.
