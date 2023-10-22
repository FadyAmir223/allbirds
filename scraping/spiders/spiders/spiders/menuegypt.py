import scrapy
import asyncio
from random import shuffle, uniform
from urllib.parse import urlparse, urljoin


class HomeSpider(scrapy.Spider):
    name = "menuegypt"
    allowed_domains = ["www.menuegypt.com"]
    start_url = "https://www.menuegypt.com"

    custom_settings = {
        "FEEDS": {"resturants.json": {"format": "json", "overwrite": True}}
    }

    async def errback(self, failure):
        page = failure.request.meta["playwright_page"]
        await page.close()

    def start_requests(self):
        yield scrapy.Request(
            self.start_url,
            meta=dict(
                playwright=True,
                playwright_include_page=True,
                errback=self.errback,
            ),
        )

    async def parse(self, response):
        page = response.meta["playwright_page"]

        cities = response.css(
            ".form-control.city_url_key_en option::attr(value)"
        ).getall()
        shuffle(cities)

        urls = []

        for city in cities:
            await page.select_option(".form-control.city_url_key_en", value=city)
            await asyncio.sleep(uniform(1, 2))
            regions = await page.evaluate(
                """() => Array.from(document.querySelectorAll('.form-control.region_url_key_en option'), option => option.value)"""
            )

            for region in regions:
                urls.append(
                    f"{self.start_url}/menus/{city}/{region}/restaurants-menus-hotline-delivery-number"
                )

        await page.close()
        shuffle(urls)

        for _link in urls:
            yield scrapy.Request(_link, callback=self.parse_rests)

    def parse_rests(self, response):
        rests = response.css(".col-sm-6.col-xs-12.shake-heart")
        shuffle(rests)

        for rest in rests:
            rest_url = rest.css("a::attr(href)").get()
            categories = rest.xpath("normalize-space(.//h3/text())").get()
            yield scrapy.Request(
                rest_url, callback=self.parse_rest, meta={"categories": categories}
            )

        next_page = response.css(
            "nav.flex.justify-between :last-child::attr(href)"
        ).get()

        if next_page:
            yield scrapy.Request(next_page, callback=self.parse_rests)

    def parse_rest(self, response):
        categories = response.meta["categories"].split(",")

        name = response.css(".food-name h1::text").get()
        logo = response.css(".food-detail img::attr(src)").get()
        hotline = response.css("p.tel a::text").get()

        images = response.css("img.shake-heart::attr(src)").getall()
        contacts = response.css(".clearfix li a::attr(href)")
        reviews = response.css(".media-list .media")
        branches = response.css(".panel.panel-primary")

        contact_list = {
            "facebook": contacts[0].get(),
            "twitter": contacts[1].get(),
        }

        image_list, review_list, branch_list, categories_list = [], [], [], []

        for category in categories:
            category = category.strip()
            if category and "," not in category and "." not in category:
                categories_list.append(category)

        for image in images:
            image_list.append(urljoin(image, urlparse(image).path).replace("_s", ""))

        for branch in branches:
            branch_list.append(
                {
                    "branch": branch.css("h2::text").get().strip(),
                    "address": branch.css("h5::text").get().strip(),
                }
            )

        for review in reviews:
            review_list.append(
                {
                    "rating": len(
                        review.css(".div-rating-stars label[style]").getall()
                    ),
                    "review": review.xpath(
                        'normalize-space(.//p[@class="media-heading"]/text())'
                    ).get(),
                    "date": review.css(".media-heading + p::text").get(),
                }
            )

        yield {
            "name": name,
            "logo": logo,
            "hotline": hotline,
            "contact": contact_list,
            "categories": categories_list,
            "images": image_list,
            "branches": branch_list,
            "reviews": review_list,
        }
