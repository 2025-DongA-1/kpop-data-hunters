// === 회사별 외국인 비율 TOP10 시각화 ===

// 예시용 데이터 (Flask에서 /api/foreign-ratio 로 받을 수도 있음)
const companyData = [
  { company: "SM Entertainment", idols: 120, groups: 8, foreignRatio: 0.22 },
  { company: "JYP Entertainment", idols: 95, groups: 6, foreignRatio: 0.18 },
  { company: "HYBE", idols: 110, groups: 7, foreignRatio: 0.35 },
  { company: "YG Entertainment", idols: 80, groups: 5, foreignRatio: 0.25 },
  { company: "Starship Entertainment", idols: 60, groups: 4, foreignRatio: 0.4 },
  { company: "Cube Entertainment", idols: 55, groups: 3, foreignRatio: 0.28 },
  { company: "WM Entertainment", idols: 45, groups: 3, foreignRatio: 0.31 },
  { company: "DSP Media", idols: 50, groups: 3, foreignRatio: 0.24 },
  { company: "Fantagio", idols: 40, groups: 3, foreignRatio: 0.26 },
  { company: "FNC Entertainment", idols: 52, groups: 4, foreignRatio: 0.29 },
];

// 외국인 비율 순 정렬
const top10 = companyData
  .sort((a, b) => b.foreignRatio - a.foreignRatio)
  .slice(0, 10);

// 시각화용 데이터
const companyLabels = top10.map((d) => d.company);
const foreignRatios = top10.map((d) => (d.foreignRatio * 100).toFixed(1));
const majorLabels = ["SM Entertainment", "JYP Entertainment", "YG Entertainment", "HYBE"];

// 색상 강조
const barColors = top10.map((d) =>
  majorLabels.includes(d.company) ? "#d14b8f" : "#b07fd2"
);

// 그래프 생성
const ctx = document.getElementById("foreignByCompany").getContext("2d");
new Chart(ctx, {
  type: "bar",
  data: {
    labels: companyLabels,
    datasets: [
      {
        label: "외국인 비율 (%)",
        data: foreignRatios,
        backgroundColor: barColors,
        borderRadius: 8,
      },
    ],
  },
  options: {
    indexAxis: "y", // 수평 막대
    scales: {
      x: {
        title: {
          display: true,
          text: "외국인 비율 (%)",
          color: "#ccc",
        },
        ticks: { color: "#ccc", beginAtZero: true },
      },
      y: {
        ticks: { color: "#fff" },
      },
    },
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: "④ 기획사별 외국인 아이돌 비율 TOP 10 (2005년~)",
        color: "#b0b8ff",
        font: { size: 18 },
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const row = top10[context.dataIndex];
            return `${row.foreignRatio * 100}%  ·  ${row.idols}명 / ${row.groups}그룹`;
          },
        },
      },
    },
  },
});
