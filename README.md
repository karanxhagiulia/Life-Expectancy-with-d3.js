# Interactive visualization


## With Excel, Python, Pandas, d3.js

Since I am learning d3.js, I wanted to create this visualization that I had in mind for quite some time.

I always see the "average lifespan" compared, but never the healthy lifespan.


The visualization consists of three data sources:

*   The average healthy lifespan (**2019**)
*   Life expectancy at birth (**2020**)
*   The average age of retirement (using the data for "men") (**2018**)

Of course (unfortunately), the average retirement age is not the most comprehensive in terms of Countries.

  

Finding the data
----------------

  

*   Average healthy lifespan data from the WHO:

[https://www.who.int/data/gho/data/indicators/indicator-details/GHO/gho-ghe-hale-healthy-life-expectancy-at-birth](https://www.who.int/data/gho/data/indicators/indicator-details/GHO/gho-ghe-hale-healthy-life-expectancy-at-birth)

*   The average age of retirement (Our World in Data):

[https://ourworldindata.org/grapher/average-effective-retirement-men](https://ourworldindata.org/grapher/average-effective-retirement-men)

*   [Life expectancy at birth](https://data.worldbank.org/indicator/SP.DYN.LE00.IN) (WorldBank):

[https://data.worldbank.org/indicator/SP.DYN.LE00.IN](https://data.worldbank.org/indicator/SP.DYN.LE00.IN)

Other data sources:
https://www.forbes.com/advisor/retirement/average-retirement-age/
###   

Data Cleaning
-------------

  

I used Pandas and excel.

```python
#I know I have two types of life expectancy from the WHO data, and this could cause a mess in my visualization! I'll drop the one "at age 60 years", since I want only the "healthy life expectancy from birth" 

healthylife.Indicator.unique() 

indexNames = healthylife[ healthylife['Indicator'] == "Healthy life expectancy (HALE) at age 60 (years)" ].index

healthylife.drop(indexNames , inplace=True)
```

Same for the year: I will keep only the year 2019 to have the most recent data (I know that each country has data for the year 2019)

  

```plain
healthylife.drop(healthylife[healthylife.Period < 2019].index, inplace=True) 
#definitely faster than the previous one 
```

**INNER JOIN**

```plain
Merged1= pd.merge(healthylife,retirement,left_on=['Location'],right_on=['Entity']) 
#this is basically an INNER JOIN, and I used the Country name to match them and create a new df to use as a base for my data visualization
```

Initially, I joined the two df with country **AND** year, but I later realized that the "retirement" df was lastly updated in 2018, and it didn't create the latest match (the latest match was 2015 and 2000 for some countries). I ended up only matching them with Country names and using the latest data for each df.
In this way I only had the Countries where there was data for the retirement age as well. So I decided to do this:

Joined this data:
*   The average healthy lifespan (**2019**)
*   Life expectancy at birth (**2020**)  

```plain
newdata= pd.merge(healthylife,lifeexp,left_on=['Location'],right_on=['Country Name']) 
```
and then I did a LEFT JOIN with the retirement data, ending up in a more comprehensive table with 183 rows.

```plain
newdata =newdata.merge(retirement,left_on="Location", right_on='Entity', how='left')
```

This is the table I ended up with:

![Immagine 2022-12-30 172734](https://user-images.githubusercontent.com/96819403/210091867-f3c2f6a2-eef2-4f0e-b15c-93985f3afecc.png)

The WHO Dataset already had each country divided per region, and it spared me of quite some time of work :) 

Interaction
-----
The chart is interactive! It has :
* Legend Buttons: Clicking on the legend items allows users to highlight specific data points related to healthy life expectancy, life expectancy, and retirement age. Clicking again on a highlighted legend item removes the highlighting.
* Clicking on a location name on the y-axis highlights the corresponding data points for that location while dimming others. Clicking again on the same location removes the highlighting and dimming.
* Hovering over data points displays a tooltip with detailed information, including the average values for healthy life expectancy, life expectancy, and retirement age for the selected location.
  
![image](https://github.com/karanxhagiulia/dataviz/assets/96819403/773615ac-c625-4f1f-984a-f86c61b99a31)


Links
-----

    
Font:
https://fonts.google.com/specimen/Roboto

Documentation/links I used:

d3.js :
[https://d3-graph-gallery.com/index.html](https://d3-graph-gallery.com/index.html)

[https://d3js.org/](https://d3js.org/)

Data visualization:

- Font 
https://fontjoy.com/ Generate font combinations with deep learning

- Color Palette 
https://carbondesignsystem.com/data-visualization/color-palettes/
==============================


![dataviz](https://github.com/karanxhagiulia/dataviz/assets/96819403/6d18235b-421b-454e-a00d-bd2b95877c82)


