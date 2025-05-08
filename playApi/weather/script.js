document.addEventListener('DOMContentLoaded', () => {
    // 动态设置正确的背景图路径
    const backgroundImagePath = '../../assets/images/weather1.webp';
    document.body.style.backgroundImage = `url('${backgroundImagePath}')`;
    
    const provinceSelect = document.getElementById('province-select');
    const cityInput = document.getElementById('city-input');
    const countyInput = document.getElementById('county-input');
    
    const provincialCapitals = {
        "北京市": "北京", "天津市": "天津", "河北省": "石家庄", "山西省": "太原",
        "内蒙古自治区": "呼和浩特", "辽宁省": "沈阳", "吉林省": "长春", "黑龙江省": "哈尔滨",
        "上海市": "上海", "江苏省": "南京", "浙江省": "杭州", "安徽省": "合肥",
        "福建省": "福州", "江西省": "南昌", "山东省": "济南", "河南省": "郑州",
        "湖北省": "武汉", "湖南省": "长沙", "广东省": "广州", "广西壮族自治区": "南宁",
        "海南省": "海口", "重庆市": "重庆", "四川省": "成都", "贵州省": "贵阳",
        "云南省": "昆明", "西藏自治区": "拉萨", "陕西省": "西安", "甘肃省": "兰州",
        "青海省": "西宁", "宁夏回族自治区": "银川", "新疆维吾尔自治区": "乌鲁木齐",
        "香港特别行政区": "香港", "澳门特别行政区": "澳门", "台湾省": "台北"
    };

    // 设置默认城市为选中省份的省会
    function setDefaultCityForProvince(selectedProvince) {
        cityInput.value = provincialCapitals[selectedProvince] || '';
    }

    // 初始化：设置上海的省会（上海本身），并获取天气
    setDefaultCityForProvince(provinceSelect.value);
    fetchWeatherData(provinceSelect.value, cityInput.value, countyInput.value.trim());

    provinceSelect.addEventListener('change', () => {
        setDefaultCityForProvince(provinceSelect.value);
        countyInput.value = '';
        // 省份改变后，可以自动触发一次查询，或者让用户点击按钮
        // 为简化，此处仅填充，用户需按查询按钮
    });

    const searchButton = document.getElementById('search-weather-btn');
    searchButton.addEventListener('click', () => {
        const province = provinceSelect.value;
        const city = cityInput.value.trim();
        const county = countyInput.value.trim();

        if (province && city) {
            fetchWeatherData(province, city, county);
        } else if (province) {
            // 如果城市为空，但省份已选，尝试使用省会
            const capital = provincialCapitals[province];
            if (capital) {
                cityInput.value = capital; // 填充省会
                fetchWeatherData(province, capital, county);
            } else {
                alert('请输入城市！');
            }
        } else {
            alert('请选择省份并输入城市！');
        }
    });
});

async function fetchWeatherData(province, city, county) {
    // 请确保替换为您自己的有效 ID 和 KEY
    const apiKey = '0e8b0763210c6f7f19b175a6c177ca4f'; // 示例 Key，请替换
    const apiId = '10004465'; // 示例 ID，请替换
    
    let apiUrl = `https://cn.apihz.cn/api/tianqi/tengxun.php?id=${apiId}&key=${apiKey}&province=${encodeURIComponent(province)}&city=${encodeURIComponent(city)}`;
    if (county) {
        apiUrl += `&county=${encodeURIComponent(county)}`;
    }

    const forecastContainer = document.getElementById('forecast-container');
    forecastContainer.innerHTML = '<div class="loading">正在加载天气数据...</div>'; 
    updateLocationDisplay(province, city, county); // 更新当前查询地点显示

    try {
        const response = await fetch(apiUrl);
        // 检查响应是否成功
        if (!response.ok) {
            // 如果响应状态码不是 2xx，尝试读取响应体以获取错误信息
            let errorData = { msg: `HTTP error! status: ${response.status}` }; // 默认错误
            try {
                errorData = await response.json(); // 尝试解析 JSON 错误信息
            } catch (e) {
                // 如果响应体不是 JSON 或解析失败，使用默认错误
                console.error('Failed to parse error response:', e);
            }
            throw new Error(errorData.msg || `HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        // 检查 API 返回的业务代码
        if (data.code !== 200) {
            throw new Error(data.msg || '获取天气数据失败');
        }

        updateLocationDisplay(data.province, data.getcity, data.county); // 使用 API 返回的确认地点信息更新显示
        displayForecast(data.data);
        renderWeatherChart(data.data,{province, city, county}); // 新增：调用渲染图表的函数

    } catch (error) {
        console.error('获取天气数据时出错:', error);
        forecastContainer.innerHTML = `<div class="error">加载天气数据失败: ${error.message}</div>`;
    }
}

function updateLocationDisplay(province, city, county) {
    document.getElementById('current-province').textContent = province || '';
    document.getElementById('current-city').textContent = city || '';
    document.getElementById('current-county').textContent = county || '';
}

function displayForecast(forecastData) {
    const forecastContainer = document.getElementById('forecast-container');
    forecastContainer.innerHTML = '';

    if (!forecastData || forecastData.length === 0) {
        forecastContainer.innerHTML = '<div class="error">没有可用的天气预报数据。</div>';
        return;
    }

    const today = new Date();
    const todayString = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

    forecastData.forEach(day => {
        const dayCard = document.createElement('div');
        dayCard.className = 'forecast-day';
        if (day.time === todayString) {
            dayCard.classList.add('today');
        }

        const date = new Date(day.time);
        const formattedDate = `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
        const weekday = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'][date.getDay()];

        dayCard.innerHTML = `
            <div class="date-header">
                 <h2>${formattedDate} (${weekday}) ${day.time === todayString ? "<span class='today-indicator'>(今天)</span>" : ""}</h2>
            </div>
           
            <div class="weather-details-container">
                <div class="weather-section day-details">
                    <h3>日间</h3>
                    <div class="weather-detail">
                        <strong>天气:</strong>
                        <span>${day.day_weather_short || 'N/A'}</span>
                    </div>
                    <div class="weather-detail">
                        <strong>最高温:</strong>
                        <span class="temp-max">${day.max_degree || 'N/A'}°C</span>
                    </div>
                    <div class="weather-detail">
                        <strong>风向:</strong>
                        <span>${day.day_wind_direction || 'N/A'}</span>
                    </div>
                    <div class="weather-detail">
                        <strong>风力:</strong>
                        <span>${day.day_wind_power || 'N/A'}</span>
                    </div>
                </div>

                <div class="weather-section night-details">
                    <h3>夜间</h3>
                    <div class="weather-detail">
                        <strong>天气:</strong>
                        <span>${day.night_weather_short || 'N/A'}</span>
                    </div>
                    <div class="weather-detail">
                        <strong>最低温:</strong>
                        <span class="temp-min">${day.min_degree || 'N/A'}°C</span>
                    </div>
                    <div class="weather-detail">
                        <strong>风向:</strong>
                        <span>${day.night_wind_direction || 'N/A'}</span>
                    </div>
                    <div class="weather-detail">
                        <strong>风力:</strong>
                        <span>${day.night_wind_power || 'N/A'}</span>
                    </div>
                </div>
            </div>

            ${(day.aqi_level > 0 || day.aqi_name) ? `
            <div class="weather-section aqi-section">
                <h3>空气质量</h3>
                <div class="weather-detail">
                    <strong>AQI 等级:</strong>
                    <span>${day.aqi_level || 'N/A'}</span>
                </div>
                <div class="weather-detail">
                    <strong>AQI 名称:</strong>
                    <span>${day.aqi_name || 'N/A'}</span>
                </div>
            </div>
            ` : ''}
        `;
        forecastContainer.appendChild(dayCard);
    });
}

// 新增：渲染天气图表的函数
function renderWeatherChart(forecastData, {province, city, county}) {
    if (!forecastData || forecastData.length === 0) {
        return; // 没有数据则不渲染图表
    }

    const chartDom = document.getElementById('weather-chart-container');
    const myChart = echarts.init(chartDom);

    const dates = forecastData.map(day => {
        const date = new Date(day.time);
        // 如果日期是今天，则显示今天
        if (date.toDateString() === new Date().toDateString()) {
            return `${date.getMonth() + 1}/${date.getDate()} (今天)`;
        }
        return `${date.getMonth() + 1}/${date.getDate()}`;
    });
    const maxTemps = forecastData.map(day => parseFloat(day.max_degree));
    const minTemps = forecastData.map(day => parseFloat(day.min_degree));

    const option = {
        title: {
            text: '未来几日' + province + '-' + city + '-' + county + '气温趋势',
            left: 'center',
            textStyle: {
                color: '#ffffff'  // 修改标题颜色为白色
            }
        },
        tooltip: {
            trigger: 'axis'
        },
        legend: {
            data: ['最高气温', '最低气温'],
            top: 'bottom',
            textStyle: {
                color: '#ffffff'  // 修改标题颜色为白色
            }
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '10%', // 调整grid的bottom以容纳legend
            containLabel: true
        },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: dates,
            axisLabel: {
                color: '#ffffff'  // 修改横轴坐标值颜色为白色
            }
        },
        yAxis: {
            type: 'value',
            axisLabel: {
                formatter: '{value} °C',
                color: '#ffffff'  // 修改纵轴坐标值颜色为白色
            }
        },
        series: [
            {
                name: '最高气温',
                type: 'line',
                data: maxTemps,
                markPoint: {
                    data: [
                        { type: 'max', name: '最大值' },
                        { type: 'min', name: '最小值' }
                    ]
                },
                markLine: {
                    data: [{ type: 'average', name: '平均值' }]
                }
            },
            {
                name: '最低气温',
                type: 'line',
                data: minTemps,
                markPoint: {
                    data: [
                        { type: 'max', name: '最大值' },
                        { type: 'min', name: '最小值' }
                    ]
                },
                markLine: {
                    data: [{ type: 'average', name: '平均值' }]
                }
            }
        ]
    };

    myChart.setOption(option);

    // 监听窗口大小变化，以便图表自适应
    window.addEventListener('resize', () => {
        myChart.resize();
    });
} 