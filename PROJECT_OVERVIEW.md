# 프로젝트 개요 — SDU 링크 도구

## 목적

URL을 QR코드 또는 짧은 주소로 바꿔 쉽게 공유하는 웹앱이다. 제공된 URL2QR 로고와 밝은 노랑·살구·하늘색 그라데이션을 공통으로 사용한다. 회원가입 없이 도구를 선택해 사용할 수 있다.

## 화면과 제공 기능

| 화면 | 경로 | 기능 |
| --- | --- | --- |
| 메인 | `index.html` | ‘QR코드’, ‘URL단축’ 선택 버튼 |
| QR코드 | `url2qr/index.html` | URL 입력, QR 생성, 입력창 하단 이동, QR 클릭 시 1024 × 1024 JPG 저장 |
| URL단축 | `urlShort/index.html` | URL 입력, 공개 API를 통한 단축, 읽기 전용 결과, 복사와 ‘복사하였습니다’ 알림 |

각 도구 상단의 메뉴로 다른 도구로 이동할 수 있으며, 로고를 누르면 메인으로 돌아간다. PC와 모바일 화면을 지원하고, 키보드 Enter로도 실행할 수 있다.

## 기술 구성

- HTML, CSS, JavaScript로 구성한 정적 웹앱이며, 설치할 npm 의존성이 없다.
- QR 생성은 로컬 `vendor/qrcodegen.js`로 처리한다. QR 입력 URL은 서버에 전송하지 않는다.
- URL 단축은 da.gd 공개 API에 HTTPS POST로 요청한다. 인터넷 연결이 필요하며, 입력한 URL이 da.gd로 전송된다.
- 별도 API 키나 서버를 사용하지 않는다. 성공 결과는 현재 페이지의 메모리에만 보관하며 새로고침하면 앱의 기록은 초기화된다. da.gd에 생성된 링크는 별도로 유지된다.
- `gradient.js`와 `styles.css`로 공통 화면을 구성한다. 마우스 위치에 따라 그라데이션이 변하고, 터치 환경·동작 줄이기 설정에서는 기본 배경을 사용한다.
- GitHub Actions가 공개 파일만 `dist/`로 빌드해 GitHub Pages에 배포한다.

## 실행과 배포

저장소 루트에서 `npm start`를 실행하고 [로컬 웹앱](http://localhost:4173/)을 연다. 빌드는 `npm run build`이며 Node.js가 필요하다. 복사 기능은 HTTPS 또는 localhost 환경에서 가장 안정적으로 작동한다.

공개 주소: [SDU 웹앱](https://happypod.github.io/sdu/). 모든 페이지는 상대 경로로 연결해 저장소 하위 경로에서도 동작한다.

## 범위와 외부 의존성

사용자 계정, 링크 관리·삭제, 사용자 지정 별칭, 클릭 통계, 자체 단축 도메인은 이번 범위에 포함하지 않는다. 단축 링크 생성과 리디렉션은 da.gd의 가용성 및 사용 제한에 따른다. 앱은 요청 실패를 안내하며 자동 반복 호출하지 않는다.

관련 문서: [기능명세서](FUNCTIONAL_SPEC.md), [구현 계획](implementation_plan.md), [작업 목록](task.md), [워크스루](walkthrough.md).

API 근거: [da.gd 공식 API 문서](https://da.gd/help).
