# BALLY BALLY

> Playground for bold ideas — Soojin Jung의 개인 프로젝트 스튜디오 홈페이지.

현대적인 엔터테인먼트 기업 사이트(예: SM Entertainment)의 **레이아웃·구조·무드를 벤치마크**해서
만든 **오리지널 1페이지 홈페이지**입니다. 로고/사진/문구 등 원본의 저작권 자산은 사용하지 않았고,
콘텐츠와 디자인 요소는 모두 직접 제작했습니다.

## 🎨 컬러 팔레트

| 역할 | HEX | 미리보기 |
|------|-----|----------|
| Primary (오렌지) | `#FF5F14` | 🟧 |
| Background (잉크 블랙) | `#1A1919` | ⬛ |
| Accent (레드) | `#C90404` | 🟥 |

## 🧱 구조 (벤치마크 포인트)

- **Fixed 헤더 / 내비게이션** — 스크롤 시 블러 배경
- **대형 타이포 히어로** — Anton 디스플레이 폰트 + 마퀴 + 글로우
- **Updates** — 뉴스 카드 그리드 (스크롤 리빌 애니메이션)
- **Works** — 그라데이션 프로젝트 타일 그리드
- **Numbers** — 카운트업 통계 섹션 (IR 섹션 벤치마크)
- **About / Contact** — 소개 + CTA
- **Footer** — 소셜 링크

## 🛠 기술

순수 **HTML + CSS + Vanilla JS** (빌드 도구·의존성 없음). 바로 열면 됩니다.

```
index.html    # 마크업
styles.css    # 디자인 토큰 + 레이아웃 + 반응형
script.js     # 메뉴, 스크롤 리빌, 카운터, 마퀴
```

## ▶️ 실행

```bash
# 저장소 클론 후
open index.html
# 또는 로컬 서버
python3 -m http.server 8000   # http://localhost:8000
```

## 🌐 배포 (GitHub Pages)

Settings → Pages → Branch: `main` / `/ (root)` 선택하면 바로 호스팅됩니다.

---

© 2026 BALLY BALLY · a personal project by Soojin Jung.
