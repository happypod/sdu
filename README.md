# SDU — URL2QR

URL을 QR코드로 바꾸고 JPG 파일로 저장하는 웹사이트입니다. 노란 로고와 어울리는 밝은 그라데이션이 마우스 위치에 따라 부드럽게 변합니다.

사이트 주소: [https://happypod.github.io/sdu/](https://happypod.github.io/sdu/)

## 프로젝트

소스와 작업 문서는 [`프로젝트04`](프로젝트04/)에 있습니다.

- URL 입력 후 확인 또는 Enter로 QR 생성
- 생성 시 URL 입력창이 하단으로 이동
- QR코드를 클릭해 1024 × 1024 JPG 다운로드
- 커서에 반응하는 밝은 그라데이션
- 모바일 반응형 화면과 동작 줄이기 설정 지원

## 실행

`프로젝트04/index.html`을 브라우저로 직접 열거나, 프로젝트 폴더에서 `npm start`를 실행합니다.

```powershell
cd 프로젝트04
npm start
```

별도의 패키지 설치는 필요하지 않습니다. 로컬 서버와 배포 파일 생성에는 Node.js가 필요합니다.

## 배포

`main`의 사이트 소스 변경 시 GitHub Actions가 `npm run build`를 실행하고 GitHub Pages에 배포합니다. 배포 파일은 HTML, CSS, JavaScript, 파비콘, 로고, QR 라이브러리로 구성됩니다.

- [GitHub Actions](https://github.com/happypod/sdu/actions)
- [프로젝트 실행 안내](프로젝트04/README.md)
- [구현 계획](프로젝트04/implementation_plan.md)
- [워크스루](프로젝트04/walkthrough.md)
- [작업 목록](프로젝트04/task.md)
