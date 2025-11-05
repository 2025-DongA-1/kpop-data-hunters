    // ======= 데이터 로드 =======
    const data = debutData;

    // ======= 필드명 보정 =======
    data.forEach(d => {
      d.year = d.year || d.debut_year || d.active_year;
      d.nationality = d.nationality || d.country || d.birth_country;
    });

    // ======= 연도별 데뷔 아이돌 수 + 이동평균 =======
    const yearCount = {};
    data.forEach(d => {
      const year = parseInt(d.year);
      if (isNaN(year) || year < 2005) return;
      yearCount[year] = (yearCount[year] || 0) + 1;
    });

    const years = Object.keys(yearCount).map(Number).sort((a, b) => a - b);
    const counts = years.map(y => yearCount[y]);
    const movingAvg = counts.map((_, i, arr) => {
      const slice = arr.slice(Math.max(0, i - 2), i + 1);
      const avg = slice.reduce((a, b) => a + b, 0) / slice.length;
      return avg.toFixed(2);
    });

    // ======= 외국인 아이돌 비율 =======
    const foreignRatio = {};
    years.forEach(y => {
      const all = data.filter(d => parseInt(d.year) === y);
      const foreign = all.filter(d => {
        const nat = d.nationality?.toLowerCase() || '';
        return !['korea', 'south korea', '대한민국', '한국', 'korean'].some(k => nat.includes(k));
      });
      foreignRatio[y] = all.length ? (foreign.length / all.length * 100).toFixed(2) : 0;
    });

    const ratioValues = years.map(y => foreignRatio[y]);

    // ======= 외국인 아이돌 국적 비율 TOP10 =======
    const nationalityCount = {};
    data.forEach(d => {
      if (!d.nationality) return;
      const nat = d.nationality.toString().trim().toLowerCase();
      if (['korea', 'south korea', 'republic of korea', '대한민국', '한국', 'korean'].some(k => nat.includes(k))) return;
      nationalityCount[nat] = (nationalityCount[nat] || 0) + 1;
    });

    const top10 = Object.entries(nationalityCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);

    // ======= 국가명 한국어 변환 =======
    const countryNames = {
      'china': '중국', 'japan': '일본', 'thailand': '태국', 'usa': '미국',
      'taiwan': '대만', 'australia': '호주', 'canada': '캐나다', 'vietnam': '베트남',
      'indonesia': '인도네시아', 'philippines': '필리핀', 'malaysia': '말레이시아',
      'mongolia': '몽골', 'hong kong': '홍콩', 'singapore': '싱가포르', 'uk': '영국',
      'france': '프랑스', 'germany': '독일'
    };

    const nationalLabels = top10.map(([k]) => countryNames[k] || k);
    const nationalValues = top10.map(([, v]) => v);

    // ======= Chart.js =======

    // (1) 연도별 데뷔 아이돌 수 + 이동평균
    new Chart(document.getElementById('trendChart'), {
      type: 'bar',
      data: {
        labels: years,
        datasets: [
          {
            label: '데뷔 아이돌 수',
            data: counts,
            backgroundColor: 'rgba(54, 162, 235, 0.8)',
            borderWidth: 0,
            order: 2 // ✅ 막대를 뒤로 보냄 (낮을수록 먼저 그림)
          },
          {
            label: '3년 이동평균',
            data: movingAvg,
            type: 'line',
            borderColor: '#ff6b81',
            borderWidth: 3,
            pointRadius: 4,
            fill: false,
            tension: 0.3,
            order: 1 // ✅ 라인을 위로 올림 (높을수록 나중에 그림)
          }
        ]
      },
      options: {
        plugins: {
          legend: { labels: { color: '#212529' } },
          title: {
            display: true,
            text: '연도별 데뷔 아이돌 수 & 3년 이동평균 (2005~)',
            color: '#6a78ee',
            font: { size: 18 }
          }
        },
        scales: {
          x: { ticks: { color: '#ccc' }, title: { display: true, text: '연도', color: '#aaa' } },
          y: { ticks: { color: '#ccc' }, title: { display: true, text: '아이돌 수', color: '#aaa' }, beginAtZero: true }
        }
      }
    });

     new Chart(document.getElementById('foreignRatioChart'), {
    type: 'line',
    data: {
      labels: years.filter(y => y >= 2009),
      datasets: [{
        label: '외국인 비율 (%)',
        data: ratioValues.filter((_, i) => years[i] >= 2009),
        borderColor: '#ffcd56',
        backgroundColor: 'rgba(255, 205, 86, 0.2)',
        borderWidth: 3,
        pointRadius: 4,
        fill: true,
        tension: 0.3
      }]
    },
    options: {
      plugins: {
        legend: { position: 'top', labels: { color: '#212529' } },
        title: {
          display: true,
          text: '연도별 외국인 아이돌 비율 변화 (2009년 이후)',
          color: '#6a78ee',
          font: { size: 18 }
        }
      },
      scales: {
        x: {
          ticks: { color: '#ccc' },
          title: { display: true, text: '연도', color: '#aaa' }
        },
        y: {
          ticks: { color: '#ccc', stepSize: 2 },
          title: { display: true, text: '외국인 비율 (%)', color: '#aaa' },
          beginAtZero: true,
          max: 24   // ✅ 최대값 20%로 설정
        }
      }
    }
  });