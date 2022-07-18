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

	// create context
	ctx, cancel := chromedp.NewContext(
		context.Background(),
		// chromedp.WithDebugf(log.Printf),
	)
	defer cancel()

	url := "https://trafficscotland.org/bridgerestrictions/index.aspx"

	// capture screenshot of elements
	var buf []byte

	if err := chromedp.Run(ctx, elementScreenshot(url, `.main`, &buf)); err != nil {
		log.Fatal(err)
	}

	sEnc := b64.StdEncoding.EncodeToString(buf)
	// fmt.Println(sEnc)

	html := fmt.Sprintf("<img id='%v' src='data:image/jpeg;base64, %s'/>", url, sEnc)

	return &events.APIGatewayProxyResponse{
		StatusCode: 200,
		// Headers:    map[string]string{"Content-Type": "image/jpeg"},
		Headers: map[string]string{"Content-Type": "text/html; charset=UTF-8"},
		Body:    html,
		// Body: string(data);
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
