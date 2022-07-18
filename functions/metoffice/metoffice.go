package main

import (
	"fmt"
	"strings"

	"github.com/mmcdole/gofeed"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
)

func Handler(request events.APIGatewayProxyRequest) (*events.APIGatewayProxyResponse, error) {

	url := "http://www.metoffice.gov.uk/public/data/PWSCache/WarningsRSS/Region/UK"

	fp := gofeed.NewParser()
	feed, _ := fp.ParseURL(url)
	fmt.Println(feed)

	// fmt.Println(feed.Items)

	html := "<h5>" + feed.Title + "</h5>"

	locations := []string{"Scotland", "Strathclyde", "Dumfries", "Galloway", "Lothian", "Borders", "Central", "Tayside", "Fife", "Orkney", "Shetland", "Highlands", "Eilean Siar", "Grampian"}

	count := 0

	for i, item := range feed.Items {
		fmt.Println(i, item)
		found := false

		for _, location := range locations {
			if strings.Contains(item.Title, location) && !found {
				found = true
				count = count + 1

				fmt.Println("  -->", location)

				html = html + "<div style='float: left'><a href='" + item.Link + "'>" + item.Title + "</a></div>"
				html = html + "<div style='float: left'>&nbsp;<span class='date'>" + item.Published + "<span></div><br/>" + item.Description + "<br/><br/>"
			}
		}
	}

	// count = 0

	if count == 0 {
		html = ""
	}

	return &events.APIGatewayProxyResponse{
		StatusCode: 200,
		Headers:    map[string]string{"Content-Type": "text/html; charset=UTF-8"},
		Body:       html,
	}, nil

}

func main() {
	// Initiate AWS Lambda handler
	lambda.Start(Handler)
}
