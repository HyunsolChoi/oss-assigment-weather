# OSS React Naver Weather Map

> 지역별 날씨 데이터를 네이버 지도 위에 시각화하여 보여주는 웹 애플리케이션입니다.

---

## 프로젝트 개요

- 기상청 공공 데이터를 활용하여 **지역별 날씨 예보**를 시각적으로 보여주는 웹 서비스입니다.
- 사용자는 네이버 지도를 통해 각 지역의 **강수확률(POP)**, **최고/최저기온(TMX/TMN)**, **풍속(WSD)** 데이터를 확인할 수 있습니다.
- 지도 위에 **범례(legend)**와 함께 날씨 값에 따라 색상이 입혀진 그리드가 표시됩니다.

---

## 기술 스택

### 프론트엔드
- **React**
- **TypeScript**
- **Naver Map JavaScript API**
- **PapaParse (CSV 파싱)**

### 백엔드
- **Node.js (Express)**
- 기상청 API 프록시 서버

---

## 주요 기능

- `LOC_CODE_EUC_KR.csv`를 기반으로 각 지역의 위도/경도 → 기상청 격자 좌표(nx, ny)로 변환
- 기상청 API (`getVilageFcst`)를 통해 예보 데이터 호출
- 날씨 데이터를 지도에 **시각화 (색상 + 투명도)**
- 실시간 로딩 오버레이 및 **Glassmorphism UI** 적용
- **범례 자동 생성**으로 값의 범위 인식 가능
- 데이터 없을 경우 **재시도 로직 적용**
- Refresh 버튼으로 **데이터 수동 갱신 가능**

---

## 실행 방법
#### server/index.js 공공데이터 포털 key 값 입력 필수
#### public/static/index.html 네이버 지도 API key 값 입력 필수

- 서버 실행
`node ./server/index.js` 

- 클라이언트 실행`npm start`

---

## 사용 API 상세 정보

- 네이버 지도 API 

  https://console.ncloud.com/naver-service/application


- 공공데이터 포털(기상청 API) 

  https://www.data.go.kr/tcs/dss/selectApiDataDetailView.do?publicDataPk=15084084 

---