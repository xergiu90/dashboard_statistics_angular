import {Component, OnInit, OnDestroy, ViewChildren, QueryList, HostListener} from '@angular/core';
import {Subscription} from 'rxjs';
import {debounce, first} from 'rxjs/operators';

import {User} from '@app/_models';
import {UserService, AuthenticationService} from '@app/_services';
import {BaseChartDirective} from 'ng4-charts';
import {Chart} from 'chart.js';
import * as ChartAnnotation from 'chartjs-plugin-annotation';
import {formatDate} from '@angular/common';
import {HomeService} from '@app/home/services/home.service';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
    templateUrl: 'home.component.html',
    styleUrls: ['home.component.less']
})
export class HomeComponent implements OnInit, OnDestroy {
    selectedOption = '1';
    isFullScreen: boolean = false;
    isAllFullScreen: boolean = false;
    showFullScreen: boolean = false;
    maxValueTotalAccounts = 0;
    dates = [];
    labels = [];
    chartType: string = '';
    maxValueNewAccounts = 0;
    maxValueNewAccountsAverage = 0;
    conversionRateMax = 0;
    conversionRateAverage = 0;
    timeout = null;


    dataTotalAccounts = {};
    dataTotalAccountsWeek = {};

    dataNewAccounts = {};
    dataNewAccountsWeek = {};

    dataScreenFlow = {};
    dataScreenFlowWeek = {};

    dataConversionRate = {};
    dataConversionRateWeek = {};


    @ViewChildren(BaseChartDirective) charts: QueryList<BaseChartDirective>;


    // Options for each Chart type
    totalAccountsOptions = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            xAxes: [{
                stacked: false,
                // autoSkip: false,
                ticks: {
                    maxRotation: 0,
                    minRotation: 0
                },
                // gridLines: {
                //     display: false
                // }
            }],
            yAxes: [{
                ticks: {
                    suggestedMin: 0,
                    suggestedMax: this.maxValueTotalAccounts + 10
                },
                stacked: false,
                // gridLines: {
                //     display: false
                // }
            }],

        },
        datasetFill: false,
        tooltips: {
            callbacks: {},
            backgroundColor: '#DDDDDD',
            titleFontSize: 14,
            bodyFontSize: 14,
            yPadding: 10,
            xPadding: 15,
            titleFontFamily: 'Helvetica Neue',
            bodyFontFamily: 'Helvetica Neue',
            titleFontColor: '#000000',
            bodyFontColor: '#000000',
            displayColors: false,
            cornerRadius: 1
        }
    };


    private newAccountsOptions = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            xAxes: [{
                stacked: false,
                autoSkip: false,
                ticks: {
                    maxRotation: 0,
                    minRotation: 0
                },
                gridLines: {
                    display: false
                }
            }],
            yAxes: [{
                ticks: {
                    suggestedMin: 0,
                    suggestedMax: this.maxValueNewAccounts + 10
                },
                stacked: false,
                gridLines: {
                    display: false
                }
            }],

        },
        datasetFill: false,
        tooltips: {
            callbacks: {},
            backgroundColor: '#DDDDDD',
            titleFontSize: 14,
            bodyFontSize: 14,
            yPadding: 10,
            xPadding: 15,
            titleFontFamily: 'Helvetica Neue',
            bodyFontFamily: 'Helvetica Neue',
            titleFontColor: '#000000',
            bodyFontColor: '#000000',
            displayColors: false,
            cornerRadius: 1
        },
        annotation: {
            annotations: [{
                type: 'line',
                mode: 'horizontal',
                scaleID: 'y-axis-0',
                value: 3,
                borderDash: [10, 5],
                borderColor: '#eeeeee',
                borderWidth: 2,
                label: {
                    enabled: false,
                }
            }]
        }
    };

    private conversionRateOptions = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            xAxes: [{
                stacked: false,
                autoSkip: false,
                ticks: {
                    maxRotation: 0,
                    minRotation: 0
                },
                gridLines: {
                    display: false
                }
            }],
            yAxes: [{
                ticks: {
                    suggestedMin: 0,
                    suggestedMax: this.maxValueNewAccounts + 10
                },
                stacked: false,
                gridLines: {
                    display: false
                }
            }],

        },
        datasetFill: false,
        tooltips: {
            callbacks: {},
            backgroundColor: '#DDDDDD',
            titleFontSize: 14,
            bodyFontSize: 14,
            yPadding: 10,
            xPadding: 15,
            titleFontFamily: 'Helvetica Neue',
            bodyFontFamily: 'Helvetica Neue',
            titleFontColor: '#000000',
            bodyFontColor: '#000000',
            displayColors: false,
            cornerRadius: 1
        },
        annotation: {
            annotations: [{
                type: 'line',
                mode: 'horizontal',
                scaleID: 'y-axis-0',
                value: 3,
                borderDash: [10, 5],
                borderColor: '#eeeeee',
                borderWidth: 2,
                label: {
                    enabled: false,
                }
            }]
        }
    };


    private screenFlowOptions = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            xAxes: [],
            yAxes: [],
        },
        tooltips: {
            callbacks: {
                title: (data) => {
                    return '';
                },
                label: (data) => {
                    return this.screenFlowLabels[data.index];
                }
            },
            backgroundColor: '#DDDDDD',
            titleFontSize: 14,
            bodyFontSize: 14,
            yPadding: 10,
            xPadding: 15,
            titleFontFamily: 'Helvetica Neue',
            bodyFontFamily: 'Helvetica Neue',
            titleFontColor: '#000000',
            bodyFontColor: '#000000',
            displayColors: false,
            cornerRadius: 1
        },
        legend: {
            position: 'right',
            labels: {
                fontFamily: 'Helvetica Neue',
                fontSize: 17,
                boxWidth: 15,
                alignmentBaseline: 'left'
            }
        }
    };


    // Chart data initialization
    lineChartTotalAccounts = [{data: [], label: 'Accounts'}];
    barChartNewAccounts = [{data: [], label: 'New accounts'}];
    barChartConversionRate = [{data: [], label: 'Conversion rate'}];
    screenFlowLabels = [];
    roundScreenFlow = [[]];

    // Chart colors
    private chartBarColors = [{
        backgroundColor: '#527edb',
        hoverBorderColor: '#000000',
        hoverBorderWidth: 2
    }];

    // Chart conversion colors
    private chartConversionBarColors = [{
        backgroundColor: '#228B22',
        hoverBorderColor: '#000000',
        hoverBorderWidth: 2
    }];

    private chartColors = [
        {
            backgroundColor: '#527edb',
            borderColor: '#527edb',
            pointBackgroundColor: '#527edb',
            pointBorderColor: '#527edb',
            pointHoverBackgroundColor: '#527edb',
            pointHoverBorderColor: '#527edb',
            fill: false
        }
    ];

    private doughnutColorsScreenFlow: any[] = [
        {backgroundColor: ['#006e27', '#00bf85', '#9febd6', '#4BB4E6', '#ffb6e9', '#ffe9f8', '#ffb600', '#B5E8F70', '#A885D8', '#D9C2F0', '#CF71AF', '#E75480', '#FF1C00', '#F4C2C2', '#FFA812']},
        {borderColor: ['#FEFFC9', '#FEFFC9', '#FEFFC9', '#FEFFC9', '#FEFFC9', '#FEFFC9', '#FEFFC9', '#FEFFC9', '#FEFFC9', '#FEFFC9', '#FEFFC9', '#FEFFC9', '#FEFFC9', '#FEFFC9', '#FEFFC9']}];


    @HostListener('document:mousemove', ['$event'])
    onMouseMove(e) {
        if (this.isAllFullScreen && this.showFullScreen) {
            this.showFullScreen = false;
            clearTimeout(this.timeout);
            this.timeout = setTimeout(() => {
                this.showFullScreen = true;
            }, 2000);
        }
    }

    constructor(private router: Router,
                private route: ActivatedRoute,
                private homeService: HomeService) {
        this.dataNewAccounts = this.route.snapshot.data.newUsers;
        this.dataScreenFlow = this.route.snapshot.data.screenFlow;
        this.dataTotalAccounts = this.route.snapshot.data.totalAccounts;
        this.dataConversionRate = this.route.snapshot.data.conversionRate;
    }

    ngOnInit() {

        Chart.pluginService.register(ChartAnnotation);
        this.formatData(this.dataTotalAccounts, 'total-accounts');
        this.formatData(this.dataNewAccounts, 'new-accounts');
        this.formatData(this.dataScreenFlow, 'screen-flow');
        this.formatData(this.dataConversionRate, 'conversion-rate');
    }

    ngOnDestroy() {
    }


    showFulscreenButton() {
        if (this.isAllFullScreen) {
            this.showFullScreen = false;
            setTimeout(() => {
                this.showFullScreen = true;
            }, 2000);
        }
    }

    allFullScreenToggle() {
        this.isAllFullScreen = !this.isAllFullScreen;
        this.charts.forEach((child) => {
            child.chart.update();
        });
    }

    private changePeriod(value) {
        switch (value) {
            case '1':
                if (this.dataNewAccounts && this.dataScreenFlow && this.dataTotalAccounts && this.dataConversionRate) {
                    this.formatData(this.dataNewAccounts, 'new-accounts');
                    this.formatData(this.dataScreenFlow, 'screen-flow');
                    this.formatData(this.dataTotalAccounts, 'total-accounts');
                    this.formatData(this.dataConversionRate, 'conversion-rate');
                } else {
                    this.getChartData('month');
                }


                break;
            case '2':
                if (this.dataNewAccountsWeek && this.dataScreenFlowWeek && this.dataTotalAccountsWeek && this.dataConversionRate) {
                    this.formatData(this.dataNewAccountsWeek, 'new-accounts');
                    this.formatData(this.dataScreenFlowWeek, 'screen-flow');
                    this.formatData(this.dataTotalAccountsWeek, 'total-accounts');
                    this.formatData(this.dataConversionRateWeek, 'conversion-rate');
                } else {
                    this.getChartData('week');
                }


                break;
        }

        this.charts.forEach((child) => {
            child.chart.update();
        });
    }

    private formatData(data, chartDataType) {
        let index = 0;
        let valueMaxLimit = 0;
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        Chart.defaults.global.defaultFontFamily = 'Arial';

        switch (chartDataType) {
            case 'total-accounts':
                this.lineChartTotalAccounts = [{data: [], label: 'Accounts'}];
                const dataLengthWeekTotalAccounts = Object.keys(data).length - 8;

                this.maxValueTotalAccounts = 0;
                for (const key in data) {
                    if (data.hasOwnProperty(key)) {
                        this.lineChartTotalAccounts[0].data.push(data[key]);
                        if (data[key] > this.maxValueTotalAccounts) {
                            this.maxValueTotalAccounts = data[key];
                        }

                        if (index > dataLengthWeekTotalAccounts && Object.keys(this.dataTotalAccountsWeek).length < 7) {
                            this.dataTotalAccountsWeek[key] = data[key];
                        }

                        index++;


                        this.totalAccountsOptions.scales.yAxes[0].ticks.suggestedMax = this.maxValueTotalAccounts + 10;

                        this.totalAccountsOptions.tooltips.callbacks = {
                            title: (data) => {
                                return this.dates[data[0].index] + ' :';
                            },
                            label: (data) => {
                                return this.lineChartTotalAccounts[0].data[data.index] > 1 ? this.lineChartTotalAccounts[0].data[data.index] + ' accounts' : this.lineChartTotalAccounts[0].data[data.index] + ' account';
                            }
                        };
                    }
                }

                break;
            // case 'new-accounts':
            //     this.barChartNewAccounts = [{data: [], label: 'Accounts'}];
            //     this.maxValueNewAccounts = 0;
            //
            //     for (let key in data) {
            //         this.barChartNewAccounts[0].data.push(data[key]);
            //         this.maxValueNewAccounts += data[key];
            //         if (data[key] > valueMaxLimit) {
            //             valueMaxLimit = data[key];
            //         }
            //
            //     }
            //
            //     this.newAccountsOptions.scales.yAxes[0].ticks.suggestedMax = valueMaxLimit + 10;
            //
            //     this.newAccountsOptions.tooltips.callbacks = {
            //         title: (data) => {
            //             return this.dates[data[0].index] + ' :';
            //         },
            //         label: (data) => {
            //             return this.barChartNewAccounts[0].data[data.index] > 2 ? this.barChartNewAccounts[0].data[data.index] + ' accounts' : this.barChartNewAccounts[0].data[data.index] + ' account';
            //         }
            //     };
            //
            //     break;
            case 'new-accounts':
                this.barChartNewAccounts = [{data: [], label: 'New accounts'}];
                this.maxValueNewAccounts = 0;
                this.dates = [];
                this.labels = [];
                const dataLengthConversionWeek = Object.keys(data).length - 8;

                for (const key in data) {
                    if (data.hasOwnProperty(key)) {
                        const dateFormat = key.split('/');
                        this.barChartNewAccounts[0].data.push(data[key]);
                        this.maxValueNewAccounts += data[key];
                        if (data[key] > valueMaxLimit) {
                            valueMaxLimit = data[key];
                        }
                        this.dates.push(key);
                        this.labels.push(parseInt(dateFormat[2], 10) % 5 === 0 ? dateFormat[2] : parseInt(dateFormat[2], 10) === 1 ? monthNames[parseInt(dateFormat[1], 10) - 1] : '');

                        if (index > dataLengthConversionWeek && Object.keys(this.dataConversionRateWeek).length < 7) {
                            this.dataNewAccountsWeek[key] = data[key];
                        }

                        index++;
                    }
                }

                this.maxValueNewAccountsAverage = Math.ceil((this.maxValueNewAccounts / index));

                this.newAccountsOptions.scales.yAxes[0].ticks.suggestedMax = valueMaxLimit + 5;
                this.newAccountsOptions.annotation.annotations[0].value = this.maxValueNewAccountsAverage;

                if (this.charts) {
                    this.charts.forEach((child, index) => {
                        if (index === 1) {
                            child.chart.options.annotation.annotations[0].value = this.maxValueNewAccountsAverage;
                        }
                    });
                }

                this.newAccountsOptions.tooltips.callbacks = {
                    title: (data) => {
                        return this.dates[data[0].index] + ' :';
                    },
                    label: (data) => {
                        return this.barChartNewAccounts[0].data[data.index] > 1 ? this.barChartNewAccounts[0].data[data.index] + ' accounts' : this.barChartNewAccounts[0].data[data.index] + ' account';
                    }
                };

                break;
            case 'conversion-rate':
                this.barChartConversionRate = [{data: [], label: 'Conversion rate'}];
                const dataLengthWeek = Object.keys(data).length - 8;
                this.conversionRateMax = 0;

                for (const key in data) {
                    if (data.hasOwnProperty(key)) {
                        this.conversionRateMax+= data[key];
                        this.barChartConversionRate[0].data.push(data[key]);

                        if (index > dataLengthWeek && Object.keys(this.dataConversionRateWeek).length < 7) {
                            this.dataConversionRateWeek[key] = data[key];
                        }

                        index++;
                    }
                }
                this.conversionRateAverage = Math.ceil((this.conversionRateMax / index));

                this.conversionRateOptions.scales.yAxes[0].ticks.suggestedMax = 100;
                this.conversionRateOptions.annotation.annotations[0].value = this.conversionRateAverage;

                if (this.charts) {
                    this.charts.forEach((child, index) => {
                        if (index === 2) {
                            child.chart.options.annotation.annotations[0].value = this.conversionRateAverage;
                        }
                    });
                }

                this.conversionRateOptions.tooltips.callbacks = {
                    title: (data) => {
                        return this.dates[data[0].index] + ' :';
                    },
                    label: (data) => {
                        return this.barChartConversionRate[0].data[data.index] + '% conversion rate';
                    }
                };

                break;
            // case 'resolved-incidents':
            //     this.barChartIncidentsResolved = [
            //         {
            //             data: [],
            //             backgroundColor: '#527edb'
            //         },
            //         {
            //             data: [],
            //             backgroundColor: '#b5e8f7'
            //         }
            //     ];
            //
            //     let resolved = 0;
            //     let indexResolved = 0;
            //     this.resolvedIncidentsArray = [];
            //
            //     for (let key in data) {
            //         resolved += data[key];
            //         this.resolvedIncidentsArray.push(data[key]);
            //         let percetangeIncidents = Math.round((data[key] / this.barChartCallsHandled[0].data[indexResolved]) * 100);
            //
            //         this.barChartIncidentsResolved[0].data.push(percetangeIncidents);
            //         this.barChartIncidentsResolved[1].data.push(100 - percetangeIncidents);
            //         indexResolved++;
            //     }
            //
            //     this.resolvedIncidents = resolved;
            //
            //     this.resolvedIncidentsPercentage = this.maxValueCalls > 0 ? (Math.round((this.resolvedIncidents / this.maxValueCalls) * 100)) + '' : '0';
            //
            //
            //     this.incidentResolutionOptions.tooltips.callbacks = {
            //         title: (data) => {
            //             return this.dates[data[0].index] + ' :';
            //         },
            //         label: (data) => {
            //             return this.barChartIncidentsResolved[0].data[data.index] > 1 ? [this.barChartIncidentsResolved[0].data[data.index] + '%', this.resolvedIncidentsArray[data.index] + '/' + this.barChartCallsHandled[0].data[data.index] + ' incidents'] : [this.barChartIncidentsResolved[0].data[data.index] + '%', this.resolvedIncidentsArray[data.index] + '/' + this.barChartCallsHandled[0].data[data.index] + ' incident'];
            //         }
            //     };
            //
            //     break;
            // case 'incidents-type':
            //     this.issueRateType = [[]];
            //     this.incidentTypeLabels = [];
            //
            //     for (let key in data) {
            //         let legend = data[key] + '% ' + '\xa0\xa0'.repeat(5 - data[key].toString().length) + key;
            //
            //         this.issueRateType[0].push(data[key]);
            //         this.incidentTypeLabels.push(legend);
            //     }
            //
            //     break;

            case 'screen-flow':
                this.roundScreenFlow = [[]];
                this.screenFlowLabels = [];

                for (const key in data) {
                    if (data.hasOwnProperty(key)) {
                        const legend = data[key].percentage + '% ' + '\xa0\xa0'.repeat(2 - data[key].percentage.toString().length) + key + ' - ' + data[key].average + 's';

                        this.roundScreenFlow[0].push(data[key].percentage);
                        this.screenFlowLabels.push(legend);
                    }
                }
                break;
        }
    }

    public getChartData(period: string) {
        this.dataNewAccounts = {};
        this.homeService.getNewUsers(period).subscribe(
            (data) => {
                this.formatData(data, 'new-accounts');

                this.homeService.getConversionRate(period).subscribe(
                    (dataConv) => {
                        this.formatData(dataConv, 'conversion-rate');
                    },
                    (error) => {
                        console.log(error);
                    }
                );
            },
            (error) => {
                console.log(error);
            }
        );

        this.homeService.getScreenFlow(period).subscribe(
            (data) => {
                this.formatData(data, 'screen-flow');
            },
            (error) => {
                console.log(error);
            }
        );

        this.homeService.getTotalAccounts(period).subscribe(
            (data) => {
                this.formatData(data, 'total-accounts');
            },
            (error) => {
                console.log(error);
            }
        );


    }
}
