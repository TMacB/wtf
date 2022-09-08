package main

import (
	"fmt"

	"github.com/go-rod/rod"

	b64 "encoding/base64"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
)

func Handler(request events.APIGatewayProxyRequest) (*events.APIGatewayProxyResponse, error) {
	page := rod.New().MustConnect().MustPage("https://www.wikipedia.org/")

	page.MustElement("#searchInput").MustInput("earth")
	page.MustElement("#search-form > fieldset > button").MustClick()

	el := page.MustElement("#mw-content-text > div.mw-parser-output > table.infobox > tbody > tr:nth-child(1) > td > a > img")
	// _ = utils.OutputFile("b.png", el.MustResource())

	// fmt.Println(el.MustResource())

	sEnc := b64.StdEncoding.EncodeToString(el.MustResource())
	// fmt.Println(sEnc)

	html := fmt.Sprintf("<img src='data:image/jpeg;base64, %s'/>", sEnc)

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
