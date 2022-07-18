package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"strings"
	"time"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
)

type calmac []struct {
	RouteName    string `json:"routeName"`
	Reason       string `json:"reason"`
	Image        string `json:"image"`
	DestName     string `json:"destName"`
	Code         string `json:"code"`
	InfoIncluded string `json:"infoIncluded"`
	InfoMsg      string `json:"infoMsg"`
	Reported     string `json:"reported"`
	ID           string `json:"id"`
	WebDetail    string `json:"webDetail"`
	Updated      string `json:"updated"`
	Status       string `json:"status"`
}

func Handler(request events.APIGatewayProxyRequest) (*events.APIGatewayProxyResponse, error) {

	url := "https://www.calmac.co.uk/service-status?ajax=json"

	client := http.Client{
		Timeout: time.Second * 2, // Timeout after 2 seconds
	}

	req, err := http.NewRequest(http.MethodGet, url, nil)
	if err != nil {
		log.Fatal(err)
	}

	// req.Header.Set("User-Agent", "spacecount-tutorial")

	res, getErr := client.Do(req)
	if getErr != nil {
		log.Fatal(getErr)
	}

	if res.Body != nil {
		defer res.Body.Close()
	}

	body, readErr := ioutil.ReadAll(res.Body)
	if readErr != nil {
		log.Fatal(readErr)
	}

	calmac := calmac{}
	jsonErr := json.Unmarshal(body, &calmac)
	if jsonErr != nil {
		log.Fatal(jsonErr)
	}

	// fmt.Println(calmac)

	html := ""
	// html := "<h5>" + feed.Title + "</h5>"

	for i, item := range calmac {
		fmt.Println("index:", i, item.RouteName, item.Status)

		src := ""

		switch item.Image {
		case "normal":
			src = "https://www.calmac.co.uk/image/1788/normal-icon-green/original.png"
			break
		case "beware":
			src = "https://www.calmac.co.uk/image/3119/Be-Aware-Yellow-icon/original.jpg"
			break
		case "affected":
			src = "https://www.calmac.co.uk/image/1787/maybe-affected-icon-amber/original.png"
			break
		case "disrupted":
			src = "https://www.calmac.co.uk/image/1786/cancelled-icon-red/original.png"
			break
		default:
			src = "no-image"
		}

		reason := "- " + item.Reason
		reason = strings.Replace(reason, "- NONE", "", -1)

		html = html + `<img src="` + src + `" height="16" alt="` + item.Status + `" title="` + item.Status + `"/> <a href="https://www.calmac.co.uk/service-status?route=` + item.Code + `" title="Route: ` + item.Code + `">` + item.RouteName + `</a> ` + reason + `<br/>`

		// html = html + "<div style='float: left'><img src='" + src + "'/></div><div><a href='" + item.WebDetail + "'>" + item.DestName + " - " + item.RouteName + "</a></div>"
		// html = html + "<div style='float: left'>&nbsp;<span class='date'>" + item.Updated + "<span></div><br/>" + item.InfoMsg + "<br/><br/>"
	}

	return &events.APIGatewayProxyResponse{
		StatusCode: 200,
		Headers:    map[string]string{"Content-Type": "text/html; charset=UTF-8"},
		Body:       fmt.Sprintf("%v", html),
	}, nil

}

func main() {
	// Initiate AWS Lambda handler
	lambda.Start(Handler)
}
