package main

import (
	"context"
	"fmt"
	"log"

	b64 "encoding/base64"

	"github.com/chromedp/chromedp"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
)

func Handler(request events.APIGatewayProxyRequest) (*events.APIGatewayProxyResponse, error) {
	location := request.QueryStringParameters["location"]
	// response := fmt.Sprintf("Hello %s!", location)

	// create context
	ctx, cancel := chromedp.NewContext(
		context.Background(),
		// chromedp.WithDebugf(log.Printf),
	)
	defer cancel()

	url := "https://www.yr.no/en/forecast/graph/" + location

	// fmt.Println(url)

	// run task list
	var placename string
	err := chromedp.Run(ctx,
		chromedp.Navigate(url),
		chromedp.Text(`.page-header__location-name`, &placename, chromedp.NodeVisible),
	)
	if err != nil {
		log.Fatal(err)
	}

	// log.Println(strings.TrimSpace(placename))

	// capture screenshot of elements
	var buf1 []byte
	var buf2 []byte

	if err := chromedp.Run(ctx, elementScreenshot(url, `div.now-hero__next-hour-content`, &buf1)); err != nil {
		log.Fatal(err)
	}

	if err := chromedp.Run(ctx, elementScreenshot(url, `div.meteogram`, &buf2)); err != nil {
		log.Fatal(err)
	}

	sEnc1 := b64.StdEncoding.EncodeToString(buf1)
	// fmt.Println(sEnc)

	sEnc2 := b64.StdEncoding.EncodeToString(buf2)
	// fmt.Println(sEnc)

	html := fmt.Sprintf("<h5>%v &nbsp;&nbsp;&nbsp;&nbsp;<img id='%v' src='data:image/jpeg;base64, %s'/></h5>", placename, url, sEnc1)
	// html = html + fmt.Sprintf("<img id='%v' src='data:image/jpeg;base64, %s'/><br/><br/>", placename, sEnc1)
	html = html + fmt.Sprintf("<img id='%v' src='data:image/jpeg;base64, %s'/><br/>", placename, sEnc2)

	// fmt.Println(html)

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

// elementScreenshot takes a screenshot of a specific element.
func elementScreenshot(urlstr, sel string, res *[]byte) chromedp.Tasks {
	return chromedp.Tasks{
		chromedp.Navigate(urlstr),
		chromedp.EmulateViewport(980, 1080),
		chromedp.Screenshot(sel, res, chromedp.NodeVisible),
	}
}

// fullScreenshot takes a screenshot of the entire browser viewport.
//
// Note: chromedp.FullScreenshot overrides the device's emulation settings. Use
// device.Reset to reset the emulation and viewport settings.
func fullScreenshot(urlstr string, quality int, res *[]byte) chromedp.Tasks {
	return chromedp.Tasks{
		chromedp.Navigate(urlstr),
		chromedp.FullScreenshot(res, quality),
	}
}
