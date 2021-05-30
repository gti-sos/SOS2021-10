<script>
    import FusionCharts from 'fusioncharts';
    import Charts from 'fusioncharts/fusioncharts.charts';
    import FusionTheme from 'fusioncharts/themes/fusioncharts.theme.fusion';
    import SvelteFC, { fcRoot } from 'svelte-fusioncharts';
    
    // Always set FusionCharts as the first parameter
    fcRoot(FusionCharts, Charts, FusionTheme);
    
    const dataSource = {
      "chart": {
        "caption": "GDP Growth Rate Comparison",
        "yaxisname": "Quarterly GDP Growth Rate in %",
        "subcaption": "India vs China",
        "drawcrossline": "1",
        "numbersuffix": "%",
        "plottooltext": "$seriesName's GDP grew $dataValue in $label",
        "theme": "fusion"
      },
      "categories": [
        {
          "category": [
            {
              "label": "April 2016"
            },
            {
              "label": "July 2016"
            },
            {
              "label": "Oct 2016"
            },
            {
              "label": "Jan 2017"
            },
            {
              "label": "April 2017"
            }
          ]
        }
      ],
      "dataset": [
        {
          "seriesname": "India",
          "data": [
            {
              "value": "9.2"
            },
            {
              "value": "7.9"
            },
            {
              "value": "7.5"
            },
            {
              "value": "7"
            },
            {
              "value": "6.1"
            }
          ]
        },
        {
          "seriesname": "China",
          "data": [
            {
              "value": "6.7"
            },
            {
              "value": "6.7"
            },
            {
              "value": "6.7"
            },
            {
              "value": "6.8"
            },
            {
              "value": "6.9"
            }
          ]
        }
      ]
    };
    
    const chartConfigs = {
       type: 'msarea',
       width: 600,
       height: 400,
       dataFormat: 'json',
       dataSource
    };
    </script>
    
    <SvelteFC {...chartConfigs} />