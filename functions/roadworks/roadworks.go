package main

import (
	"fmt"

	"github.com/mmcdole/gofeed"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
)

func Handler(request events.APIGatewayProxyRequest) (*events.APIGatewayProxyResponse, error) {

	url := "https://trafficscotland.org/rss/feeds/roadworks.aspx"

	fp := gofeed.NewParser()
	feed, _ := fp.ParseURL(url)
	fmt.Println(feed)

	html := "<h5>" + feed.Title + "</h5>"

	for i, item := range feed.Items {
		fmt.Println("index:", i, item)
		html = html + "<div style='float: left'><a href='" + item.Link + "'>" + item.Title + "</a></div>"
		html = html + "<div style='float: left'>&nbsp;<span class='date'>" + item.Published + "<span></div><br/>" + item.Description + "<br/><br/>"
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
