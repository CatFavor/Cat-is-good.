# 파주미래성형외과의원 홈페이지

HTML · CSS · 자바스크립트로만 만든 정적 웹사이트입니다.
프로그램 설치나 빌드 과정 없이, **파일을 더블클릭하면 바로 열립니다.**

---

## 1. 폴더 구조

```
paju-mirae/
├── index.html          ← 메인 페이지
├── about.html          ← 병원소개 / 원장소개
├── procedures.html     ← 시술안내 (탭 + 가격표)
├── before-after.html   ← 전후사진
├── contact.html        ← 오시는길 + 상담신청
├── css/style.css       ← 디자인 (색상·폰트·여백 전부 여기)
├── js/main.js          ← 애니메이션·동작
└── images/             ← 사진을 넣을 폴더
```

## 2. 미리보기 방법

`index.html` 파일을 더블클릭하면 브라우저에서 열립니다.

## 3. 색을 바꾸고 싶을 때

`css/style.css` 파일 맨 위 `:root { ... }` 안의 색상 코드만 바꾸면
사이트 전체 색이 한 번에 바뀝니다.

| 변수 | 지금 색 | 쓰이는 곳 |
|---|---|---|
| `--ink` | `#0F1E1D` 딥그린블랙 | 제목, 버튼, 어두운 섹션 |
| `--paper` | `#FBF9F5` 아이보리 | 기본 배경 |
| `--gold` | `#B08D57` 브라스골드 | 포인트 색 (라벨, 강조) |

## 4. 사진 넣는 방법 (가장 자주 하실 작업)

지금은 사진 자리마다 회색 상자가 들어가 있습니다.

```html
<div class="ph ratio-3x4"><span><b>[사진 필요] 눈성형</b>900×1200px</span></div>
```

사진이 준비되면 그 줄을 통째로 아래처럼 바꾸세요.

```html
<img src="images/eyes.jpg" alt="눈성형 시술 안내">
```

1. 사진 파일을 `images/` 폴더에 넣습니다
2. `src="images/파일이름.jpg"` 로 이름을 맞춥니다
3. `alt="..."` 에는 사진 설명을 적습니다 (검색 노출에 도움이 됩니다)

전후사진(BEFORE / AFTER 슬라이더)도 같은 방식이며,
BEFORE 사진과 AFTER 사진을 각각 넣으면 됩니다.

## 5. 글자를 고치고 싶을 때

HTML 파일을 메모장이나 VS Code로 열어서
`<` `>` 로 감싸인 태그는 건드리지 말고 **그 사이의 한글만** 고치면 됩니다.

파일 안에 `▣` 표시가 있는 주석은 **반드시 확인이 필요한 곳**입니다.
VS Code에서 Ctrl+Shift+F 로 `▣` 를 검색하면 한 번에 찾을 수 있습니다.

## 6. 인터넷에 올리는 방법 (배포)

1. **Netlify Drop** — https://app.netlify.com/drop 에 `paju-mirae` 폴더를
   드래그해서 놓으면 끝. 바로 주소가 생깁니다. (먼저 이걸로 연습 추천)
2. **가비아 / 카페24** 등에서 `pajumirae.com` 같은 도메인 구입 (연 2만원 내외)
3. Netlify 설정에서 그 도메인을 연결

## 7. 상담신청 폼을 진짜 메일로 받고 싶다면

현재는 서버가 없어서 **작성 내용 복사 → 카카오톡 상담창 열기** 방식입니다.
메일로 받고 싶으면:

1. https://formspree.io 가입 (무료 월 50건)
2. 발급받은 주소를 `contact.html` 의 form 태그에 넣기
   ```html
   <form class="form" id="consultForm" action="https://formspree.io/f/발급코드" method="POST">
   ```
3. `js/main.js` 의 `initForm()` 안에서 `e.preventDefault();` 줄을 지우기

## 8. 검색(네이버·구글)에 잘 걸리게 하려면

- 각 HTML 파일 위쪽 `<title>` 과 `<meta name="description">` 에
  **파주 / 운정 / 동패동** 지역 키워드를 넣으세요 (이미 넣어두었습니다)
- 네이버 서치어드바이저(searchadvisor.naver.com)에 사이트 등록
- 구글 서치콘솔(search.google.com/search-console)에 사이트 등록
- 네이버 플레이스 · 인스타그램 프로필에 홈페이지 주소 링크 걸기
