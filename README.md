# SDU — URL2QR

URL을 입력하면 중앙에 QR코드가 나타나고, QR코드를 클릭하면 1024 × 1024 JPG로 저장됩니다. 입력창에서 Enter를 눌러도 생성됩니다. 다른 URL을 입력하면 QR코드가 갱신됩니다.

화면은 노란 로고와 어울리는 노랑·살구·하늘색 그라데이션으로 구성했습니다. 마우스를 움직이면 빛의 중심과 색상이 부드럽게 달라집니다. 모바일 터치 환경과 동작 줄이기 설정에서는 기본 배경을 표시합니다.

## 작업 문서

- [구현 계획](implementation_plan.md)
- [작업 목록](task.md)
- [워크스루](walkthrough.md)

## 실행

소스와 작업 문서는 저장소 루트 `F:\moalab\SDU`에 있습니다. 루트의 `index.html`을 브라우저로 열면 바로 사용할 수 있습니다. 설치는 필요하지 않습니다.

로컬 서버로 실행하려면 이 폴더에서 `npm start`를 실행한 뒤 [http://localhost:4173](http://localhost:4173)을 엽니다. Node.js가 필요하며, 추가 패키지 설치는 필요하지 않습니다.

## 파일

- `img/logo.png`: 제공된 원본 로고
- `index.html`: 화면 구조
- `styles.css`: 밝은 그라데이션 테마, 반응형 디자인과 입력창 이동 애니메이션
- `app.js`: 커서 반응 배경, URL 검증, QR 생성, JPG 다운로드
- `vendor/qrcodegen.js`: Project Nayuki의 MIT 라이선스 QR 생성 라이브러리
- `server.mjs`: 선택적으로 사용할 로컬 서버

QR 생성과 JPG 변환은 브라우저 안에서 처리됩니다. URL을 외부 서비스에 보내거나 입력한 사이트를 방문하지 않습니다. `https://`를 생략한 도메인에는 자동으로 붙입니다. `http://`, `https://` 웹 주소를 지원합니다.

## GitHub Pages 배포

사이트 주소: [https://happypod.github.io/sdu/](https://happypod.github.io/sdu/)

루트의 `index.html`이 홈페이지입니다. `README.md`는 GitHub 저장소의 설명 문서입니다. `.nojekyll` 파일로 정적 파일을 그대로 게시할 수 있게 했습니다.

저장소 `main`에 사이트 소스를 푸시하면 GitHub Actions가 파일을 확인하고 GitHub Pages로 자동 배포합니다. 상태는 [Actions](https://github.com/happypod/sdu/actions)에서 확인할 수 있습니다.

`npm run build`를 실행하면 공개할 파일만 `dist/`에 생성됩니다. 정적 호스팅에 올릴 때는 `dist/`의 내용을 업로드하면 됩니다.

QR 생성 라이브러리: [Project Nayuki QR Code generator](https://github.com/nayuki/QR-Code-generator). 라이브러리 원본의 MIT 라이선스 고지를 보존했습니다.
