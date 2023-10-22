import scrapy
from urllib.parse import urlparse, parse_qs


class YellowpagesSpider(scrapy.Spider):
    name = "yellowpages"
    allowed_domains = ["yellowpages.com.eg"]
    start_url = "https://yellowpages.com.eg/en/category/restaurants/p1"

    custom_settings = {
        "FEEDS": {"yellowpages.json": {"format": "json", "overwrite": True}}
    }

    def start_requests(self):
        yield scrapy.Request(self.start_url, meta={"playwright": True})

    def parse(self, response):
        rests = response.css('.row.item-row[style="display:block;"]')

        for rest in rests:
            name = rest.css(".item-title::text").get()
            location_name = rest.css(".address-text span::text").get()
            location_url = rest.css(".address-text::attr(href)").get()
            categories = rest.css(".category + span span::attr(data-content)").get()
            keywords = rest.css(".two-words + span::attr(data-content)").get()
            about_us = rest.css(".item-aboutUs a::text").get()
            phone_endpoint = rest.css(".call-us-click::attr(data-tooltip-phones)").get()
            website = rest.css(".website::attr(href)").get()
            whatsapp = rest.css(".whatsAppLink::attr(href)").get()

            # phone_numbers = response = requests.get(url)
            # whatsapp = parse_qs(urlparse('//web.whatsapp.com/send?phone=+201061500248').query).get('phone')

            item_data = {}

            if name:
                item_data["name"] = name
            if location_name:
                item_data["location_name"] = location_name
            if location_url:
                item_data["location_url"] = location_url
            if categories:
                categories = categories.split("<br>")
                item_data["categories"] = categories
            if keywords:
                keywords = keywords.split("<br>")
                item_data["keywords"] = keywords
            if about_us:
                about_us = about_us.strip()
                item_data["about_us"] = about_us
            if phone_endpoint:
                item_data["phone_endpoint"] = phone_endpoint
            if website:
                item_data["website"] = website
            if whatsapp:
                whatsapp = parse_qs(urlparse(whatsapp).query).get("phone")[0]
                item_data["whatsapp"] = whatsapp

            yield item_data
