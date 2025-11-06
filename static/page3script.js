// static/page3script.js

async function drawKpopChart() {
  const response = await fetch("/static/kpop_summary.json");
  const data = await response.json();

  const years = data.map(d => d.year);
  const ratios = data.map(d => d.kpop_ratio);

  const ctx = document.getElementById("kpopChart").getContext("2d");

  new Chart(ctx, {
    type: "line",
    data: {
      labels: years,
      datasets: [{
        label: "K-POP 비율 (%)",
        data: ratios,
        borderColor: "#FF66B2",           // 라인 색상 (진한 핑크)
        backgroundColor: "rgba(255, 182, 193, 0.25)", // 음영 영역 (연핑크)
        borderWidth: 4,                   // 선 두께
        pointRadius: 6,                   // 점 크기
        pointBackgroundColor: "#FF66B2",  // 점 색상
        fill: true,                       // 아래 영역 채우기
        tension: 0.25                     // 곡선 정도 (부드럽게)
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { position: 'top', labels: { color: '#212529' } },
        title: {
          display: true,
          text: "K-POP 비율 (Billboard Hot 100, 2010~2023)",
          color: "#6a78ee",
          font: { size: 18, weight: "bold" },
          padding: { top: 10, bottom: 12 }
        }
      },
      scales: {
        x: {
          title: {
            display: true,
            text: "연도",
            color: "#aaa",
            font: { size: 14 }
          },
          ticks: { color: "#ccc" },
          grid: { color: "#aaa" }
        },
        y: {
          title: {
            display: true,
            text: "K-POP 비율 (%)",
            color: "#aaa",
            font: { size: 14 }
          },
          ticks: { color: "#ccc" },
          grid: { color: "#ccc" },
          beginAtZero: true,
          suggestedMax: 3.5
        }
      }
    }
  });
}

drawKpopChart();
