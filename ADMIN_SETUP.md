# 🛠 BALLY BALLY 관리자 페이지 설정 가이드

디자이너가 **코드 없이** 메인 화면 슬라이드 사진을 교체할 수 있는 관리자 페이지(`/admin`)입니다.
[Sveltia CMS](https://github.com/sveltia/sveltia-cms)(Decap CMS 호환)를 사용합니다.

> 이 설정은 **딱 한 번만** 하면 됩니다. 그 다음부터 디자이너는 `https://soojinjung7.github.io/bally-bally/admin/` 에 접속해서 사진만 바꾸면 끝입니다.

---

## ✅ 사용 흐름 (설정 끝난 뒤, 디자이너용)

1. `https://soojinjung7.github.io/bally-bally/admin/` 접속
2. **"Login with GitHub"** 클릭 → GitHub 로그인
3. **사이트 → 히어로 슬라이드** 메뉴 클릭
4. 슬라이드의 사진을 드래그&드롭으로 교체하거나, **+ 슬라이드 추가**로 새 사진 업로드
5. 우측 상단 **Save / Publish** 클릭 → 1~2분 뒤 사이트에 자동 반영 ✨

순서 변경(드래그), 전환 간격(초) 조절, 사진 설명 입력도 가능합니다.

---

## 🔧 최초 1회 설정 (사이트 소유자 = Soojin)

GitHub Pages 같은 정적 사이트는 로그인 처리를 위한 작은 "인증 중계소(OAuth proxy)"가 필요합니다.
무료인 **Cloudflare Workers** 로 5분이면 됩니다.

### 1단계 — GitHub OAuth App 만들기

1. https://github.com/settings/developers → **New OAuth App**
2. 입력값:
   - **Application name**: `BALLY BALLY CMS`
   - **Homepage URL**: `https://soojinjung7.github.io/bally-bally/`
   - **Authorization callback URL**: `https://sveltia-cms-auth.<당신서브도메인>.workers.dev/callback`
     (2단계에서 만들 Worker 주소 — 일단 임시로 두고 나중에 수정해도 됨)
3. 만든 뒤 **Client ID** 복사, **Generate a new client secret** 눌러 **Client Secret** 복사 (한 번만 보임!)

### 2단계 — Cloudflare Worker(인증 중계소) 배포

1. https://dash.cloudflare.com 가입/로그인 (무료)
2. Sveltia 공식 인증 워커를 배포합니다. 가장 쉬운 방법:
   - https://github.com/sveltia/sveltia-cms-auth 저장소의 **"Deploy to Cloudflare"** 버튼 사용
   - 또는 Cloudflare 대시보드 → Workers & Pages → Create → 저장소의 `index.js` 코드 붙여넣기
3. 배포 후 Worker **Settings → Variables**에 환경변수 2개 추가:
   - `GITHUB_CLIENT_ID` = (1단계의 Client ID)
   - `GITHUB_CLIENT_SECRET` = (1단계의 Client Secret)
4. 배포된 Worker 주소를 확인합니다. 예: `https://sveltia-cms-auth.soojin.workers.dev`
5. 1단계의 **Authorization callback URL** 을 `그_주소/callback` 으로 맞춰줍니다.

### 3단계 — 사이트에 Worker 주소 연결

`admin/config.yml` 파일에서 이 줄을 본인 Worker 주소로 바꾸고 커밋하세요:

```yaml
backend:
  name: github
  repo: SoojinJung7/bally-bally
  branch: main
  base_url: https://sveltia-cms-auth.soojin.workers.dev   # ← 본인 Worker 주소로 교체
```

GitHub 웹에서 직접 수정해도 됩니다: repo → `admin/config.yml` → 연필 아이콘 → 수정 → Commit.

### 4단계 — 디자이너 권한 주기 (계정 공유 X)

> ⚠️ **내 GitHub 계정을 공유하지 않습니다.** 디자이너는 **본인 GitHub 계정**으로 작업합니다.

1. 디자이너가 자기 GitHub 계정을 만듭니다 (https://github.com/signup, 무료).
2. 그 계정 아이디(또는 이메일)를 이 repo에만 Collaborator로 초대:
   repo → **Settings → Collaborators → Add people** → 디자이너 계정 입력.
3. 디자이너는 이메일로 온 초대를 수락합니다.

이렇게 하면 디자이너에게는 **`bally-bally` repo 하나만** 보이고 편집 가능합니다.
내 다른 프로젝트/저장소는 전혀 노출되지 않습니다.
`/admin` 에서 "Login with GitHub" 을 누르면 디자이너 **본인 계정으로** 로그인됩니다.

> 권한을 더 좁히고 싶다면(이 repo조차 Collaborator로 주기 싫다면),
> GitHub **Organization** 을 만들고 거기에 repo를 옮긴 뒤 디자이너를 특정 repo에만
> 권한 있는 멤버로 추가하는 방법도 있습니다. 1인 프로젝트라면 Collaborator 초대로 충분합니다.

---

## 🧪 로컬에서 미리 써보기 (선택)

설정 전에 동작을 보고 싶다면, repo를 클론한 폴더에서:

```bash
npx @sveltia/cms-proxy-server   # 로컬 백엔드 실행
# 다른 터미널에서
python3 -m http.server 8000
# 브라우저: http://localhost:8000/admin/  (GitHub 로그인 없이 편집 테스트)
```

`config.yml` 에 `local_backend: true` 가 켜져 있어 로컬 테스트가 가능합니다.

---

## ❓ 자주 묻는 질문

- **Q. 사진을 바꿨는데 사이트에 안 보여요.** → GitHub Pages 재빌드에 1~2분 걸립니다. 브라우저 새로고침(Ctrl/Cmd+Shift+R) 해보세요.
- **Q. 슬라이드를 4장 이상 / 2장으로 바꿔도 되나요?** → 네. 목록에서 추가·삭제하면 사이트가 자동으로 맞춰서 돌아갑니다.
- **Q. 큰 원본 사진을 올려도 되나요?** → 가능하지만 8MB 이하 권장. 너무 크면 사이트가 느려집니다. (현재 슬라이드는 1920px/약 600KB로 최적화돼 있어요.)
