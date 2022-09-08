package main

import (
	"encoding/xml"
	"fmt"
	"log"
	"net/http"
	"strings"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
)

// type RssFeed struct {
//     XMLName xml.Name  `xml:"rss"`
//     Items   []RssItem `xml:"channel>item"`
// }

// type RssItem struct {
//     XMLName     xml.Name `xml:"item"`
//     Title       string   `xml:"title"`
//     Link        string   `xml:"link"`
//     Description string   `xml:"description"`
//     //NestedTag    string      xml:">nested>tags>"
// }

// type Rss struct {
// 	XMLName xml.Name `xml:"rss"`
// 	Text    string   `xml:",chardata"`
// 	Version string   `xml:"version,attr"`
// 	Dc      string   `xml:"dc,attr"`
// 	Channel struct {
// 		Text        string `xml:",chardata"`
// 		Title       string `xml:"title"`
// 		Link        string `xml:"link"`
// 		Description string `xml:"description"`
// 		Language    string `xml:"language"`
// 		Copyright   string `xml:"copyright"`
// 		PubDate     string `xml:"pubDate"`
// 		Creator     string `xml:"creator"`
// 		Item        []RssItem
// 	} `xml:"channel"`
// }

// type RssItem struct {
// 	Text        string `xml:",chardata"`
// 	Title       string `xml:"title"`
// 	Link        string `xml:"link"`
// 	Description string `xml:"description"`
// 	Guid        struct {
// 		Text        string `xml:",chardata"`
// 		IsPermaLink string `xml:"isPermaLink,attr"`
// 	} `xml:"guid"`
// 	Enclosure struct {
// 		Text   string `xml:",chardata"`
// 		Length string `xml:"length,attr"`
// 		Type   string `xml:"type,attr"`
// 		URL    string `xml:"url,attr"`
// 	} `xml:"enclosure"`
// }

type Rss struct {
	XMLName xml.Name `xml:"rss"`
	Text    string   `xml:",chardata"`
	Version string   `xml:"version,attr"`
	Dc      string   `xml:"dc,attr"`
	Channel struct {
		Text        string `xml:",chardata"`
		Title       string `xml:"title"`
		Link        string `xml:"link"`
		Description string `xml:"description"`
		Language    string `xml:"language"`
		Copyright   string `xml:"copyright"`
		PubDate     string `xml:"pubDate"`
		Creator     string `xml:"creator"`
		Item        []struct {
			Text        string `xml:",chardata"`
			Title       string `xml:"title"`
			Link        string `xml:"link"`
			Description string `xml:"description"`
			Guid        struct {
				Text        string `xml:",chardata"`
				IsPermaLink string `xml:"isPermaLink,attr"`
			} `xml:"guid"`
			Enclosure struct {
				Text   string `xml:",chardata"`
				Length string `xml:"length,attr"`
				Type   string `xml:"type,attr"`
				URL    string `xml:"url,attr"`
			} `xml:"enclosure"`
		} `xml:"item"`
	} `xml:"channel"`
}

func Handler(request events.APIGatewayProxyRequest) (*events.APIGatewayProxyResponse, error) {

	url := "http://www.metoffice.gov.uk/public/data/PWSCache/WarningsRSS/Region/UK"

	resp, err := http.Get(url)
	if err != nil {
		log.Fatalln(err)
	}
	defer resp.Body.Close()

	var rss Rss
	if err = xml.NewDecoder(resp.Body).Decode(&rss); err != nil {
		log.Fatal(err)
	}

	// fmt.Println(rss)

	html := "<h5>" + rss.Channel.Title + "</h5>"

	locations := []string{"Scotland", "Strathclyde", "Dumfries", "Galloway", "Lothian", "Borders", "Central", "Tayside", "Fife", "Orkney", "Shetland", "Highlands", "Eilean Siar", "Grampian"}

	count := 0

	for i, item := range rss.Channel.Item {
		fmt.Println(i, ": ", item.Enclosure.URL)

		found := false

		for _, location := range locations {
			if strings.Contains(item.Title, location) && !found {
				found = true
				count = count + 1

				// fmt.Println("  -->", location, " - ", item.Enclosure.URL)

				html = html + "<div><div style='float: left; padding-right: 5px'><img src='" + item.Enclosure.URL + "' height='64px'></div>"
				html = html + "<div style='float: left'><a href='" + item.Link + "'>" + item.Title + "</a></div>"
				html = html + "<div style='float: left'>&nbsp;<span class='date'>" + rss.Channel.PubDate + "<span></div><br/>" + item.Description + "</div><br/><br/>"
				html = html + "<div clear='both'></div>"
			}
		}

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
