import { ECharts, init as echartsInit, graphic } from "echarts";
import { DrawingElement } from "../core/element/Element";
import { ElementProperty } from "../core/element/ElementProperty";
import { DrawingElementPropsView, LayoutSchema, propViews } from "../core/element/ElementPropsView";
import { elementMeta } from "../core/element/ElementMeta";


@elementMeta({
    id: "echarts-bar-chart",
    label: 'Bar Chart',
    icon: `<?xml version="1.0" encoding="UTF-8"?><svg width="14" height="14" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6 6V42H42" stroke="#333" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M14 30V34" stroke="#333" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M22 22V34" stroke="#333" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M30 6V34" stroke="#333" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M38 14V34" stroke="#333" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    creator: {
        create(prop: ElementProperty, onClick?: (el: DrawingElement, me: MouseEvent) => void) { return new BarChart(prop, onClick) }
    }
})
export class BarChart extends DrawingElement {
    private chart: ECharts;
    constructor(prop: ElementProperty, onClick?: (el: DrawingElement, me: MouseEvent) => void) {
        const dom = document.createElementNS('http://www.w3.org/2000/svg', 'foreignObject');
        const innerDiv = document.createElement("div");
        innerDiv.setAttribute("xmlns", "http://www.w3.org/1999/xhtml");

        innerDiv.style.display = "inner-block";
        innerDiv.style.width = "100%";
        innerDiv.style.height = "100%";

        dom.appendChild(innerDiv);
        super(prop, propViews(LayoutSchema), dom, onClick);
        this.chart = echartsInit(innerDiv);
        console.log(dom)

        // prettier-ignore
        let dataAxis = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20'];
        // prettier-ignore
        let data = [220, 182, 191, 234, 290, 330, 310, 123, 442, 321, 90, 149, 210, 122, 133, 334, 198, 123, 125, 220];
        let yMax = 500;
        let dataShadow = [];
        for (let i = 0; i < data.length; i++) {
            dataShadow.push(yMax);
        }
        // 绘制图表
        this.chart.setOption({
            grid: {
                top: '0px',
                left: '0px',
                right: '0px',
                bottom: '0px',

            },
            xAxis: {
                data: dataAxis,
                axisLabel: {
                    inside: true,
                    color: '#fff'
                },
                axisTick: {
                    show: false
                },
                axisLine: {
                    show: false
                },
                z: 10
            },
            yAxis: {
                axisLine: {
                    show: false
                },
                axisTick: {
                    show: false
                },
                axisLabel: {
                    color: '#999'
                }
            },
            dataZoom: [
                {
                    type: 'inside'
                }
            ],
            series: [
                {
                    type: 'bar',
                    showBackground: true,
                    itemStyle: {
                        color: new graphic.LinearGradient(0, 0, 0, 1, [
                            { offset: 0, color: '#83bff6' },
                            { offset: 0.5, color: '#188df0' },
                            { offset: 1, color: '#188df0' }
                        ])
                    },
                    emphasis: {
                        itemStyle: {
                            color: new graphic.LinearGradient(0, 0, 0, 1, [
                                { offset: 0, color: '#2378f7' },
                                { offset: 0.7, color: '#2378f7' },
                                { offset: 1, color: '#83bff6' }
                            ])
                        }
                    },
                    data: data
                }
            ]
        });
    }

    public update(): void {
        this.dom.setAttribute('x', this.prop.layout.position.x.toString());
        this.dom.setAttribute('y', this.prop.layout.position.y.toString());
        this.dom.setAttribute('width', this.prop.layout.size.width.toString());
        this.dom.setAttribute('height', this.prop.layout.size.height.toString());
        this.dom.setAttribute('transform', `rotate(${this.prop.layout.rotation} ${this.prop.layout.position.x} ${this.prop.layout.position.y})`);
        this.chart?.resize();
    }

}

@elementMeta({
    id: "echarts-line-chart",
    label: 'Line Chart',
    icon: `<?xml version="1.0" encoding="UTF-8"?><svg width="14" height="14" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6 6V42H42" stroke="#333" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M14 34L22 18L32 27L42 6" stroke="#333" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    creator: {
        create(prop: ElementProperty, onClick?: (el: DrawingElement, me: MouseEvent) => void) { return new LineChart(prop, onClick) }
    }
})
export class LineChart extends DrawingElement {
    private chart: ECharts;
    constructor(prop: ElementProperty, onClick?: (el: DrawingElement, me: MouseEvent) => void) {
        const dom = document.createElementNS('http://www.w3.org/2000/svg', 'foreignObject');
        const innerDiv = document.createElement("div");
        innerDiv.setAttribute("xmlns", "http://www.w3.org/1999/xhtml");

        innerDiv.style.display = "inner-block";
        innerDiv.style.width = "100%";
        innerDiv.style.height = "100%";

        dom.appendChild(innerDiv);
        super(prop, propViews(LayoutSchema), dom, onClick);
        this.chart = echartsInit(innerDiv);
        // 绘制图表
        this.chart.setOption({
            grid: {
                top: '0px',
                left: '0px',
                right: '0px',
                bottom: '0px',

            },
            xAxis: {
                type: 'category',
                boundaryGap: false
            },
            yAxis: {
                type: 'value',
                boundaryGap: [0, '30%']
            },
            visualMap: {
                type: 'piecewise',
                show: false,
                dimension: 0,
                seriesIndex: 0,
                pieces: [
                    {
                        gt: 1,
                        lt: 3,
                        color: 'rgba(0, 0, 180, 0.4)'
                    },
                    {
                        gt: 5,
                        lt: 7,
                        color: 'rgba(0, 0, 180, 0.4)'
                    }
                ]
            },
            series: [
                {
                    type: 'line',
                    smooth: 0.6,
                    symbol: 'none',
                    lineStyle: {
                        color: '#5470C6',
                        width: 5
                    },
                    markLine: {
                        symbol: ['none', 'none'],
                        label: { show: false },
                        data: [{ xAxis: 1 }, { xAxis: 3 }, { xAxis: 5 }, { xAxis: 7 }]
                    },
                    areaStyle: {},
                    data: [
                        ['2019-10-10', 200],
                        ['2019-10-11', 560],
                        ['2019-10-12', 750],
                        ['2019-10-13', 580],
                        ['2019-10-14', 250],
                        ['2019-10-15', 300],
                        ['2019-10-16', 450],
                        ['2019-10-17', 300],
                        ['2019-10-18', 100]
                    ]
                }
            ]
        });
    }

    public update(): void {
        this.dom.setAttribute('x', this.prop.layout.position.x.toString());
        this.dom.setAttribute('y', this.prop.layout.position.y.toString());
        this.dom.setAttribute('width', this.prop.layout.size.width.toString());
        this.dom.setAttribute('height', this.prop.layout.size.height.toString());
        this.dom.setAttribute('transform', `rotate(${this.prop.layout.rotation} ${this.prop.layout.position.x} ${this.prop.layout.position.y})`);
        this.chart?.resize();
    }

}


export interface GaugeChartProperty {
    value: number;
    minValue: number;
    maxValue: number;

    fontSize: number;
    textFormatter: string;
}

const GaugePropView: DrawingElementPropsView = {
    groups: [{
        id: 'chart',
        label: '图表',
        items: [
            {
                propPath: "value",
                type: 'number',
                label: 'Val'
            },
            {
                propPath: "minValue",
                type: 'number',
                label: 'Min'
            },
            {
                propPath: "maxValue",
                type: 'number',
                label: 'Max'
            },
            {
                propPath: "fontSize",
                type: 'number',
                label: 'FS'
            },
            {
                propPath: "textFormatter",
                type: 'text',
                label: 'TF'
            }
        ]
    }]
}

@elementMeta({
    id: "echarts-gauge-chart",
    label: 'Gauge Chart',
    icon: `<?xml version="1.0" encoding="UTF-8"?><svg width="14" height="14" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M24 44C35.0457 44 44 35.0457 44 24C44 18.4836 41.7666 13.4887 38.1547 9.87045C34.5344 6.24377 29.5292 4 24 4C18.4708 4 13.4656 6.24377 9.84529 9.87045C6.23339 13.4887 4 18.4835 4 24C4 35.0457 12.9543 44 24 44Z" stroke="#333" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/><path d="M4 24H8" stroke="#333" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/><path d="M9.84521 9.87036L12.9747 12.9999" stroke="#333" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/><path d="M24 4V8" stroke="#333" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/><path d="M44 24H40" stroke="#333" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/><path d="M38.1549 9.87036L35.0254 12.9999" stroke="#333" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/><path d="M24 20V32" stroke="#333" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/><path d="M39.8523 36.1961C36.1954 40.9422 30.4548 44 24 44C17.5452 44 11.8046 40.9422 8.14771 36.1961C12.8209 33.5259 18.2323 32 24 32C29.7677 32 35.179 33.5259 39.8523 36.1961Z" stroke="#333" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    creator: {
        create(prop: ElementProperty, onClick?: (el: DrawingElement, me: MouseEvent) => void) { return new GaugeChart(prop, onClick) }
    }
})
export class GaugeChart extends DrawingElement<GaugeChart, ElementProperty & Partial<GaugeChartProperty>> {
    private chart: ECharts;
    constructor(prop: ElementProperty & Partial<GaugeChartProperty>, onClick?: (el: DrawingElement, me: MouseEvent) => void) {
        const dom = document.createElementNS('http://www.w3.org/2000/svg', 'foreignObject');
        const innerDiv = document.createElement("div");
        innerDiv.setAttribute("xmlns", "http://www.w3.org/1999/xhtml");

        innerDiv.style.display = "inner-block";
        innerDiv.style.width = "100%";
        innerDiv.style.height = "100%";

        dom.appendChild(innerDiv);

        prop.value = 0;
        prop.minValue = 0;
        prop.maxValue = 0;
        prop.fontSize = 20;
        prop.textFormatter = '{value} °C';


        super(prop, propViews(LayoutSchema, GaugePropView), dom, onClick);
        this.chart = echartsInit(innerDiv);
        console.log(dom)
        // 绘制图表
        this.chart.setOption({
            series: [
                {
                    grid: {
                        top: '0px',
                        left: '0px',
                        right: '0px',
                        bottom: '0px',

                    },
                    type: 'gauge',
                    center: ['50%', '60%'],
                    startAngle: 200,
                    endAngle: -20,
                    min: prop.minValue,
                    max: prop.maxValue,
                    splitNumber: 10,
                    itemStyle: {
                        color: '#FFAB91'
                    },
                    progress: {
                        show: true,
                        width: 30
                    },
                    pointer: {
                        show: false
                    },
                    axisLine: {
                        lineStyle: {
                            width: 30
                        }
                    },
                    axisTick: {
                        distance: -45,
                        splitNumber: 5,
                        lineStyle: {
                            width: 2,
                            color: '#999'
                        }
                    },
                    splitLine: {
                        distance: -52,
                        length: 14,
                        lineStyle: {
                            width: 3,
                            color: '#999'
                        }
                    },
                    axisLabel: {
                        distance: -20,
                        color: '#999',
                        fontSize: 20
                    },
                    anchor: {
                        show: false
                    },
                    title: {
                        show: false
                    },
                    detail: {
                        valueAnimation: true,
                        width: '60%',
                        lineHeight: 40,
                        borderRadius: 8,
                        offsetCenter: [0, '-15%'],
                        fontSize: 60,
                        fontWeight: 'bolder',
                        formatter: prop.textFormatter,
                        color: 'inherit'
                    },
                    data: [
                        {
                            value: prop.value
                        }
                    ]
                },
                {
                    grid: {
                        top: '0px',
                        left: '0px',
                        right: '0px',
                        bottom: '0px',

                    },
                    type: 'gauge',
                    center: ['50%', '60%'],
                    startAngle: 200,
                    endAngle: -20,
                    min: prop.minValue,
                    max: prop.maxValue,
                    itemStyle: {
                        color: '#FD7347'
                    },
                    progress: {
                        show: true,
                        width: 8
                    },
                    pointer: {
                        show: false
                    },
                    axisLine: {
                        show: false
                    },
                    axisTick: {
                        show: false
                    },
                    splitLine: {
                        show: false
                    },
                    axisLabel: {
                        show: false
                    },
                    detail: {
                        show: false
                    },
                    data: [
                        {
                            value: prop.value
                        }
                    ]
                }
            ]

        });
    }

    public update(): void {
        this.dom.setAttribute('x', this.prop.layout.position.x.toString());
        this.dom.setAttribute('y', this.prop.layout.position.y.toString());
        this.dom.setAttribute('width', this.prop.layout.size.width.toString());
        this.dom.setAttribute('height', this.prop.layout.size.height.toString());
        this.dom.setAttribute('transform', `rotate(${this.prop.layout.rotation} ${this.prop.layout.position.x} ${this.prop.layout.position.y})`);
        this.chart?.setOption({
            series: [
                {
                    min: this.prop.minValue,
                    max: this.prop.maxValue,
                    detail: {
                        formatter: this.prop.textFormatter,
                        fontSize: this.prop.fontSize,

                    },
                    data: [
                        {
                            value: this.prop.value
                        }
                    ]
                },
                {
                    min: this.prop.minValue,
                    max: this.prop.maxValue,
                    data: [
                        {
                            value: this.prop.value
                        }
                    ]
                }
            ]
        })
        this.chart?.resize();
    }

}

// @elementMeta({
//     id: "echarts-earth-3d-chart",
//     label: 'Earth 3D Chart',
//     icon: `<svg t="1720972128372" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="7758" width="14" height="14"><path d="M797.064 768c1.932 0.188 3.889 0.29 5.87 0.29 1.982 0 3.939-0.29 5.871-0.29h-11.741z m66.07-59.71c0-1.284-0.134-2.554-0.134-3.818v7.636c0-1.264 0.134-2.535 0.134-3.818z m-582.994 60c1.981 0 3.938-0.102 5.87-0.29h-11.74c1.932 0.188 3.889 0.29 5.87 0.29z" p-id="7759" fill="#000000"></path><path d="M930 900H124V94c0-16.568-13.432-30-30-30S64 77.432 64 94v806c0 33.137 26.863 60 60 60h806c16.568 0 30-13.432 30-30s-13.432-30-30-30z" p-id="7760" fill="#000000"></path><path d="M188.917 780.801a29.882 29.882 0 0 0 19.859 7.524c8.298 0 16.559-3.424 22.487-10.13l218.903-247.604 148.85 156.498 304.199-402.478c9.99-13.218 7.374-32.032-5.844-42.022-13.218-9.99-32.033-7.374-42.021 5.844L593.774 594.518 448.551 441.833 186.312 738.455c-10.975 12.413-9.808 31.372 2.605 42.346z" p-id="7761" fill="#000000"></path></svg>`,
//     creator: {
//         create(prop: ElementProperty, onClick?: (el: DrawingElement, me: MouseEvent) => void) { return new Earth3DChart(prop, onClick) }
//     }
// })
export class Earth3DChart extends DrawingElement {
    private chart: ECharts;
    constructor(prop: ElementProperty, onClick?: (el: DrawingElement, me: MouseEvent) => void) {
        const dom = document.createElementNS('http://www.w3.org/2000/svg', 'foreignObject');
        const innerDiv = document.createElement("div");
        innerDiv.setAttribute("xmlns", "http://www.w3.org/1999/xhtml");

        innerDiv.style.display = "inner-block";
        innerDiv.style.width = "100%";
        innerDiv.style.height = "100%";

        dom.appendChild(innerDiv);
        super(prop, propViews(LayoutSchema), dom, onClick);
        this.chart = echartsInit(innerDiv);
        console.log(dom)
        // 绘制图表
        this.chart.setOption({
            backgroundColor: '#000',
            globe: {
                baseTexture: 'https://echarts.apache.org/examples' + '/data-gl/asset/world.topo.bathy.200401.jpg',
                heightTexture: 'https://echarts.apache.org/examples' + '/data-gl/asset/world.topo.bathy.200401.jpg',
                displacementScale: 0.04,
                shading: 'realistic',
                environment: 'https://echarts.apache.org/examples' + '/data-gl/asset/starfield.jpg',
                realisticMaterial: {
                    roughness: 0.9
                },
                postEffect: {
                    enable: true
                },
                light: {
                    main: {
                        intensity: 5,
                        shadow: true
                    },
                    ambientCubemap: {
                        texture: 'https://echarts.apache.org/examples' + '/data-gl/asset/pisa.hdr',
                        diffuseIntensity: 0.2
                    }
                }
            }

        });
    }

    public update(): void {
        this.dom.setAttribute('x', this.prop.layout.position.x.toString());
        this.dom.setAttribute('y', this.prop.layout.position.y.toString());
        this.dom.setAttribute('width', this.prop.layout.size.width.toString());
        this.dom.setAttribute('height', this.prop.layout.size.height.toString());
        this.dom.setAttribute('transform', `rotate(${this.prop.layout.rotation} ${this.prop.layout.position.x} ${this.prop.layout.position.y})`);
        this.chart?.resize();
    }

}